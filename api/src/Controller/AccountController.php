<?php

namespace App\Controller;

use App\Entity\FirebaseUser;
use App\Entity\Account;
use App\Entity\Website;
use Kreait\Firebase\Factory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class AccountController extends AbstractController{

    /**
     * @Route("/v1/accounts",name="v1accounts")
     */
    public function accounts(Request $request){
        $this->denyAccessUnlessGranted('ROLE_USER');
        /** @var FirebaseUser $user */
        $user = $this->getUser();
        // POST
        if($request->isMethod("POST")){
            try{
                $data = json_decode($request->getContent(), true);
                if(!$data["accounts"]) throw new \Exception("Field accounts missing");
            }catch (\Exception $e){
                return new JsonResponse(["message" => "Error while reading request", "error" => $e], 400);
            }
            if(count($data["accounts"]) == 0) throw new \Exception("Accounts empty");
            $website_id = preg_match_all('/\d+/m', $data["accounts"][0]->website, $matches, PREG_SET_ORDER, 0)[0][0];
            if(!$website_id) throw new \Exception("Website id missing");
            /** @var Website $website */
            $website = $this->getDoctrine()->getRepository(Website::class)->find($website_id);

            $em = $this->getDoctrine()->getManager();
            foreach ($data["accounts"] as $acc){
                if($website->getId() != preg_match_all('/\d+/m', $acc->website, $matches, PREG_SET_ORDER, 0)[0][0]){
                    $website_id = preg_match_all('/\d+/m', $acc->website, $matches, PREG_SET_ORDER, 0)[0][0];
                    /** @var Website $website */
                    $website = $this->getDoctrine()->getRepository(Website::class)->find($website_id);
                }
                /** @var Account $account */
                $account = new Account();
                $account->setEmail($acc->email);
                $account->setPassword($acc->password);
                $account->setFirebaseUser($user);
                $account->setWebsite($website);
                if(trim(strtolower($website->getName())) === "instagram"){
                    if(!$acc->session) throw new \Exception("Instagram session is missing for email: ".$acc->email);
                    $account->setInstagramSession($acc->session);
                }
                $em->persist($account);
            }
            $em->flush();
            return new JsonResponse([], 200);
        }
        else{
            return new JsonResponse(["message" => "Method not allowed"], 405);
        }
    }
}
