<?php

namespace App\Repository;

use App\Entity\VenueSport;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<VenueSport>
 *
 * @method VenueSport|null find($id, $lockMode = null, $lockVersion = null)
 * @method VenueSport|null findOneBy(array $criteria, array $orderBy = null)
 * @method VenueSport[]    findAll()
 * @method VenueSport[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class VenueSportRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, VenueSport::class);
    }

    public function save(VenueSport $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(VenueSport $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
} 