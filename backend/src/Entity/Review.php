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
use App\Repository\ReviewRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation as OpenApiOperation;
use ApiPlatform\OpenApi\Model\Response as OpenApiResponse;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\OpenApi\Model\Parameter as OpenApiParameter;
use ApiPlatform\OpenApi\Model\RequestBody as OpenApiRequestBody;

#[ORM\Entity(repositoryClass: ReviewRepository::class)]
#[ORM\Table(name: 'reviews')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            openapi: new OpenApiOperation(
                summary: 'Retrieve a review',
                description: 'Retrieves a specific review by its ID.',
                responses: [
                    '200' => new OpenApiResponse(
                        description: 'Review retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Review'
                                ]
                            ]
                        ])
                    ),
                    '404' => new OpenApiResponse(description: 'Review not found')
                ]
            )
        ),
        new GetCollection(
            openapi: new OpenApiOperation(
                summary: 'Retrieve reviews',
                description: 'Retrieves a collection of reviews with filtering and pagination.',
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
                        name: 'author.id',
                        in: 'query',
                        description: 'Filter by author ID',
                        schema: ['type' => 'integer']
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_USER')",
            openapi: new OpenApiOperation(
                summary: 'Create a review',
                description: 'Creates a new review for a sport venue. Only authenticated users can create reviews.',
                requestBody: new OpenApiRequestBody(
                    description: 'Create a new review',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Review-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new OpenApiResponse(
                        description: 'Review created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Review'
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
            security: "is_granted('ROLE_USER') and object.getAuthor() == user or is_granted('ROLE_ADMIN')",
            openapi: new OpenApiOperation(
                summary: 'Update a review',
                description: 'Updates an existing review. Only the review author or administrators can update reviews.',
                requestBody: new OpenApiRequestBody(
                    description: 'Update a review',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Review-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new OpenApiResponse(
                        description: 'Review updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Review'
                                ]
                            ]
                        ])
                    ),
                    '400' => new OpenApiResponse(description: 'Invalid input'),
                    '403' => new OpenApiResponse(description: 'Access denied'),
                    '404' => new OpenApiResponse(description: 'Review not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_USER') and object.getAuthor() == user or is_granted('ROLE_ADMIN')",
            openapi: new OpenApiOperation(
                summary: 'Delete a review',
                description: 'Deletes a review. Only the review author or administrators can delete reviews.',
                responses: [
                    '204' => new OpenApiResponse(description: 'Review deleted successfully'),
                    '403' => new OpenApiResponse(description: 'Access denied'),
                    '404' => new OpenApiResponse(description: 'Review not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['review:read']],
    denormalizationContext: ['groups' => ['review:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: ['venue.id' => 'exact', 'author.id' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt', 'rating'])]
#[ApiFilter(RangeFilter::class, properties: ['rating'])]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['review:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['review:read'])]
    private ?User $author = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class, inversedBy: 'reviews')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['review:read', 'review:write'])]
    private ?SportVenue $venue = null;

    #[ORM\Column(type: 'integer')]
    #[Assert\Range(min: 1, max: 5)]
    #[Groups(['review:read', 'review:write'])]
    private ?int $rating = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Assert\Length(min: 10, max: 1000)]
    #[Groups(['review:read', 'review:write'])]
    private ?string $content = null;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['review:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['review:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;
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

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(int $rating): self
    {
        $this->rating = $rating;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
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