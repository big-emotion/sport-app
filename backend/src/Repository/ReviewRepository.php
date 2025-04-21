<?php

namespace App\Repository;

use App\Entity\Review;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Review>
 *
 * @method Review|null find($id, $lockMode = null, $lockVersion = null)
 * @method Review|null findOneBy(array $criteria, array $orderBy = null)
 * @method Review[]    findAll()
 * @method Review[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Review::class);
    }

    /**
     * Find reviews for a specific venue
     */
    public function findByVenue(int $venueId): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.venue = :venueId')
            ->setParameter('venueId', $venueId)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find reviews by a specific user
     */
    public function findByUser(int $userId): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.author = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find reviews by rating range
     */
    public function findByRatingRange(int $minRating, int $maxRating): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('r.rating >= :minRating')
            ->andWhere('r.rating <= :maxRating')
            ->setParameter('minRating', $minRating)
            ->setParameter('maxRating', $maxRating)
            ->orderBy('r.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Get average rating for a venue
     */
    public function getAverageRating(int $venueId): float
    {
        return $this->createQueryBuilder('r')
            ->select('AVG(r.rating) as averageRating')
            ->andWhere('r.venue = :venueId')
            ->setParameter('venueId', $venueId)
            ->getQuery()
            ->getSingleScalarResult() ?? 0;
    }

    /**
     * Get recent reviews
     */
    public function findRecent(int $limit = 10): array
    {
        return $this->createQueryBuilder('r')
            ->orderBy('r.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
} 