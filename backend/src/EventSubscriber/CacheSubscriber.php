<?php

namespace App\EventSubscriber;

use App\Entity\Booking;
use App\Entity\Review;
use App\Entity\Sport;
use App\Entity\SportVenue;
use App\Entity\User;
use App\Service\CacheService;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PostFlushEventArgs;
use Doctrine\ORM\Events;

class CacheSubscriber implements EventSubscriberInterface
{
    private array $entitiesToInvalidate = [];

    public function __construct(
        private CacheService $cacheService
    ) {}

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
            Events::postUpdate,
            Events::postRemove,
            Events::postFlush,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $this->markEntityForInvalidation($args->getObject());
    }

    public function postUpdate(LifecycleEventArgs $args): void
    {
        $this->markEntityForInvalidation($args->getObject());
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $this->markEntityForInvalidation($args->getObject());
    }

    public function postFlush(PostFlushEventArgs $args): void
    {
        foreach ($this->entitiesToInvalidate as $entity) {
            $this->invalidateEntityCache($entity);
        }
        $this->entitiesToInvalidate = [];
    }

    private function markEntityForInvalidation(object $entity): void
    {
        $this->entitiesToInvalidate[] = $entity;
    }

    private function invalidateEntityCache(object $entity): void
    {
        switch (true) {
            case $entity instanceof SportVenue:
                $this->cacheService->invalidateCache('venue', ['venue_' . $entity->getId()]);
                break;
            case $entity instanceof User:
                $this->cacheService->invalidateCache('user', ['user_' . $entity->getId()]);
                break;
            case $entity instanceof Sport:
                $this->cacheService->invalidateCache('sport', ['sport_' . $entity->getId()]);
                break;
            case $entity instanceof Review:
                $this->cacheService->invalidateCache('review', ['review_' . $entity->getId()]);
                if ($entity->getVenue()) {
                    $this->cacheService->invalidateCache('venue', ['venue_' . $entity->getVenue()->getId()]);
                }
                break;
            case $entity instanceof Booking:
                $this->cacheService->invalidateCache('booking', ['booking_' . $entity->getId()]);
                if ($entity->getVenue()) {
                    $this->cacheService->invalidateCache('venue', ['venue_' . $entity->getVenue()->getId()]);
                }
                break;
        }
    }
} 