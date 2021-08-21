<?php

namespace App\Security;

use App\Entity\FirebaseUser;
use Doctrine\ORM\EntityManagerInterface;
use Firebase\Auth\Token\Exception\InvalidToken;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use Kreait\Firebase\Factory;

class TokenAuthenticator extends AbstractGuardAuthenticator
{
    private EntityManagerInterface $em;
    private $factory;
    private bool $admin;

    public function __construct(string $projectDir, EntityManagerInterface $em)
    {
        $this->em = $em;
        $this->factory = (new Factory)->withServiceAccount($projectDir.'/config/serv-acc.json');
        $this->admin = 0;
    }

    /**
    * Called on every request to decide if this authenticator should be
    * used for the request. Returning `false` will cause this authenticator
    * to be skipped.
    */
    public function supports(Request $request)
    {
        return $request->headers->has('Authorization');
    }

    /**
    * Called on every request. Return whatever credentials you want to
    * be passed to getUser() as $credentials.
    */
    public function getCredentials(Request $request)
    {
        $authorization = $request->headers->get('Authorization');
        $this->admin = 1 ? $request->headers->has("Admin") : 0;
        preg_match('/^Bearer\s(\S+)/i', $authorization, $matches);
        if(!$matches){
            throw new AuthenticationException("Invalid Token.");
        }elseif ($matches[1]){
            return $matches[1];
        }else{
            throw new AuthenticationException("Invalid Authorization.");
        }
    }

    public function getUser($credentials, UserProviderInterface $userProvider)
    {
        if (null === $credentials) {
            // The token header was empty, authentication fails with HTTP Status
            // Code 401 "Unauthorized"
            return null;
        }

        $auth = $this->factory->createAuth();
        try {
            if($this->admin){
                $idToken = $auth->signInWithCustomToken($credentials)->idToken();
                $token = $auth->verifyIdToken($idToken);
            }else{
                $token = $auth->verifyIdToken($credentials); // TODO: check if revoked
            }
            $uid = $token->getClaim('sub');
        }catch (\Exception $e){
            throw new AuthenticationException("Error while verifying token: {$e->getMessage()}");
        }

        // if a User is returned, checkCredentials() is called
        $user = $this->em->getRepository(FirebaseUser::class)->findOneByFirebaseId($uid);

        // init user
        // no user found but token valid means the user hasn't been initialized inside the API
        if(!$user){
            $fbuser = $auth->getUser($uid);
            $user = new FirebaseUser();
            $user->setFirebaseId($fbuser->uid);
            $user->setAlias($fbuser->displayName);
            $user->setBalance(2.0);
            $user->setRoles(["ROLE_USER"]);
            $user->setUserType("temp");
            $this->em->persist($user);
            $this->em->flush();
        }
        return $user;
    }

    public function checkCredentials($credentials, UserInterface $user)
    {
        // Check credentials - e.g. make sure the password is valid.
        // In case of an API token, no credential check is needed.

        // Return `true` to cause authentication success
        return true;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, $providerKey)
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception)
    {
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => $exception->getMessage()

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    /**
    * Called when authentication is needed, but it's not sent
    */
    public function start(Request $request, AuthenticationException $authException = null)
    {
        $data = [
        // you might translate this message
        'message' => 'Authentication Required'
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    public function supportsRememberMe()
    {
        return false;
    }
}
