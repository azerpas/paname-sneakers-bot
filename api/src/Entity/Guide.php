<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\GuideRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(
 *     collectionOperations={
 *          "post"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"}
 *     },
 *     itemOperations={
 *          "get"={"security"="is_granted('ROLE_USER')"},
 *          "delete"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "put"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"},
 *          "patch"={"security"="is_granted('ROLE_ADMIN') or is_granted('ROLE_EDITOR')"}
 *     }
 * )
 * @ORM\Entity(repositoryClass=GuideRepository::class)
 */
class Guide
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=Website::class, inversedBy="guide", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     */
    private $website;

    /**
     * @ORM\Column(type="text", nullable=true, options={"default": null})
     */
    private $address;

    /**
     * @ORM\Column(type="text", nullable=true, options={"default": null})
     */
    private $email;

    /**
     * @ORM\Column(type="text", nullable=true, options={"default": null})
     */
    private $phone;

    /**
     * @ORM\Column(type="text", nullable=true, options={"default": null})
     */
    private $name;

    /**
     * @ORM\Column(type="text", nullable=true, options={"default": null})
     */
    private $instagram;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWebsite(): ?Website
    {
        return $this->website;
    }

    public function setWebsite(Website $website): self
    {
        $this->website = $website;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): self
    {
        $this->address = $address;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): self
    {
        $this->name = $name;

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
}
