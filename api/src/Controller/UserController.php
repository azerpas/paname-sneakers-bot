<?php

namespace App\Controller;

use App\Entity\FirebaseUser;
use Kreait\Firebase\Factory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class UserController extends AbstractController{

    /**
     * @Route("/user",name="user")
     */
    public function user(Request $request){
        $this->denyAccessUnlessGranted('ROLE_USER');
        /** @var FirebaseUser $user */
        $user = $this->getUser();
        // GET
        if($request->isMethod("GET")){
            return new JsonResponse(["balance"=>$user->getBalance(), "customer" => ["id"=>$user->getCustomerId(), "paying"=>$user->getPaying()], "id"=>$user->getId(), "roles"=>$user->getRoles(), "webhook"=> $user->getDiscordWebhook(), "errorWebhook" => $user->getDiscordWebhookError()], 200);
        }
        // POST - Setting roles
        // TODO: Remove this, check +roles
        elseif($request->isMethod("POST")){
            if($user->getUserType() === "temp"){
                if($request->request->has("roles") && $request->request->has("type")){
                    $user->setRoles($request->request->get("roles"));
                    $user->setUserType($request->request->get("type"));
                    $this->getDoctrine()->getManager()->persist($user);
                    $this->getDoctrine()->getManager()->flush();
                    return new JsonResponse(["roles" => $user->getRoles(), "type" => $user->getUserType()], 200);
                }else return new JsonResponse(["message" => "Malformed request"], 400);
            }else return new JsonResponse(["message" => "Not allowed"], 403);
        }
        else{
            return new JsonResponse(["message" => "Method not allowed"], 405);
        }
    }

    /**
     * @Route("/user/{id}/roles",name="user_roles", requirements={"id"="\d+"})
     * @param Request $request
     * @return JsonResponse
     */
    public function roles(int $id, Request $request){
        if($request->isMethod("POST")){
            $this->denyAccessUnlessGranted('ROLE_ADMIN');
            /** @var FirebaseUser $user */
            $user = $this->getDoctrine()->getRepository(FirebaseUser::class)->find($id);
            if(!$user) return new JsonResponse(["message" => "User not found"], 404);
            if($user->getUserType() === "temp"){
                if($request->request->has("roles") && $request->request->has("type")){
                    $user->setRoles($request->request->get("roles"));
                    $user->setUserType($request->request->get("type"));
                    $this->getDoctrine()->getManager()->persist($user);
                    $this->getDoctrine()->getManager()->flush();
                    return new JsonResponse(["roles" => $user->getRoles(), "type" => $user->getUserType()], 200);
                }else return new JsonResponse(["message" => "Malformed request"], 400);
            }
            else return new JsonResponse(["message" => "Not allowed"], 403);
        }
        return new JsonResponse(["message" => "Method not allowed"], 405);
    }

    /**
     * @Route("/user/{id}/balance", name="user_balance", requirements={"id"="\d+"})
     * @param int $id - FirebaseUser id
     * @param Request $request
     * @return JsonResponse
     */
    public function balance(int $id, Request $request){
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        if($request->isMethod("POST")){
            /** @var FirebaseUser $user */
            $user = $this->getDoctrine()->getRepository(FirebaseUser::class)->find($id);
            if(!$user) return new JsonResponse(["message" => "User not found"], 404);
            $balance = $user->getBalance();
            $cost = $request->request->get("cost");
            // TODO: Send report to admin + Flag balance addition of more than ...
            if($balance <= 0) return new JsonResponse(["message" => "Balance is negative"], 403);
            if($balance < $cost) return new JsonResponse(["message" => "Balance is insufficient"], 403);
            $user->setBalance($balance-$cost);
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
            return new JsonResponse(["balance"=>$user->getBalance()], 200);
        }else{
            return new JsonResponse(["message" => "Method not allowed"], 405);
        }
    }

    /**
     * @Route("/user/{id}/checkout", name="user_checkout")
     * @param int $id - FirebaseUser id
     * @param Request $request
     * @return JsonResponse
     */
    public function checkout(string $id, Request $request){
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        if($request->isMethod("PUT")){
            /** @var FirebaseUser $user */
            $user = $this->getDoctrine()->getRepository(FirebaseUser::class)->findOneByFirebaseId($id);
            if(!$user) return new JsonResponse(["message" => "User not found"], 404);
            try{
                $data = json_decode($request->getContent(), true);
                if(!$data["sessionId"] || !$data["customerId"]) throw new \Exception();
            }catch (\Exception $e){
                return new JsonResponse(["message" => "Error while reading request", "e" => $e], 400);
            }
            $sessionId = $data["sessionId"];
            $customerId = $data["customerId"];

            $user->setCustomerId($customerId);
            $user->setSubCheckoutSession($sessionId);
            $this->getDoctrine()->getManager()->persist($user);
            $this->getDoctrine()->getManager()->flush();
            return new JsonResponse(["a"=>$sessionId,"b"=>$customerId], 201);
        }else{
            return new JsonResponse(["message" => "Method not allowed"], 405);
        }
    }
}
