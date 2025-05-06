<?php

namespace App\DataFixtures;

use App\Entity\SportVenue;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Basketball venue
        $venue1 = new SportVenue();
        $venue1->setName('Downtown Basketball Court');
        $venue1->setLatitude(48.856614);
        $venue1->setLongitude(2.3522219);
        $venue1->setOpeningTime(new \DateTime('08:00'));
        $venue1->setClosingTime(new \DateTime('22:00'));
        $venue1->setEntranceFee('0.00');
        $venue1->setDescription('Public basketball court with 3 hoops, located in the heart of downtown');
        $venue1->setCreationDate(new \DateTime());
        $venue1->setPublicationDate(new \DateTime());
        $venue1->setAverageRating(4.5);
        $venue1->setAddress('123 Downtown Square, Paris, France');
        $venue1->setVenueType(SportVenue::VENUE_TYPE_BASKETBALL);

        // Football venue
        $venue2 = new SportVenue();
        $venue2->setName('Riverside Football Field');
        $venue2->setLatitude(48.858844);
        $venue2->setLongitude(2.294351);
        $venue2->setOpeningTime(new \DateTime('07:00'));
        $venue2->setClosingTime(new \DateTime('20:00'));
        $venue2->setEntranceFee('5.00');
        $venue2->setDescription('Professional football field with artificial turf, near the riverside');
        $venue2->setCreationDate(new \DateTime());
        $venue2->setPublicationDate(new \DateTime());
        $venue2->setAverageRating(4.7);
        $venue2->setAddress('45 Riverside Road, Paris, France');
        $venue2->setVenueType(SportVenue::VENUE_TYPE_FOOTBALL);

        // Tennis venue
        $venue3 = new SportVenue();
        $venue3->setName('Summit Tennis Club');
        $venue3->setLatitude(48.852968);
        $venue3->setLongitude(2.349902);
        $venue3->setOpeningTime(new \DateTime('09:00'));
        $venue3->setClosingTime(new \DateTime('21:00'));
        $venue3->setEntranceFee('15.00');
        $venue3->setDescription('Private tennis club with 6 courts, 2 indoor and 4 outdoor');
        $venue3->setCreationDate(new \DateTime());
        $venue3->setPublicationDate(new \DateTime());
        $venue3->setAverageRating(4.8);
        $venue3->setAddress('78 Mountain View Road, Paris, France');
        $venue3->setVenueType(SportVenue::VENUE_TYPE_TENNIS);

        // Swimming venue
        $venue4 = new SportVenue();
        $venue4->setName('Aquatic Center');
        $venue4->setLatitude(48.860294);
        $venue4->setLongitude(2.338629);
        $venue4->setOpeningTime(new \DateTime('06:00'));
        $venue4->setClosingTime(new \DateTime('22:00'));
        $venue4->setEntranceFee('8.50');
        $venue4->setDescription('Olympic-sized swimming pool with diving platforms and children\'s area');
        $venue4->setCreationDate(new \DateTime());
        $venue4->setPublicationDate(new \DateTime());
        $venue4->setAverageRating(4.6);
        $venue4->setAddress('156 Water Lane, Paris, France');
        $venue4->setVenueType(SportVenue::VENUE_TYPE_SWIMMING);

        // Running venue
        $venue5 = new SportVenue();
        $venue5->setName('City Park Running Track');
        $venue5->setLatitude(48.845587);
        $venue5->setLongitude(2.341699);
        $venue5->setOpeningTime(new \DateTime('06:00'));
        $venue5->setClosingTime(new \DateTime('23:00'));
        $venue5->setEntranceFee('0.00');
        $venue5->setDescription('400m running track in the city park, with a special rubberized surface');
        $venue5->setCreationDate(new \DateTime());
        $venue5->setPublicationDate(new \DateTime());
        $venue5->setAverageRating(4.3);
        $venue5->setAddress('City Park, Paris, France');
        $venue5->setVenueType(SportVenue::VENUE_TYPE_RUNNING);

        // Persist all venues
        $manager->persist($venue1);
        $manager->persist($venue2);
        $manager->persist($venue3);
        $manager->persist($venue4);
        $manager->persist($venue5);

        $manager->flush();
    }
} 