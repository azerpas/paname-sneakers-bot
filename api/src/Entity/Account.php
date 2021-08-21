<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\AccountRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ApiResource(
 *     denormalizationContext={"groups"={"user"}},
 *     attributes={"security"="is_granted('ROLE_USER')"},
 *     collectionOperations={
 *          "post"={"security"="is_granted('ROLE_USER') and object.getFirebaseUser() == user"},
 *          "get"={"security"="is_granted('ROLE_USER') and object.getFirebaseUser() == user"},
 *     },
 *     itemOperations={
 *         "get"={"security"="is_granted('ROLE_USER') and object.getFirebaseUser() == user"},
 *         "delete"={"security"="is_granted('ROLE_USER') and object.getFirebaseUser() == user"}
 *     }
 * )
 * @ORM\Entity(repositoryClass=AccountRepository::class)
 */
class Account
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"user"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user"})
     */
    private $password;

    /**
     * @ORM\ManyToOne(targetEntity=FirebaseUser::class, inversedBy="accounts")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user"})
     */
    private $firebaseUser;

    /**
     * @ORM\ManyToOne(targetEntity=Website::class)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user"})
     */
    private $website;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $instagramSession;

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

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getFirebaseUser(): ?FirebaseUser
    {
        return $this->firebaseUser;
    }

    public function setFirebaseUser(?FirebaseUser $firebaseUser): self
    {
        $this->firebaseUser = $firebaseUser;

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

    public function getInstagramSession(): ?string
    {
        return $this->instagramSession;
    }

    public function setInstagramSession(?string $instagramSession): self
    {
        $this->instagramSession = $instagramSession;

        return $this;
    }
}
