<?php

namespace App\EventListener;

use App\Entity\Booking;
use App\Entity\Notification;
use App\Entity\Review;
use App\Entity\User;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Symfony\Component\Security\Core\Security;

class NotificationEventListener
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        $entityManager = $args->getObjectManager();

        if ($entity instanceof Review) {
            $this->handleNewReview($entity, $entityManager);
        } elseif ($entity instanceof Booking) {
            $this->handleNewBooking($entity, $entityManager);
        }
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $entity = $args->getObject();
        $entityManager = $args->getObjectManager();

        if ($entity instanceof Booking && $args->hasChangedField('status')) {
            $this->handleBookingStatusChange($entity, $args->getOldValue('status'), $entityManager);
        }
    }

    private function handleNewReview(Review $review, $entityManager): void
    {
        $venue = $review->getVenue();
        $notification = new Notification();
        $notification->setType('NEW_REVIEW');
        $notification->setMessage(sprintf('New review received for %s', $venue->getName()));
        $notification->setUser($venue->getOwner());
        $notification->setData([
            'venueId' => $venue->getId(),
            'reviewId' => $review->getId(),
            'rating' => $review->getRating()
        ]);

        $entityManager->persist($notification);
        $entityManager->flush();
    }

    private function handleNewBooking(Booking $booking, $entityManager): void
    {
        $venue = $booking->getVenue();
        $notification = new Notification();
        $notification->setType('NEW_BOOKING');
        $notification->setMessage(sprintf('New booking for %s', $venue->getName()));
        $notification->setUser($venue->getOwner());
        $notification->setData([
            'venueId' => $venue->getId(),
            'bookingId' => $booking->getId(),
            'startTime' => $booking->getStartTime()->format('c'),
            'numberOfPeople' => $booking->getNumberOfPeople()
        ]);

        $entityManager->persist($notification);
        $entityManager->flush();
    }

    private function handleBookingStatusChange(Booking $booking, string $oldStatus, $entityManager): void
    {
        $newStatus = $booking->getStatus();
        $user = $booking->getUser();
        $venue = $booking->getVenue();

        $notification = new Notification();
        $notification->setType('BOOKING_STATUS_CHANGE');
        $notification->setMessage(sprintf(
            'Booking status changed from %s to %s for %s',
            $oldStatus,
            $newStatus,
            $venue->getName()
        ));
        $notification->setUser($user);
        $notification->setData([
            'venueId' => $venue->getId(),
            'bookingId' => $booking->getId(),
            'oldStatus' => $oldStatus,
            'newStatus' => $newStatus
        ]);

        $entityManager->persist($notification);
        $entityManager->flush();
    }
} 