<?php

namespace App\Repository;

use App\Entity\FirebaseUser;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method FirebaseUser|null find($id, $lockMode = null, $lockVersion = null)
 * @method FirebaseUser|null findOneBy(array $criteria, array $orderBy = null)
 * @method FirebaseUser[]    findAll()
 * @method FirebaseUser[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FirebaseUserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FirebaseUser::class);
    }

    public function findOneByFirebaseId($uid): ?FirebaseUser
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.firebaseId = :uid')
            ->setParameter('uid', $uid)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }

    // /**
    //  * @return FirebaseUser[] Returns an array of FirebaseUser objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('f.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?FirebaseUser
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
