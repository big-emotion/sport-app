<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\MediaRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiFilter\SearchFilter;
use ApiPlatform\Core\Annotation\ApiFilter\OrderFilter;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ORM\Table(name: 'media')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('ROLE_USER') and object.getUploadedBy() == user"),
        new Delete(security: "is_granted('ROLE_USER') and object.getUploadedBy() == user"),
    ],
    normalizationContext: ['groups' => ['media:read']],
    denormalizationContext: ['groups' => ['media:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 20
)]
#[ApiFilter(SearchFilter::class, properties: ['type' => 'exact', 'storageProvider' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt'])]
class Media
{
    public const TYPE_PHOTO = 'PHOTO';
    public const TYPE_VIDEO = 'VIDEO';

    public const STORAGE_S3 = 'S3';
    public const STORAGE_CLOUDINARY = 'CLOUDINARY';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['media:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [self::TYPE_PHOTO, self::TYPE_VIDEO])]
    #[Groups(['media:read', 'media:write'])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Url]
    #[Groups(['media:read', 'media:write'])]
    private ?string $url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Url]
    #[Groups(['media:read', 'media:write'])]
    private ?string $thumbnailUrl = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['media:read', 'media:write'])]
    private ?SportVenue $venue = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['media:read'])]
    private ?User $uploadedBy = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [self::STORAGE_S3, self::STORAGE_CLOUDINARY])]
    #[Groups(['media:read', 'media:write'])]
    private ?string $storageProvider = null;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['media:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['media:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }

    public function getUrl(): ?string
    {
        return $this->url;
    }

    public function setUrl(string $url): self
    {
        $this->url = $url;
        return $this;
    }

    public function getThumbnailUrl(): ?string
    {
        return $this->thumbnailUrl;
    }

    public function setThumbnailUrl(?string $thumbnailUrl): self
    {
        $this->thumbnailUrl = $thumbnailUrl;
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

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): self
    {
        $this->uploadedBy = $uploadedBy;
        return $this;
    }

    public function getStorageProvider(): ?string
    {
        return $this->storageProvider;
    }

    public function setStorageProvider(string $storageProvider): self
    {
        $this->storageProvider = $storageProvider;
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