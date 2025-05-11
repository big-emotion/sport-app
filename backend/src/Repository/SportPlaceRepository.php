<?php

namespace App\Repository;

use App\Entity\SportPlace;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SportPlace>
 *
 * @method SportPlace|null find($id, $lockMode = null, $lockVersion = null)
 * @method SportPlace|null findOneBy(array $criteria, array $orderBy = null)
 * @method SportPlace[]    findAll()
 * @method SportPlace[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SportPlaceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SportPlace::class);
    }
}
