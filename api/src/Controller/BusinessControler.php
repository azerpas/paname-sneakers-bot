<?php

namespace App\Controller;

use App\Entity\FirebaseUser;
use Doctrine\ORM\EntityManagerInterface;
use Kreait\Firebase\Factory;
use mysql_xdevapi\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class BusinessControler extends AbstractController{

    /**
     * @var Factory
     */
    private Factory $factory;

    public function __construct(string $projectDir, EntityManagerInterface $em)
    {
        $this->factory = (new Factory)->withServiceAccount($projectDir.'/config/serv-acc.json');
    }

    /**
     * @Route("/business/login",name="business-login")
     */
    public function login(Request $request){
        if($request->request->has("refresh_token")){
            $auth = $this->factory->createAuth();
            try {
                $result = $auth->signInWithRefreshToken($request->request->get("refresh_token"));
            }catch (\Exception $e){
                return new JsonResponse(["error"=>"Could not login"], 500);
            }
        }else{
            if(!$request->request->has("uid")) return new JsonResponse(["error"=>"Provide an uid"],403);
            else{
                /** @var FirebaseUser $user */
                $user = $this->getDoctrine()->getManager()->getRepository(FirebaseUser::class)->findOneByFirebaseId($request->request->get("uid"));
                if(!$user) return new JsonResponse(["error"=>"Not found"],403);
                if(!in_array("ROLE_BUSINESS", $user->getRoles())) return new JsonResponse(["error"=>"Not business"],403);
            }
            if(!$request->request->has("username") || !$request->request->has("password")){
                return new JsonResponse(["error"=>"Provide an username AND a password"],400);
            }
            $auth = $this->factory->createAuth();
            try {
                $result = $auth->signInWithEmailAndPassword($request->request->get("username"), $request->request->get("password"));
            }catch (\Exception $e){
                return new JsonResponse(["error"=>"Could not login"], 500);
            }
        }
        return new JsonResponse(["id_token" => $result->idToken(), /*"access_token"=> $result->accessToken(),*/ "refresh_token" => $result->refreshToken()], 200);
    }

    /**
     * @Route("/business",name="business", methods={"POST"})
     */
    public function business(Request $request){
        if($request->getMethod() === "POST"){
            $this->denyAccessUnlessGranted('ROLE_ADMIN');
            if(!$request->request->has("username") || !$request->request->has("password")){
                return new JsonResponse(["error"=>"Provide an username AND a password"],400);
            }
            $auth = $this->factory->createAuth();
            try {
                $result = $auth->createUserWithEmailAndPassword($request->request->get("username"), $request->request->get("password"));
                $user = new FirebaseUser();
                $user->setBalance(0.0);
                $user->setFirebaseId($result->uid);
                $user->setRoles(["ROLE_USER","ROLE_BUSINESS"]);
                $user->setUserType("business");
                $em = $this->getDoctrine()->getManager();
                $em->persist($user);
                $em->flush();
                return new JsonResponse(["uid" => $result->uid, "id"=>$user->getId()], 200);
            }catch (\Exception $exception){
                return new JsonResponse(["error"=>"Could not create user", "message"=>$exception->getMessage()], 500);
            }
        }else{
            return new JsonResponse(["message" => "Method not allowed"], 405);
        }
    }
}
