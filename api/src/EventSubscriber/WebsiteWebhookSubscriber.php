<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Website;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class WebsiteWebhookSubscriber implements EventSubscriberInterface
{
    private $webhook;

    public function __construct()
    {
        $this->webhook = $_ENV["WEBHOOK_WEBSITE_EVENT"];
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendWebhook', EventPriorities::POST_WRITE],
        ];
    }

    public function sendWebhook(ViewEvent $event): void
    {
        $website = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$website instanceof Website || Request::METHOD_POST !== $method) {
            return;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->webhook);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        $body = array (
            'content' => '@here',
            'embeds' =>
                array (
                    0 =>
                        array (
                            'title' => $website->getName().' ADDED',
                            'url' => 'https://paname.io/dashboard',
                            'color' => 10815231,
                            'footer' =>
                                array (
                                    'text' => 'Paname.io',
                                    'icon_url' => 'https://media.discordapp.net/attachments/781771924014628874/812470393935364136/paname-logo.png?width=1038&height=1038',
                                ),
                            'thumbnail' =>
                                array (
                                    'url' => $website->getImageUrl(),
                                ),
                        ),
                ),
        );

        $payload = json_encode( $body );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
        $output = curl_exec($ch);
        curl_close($ch);

    }
}
