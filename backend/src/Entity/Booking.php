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
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\RequestBody;
use ApiPlatform\OpenApi\Model\Response;
use App\Repository\BookingRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
#[ORM\Table(name: 'bookings')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('ROLE_USER') and object.getUser() == user or is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Retrieve a booking',
                description: 'Retrieves a specific booking by its ID. Only the booking owner or admin can access it.',
                responses: [
                    '200' => new Response(
                        description: 'Booking retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Booking'
                                ]
                            ]
                        ])
                    ),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Booking not found')
                ]
            )
        ),
        new GetCollection(
            security: "is_granted('ROLE_USER')",
            openapi: new Operation(
                summary: 'Retrieve bookings',
                description: 'Retrieves a collection of bookings. Users can only see their own bookings.',
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
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_USER')",
            openapi: new Operation(
                summary: 'Create a booking',
                description: 'Creates a new booking for a sport venue.',
                requestBody: new RequestBody(
                    description: 'Create a new booking',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Booking-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new Response(
                        description: 'Booking created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Booking'
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
            security: "is_granted('ROLE_USER') and object.getUser() == user or is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Update a booking',
                description: 'Updates an existing booking. Only the booking owner or admin can update it.',
                requestBody: new RequestBody(
                    description: 'Update a booking',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Booking-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new Response(
                        description: 'Booking updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Booking'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Booking not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_USER') and object.getUser() == user or is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Delete a booking',
                description: 'Deletes a booking. Only the booking owner or admin can delete it.',
                responses: [
                    '204' => new Response(description: 'Booking deleted successfully'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Booking not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['booking:read']],
    denormalizationContext: ['groups' => ['booking:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['startTime', 'endTime', 'createdAt'])]
#[ApiFilter(DateFilter::class, properties: ['startTime', 'endTime'])]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['booking:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['booking:read'])]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['booking:read', 'booking:write'])]
    private ?SportVenue $venue = null;

    #[ORM\Column(type: 'datetime')]
    #[Assert\NotBlank]
    #[Assert\GreaterThan('now')]
    #[Groups(['booking:read', 'booking:write'])]
    private ?\DateTimeInterface $startTime = null;

    #[ORM\Column(type: 'datetime')]
    #[Assert\NotBlank]
    #[Assert\GreaterThan(propertyPath: 'startTime')]
    #[Groups(['booking:read', 'booking:write'])]
    private ?\DateTimeInterface $endTime = null;

    #[ORM\Column]
    #[Assert\NotBlank]
    #[Assert\Positive]
    #[Groups(['booking:read', 'booking:write'])]
    private ?int $numberOfPeople = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['pending', 'confirmed', 'cancelled'])]
    #[Groups(['booking:read', 'booking:write'])]
    private ?string $status = 'pending';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['booking:read', 'booking:write'])]
    private ?string $notes = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['booking:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['booking:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getVenue(): ?SportVenue
    {
        return $this->venue;
    }

    public function setVenue(?SportVenue $venue): self
    {
        $this->venue = $venue;
        return $this;
    }

    public function getStartTime(): ?\DateTimeInterface
    {
        return $this->startTime;
    }

    public function setStartTime(\DateTimeInterface $startTime): self
    {
        $this->startTime = $startTime;
        return $this;
    }

    public function getEndTime(): ?\DateTimeInterface
    {
        return $this->endTime;
    }

    public function setEndTime(\DateTimeInterface $endTime): self
    {
        $this->endTime = $endTime;
        return $this;
    }

    public function getNumberOfPeople(): ?int
    {
        return $this->numberOfPeople;
    }

    public function setNumberOfPeople(int $numberOfPeople): self
    {
        $this->numberOfPeople = $numberOfPeople;
        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): self
    {
        $this->notes = $notes;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }
} 