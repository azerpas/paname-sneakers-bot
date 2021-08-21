<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\WebsiteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     collectionOperations={
 *          "post"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "get"={"security"="is_granted('ROLE_USER')"}
 *     },
 *     itemOperations={
 *          "get"={"security"="is_granted('ROLE_USER')"},
 *          "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "put"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "patch"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"}
 *     },
 * )
 * @ORM\Entity(repositoryClass=WebsiteRepository::class)
 */
class Website
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"website"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $aliases;

    /**
     * @ORM\Column(type="string", length=10, nullable=true)
     */
    private $locale;

    /**
     * @ORM\Column(type="boolean")
     */
    private $accountRequired;

    /**
     * @ORM\Column(type="text")
     */
    private $url;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $instagram;

    /**
     * @ORM\Column(type="text")
     */
    private $imageUrl;

    /**
     * @ORM\Column(type="string", length=20)
     */
    private $status;

    /**
     * @ORM\Column(type="datetime")
     */
    private $last_tested_at;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $cloudApiUrl;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $cloudApiIdentifier;

    /**
     * @ORM\OneToMany(targetEntity=Raffle::class, mappedBy="website", orphanRemoval=true)
     */
    private $raffles;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $estimated_captcha_cost;

    /**
     * 100 Kb = 0.0001 Gb
     * Input 0.000002 for 2Kb of data
     * @ORM\Column(type="float", nullable=true)
     */
    private $estimated_proxy_cost;

    /**
     * ["size","email","fname","lname","phone","housenumber","address","address2","state","city","zip","country","utils","instagram","faking"]
     * @ORM\Column(type="array", nullable=true)
     */
    private $fields = [];

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $working;

    /**
     * Default: 'f'
     * Values:
     * - 'f': functions
     * - 'c': cloud run
     * @ORM\Column(type="string", length=255, options={"default": "f"})
     */
    private $handledBy;

    /**
     * @ORM\Column(type="boolean")
     */
    private $published;

    /**
     * @ORM\OneToOne(targetEntity=Guide::class, mappedBy="website", cascade={"persist", "remove"})
     */
    private $guide;

    public function __construct()
    {
        $this->raffles = new ArrayCollection();
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

    public function getAliases(): ?string
    {
        return $this->aliases;
    }

    public function setAliases(?string $aliases): self
    {
        $this->aliases = $aliases;

        return $this;
    }

    public function getLocale(): ?string
    {
        return $this->locale;
    }

    public function setLocale(?string $locale): self
    {
        $this->locale = $locale;

        return $this;
    }

    public function getAccountRequired(): ?bool
    {
        return $this->accountRequired;
    }

    public function setAccountRequired(bool $accountRequired): self
    {
        $this->accountRequired = $accountRequired;

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

    public function getInstagram(): ?string
    {
        return $this->instagram;
    }

    public function setInstagram(?string $instagram): self
    {
        $this->instagram = $instagram;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(string $imageUrl): self
    {
        $this->imageUrl = $imageUrl;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getLastTestedAt(): ?\DateTimeInterface
    {
        return $this->last_tested_at;
    }

    public function setLastTestedAt(\DateTimeInterface $last_tested_at): self
    {
        $this->last_tested_at = $last_tested_at;

        return $this;
    }

    public function getCloudApiUrl(): ?string
    {
        return $this->cloudApiUrl;
    }

    public function setCloudApiUrl(?string $cloudApiUrl): self
    {
        $this->cloudApiUrl = $cloudApiUrl;

        return $this;
    }

    public function getCloudApiIdentifier(): ?string
    {
        return $this->cloudApiIdentifier;
    }

    public function setCloudApiIdentifier(?string $cloudApiIdentifier): self
    {
        $this->cloudApiIdentifier = $cloudApiIdentifier;

        return $this;
    }

    /**
     * @return Collection|Raffle[]
     */
    public function getRaffles(): Collection
    {
        return $this->raffles;
    }

    public function addRaffle(Raffle $raffle): self
    {
        if (!$this->raffles->contains($raffle)) {
            $this->raffles[] = $raffle;
            $raffle->setWebsite($this);
        }

        return $this;
    }

    public function removeRaffle(Raffle $raffle): self
    {
        if ($this->raffles->contains($raffle)) {
            $this->raffles->removeElement($raffle);
            // set the owning side to null (unless already changed)
            if ($raffle->getWebsite() === $this) {
                $raffle->setWebsite(null);
            }
        }

        return $this;
    }

    public function getEstimatedCaptchaCost(): ?float
    {
        return $this->estimated_captcha_cost;
    }

    public function setEstimatedCaptchaCost(?float $estimated_captcha_cost): self
    {
        $this->estimated_captcha_cost = $estimated_captcha_cost;

        return $this;
    }

    public function getEstimatedProxyCost(): ?float
    {
        return $this->estimated_proxy_cost;
    }

    public function setEstimatedProxyCost(?float $estimated_proxy_cost): self
    {
        $this->estimated_proxy_cost = $estimated_proxy_cost;

        return $this;
    }

    public function getFields(): ?array
    {
        return $this->fields;
    }

    public function setFields(?array $fields): self
    {
        $this->fields = $fields;

        return $this;
    }

    public function getWorking(): ?bool
    {
        return $this->working;
    }

    public function setWorking(?bool $working): self
    {
        $this->working = $working;

        return $this;
    }

    public function getHandledBy(): ?string
    {
        return $this->handledBy;
    }

    public function setHandledBy(string $handledBy): self
    {
        $this->handledBy = $handledBy;

        return $this;
    }

    public function getPublished(): ?bool
    {
        return $this->published;
    }

    public function setPublished(bool $published): self
    {
        $this->published = $published;

        return $this;
    }

    public function getGuide(): ?Guide
    {
        return $this->guide;
    }

    public function setGuide(Guide $guide): self
    {
        // set the owning side of the relation if necessary
        if ($guide->getWebsite() !== $this) {
            $guide->setWebsite($this);
        }

        $this->guide = $guide;

        return $this;
    }
}
