<?php

namespace App\Repository;

use App\Entity\UsageStatistics;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UsageStatistics>
 *
 * @method UsageStatistics|null find($id, $lockMode = null, $lockVersion = null)
 * @method UsageStatistics|null findOneBy(array $criteria, array $orderBy = null)
 * @method UsageStatistics[]    findAll()
 * @method UsageStatistics[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UsageStatisticsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UsageStatistics::class);
    }
}
