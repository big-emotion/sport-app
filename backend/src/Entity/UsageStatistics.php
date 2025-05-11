<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UsageStatisticsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UsageStatisticsRepository::class)]
#[ApiResource]
class UsageStatistics
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column]
    private ?int $views = 0;

    #[ORM\Column]
    private ?int $visitCount = 0;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastVisited = null;

    #[ORM\ManyToOne(inversedBy: 'usageStatistics')]
    #[ORM\JoinColumn(nullable: false)]
    private ?SportPlace $sportPlace = null;

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getViews(): ?int
    {
        return $this->views;
    }

    public function setViews(int $views): static
    {
        $this->views = $views;

        return $this;
    }

    public function incrementViews(): static
    {
        $this->views++;

        return $this;
    }

    public function getVisitCount(): ?int
    {
        return $this->visitCount;
    }

    public function setVisitCount(int $visitCount): static
    {
        $this->visitCount = $visitCount;

        return $this;
    }

    public function incrementVisitCount(): static
    {
        $this->visitCount++;
        $this->lastVisited = new \DateTimeImmutable();

        return $this;
    }

    public function getLastVisited(): ?\DateTimeImmutable
    {
        return $this->lastVisited;
    }

    public function setLastVisited(?\DateTimeImmutable $lastVisited): static
    {
        $this->lastVisited = $lastVisited;

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
}