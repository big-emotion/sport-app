<?php

namespace App\Repository;

use App\Entity\Itinerary;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Itinerary>
 *
 * @method Itinerary|null find($id, $lockMode = null, $lockVersion = null)
 * @method Itinerary|null findOneBy(array $criteria, array $orderBy = null)
 * @method Itinerary[]    findAll()
 * @method Itinerary[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ItineraryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Itinerary::class);
    }
}
