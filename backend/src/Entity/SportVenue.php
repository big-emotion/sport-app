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

#[ORM\Entity(repositoryClass: SportVenueRepository::class)]
#[ORM\Table(name: 'sport_venues')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(normalizationContext: ['groups' => ['venue:read']]),
        new GetCollection(normalizationContext: ['groups' => ['venue:read']]),
        new Post(normalizationContext: ['groups' => ['venue:read']], denormalizationContext: ['groups' => ['venue:write']]),
        new Put(normalizationContext: ['groups' => ['venue:read']], denormalizationContext: ['groups' => ['venue:write']]),
        new Delete()
    ],
    order: ['name' => 'ASC'],
    paginationEnabled: true
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
    #[Groups(['venue:read', 'venue:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'float')]
    #[Assert\NotNull(message: 'Latitude is required')]
    #[Groups(['venue:read', 'venue:write'])]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    #[Assert\NotNull(message: 'Longitude is required')]
    #[Groups(['venue:read', 'venue:write'])]
    private ?float $longitude = null;

    #[ORM\Column(name: 'opening_time', type: 'time', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?\DateTimeInterface $openingTime = null;

    #[ORM\Column(name: 'closing_time', type: 'time', nullable: true)]
    #[Groups(['venue:read', 'venue:write'])]
    private ?\DateTimeInterface $closingTime = null;

    #[ORM\Column(name: 'entrance_fee', type: 'decimal', precision: 10, scale: 2, nullable: true)]
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

    #[ORM\PrePersist]
    public function setCreationDateValue(): void
    {
        $this->creationDate = new \DateTimeImmutable();
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
} 