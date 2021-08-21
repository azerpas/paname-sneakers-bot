<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Raffle;

final class RafflesCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable<Raffle> $collection
     * @param array $context
     * @return iterable<Raffle>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
