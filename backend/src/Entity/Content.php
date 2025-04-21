<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\ContentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;

#[ORM\Entity(repositoryClass: ContentRepository::class)]
#[ORM\Table(name: 'contents')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('ROLE_USER') and object.getAuthor() == user"),
        new Delete(security: "is_granted('ROLE_USER') and object.getAuthor() == user"),
    ],
    normalizationContext: ['groups' => ['content:read']],
    denormalizationContext: ['groups' => ['content:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 20
)]
#[ApiFilter(SearchFilter::class, properties: ['type' => 'exact', 'content' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt'])]
class Content
{
    public const TYPE_VIDEO = 'VIDEO';
    public const TYPE_COMMENT = 'COMMENT';
    public const TYPE_REVIEW = 'REVIEW';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['content:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Assert\Choice(choices: [self::TYPE_VIDEO, self::TYPE_COMMENT, self::TYPE_REVIEW])]
    #[Groups(['content:read', 'content:write'])]
    private ?string $type = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    #[Groups(['content:read', 'content:write'])]
    private ?string $content = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['content:read'])]
    private ?User $author = null;

    #[ORM\ManyToOne(targetEntity: SportVenue::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?SportVenue $venue = null;

    #[ORM\ManyToOne(targetEntity: Sport::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?Sport $sport = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?string $mediaUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['content:read', 'content:write'])]
    private ?string $thumbnailUrl = null;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['content:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['content:read'])]
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

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;
        return $this;
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

    public function getSport(): ?Sport
    {
        return $this->sport;
    }

    public function setSport(?Sport $sport): self
    {
        $this->sport = $sport;
        return $this;
    }

    public function getMediaUrl(): ?string
    {
        return $this->mediaUrl;
    }

    public function setMediaUrl(?string $mediaUrl): self
    {
        $this->mediaUrl = $mediaUrl;
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