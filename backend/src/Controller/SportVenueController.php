<?php

namespace App\Controller;

use App\Entity\SportVenue;
use App\Repository\SportVenueRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/sport-venues')]
class SportVenueController extends AbstractController
{
    public function __construct(
        private SportVenueRepository $venueRepository,
        private SerializerInterface $serializer
    ) {
    }

    /**
     * Find venues within a specified radius
     */
    #[Route('/radius-search', name: 'venue_radius_search', methods: ['GET'])]
    public function findVenuesWithinRadius(Request $request): JsonResponse
    {
        $lat = $request->query->get('lat');
        $lon = $request->query->get('lon');
        $radius = $request->query->get('radius', 5000); // Default radius: 5km
        
        if (!$lat || !$lon) {
            return $this->json(['error' => 'Latitude and longitude parameters are required'], Response::HTTP_BAD_REQUEST);
        }
        
        $venues = $this->venueRepository->findVenuesWithinRadius((float) $lat, (float) $lon, (float) $radius);
        
        return $this->json($venues, Response::HTTP_OK, [], ['groups' => 'venue:read']);
    }

    /**
     * Find venues by type
     * Note: This could also be done via API Platform filters, but included as an example
     */
    #[Route('/by-type/{venueType}', name: 'venue_by_type', methods: ['GET'])]
    public function findVenuesByType(string $venueType): JsonResponse
    {
        // Validate venue type
        $validTypes = [
            SportVenue::VENUE_TYPE_BASKETBALL,
            SportVenue::VENUE_TYPE_FOOTBALL,
            SportVenue::VENUE_TYPE_TENNIS,
            SportVenue::VENUE_TYPE_SWIMMING,
            SportVenue::VENUE_TYPE_RUNNING,
            SportVenue::VENUE_TYPE_VOLLEYBALL,
            SportVenue::VENUE_TYPE_GOLF,
            SportVenue::VENUE_TYPE_OTHER
        ];
        
        if (!in_array($venueType, $validTypes)) {
            return $this->json(['error' => 'Invalid venue type'], Response::HTTP_BAD_REQUEST);
        }
        
        $venues = $this->venueRepository->findByVenueType($venueType);
        
        return $this->json($venues, Response::HTTP_OK, [], ['groups' => 'venue:read']);
    }

    /**
     * Custom search endpoint
     */
    #[Route('/search', name: 'venue_search', methods: ['GET'])]
    public function searchVenues(Request $request): JsonResponse
    {
        $name = $request->query->get('name');
        
        if (!$name) {
            return $this->json(['error' => 'Name parameter is required'], Response::HTTP_BAD_REQUEST);
        }
        
        $venues = $this->venueRepository->findByNameContainingIgnoreCase($name);
        
        return $this->json($venues, Response::HTTP_OK, [], ['groups' => 'venue:read']);
    }
} 