<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Kreait\Firebase\Factory;
use Symfony\Component\Validator\Constraints\Json;

class AuthController extends AbstractController
{
    public function __construct(string $projectDir, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->factory = (new Factory)->withServiceAccount($projectDir.'/config/serv-acc.json');
        $this->admin = 0;
    }
    /**
     * @Route("/login",name="login")
     */
    public function login(Request $request){
        $uuid = $_ENV["API_TOKEN"];
        $editor_uid = $_ENV["EDITOR_UID"];
        if($uuid == $request->request->get("uuid") && $editor_uid == $request->request->get("uid")){
            $factory = (new Factory)->withServiceAccount($this->getParameter('kernel.project_dir').'/config/serv-acc.json');
            $auth = $factory->createAuth();
            $token = $auth->createCustomToken($editor_uid);
            return new JsonResponse(["token"=> (string) $token],200);
        }else{
            return new JsonResponse([],403);
        }
    }
}
