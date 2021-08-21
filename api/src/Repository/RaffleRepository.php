<?php

namespace App\Repository;

use App\Entity\Raffle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Raffle|null find($id, $lockMode = null, $lockVersion = null)
 * @method Raffle|null findOneBy(array $criteria, array $orderBy = null)
 * @method Raffle[]    findAll()
 * @method Raffle[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RaffleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Raffle::class);
    }

    // /**
    //  * @return Raffle[] Returns an array of Raffle objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('r.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Raffle
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
