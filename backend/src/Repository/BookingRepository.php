<?php

namespace App\Repository;

use App\Entity\Booking;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Booking>
 *
 * @method Booking|null find($id, $lockMode = null, $lockVersion = null)
 * @method Booking|null findOneBy(array $criteria, array $orderBy = null)
 * @method Booking[]    findAll()
 * @method Booking[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BookingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Booking::class);
    }

    /**
     * Find bookings for a specific user
     */
    public function findByUser(int $userId): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.user = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('b.startTime', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find bookings for a specific venue
     */
    public function findByVenue(int $venueId): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.venue = :venueId')
            ->setParameter('venueId', $venueId)
            ->orderBy('b.startTime', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find bookings by status
     */
    public function findByStatus(string $status): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.status = :status')
            ->setParameter('status', $status)
            ->orderBy('b.startTime', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find upcoming bookings
     */
    public function findUpcoming(): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.startTime > :now')
            ->setParameter('now', new \DateTime())
            ->orderBy('b.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find bookings within a date range
     */
    public function findByDateRange(\DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.startTime >= :startDate')
            ->andWhere('b.endTime <= :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('b.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
} 