<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ForumPostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: ForumPostRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource]
class ForumPost
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column(type: 'text')]
    private ?string $content = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'forumPosts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'forumPosts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?SportPlace $sportPlace = null;

    #[ORM\OneToMany(mappedBy: 'forumPost', targetEntity: ForumReply::class, orphanRemoval: true)]
    private Collection $forumReplies;

    public function __construct()
    {
        $this->forumReplies = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSportPlace(): ?SportPlace
    {
        return $this->sportPlace;
    }

    public function setSportPlace(?SportPlace $sportPlace): static
    {
        $this->sportPlace = $sportPlace;

        return $this;
    }

    /**
     * @return Collection<int, ForumReply>
     */
    public function getForumReplies(): Collection
    {
        return $this->forumReplies;
    }

    public function addForumReply(ForumReply $forumReply): static
    {
        if (!$this->forumReplies->contains($forumReply)) {
            $this->forumReplies->add($forumReply);
            $forumReply->setForumPost($this);
        }

        return $this;
    }

    public function removeForumReply(ForumReply $forumReply): static
    {
        if ($this->forumReplies->removeElement($forumReply)) {
            // set the owning side to null (unless already changed)
            if ($forumReply->getForumPost() === $this) {
                $forumReply->setForumPost(null);
            }
        }

        return $this;
    }
}