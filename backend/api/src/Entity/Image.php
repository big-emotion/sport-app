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
use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ORM\Table(name: 'images')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')"),
    ],
    normalizationContext: ['groups' => ['image:read']],
    denormalizationContext: ['groups' => ['image:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 20
)]
#[ApiFilter(SearchFilter::class, properties: ['isMain' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt'])]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['image:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class, inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['image:read', 'image:write'])]
    private ?SportVenue $venue = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['image:read', 'image:write'])]
    private ?string $path = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['image:read', 'image:write'])]
    private ?string $altText = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['image:read', 'image:write'])]
    private bool $isMain = false;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['image:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['image:read'])]
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

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): self
    {
        $this->path = $path;
        return $this;
    }

    public function getAltText(): ?string
    {
        return $this->altText;
    }

    public function setAltText(?string $altText): self
    {
        $this->altText = $altText;
        return $this;
    }

    public function isMain(): bool
    {
        return $this->isMain;
    }

    public function setIsMain(bool $isMain): self
    {
        $this->isMain = $isMain;
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