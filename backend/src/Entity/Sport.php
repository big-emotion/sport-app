<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use App\Repository\SportRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Response;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\RequestBody;

#[ORM\Entity(repositoryClass: SportRepository::class)]
#[ORM\Table(name: 'sports')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            openapi: new Operation(
                summary: 'Retrieve a sport',
                description: 'Retrieves a specific sport by its ID.',
                responses: [
                    '200' => new Response(
                        description: 'Sport retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Sport'
                                ]
                            ]
                        ])
                    ),
                    '404' => new Response(description: 'Sport not found')
                ]
            )
        ),
        new GetCollection(
            openapi: new Operation(
                summary: 'Retrieve sports',
                description: 'Retrieves a collection of sports with filtering and pagination.',
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
                        description: 'Filter by sport name (partial match)',
                        schema: ['type' => 'string']
                    )
                ]
            )
        ),
        new Post(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Create a sport',
                description: 'Creates a new sport. Only administrators can create sports.',
                requestBody: new RequestBody(
                    description: 'Create a new sport',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Sport-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new Response(
                        description: 'Sport created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Sport'
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
                summary: 'Update a sport',
                description: 'Updates an existing sport. Only administrators can update sports.',
                requestBody: new RequestBody(
                    description: 'Update a sport',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Sport-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new Response(
                        description: 'Sport updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/Sport'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Sport not found')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Delete a sport',
                description: 'Deletes a sport. Only administrators can delete sports.',
                responses: [
                    '204' => new Response(description: 'Sport deleted successfully'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'Sport not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['sport:read']],
    denormalizationContext: ['groups' => ['sport:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 10
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial', 'isOfficial' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['name', 'createdAt'])]
class Sport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sport:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 2, max: 100)]
    #[Groups(['sport:read', 'sport:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['sport:read', 'sport:write'])]
    private ?string $description = null;

    #[ORM\Column(name: 'is_official', type: 'boolean')]
    #[Groups(['sport:read', 'sport:write'])]
    private bool $isOfficial = false;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['sport:read', 'sport:write'])]
    private ?string $icon = null;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['sport:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['sport:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'created_by_id', nullable: false)]
    #[Groups(['sport:read'])]
    private ?User $createdBy = null;

    #[ORM\OneToMany(mappedBy: 'sport', targetEntity: VenueSport::class, cascade: ['persist', 'remove'])]
    #[Groups(['sport:read', 'sport:write'])]
    private Collection $venueSports;

    public function __construct()
    {
        $this->venueSports = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function isOfficial(): bool
    {
        return $this->isOfficial;
    }

    public function setIsOfficial(bool $isOfficial): self
    {
        $this->isOfficial = $isOfficial;
        return $this;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }

    public function setIcon(?string $icon): self
    {
        $this->icon = $icon;
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

    public function getCreatedBy(): ?User
    {
        return $this->createdBy;
    }

    public function setCreatedBy(?User $createdBy): self
    {
        $this->createdBy = $createdBy;
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
            $venueSport->setSport($this);
        }

        return $this;
    }

    public function removeVenueSport(VenueSport $venueSport): self
    {
        if ($this->venueSports->removeElement($venueSport)) {
            // set the owning side to null (unless already changed)
            if ($venueSport->getSport() === $this) {
                $venueSport->setSport(null);
            }
        }

        return $this;
    }
} 