<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SportRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: SportRepository::class)]
#[ApiResource]
class Sport
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: 'doctrine.uuid_generator')]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $iconUrl = null;

    #[ORM\ManyToMany(targetEntity: SportPlace::class, mappedBy: 'sports')]
    private Collection $sportPlaces;

    public function __construct()
    {
        $this->sportPlaces = new ArrayCollection();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getIconUrl(): ?string
    {
        return $this->iconUrl;
    }

    public function setIconUrl(?string $iconUrl): static
    {
        $this->iconUrl = $iconUrl;

        return $this;
    }

    /**
     * @return Collection<int, SportPlace>
     */
    public function getSportPlaces(): Collection
    {
        return $this->sportPlaces;
    }

    public function addSportPlace(SportPlace $sportPlace): static
    {
        if (!$this->sportPlaces->contains($sportPlace)) {
            $this->sportPlaces->add($sportPlace);
            $sportPlace->addSport($this);
        }

        return $this;
    }

    public function removeSportPlace(SportPlace $sportPlace): static
    {
        if ($this->sportPlaces->removeElement($sportPlace)) {
            $sportPlace->removeSport($this);
        }

        return $this;
    }
}