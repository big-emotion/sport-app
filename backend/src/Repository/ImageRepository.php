<?php

namespace App\Repository;

use App\Entity\Image;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Image>
 *
 * @method Image|null find($id, $lockMode = null, $lockVersion = null)
 * @method Image|null findOneBy(array $criteria, array $orderBy = null)
 * @method Image[]    findAll()
 * @method Image[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Image::class);
    }

    /**
     * Find images for a specific venue
     */
    public function findByVenue(int $venueId): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.venue = :venueId')
            ->setParameter('venueId', $venueId)
            ->orderBy('i.isMain', 'DESC')
            ->addOrderBy('i.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find main image for a venue
     */
    public function findMainImage(int $venueId): ?Image
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.venue = :venueId')
            ->andWhere('i.isMain = true')
            ->setParameter('venueId', $venueId)
            ->getQuery()
            ->getOneOrNullResult();
    }

    /**
     * Find non-main images for a venue
     */
    public function findNonMainImages(int $venueId): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.venue = :venueId')
            ->andWhere('i.isMain = false')
            ->setParameter('venueId', $venueId)
            ->orderBy('i.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Find recent images
     */
    public function findRecent(int $limit = 10): array
    {
        return $this->createQueryBuilder('i')
            ->orderBy('i.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
} 