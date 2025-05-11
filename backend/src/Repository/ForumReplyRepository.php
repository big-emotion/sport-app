<?php

namespace App\Repository;

use App\Entity\ForumReply;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ForumReply>
 *
 * @method ForumReply|null find($id, $lockMode = null, $lockVersion = null)
 * @method ForumReply|null findOneBy(array $criteria, array $orderBy = null)
 * @method ForumReply[]    findAll()
 * @method ForumReply[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ForumReplyRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ForumReply::class);
    }
}
