<?php

namespace App\Repository;

use App\Entity\Content;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Content>
 *
 * @method Content|null find($id, $lockMode = null, $lockVersion = null)
 * @method Content|null findOneBy(array $criteria, array $orderBy = null)
 * @method Content[]    findAll()
 * @method Content[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ContentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Content::class);
    }

    public function save(Content $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Content $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * @return Content[] Returns an array of Content objects
     */
    public function findByVenue(int $venueId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.venue = :venueId')
            ->setParameter('venueId', $venueId)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Content[] Returns an array of Content objects
     */
    public function findBySport(int $sportId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.sport = :sportId')
            ->setParameter('sportId', $sportId)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * @return Content[] Returns an array of Content objects
     */
    public function findByAuthor(int $authorId): array
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.author = :authorId')
            ->setParameter('authorId', $authorId)
            ->orderBy('c.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
} 