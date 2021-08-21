<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Resolver\PublishedProductsCollectionResolver;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;

/**
 * @ApiResource(
 *     collectionOperations={
 *          "post"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"},
 *          "get"
 *     },
 *     itemOperations={
 *          "get",
 *          "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "put"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"},
 *          "patch"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR') or is_granted('ROLE_BUSINESS')"}
 *     },
 *     graphql={
 *          "collectionQuery"={
 *              "collection_query"=PublishedProductsCollectionResolver::class,
 *              "args"={
 *                  "public"={"type"="Boolean"}
 *              }
 *          },
 *     }
 * )
 * @ApiFilter(BooleanFilter::class, properties={"public"})
 * @ORM\Entity(repositoryClass=ProductRepository::class)
 * @UniqueEntity("soleretrieverId", ignoreNull=true, fields={"soleretrieverId"})
 */
class Product
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"product"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $brand;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $releaseAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $pid;

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $price;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $imageUrl;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $colorway;

    /**
     * @ORM\Column(type="boolean")
     */
    private $public;

    /**
     * @ORM\OneToMany(targetEntity=Raffle::class, mappedBy="product", orphanRemoval=true)
     */
    private $raffles;

    /**
     * @ORM\OneToMany(targetEntity=FirebaseUser::class, mappedBy="unlocked")
     */
    private $firebaseUsers;

    /**
     * @ORM\Column(name="soleretriever_id", type="string", length=255, nullable=true)
     */
    private $soleretrieverId;

    public function __construct()
    {
        $this->raffles = new ArrayCollection();
        $this->firebaseUsers = new ArrayCollection();
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

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function setBrand(string $brand): self
    {
        $this->brand = $brand;

        return $this;
    }

    public function getReleaseAt(): ?\DateTimeInterface
    {
        return $this->releaseAt;
    }

    public function setReleaseAt(?\DateTimeInterface $releaseAt): self
    {
        $this->releaseAt = $releaseAt;

        return $this;
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

    public function getPid(): ?string
    {
        return $this->pid;
    }

    public function setPid(?string $pid): self
    {
        $this->pid = $pid;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(?float $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function setImageUrl(?string $imageUrl): self
    {
        $this->imageUrl = $imageUrl;

        return $this;
    }

    public function getColorway(): ?string
    {
        return $this->colorway;
    }

    public function setColorway(?string $colorway): self
    {
        $this->colorway = $colorway;

        return $this;
    }

    public function getPublic(): ?bool
    {
        return $this->public;
    }

    public function setPublic(bool $public): self
    {
        $this->public = $public;

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
            $raffle->setProduct($this);
        }

        return $this;
    }

    public function removeRaffle(Raffle $raffle): self
    {
        if ($this->raffles->contains($raffle)) {
            $this->raffles->removeElement($raffle);
            // set the owning side to null (unless already changed)
            if ($raffle->getProduct() === $this) {
                $raffle->setProduct(null);
            }
        }

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
            $firebaseUser->setUnlocked($this);
        }

        return $this;
    }

    public function removeFirebaseUser(FirebaseUser $firebaseUser): self
    {
        if ($this->firebaseUsers->contains($firebaseUser)) {
            $this->firebaseUsers->removeElement($firebaseUser);
            // set the owning side to null (unless already changed)
            if ($firebaseUser->getUnlocked() === $this) {
                $firebaseUser->setUnlocked(null);
            }
        }

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
