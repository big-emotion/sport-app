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
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\OpenApi\Model\Operation;
use ApiPlatform\OpenApi\Model\Parameter;
use ApiPlatform\OpenApi\Model\RequestBody;
use ApiPlatform\OpenApi\Model\Response;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'users')]
#[ORM\Index(name: 'idx_email', columns: ['email'])]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('ROLE_USER') and object == user or is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Retrieve a user',
                description: 'Retrieves a specific user by their ID. Users can only access their own profile unless they are administrators.',
                responses: [
                    '200' => new Response(
                        description: 'User retrieved successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User'
                                ]
                            ]
                        ])
                    ),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'User not found')
                ]
            )
        ),
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Retrieve users',
                description: 'Retrieves a collection of users. Only administrators can access this endpoint.',
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
                        schema: ['type' => 'integer', 'default' => 20]
                    ),
                    new Parameter(
                        name: 'email',
                        in: 'query',
                        description: 'Filter by email (exact match)',
                        schema: ['type' => 'string']
                    ),
                    new Parameter(
                        name: 'username',
                        in: 'query',
                        description: 'Filter by username (partial match)',
                        schema: ['type' => 'string']
                    )
                ]
            )
        ),
        new Post(
            openapi: new Operation(
                summary: 'Create a user',
                description: 'Creates a new user account. This endpoint is publicly accessible for registration.',
                requestBody: new RequestBody(
                    description: 'Create a new user',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/User-create'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '201' => new Response(
                        description: 'User created successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '409' => new Response(description: 'Email or username already exists')
                ]
            )
        ),
        new Put(
            security: "is_granted('ROLE_USER') and object == user or is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Update a user',
                description: 'Updates an existing user. Users can only update their own profile unless they are administrators.',
                requestBody: new RequestBody(
                    description: 'Update a user',
                    content: new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/User-update'
                            ]
                        ]
                    ])
                ),
                responses: [
                    '200' => new Response(
                        description: 'User updated successfully',
                        content: new \ArrayObject([
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/User'
                                ]
                            ]
                        ])
                    ),
                    '400' => new Response(description: 'Invalid input'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'User not found'),
                    '409' => new Response(description: 'Email or username already exists')
                ]
            )
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')",
            openapi: new Operation(
                summary: 'Delete a user',
                description: 'Deletes a user. Only administrators can delete users.',
                responses: [
                    '204' => new Response(description: 'User deleted successfully'),
                    '403' => new Response(description: 'Access denied'),
                    '404' => new Response(description: 'User not found')
                ]
            )
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
    paginationEnabled: true,
    paginationItemsPerPage: 20
)]
#[ApiFilter(SearchFilter::class, properties: ['email' => 'exact', 'username' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['username', 'createdAt'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[Assert\Length(max: 180)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles = [];

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 8)]
    #[Groups(['user:write'])]
    private ?string $password = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $firstName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Assert\Length(max: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $lastName = null;

    #[ORM\Column(type: 'boolean')]
    #[Groups(['user:read'])]
    private bool $isActive = true;

    #[ORM\Column(name: 'created_at', type: 'datetime')]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: 'datetime')]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(name: 'last_login_at', type: 'datetime', nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $lastLoginAt = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 50)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $profilePicture = null;

    #[ORM\Column(name: 'is_verified', type: 'boolean')]
    #[Groups(['user:read'])]
    private bool $isVerified = false;

    #[ORM\Column(name: 'oauth_provider', length: 20, nullable: true)]
    #[Groups(['user:read'])]
    private ?string $oauthProvider = null;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Review::class)]
    private Collection $reviews;

    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Content::class)]
    private Collection $contents;

    #[ORM\OneToMany(mappedBy: 'sender', targetEntity: Message::class)]
    private Collection $sentMessages;

    #[ORM\OneToMany(mappedBy: 'receiver', targetEntity: Message::class)]
    private Collection $receivedMessages;

    #[ORM\OneToMany(mappedBy: 'uploadedBy', targetEntity: Media::class)]
    private Collection $media;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Notification::class)]
    private Collection $notifications;

    public function __construct()
    {
        $this->reviews = new ArrayCollection();
        $this->contents = new ArrayCollection();
        $this->sentMessages = new ArrayCollection();
        $this->receivedMessages = new ArrayCollection();
        $this->media = new ArrayCollection();
        $this->notifications = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        if (empty($this->roles)) {
            $this->roles = ['ROLE_USER'];
        }
    }

    #[ORM\PreUpdate]
    public function setUpdatedAtValue(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateLastLogin(): void
    {
        $this->lastLoginAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;
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

    public function getProfilePicture(): ?string
    {
        return $this->profilePicture;
    }

    public function setProfilePicture(?string $profilePicture): self
    {
        $this->profilePicture = $profilePicture;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): self
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    public function getOauthProvider(): ?string
    {
        return $this->oauthProvider;
    }

    public function setOauthProvider(?string $oauthProvider): self
    {
        $this->oauthProvider = $oauthProvider;
        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    /**
     * @return Collection<int, Content>
     */
    public function getContents(): Collection
    {
        return $this->contents;
    }

    public function addContent(Content $content): self
    {
        if (!$this->contents->contains($content)) {
            $this->contents->add($content);
            $content->setAuthor($this);
        }

        return $this;
    }

    public function removeContent(Content $content): self
    {
        if ($this->contents->removeElement($content)) {
            // set the owning side to null (unless already changed)
            if ($content->getAuthor() === $this) {
                $content->setAuthor(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getSentMessages(): Collection
    {
        return $this->sentMessages;
    }

    public function addSentMessage(Message $sentMessage): self
    {
        if (!$this->sentMessages->contains($sentMessage)) {
            $this->sentMessages->add($sentMessage);
            $sentMessage->setSender($this);
        }

        return $this;
    }

    public function removeSentMessage(Message $sentMessage): self
    {
        if ($this->sentMessages->removeElement($sentMessage)) {
            // set the owning side to null (unless already changed)
            if ($sentMessage->getSender() === $this) {
                $sentMessage->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getReceivedMessages(): Collection
    {
        return $this->receivedMessages;
    }

    public function addReceivedMessage(Message $receivedMessage): self
    {
        if (!$this->receivedMessages->contains($receivedMessage)) {
            $this->receivedMessages->add($receivedMessage);
            $receivedMessage->setReceiver($this);
        }

        return $this;
    }

    public function removeReceivedMessage(Message $receivedMessage): self
    {
        if ($this->receivedMessages->removeElement($receivedMessage)) {
            // set the owning side to null (unless already changed)
            if ($receivedMessage->getReceiver() === $this) {
                $receivedMessage->setReceiver(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): self
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
            $medium->setUploadedBy($this);
        }

        return $this;
    }

    public function removeMedium(Media $medium): self
    {
        if ($this->media->removeElement($medium)) {
            // set the owning side to null (unless already changed)
            if ($medium->getUploadedBy() === $this) {
                $medium->setUploadedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): self
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setUser($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): self
    {
        if ($this->notifications->removeElement($notification)) {
            // set the owning side to null (unless already changed)
            if ($notification->getUser() === $this) {
                $notification->setUser(null);
            }
        }

        return $this;
    }
} 