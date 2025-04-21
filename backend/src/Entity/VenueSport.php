<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\VenueSportRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\RequestBody;

#[ORM\Entity(repositoryClass: VenueSportRepository::class)]
#[ORM\Table(name: 'venue_sports')]
#[ORM\UniqueConstraint(name: 'venue_sport_unique', columns: ['venue_id', 'sport_id'])]
#[ApiResource(
    operations: [
        new Get(
            openapi: new Operation(
                summary: 'Retrieve a venue sport',
                description: 'Retrieves a specific venue sport by its ID.',
                responses: [
                    '200' => new Response(
                        description: 'Venue sport retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/VenueSport'
                                ]
                            ]
                        ])
                    ),
                    '404' => new Response(description: 'Venue sport not found')
                ]
            )
        ),
        new GetCollection(
            openapi: new Operation(
                summary: 'Retrieve venue sports',
                description: 'Retrieves a collection of venue sports with filtering and pagination.',
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
                        name: 'venue.id',
                        in: 'query',
                        description: 'Filter by venue ID',
                        schema: ['type' => 'integer']
                    ),
                    new Parameter(
                        name: 'sport.id',
                        in: 'query',
                        description: 'Filter by sport ID',
                        schema: ['type' => 'integer']
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Create a venue sport',
                description: 'Creates a new venue sport association. Only administrators can create venue sports.',
                requestBody: new RequestBody(
                    description: 'Create a new venue sport',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/VenueSport-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new Response(
                        description: 'Venue sport created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/VenueSport'
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
                summary: 'Update a venue sport',
                description: 'Updates an existing venue sport association. Only administrators can update venue sports.',
                requestBody: new RequestBody(
                    description: 'Update a venue sport',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/VenueSport-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new Response(
                        description: 'Venue sport updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/VenueSport'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Venue sport not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Delete a venue sport',
                description: 'Deletes a venue sport association. Only administrators can delete venue sports.',
                responses: [
                    '204' => new Response(description: 'Venue sport deleted successfully'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Venue sport not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['venue_sport:read']],
    denormalizationContext: ['groups' => ['venue_sport:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
class VenueSport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['venue_sport:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class, inversedBy: 'venueSports')]
    #[ORM\JoinColumn(name: 'venue_id', nullable: false)]
    #[Assert\NotNull]
    #[Groups(['venue_sport:read', 'venue_sport:write'])]
    private ?SportVenue $venue = null;

    #[ORM\ManyToOne(targetEntity: Sport::class, inversedBy: 'venueSports')]
    #[ORM\JoinColumn(name: 'sport_id', nullable: false)]
    #[Assert\NotNull]
    #[Groups(['venue_sport:read', 'venue_sport:write'])]
    private ?Sport $sport = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['venue_sport:read', 'venue_sport:write'])]
    private bool $isPrimary = false;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['venue_sport:read', 'venue_sport:write'])]
    private ?string $description = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['venue_sport:read', 'venue_sport:write'])]
    private ?array $facilities = null;

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

    public function getSport(): ?Sport
    {
        return $this->sport;
    }

    public function setSport(?Sport $sport): self
    {
        $this->sport = $sport;
        return $this;
    }

    public function isPrimary(): bool
    {
        return $this->isPrimary;
    }

    public function setIsPrimary(bool $isPrimary): self
    {
        $this->isPrimary = $isPrimary;
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

    public function getFacilities(): ?array
    {
        return $this->facilities;
    }

    public function setFacilities(?array $facilities): self
    {
        $this->facilities = $facilities;
        return $this;
    }
} 