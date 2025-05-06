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
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use App\Repository\FacilityRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation as OpenApiOperation;
use ApiPlatform\OpenApi\Model\Response as OpenApiResponse;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\OpenApi\Model\Parameter as OpenApiParameter;
use ApiPlatform\OpenApi\Model\RequestBody as OpenApiRequestBody;

#[ORM\Entity(repositoryClass: FacilityRepository::class)]
#[ORM\Table(name: 'facilities')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            openapi: new OpenApiOperation(
                summary: 'Retrieve a facility',
                description: 'Retrieves a specific facility by its ID.',
                responses: [
                    '200' => new OpenApiResponse(
                        description: 'Facility retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Facility'
                                ]
                            ]
                        ])
                    ),
                    '404' => new OpenApiResponse(description: 'Facility not found')
                ]
            )
        ),
        new GetCollection(
            openapi: new OpenApiOperation(
                summary: 'Retrieve facilities',
                description: 'Retrieves a collection of facilities with filtering and pagination.',
                parameters: [
                    new OpenApiParameter(
                        name: 'page',
                        in: 'query',
                        description: 'The collection page number',
                        schema: ['type' => 'integer', 'default' => 1]
                    ),
                    new OpenApiParameter(
                        name: 'itemsPerPage',
                        in: 'query',
                        description: 'The number of items per page',
                        schema: ['type' => 'integer', 'default' => 10]
                    ),
                    new OpenApiParameter(
                        name: 'venue.id',
                        in: 'query',
                        description: 'Filter by venue ID',
                        schema: ['type' => 'integer']
                    ),
                    new OpenApiParameter(
                        name: 'isAvailable',
                        in: 'query',
                        description: 'Filter by availability',
                        schema: ['type' => 'boolean']
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new OpenApiOperation(
                summary: 'Create a facility',
                description: 'Creates a new facility. Only administrators can create facilities.',
                requestBody: new OpenApiRequestBody(
                    description: 'Create a new facility',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Facility-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new OpenApiResponse(
                        description: 'Facility created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Facility'
                                ]
                            ]
                        ])
                    ),
                    '400' => new OpenApiResponse(description: 'Invalid input'),
                    '403' => new OpenApiResponse(description: 'Access denied')
                ]
            )
        ),
        new Put(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new OpenApiOperation(
                summary: 'Update a facility',
                description: 'Updates an existing facility. Only administrators can update facilities.',
                requestBody: new OpenApiRequestBody(
                    description: 'Update a facility',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Facility-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new OpenApiResponse(
                        description: 'Facility updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Facility'
                                ]
                            ]
                        ])
                    ),
                    '400' => new OpenApiResponse(description: 'Invalid input'),
                    '403' => new OpenApiResponse(description: 'Access denied'),
                    '404' => new OpenApiResponse(description: 'Facility not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new OpenApiOperation(
                summary: 'Delete a facility',
                description: 'Deletes a facility. Only administrators can delete facilities.',
                responses: [
                    '204' => new OpenApiResponse(description: 'Facility deleted successfully'),
                    '403' => new OpenApiResponse(description: 'Access denied'),
                    '404' => new OpenApiResponse(description: 'Facility not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['facility:read']],
    denormalizationContext: ['groups' => ['facility:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: ['venue.id' => 'exact', 'name' => 'partial', 'isAvailable' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['name', 'price'])]
#[ApiFilter(RangeFilter::class, properties: ['price'])]
class Facility
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['facility:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class, inversedBy: 'facilities')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['facility:read', 'facility:write'])]
    private ?SportVenue $venue = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 100)]
    #[Groups(['facility:read', 'facility:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['facility:read', 'facility:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['facility:read', 'facility:write'])]
    private bool $isAvailable = true;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    #[Assert\PositiveOrZero]
    #[Groups(['facility:read', 'facility:write'])]
    private ?string $price = null;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['facility:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['facility:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
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

    public function isAvailable(): bool
    {
        return $this->isAvailable;
    }

    public function setIsAvailable(bool $isAvailable): self
    {
        $this->isAvailable = $isAvailable;
        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): self
    {
        $this->price = $price;
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

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
} 