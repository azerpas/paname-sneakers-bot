<?php

namespace App\Resolver;

use ApiPlatform\Core\GraphQl\Resolver\QueryCollectionResolverInterface;
use App\Entity\Product;

final class PublishedProductsCollectionResolver implements QueryCollectionResolverInterface
{
    /**
     * @param iterable<Product> $collection
     * @param array $context
     * @return iterable<Product>
     */
    public function __invoke(iterable $collection, array $context): iterable
    {
        return $collection;
    }
}
