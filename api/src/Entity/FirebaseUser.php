<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\FirebaseUserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     collectionOperations={
 *          "get"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *     },
 *     itemOperations={
 *         "get"={"security"="is_granted('ROLE_USER') and this == user"}
 *     }
 * )
 * @ORM\Entity(repositoryClass=FirebaseUserRepository::class)
 * @UniqueEntity("firebaseId", ignoreNull=true, fields={"firebaseId"})
 */
class FirebaseUser implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user"})
     */
    private $id;

    /**
     * @ORM\Column(type="text")
     */
    private $firebaseId;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $userType;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $alias;

    /**
     * @ORM\OneToMany(targetEntity=Profile::class, mappedBy="firebaseUser", orphanRemoval=true)
     */
    private $profiles;

    /**
     * Unlocked products
     * @ORM\ManyToOne(targetEntity=Product::class, inversedBy="firebaseUsers")
     */
    private $unlocked;

    /**
     * @ORM\ManyToMany(targetEntity=Raffle::class, inversedBy="firebaseUsers")
     */
    private $Raffles;

    /**
     * @ORM\OneToMany(targetEntity=Account::class, mappedBy="firebaseUser", orphanRemoval=true)
     */
    private $accounts;

    /**
     * @ORM\Column(type="array")
     */
    private $roles = [];

    /**
     * @ORM\Column(type="float", nullable=true)
     */
    private $balance;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $customerId;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subCheckoutSession;

    /**
     * @ORM\Column(type="boolean", nullable=true)
     */
    private $paying;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $discordWebhook;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $discordWebhookError;

    public function __construct()
    {
        $this->profiles = new ArrayCollection();
        $this->Raffles = new ArrayCollection();
        $this->accounts = new ArrayCollection();
        $this->charges = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirebaseId(): ?string
    {
        return $this->firebaseId;
    }

    public function setFirebaseId(string $firebaseId): self
    {
        $this->firebaseId = $firebaseId;

        return $this;
    }

    public function getUserType(): ?string
    {
        return $this->userType;
    }

    public function setUserType(string $userType): self
    {
        $this->userType = $userType;

        return $this;
    }

    public function getAlias(): ?string
    {
        return $this->alias;
    }

    public function setAlias(?string $alias): self
    {
        $this->alias = $alias;

        return $this;
    }

    /**
     * @return Collection|Profile[]
     */
    public function getProfiles(): Collection
    {
        return $this->profiles;
    }

    public function addProfile(Profile $profile): self
    {
        if (!$this->profiles->contains($profile)) {
            $this->profiles[] = $profile;
            $profile->setFirebaseUser($this);
        }

        return $this;
    }

    public function removeProfile(Profile $profile): self
    {
        if ($this->profiles->contains($profile)) {
            $this->profiles->removeElement($profile);
            // set the owning side to null (unless already changed)
            if ($profile->getFirebaseUser() === $this) {
                $profile->setFirebaseUser(null);
            }
        }

        return $this;
    }

    public function getUnlocked(): ?Product
    {
        return $this->unlocked;
    }

    public function setUnlocked(?Product $unlocked): self
    {
        $this->unlocked = $unlocked;

        return $this;
    }

    /**
     * @return Collection|Raffle[]
     */
    public function getRaffles(): Collection
    {
        return $this->Raffles;
    }

    public function addRaffle(Raffle $raffle): self
    {
        if (!$this->Raffles->contains($raffle)) {
            $this->Raffles[] = $raffle;
        }

        return $this;
    }

    public function removeRaffle(Raffle $raffle): self
    {
        if ($this->Raffles->contains($raffle)) {
            $this->Raffles->removeElement($raffle);
        }

        return $this;
    }

    /**
     * @return Collection|Account[]
     */
    public function getAccounts(): Collection
    {
        return $this->accounts;
    }

    public function addAccount(Account $account): self
    {
        if (!$this->accounts->contains($account)) {
            $this->accounts[] = $account;
            $account->setFirebaseUser($this);
        }

        return $this;
    }

    public function removeAccount(Account $account): self
    {
        if ($this->accounts->contains($account)) {
            $this->accounts->removeElement($account);
            // set the owning side to null (unless already changed)
            if ($account->getFirebaseUser() === $this) {
                $account->setFirebaseUser(null);
            }
        }

        return $this;
    }

    public function getRoles()
    {
        return $this->roles;
    }

    public function getPassword()
    {
        // TODO: Implement getPassword() method.
    }

    public function getSalt()
    {
        // TODO: Implement getSalt() method.
    }

    public function getUsername()
    {
        // TODO: Implement getUsername() method.
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getBalance(): ?float
    {
        return $this->balance;
    }

    public function setBalance(?float $balance): self
    {
        $this->balance = $balance;

        return $this;
    }

    public function getCustomerId(): ?string
    {
        return $this->customerId;
    }

    public function setCustomerId(?string $customerId): self
    {
        $this->customerId = $customerId;

        return $this;
    }

    public function getSubCheckoutSession(): ?string
    {
        return $this->subCheckoutSession;
    }

    public function setSubCheckoutSession(?string $subCheckoutSession): self
    {
        $this->subCheckoutSession = $subCheckoutSession;

        return $this;
    }

    public function getPaying(): ?bool
    {
        return $this->paying;
    }

    public function setPaying(?bool $paying): self
    {
        $this->paying = $paying;

        return $this;
    }

    public function getDiscordWebhook(): ?string
    {
        return $this->discordWebhook;
    }

    public function setDiscordWebhook(?string $discordWebhook): self
    {
        $this->discordWebhook = $discordWebhook;

        return $this;
    }

    public function getDiscordWebhookError(): ?string
    {
        return $this->discordWebhookError;
    }

    public function setDiscordWebhookError(?string $discordWebhookError): self
    {
        $this->discordWebhookError = $discordWebhookError;

        return $this;
    }

}
