<?php

namespace App\Repository;

use App\Entity\Guide;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Guide|null find($id, $lockMode = null, $lockVersion = null)
 * @method Guide|null findOneBy(array $criteria, array $orderBy = null)
 * @method Guide[]    findAll()
 * @method Guide[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GuideRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Guide::class);
    }

    // /**
    //  * @return Guide[] Returns an array of Guide objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('g.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Guide
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
