<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Repository\SportVenueRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\RequestBody;

#[ORM\Entity(repositoryClass: SportVenueRepository::class)]
#[ORM\Table(name: 'sport_venues')]
#[ORM\Index(name: 'idx_venue_type', columns: ['venue_type'])]
#[ORM\Index(name: 'idx_location', columns: ['latitude', 'longitude'])]
#[ORM\Index(name: 'idx_rating', columns: ['average_rating'])]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            openapi: new Operation(
                summary: 'Retrieve a sport venue',
                description: 'Retrieves a specific sport venue by its ID.',
                responses: [
                    '200' => new Response(
                        description: 'Sport venue retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/SportVenue'
                                ]
                            ]
                        ])
                    ),
                    '404' => new Response(description: 'Sport venue not found')
                ]
            )
        ),
        new GetCollection(
            openapi: new Operation(
                summary: 'Retrieve sport venues',
                description: 'Retrieves a collection of sport venues with filtering and pagination.',
                parameters: [
                    new Parameter(
                        name: 'page',
                        in: 'query',
                        description: 'The collection page number',
                        schema: ['type' => 'integer', 'default' => 1]
                    ),
                    new Parameter(
                        name: 'itemsPerPage',
                        in: 'query',
                        description: 'The number of items per page',
                        schema: ['type' => 'integer', 'default' => 10]
                    ),
                    new Parameter(
                        name: 'name',
                        in: 'query',
                        description: 'Filter by venue name (partial match)',
                        schema: ['type' => 'string']
                    ),
                    new Parameter(
                        name: 'venueType',
                        in: 'query',
                        description: 'Filter by venue type (exact match)',
                        schema: ['type' => 'string']
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Create a sport venue',
                description: 'Creates a new sport venue. Only administrators can create venues.',
                requestBody: new RequestBody(
                    description: 'Create a new sport venue',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/SportVenue-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new Response(
                        description: 'Sport venue created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/SportVenue'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied')
                ]
            )
        ),
        new Put(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Update a sport venue',
                description: 'Updates an existing sport venue. Only administrators can update venues.',
                requestBody: new RequestBody(
                    description: 'Update a sport venue',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/SportVenue-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new Response(
                        description: 'Sport venue updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/SportVenue'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Sport venue not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Delete a sport venue',
                description: 'Deletes a sport venue. Only administrators can delete venues.',
                responses: [
                    '204' => new Response(description: 'Sport venue deleted successfully'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Sport venue not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['venue:read']],
    denormalizationContext: ['groups' => ['venue:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial', 'venueType' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['name', 'averageRating', 'creationDate'])]
class SportVenue
{
    public const VENUE_TYPE_BASKETBALL = 'BASKETBALL';
    public const VENUE_TYPE_FOOTBALL = 'FOOTBALL';
    public const VENUE_TYPE_TENNIS = 'TENNIS';
    public const VENUE_TYPE_SWIMMING = 'SWIMMING';
    public const VENUE_TYPE_RUNNING = 'RUNNING';
    public const VENUE_TYPE_VOLLEYBALL = 'VOLLEYBALL';
    public const VENUE_TYPE_GOLF = 'GOLF';
    public const VENUE_TYPE_OTHER = 'OTHER';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['venue:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Name is required')]
    #[Assert\Length(min: 2, max: 255)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'float')]
    #[Assert\NotNull(message: 'Latitude is required')]
    #[Assert\Range(min: -90, max: 90)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Assert\NotNull(message: 'Longitude is required')]
    #[Assert\Range(min: -180, max: 180)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?float $longitude = null;

    #[ORM\Column(name: 'opening_time', type: 'time', nullable: true)]
    #[Assert\Expression(
        "this.getOpeningTime() === null or this.getClosingTime() === null or this.getOpeningTime() < this.getClosingTime()",
        message: "Opening time must be before closing time"
    )]
    #[Groups(['venue:read', 'venue:write'])]
    private ?\DateTimeInterface $openingTime = null;

    #[ORM\Column(name: 'closing_time', type: 'time', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?\DateTimeInterface $closingTime = null;

    #[ORM\Column(name: 'entrance_fee', type: 'decimal', precision: 10, scale: 2, nullable: true)]
    #[Assert\Range(min: 0)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $entranceFee = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $description = null;

    #[ORM\Column(name: 'creation_date', type: 'datetime')]
    #[Groups(['venue:read'])]
    private ?\DateTimeInterface $creationDate = null;

    #[ORM\Column(name: 'publication_date', type: 'datetime', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?\DateTimeInterface $publicationDate = null;

    #[ORM\Column(name: 'average_rating', type: 'float', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?float $averageRating = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $address = null;

    #[ORM\Column(name: 'venue_type', length: 20)]
    #[Assert\Choice(choices: [
        self::VENUE_TYPE_BASKETBALL,
        self::VENUE_TYPE_FOOTBALL,
        self::VENUE_TYPE_TENNIS,
        self::VENUE_TYPE_SWIMMING,
        self::VENUE_TYPE_RUNNING,
        self::VENUE_TYPE_VOLLEYBALL,
        self::VENUE_TYPE_GOLF,
        self::VENUE_TYPE_OTHER
    ])]
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $venueType = null;

    #[ORM\OneToMany(mappedBy: 'venue', targetEntity: VenueSport::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport_venue:read', 'sport_venue:write'])]
    private Collection $venueSports;

    #[ORM\OneToMany(mappedBy: 'venue', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport_venue:read'])]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'venue', targetEntity: Booking::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport_venue:read'])]
    private Collection $bookings;

    #[ORM\OneToMany(mappedBy: 'venue', targetEntity: Facility::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport_venue:read'])]
    private Collection $facilities;

    #[ORM\OneToMany(mappedBy: 'venue', targetEntity: Image::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport_venue:read'])]
    private Collection $images;

    public function __construct()
    {
        $this->venueSports = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->bookings = new ArrayCollection();
        $this->facilities = new ArrayCollection();
        $this->images = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreationDateValue(): void
    {
        $this->creationDate = new \DateTimeImmutable();
        if ($this->publicationDate === null) {
            $this->publicationDate = new \DateTimeImmutable();
        }
    }

    #[ORM\PreUpdate]
    public function updateAverageRating(): void
    {
        if ($this->reviews->count() > 0) {
            $totalRating = 0;
            foreach ($this->reviews as $review) {
                $totalRating += $review->getRating();
            }
            $this->averageRating = $totalRating / $this->reviews->count();
        }
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;
        return $this;
    }

    public function getOpeningTime(): ?\DateTimeInterface
    {
        return $this->openingTime;
    }

    public function setOpeningTime(?\DateTimeInterface $openingTime): self
    {
        $this->openingTime = $openingTime;
        return $this;
    }

    public function getClosingTime(): ?\DateTimeInterface
    {
        return $this->closingTime;
    }

    public function setClosingTime(?\DateTimeInterface $closingTime): self
    {
        $this->closingTime = $closingTime;
        return $this;
    }

    public function getEntranceFee(): ?string
    {
        return $this->entranceFee;
    }

    public function setEntranceFee(?string $entranceFee): self
    {
        $this->entranceFee = $entranceFee;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getCreationDate(): ?\DateTimeInterface
    {
        return $this->creationDate;
    }

    public function setCreationDate(\DateTimeInterface $creationDate): self
    {
        $this->creationDate = $creationDate;
        return $this;
    }

    public function getPublicationDate(): ?\DateTimeInterface
    {
        return $this->publicationDate;
    }

    public function setPublicationDate(?\DateTimeInterface $publicationDate): self
    {
        $this->publicationDate = $publicationDate;
        return $this;
    }

    public function getAverageRating(): ?float
    {
        return $this->averageRating;
    }

    public function setAverageRating(?float $averageRating): self
    {
        $this->averageRating = $averageRating;
        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;
        return $this;
    }

    public function getVenueType(): ?string
    {
        return $this->venueType;
    }

    public function setVenueType(string $venueType): self
    {
        $this->venueType = $venueType;
        return $this;
    }

    /**
     * @return Collection<int, VenueSport>
     */
    public function getVenueSports(): Collection
    {
        return $this->venueSports;
    }

    public function addVenueSport(VenueSport $venueSport): self
    {
        if (!$this->venueSports->contains($venueSport)) {
            $this->venueSports->add($venueSport);
            $venueSport->setVenue($this);
        }

        return $this;
    }

    public function removeVenueSport(VenueSport $venueSport): self
    {
        if ($this->venueSports->removeElement($venueSport)) {
            // set the owning side to null (unless already changed)
            if ($venueSport->getVenue() === $this) {
                $venueSport->setVenue(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): self
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setVenue($this);
        }

        return $this;
    }

    public function removeReview(Review $review): self
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getVenue() === $this) {
                $review->setVenue(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Booking>
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    public function addBooking(Booking $booking): self
    {
        if (!$this->bookings->contains($booking)) {
            $this->bookings->add($booking);
            $booking->setVenue($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): self
    {
        if ($this->bookings->removeElement($booking)) {
            // set the owning side to null (unless already changed)
            if ($booking->getVenue() === $this) {
                $booking->setVenue(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Facility>
     */
    public function getFacilities(): Collection
    {
        return $this->facilities;
    }

    public function addFacility(Facility $facility): self
    {
        if (!$this->facilities->contains($facility)) {
            $this->facilities->add($facility);
            $facility->setVenue($this);
        }

        return $this;
    }

    public function removeFacility(Facility $facility): self
    {
        if ($this->facilities->removeElement($facility)) {
            // set the owning side to null (unless already changed)
            if ($facility->getVenue() === $this) {
                $facility->setVenue(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setVenue($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getVenue() === $this) {
                $image->setVenue(null);
            }
        }

        return $this;
    }
} 