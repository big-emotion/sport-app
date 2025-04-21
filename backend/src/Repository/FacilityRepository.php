<?php

namespace App\Repository;

use App\Entity\Facility;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Facility>
 *
 * @method Facility|null find($id, $lockMode = null, $lockVersion = null)
 * @method Facility|null findOneBy(array $criteria, array $orderBy = null)
 * @method Facility[]    findAll()
 * @method Facility[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FacilityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Facility::class);
    }

    /**
     * Find available facilities for a venue
     */
    public function findAvailableByVenue(int $venueId): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.venue = :venueId')
            ->andWhere('f.isAvailable = true')
            ->setParameter('venueId', $venueId)
            ->orderBy('f.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find facilities by price range
     */
    public function findByPriceRange(float $minPrice, float $maxPrice): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.price >= :minPrice')
            ->andWhere('f.price <= :maxPrice')
            ->setParameter('minPrice', $minPrice)
            ->setParameter('maxPrice', $maxPrice)
            ->orderBy('f.price', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find facilities by name (partial match)
     */
    public function findByName(string $name): array
    {
        return $this->createQueryBuilder('f')
            ->andWhere('f.name LIKE :name')
            ->setParameter('name', '%' . $name . '%')
            ->orderBy('f.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 