<?php

namespace App\Repository;

use App\Entity\SportVenue;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Query\Expr\Join;

/**
 * @method SportVenue|null find($id, $lockMode = null, $lockVersion = null)
 * @method SportVenue|null findOneBy(array $criteria, array $orderBy = null)
 * @method SportVenue[]    findAll()
 * @method SportVenue[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SportVenueRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SportVenue::class);
    }

    /**
     * Find venues by venue type
     */
    public function findByVenueType(string $venueType): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.venueType = :venueType')
            ->setParameter('venueType', $venueType)
            ->orderBy('v.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find venues by name (case insensitive partial match)
     */
    public function findByNameContainingIgnoreCase(string $name): array
    {
        return $this->createQueryBuilder('v')
            ->andWhere('LOWER(v.name) LIKE LOWER(:name)')
            ->setParameter('name', '%' . $name . '%')
            ->orderBy('v.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find venues within radius using PostgreSQL earth_distance
     * Note: This requires the PostgreSQL earthdistance module
     */
    public function findVenuesWithinRadius(float $lat, float $lon, float $radius): array
    {
        $conn = $this->getEntityManager()->getConnection();
        $sql = '
            SELECT v.* 
            FROM sport_venues v
            WHERE earth_distance(
                ll_to_earth(:lat, :lon),
                ll_to_earth(v.latitude, v.longitude)
            ) <= :radius
        ';
        
        $stmt = $conn->prepare($sql);
        $stmt->bindValue('lat', $lat);
        $stmt->bindValue('lon', $lon);
        $stmt->bindValue('radius', $radius);
        $resultSet = $stmt->executeQuery();
        
        return $resultSet->fetchAllAssociative();
    }
} 