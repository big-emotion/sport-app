<?php

namespace App\Repository;

use App\Entity\Sport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Sport>
 *
 * @method Sport|null find($id, $lockMode = null, $lockVersion = null)
 * @method Sport|null findOneBy(array $criteria, array $orderBy = null)
 * @method Sport[]    findAll()
 * @method Sport[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Sport::class);
    }

    /**
     * Find sports by name (partial match)
     */
    public function findByName(string $name): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.name LIKE :name')
            ->setParameter('name', '%' . $name . '%')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find sports by category
     */
    public function findByCategory(string $category): array
    {
        return $this->createQueryBuilder('s')
            ->andWhere('s.category = :category')
            ->setParameter('category', $category)
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find popular sports (by number of venues)
     */
    public function findPopular(int $limit = 10): array
    {
        return $this->createQueryBuilder('s')
            ->select('s, COUNT(vs.id) as venueCount')
            ->leftJoin('s.venueSports', 'vs')
            ->groupBy('s.id')
            ->orderBy('venueCount', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    /**
     * Find sports with active venues
     */
    public function findWithActiveVenues(): array
    {
        return $this->createQueryBuilder('s')
            ->select('s, COUNT(vs.id) as venueCount')
            ->leftJoin('s.venueSports', 'vs')
            ->leftJoin('vs.venue', 'v')
            ->andWhere('v.isActive = true')
            ->groupBy('s.id')
            ->having('venueCount > 0')
            ->orderBy('s.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 