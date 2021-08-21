<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\RaffleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use App\Resolver\RafflesCollectionResolver;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *     denormalizationContext={"groups"={"website","product"}},
 *     collectionOperations={
 *          "post"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"},
 *          "get",
 *     },
 *     itemOperations={
 *          "get",
 *          "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "put"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"},
 *          "patch"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"}
 *     },
 *     graphql={
 *          "collectionQuery"={
 *              "collection_query"=RafflesCollectionResolver::class,
 *              "args"={
 *                  "raffleType"={"type"="String", "description"="What raffle type?"},
 *                  "website"={"type"="ID!", "description"="Website ID"}
 *              }
 *          },
 *
 *     }
 * )
 * @ApiFilter(SearchFilter::class, properties={"website": "exact", "raffleType": "exact"})
 * @ORM\Entity(repositoryClass=RaffleRepository::class)
 * @UniqueEntity("soleretrieverId", ignoreNull=true, fields={"soleretrieverId"})
 */
class Raffle
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"website","product"})
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"website","product"})
     */
    private $updatedAt;

    /**
     * @ORM\ManyToOne(targetEntity=Website::class, inversedBy="raffles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"website"})
     */
    private $website;

    /**
     * @ORM\ManyToOne(targetEntity=Product::class, inversedBy="raffles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"product"})
     */
    private $product;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"website","product"})
     */
    private $startAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"website","product"})
     */
    private $endAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"website","product"})
     */
    private $raffleType;

    /**
     * @ORM\ManyToMany(targetEntity=FirebaseUser::class, mappedBy="Raffles")
     */
    private $firebaseUsers;

    /**
     * @ORM\Column(type="text")
     * @Groups({"website","product"})
     */
    private $url;

    /**
     * @ORM\Column(name="soleretriever_id", type="string", length=255, nullable=true)
     * @Groups({"website","product"})
     */
    private $soleretrieverId;

    public function __construct()
    {
        $this->firebaseUsers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getWebsite(): ?Website
    {
        return $this->website;
    }

    public function setWebsite(?Website $website): self
    {
        $this->website = $website;

        return $this;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getStartAt(): ?\DateTimeInterface
    {
        return $this->startAt;
    }

    public function setStartAt(?\DateTimeInterface $startAt): self
    {
        $this->startAt = $startAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function getRaffleType(): ?string
    {
        return $this->raffleType;
    }

    public function setRaffleType(string $raffleType): self
    {
        $this->raffleType = $raffleType;

        return $this;
    }

    /**
     * @return Collection|FirebaseUser[]
     */
    public function getFirebaseUsers(): Collection
    {
        return $this->firebaseUsers;
    }

    public function addFirebaseUser(FirebaseUser $firebaseUser): self
    {
        if (!$this->firebaseUsers->contains($firebaseUser)) {
            $this->firebaseUsers[] = $firebaseUser;
            $firebaseUser->addRaffle($this);
        }

        return $this;
    }

    public function removeFirebaseUser(FirebaseUser $firebaseUser): self
    {
        if ($this->firebaseUsers->contains($firebaseUser)) {
            $this->firebaseUsers->removeElement($firebaseUser);
            $firebaseUser->removeRaffle($this);
        }

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

    public function getSoleretrieverId(): ?string
    {
        return $this->soleretrieverId;
    }

    public function setSoleretrieverId(?string $soleretrieverId): self
    {
        $this->soleretrieverId = $soleretrieverId;

        return $this;
    }
}
