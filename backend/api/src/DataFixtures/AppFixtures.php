<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Sport;
use App\Entity\SportPlace;
use App\Entity\Media;
use App\Entity\Review;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    
    public function load(ObjectManager $manager): void
    {
        // Create users
        $admin = new User();
        $admin->setFirstName('Admin');
        $admin->setLastName('User');
        $admin->setEmail('admin@sportapp.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setAvatarUrl('https://i.pravatar.cc/150?u=admin');
        $manager->persist($admin);
        
        $user1 = new User();
        $user1->setFirstName('John');
        $user1->setLastName('Doe');
        $user1->setEmail('john@sportapp.com');
        $user1->setRoles(['ROLE_USER']);
        $user1->setPassword($this->passwordHasher->hashPassword($user1, 'user123'));
        $user1->setAvatarUrl('https://i.pravatar.cc/150?u=john');
        $manager->persist($user1);
        
        $user2 = new User();
        $user2->setFirstName('Jane');
        $user2->setLastName('Smith');
        $user2->setEmail('jane@sportapp.com');
        $user2->setRoles(['ROLE_USER']);
        $user2->setPassword($this->passwordHasher->hashPassword($user2, 'user123'));
        $user2->setAvatarUrl('https://i.pravatar.cc/150?u=jane');
        $manager->persist($user2);
        
        // Create sports
        $sportTypes = [
            ['Football', 'The world\'s most popular sport played with a spherical ball.', 'https://example.com/icons/football.png'],
            ['Basketball', 'A team sport played with a ball and hoop.', 'https://example.com/icons/basketball.png'],
            ['Tennis', 'A racket sport played individually or in pairs.', 'https://example.com/icons/tennis.png'],
            ['Swimming', 'A water-based sport involving traversing a body of water.', 'https://example.com/icons/swimming.png'],
            ['Volleyball', 'A team sport in which two teams hit a ball over a net.', 'https://example.com/icons/volleyball.png'],
            ['Fitness', 'Physical exercise focused on strength and endurance.', 'https://example.com/icons/fitness.png'],
            ['Running', 'A method of terrestrial locomotion for exercise or sport.', 'https://example.com/icons/running.png'],
            ['Yoga', 'A group of physical, mental, and spiritual practices.', 'https://example.com/icons/yoga.png']
        ];
        
        $sportEntities = [];
        foreach ($sportTypes as $index => $sportData) {
            $sport = new Sport();
            $sport->setName($sportData[0]);
            $sport->setDescription($sportData[1]);
            $sport->setIconUrl($sportData[2]);
            $manager->persist($sport);
            $sportEntities[] = $sport;
        }
        
        // Create sport places around 288 avenue des gresillons 92600 asnieres
        // This is the central location
        $centralLat = 48.9167;  // Approximate latitude for the address
        $centralLng = 2.2833;   // Approximate longitude for the address
        
        $sportPlaceData = [
            [
                'Stade Nautique', 
                'A modern swimming facility with Olympic-sized pool and fitness area.',
                $centralLat + 0.003, 
                $centralLng - 0.002,
                '12 Rue du Sport, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['08:00-21:00'],
                    'tuesday' => ['08:00-21:00'],
                    'wednesday' => ['08:00-21:00'],
                    'thursday' => ['08:00-21:00'],
                    'friday' => ['08:00-21:00'],
                    'saturday' => ['09:00-20:00'],
                    'sunday' => ['09:00-18:00'],
                ],
                [3] // Swimming
            ],
            [
                'Asnieres Sports Center', 
                'Multi-purpose sports facility with courts for basketball, volleyball, and tennis.',
                $centralLat - 0.001, 
                $centralLng + 0.003,
                '45 Avenue des Sports, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['07:00-22:00'],
                    'tuesday' => ['07:00-22:00'],
                    'wednesday' => ['07:00-22:00'],
                    'thursday' => ['07:00-22:00'],
                    'friday' => ['07:00-22:00'],
                    'saturday' => ['08:00-20:00'],
                    'sunday' => ['09:00-18:00'],
                ],
                [1, 2, 4] // Basketball, Tennis, Volleyball
            ],
            [
                'Stade Leo Lagrange', 
                'Large stadium with football field and running track.',
                $centralLat + 0.002, 
                $centralLng + 0.001,
                '38 Rue Leo Lagrange, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['09:00-20:00'],
                    'tuesday' => ['09:00-20:00'],
                    'wednesday' => ['09:00-20:00'],
                    'thursday' => ['09:00-20:00'],
                    'friday' => ['09:00-20:00'],
                    'saturday' => ['10:00-19:00'],
                    'sunday' => ['10:00-19:00'],
                ],
                [0, 6] // Football, Running
            ],
            [
                'FitLife Gym', 
                'Modern fitness center with weight training and cardio equipment.',
                $centralLat - 0.002, 
                $centralLng - 0.001,
                '78 Boulevard Voltaire, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['06:00-23:00'],
                    'tuesday' => ['06:00-23:00'],
                    'wednesday' => ['06:00-23:00'],
                    'thursday' => ['06:00-23:00'],
                    'friday' => ['06:00-23:00'],
                    'saturday' => ['08:00-22:00'],
                    'sunday' => ['08:00-22:00'],
                ],
                [5] // Fitness
            ],
            [
                'Yoga Zen Studio', 
                'Peaceful yoga studio offering various styles of yoga classes.',
                $centralLat + 0.001, 
                $centralLng - 0.003,
                '23 Rue de la Paix, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['07:00-21:00'],
                    'tuesday' => ['07:00-21:00'],
                    'wednesday' => ['07:00-21:00'],
                    'thursday' => ['07:00-21:00'],
                    'friday' => ['07:00-21:00'],
                    'saturday' => ['09:00-18:00'],
                    'sunday' => ['09:00-15:00'],
                ],
                [7] // Yoga
            ],
            [
                'Tennis Club d\'Asnieres', 
                'Tennis club with 10 courts, including 4 indoor courts.',
                $centralLat - 0.003, 
                $centralLng + 0.002,
                '56 Rue du Tennis, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['08:00-22:00'],
                    'tuesday' => ['08:00-22:00'],
                    'wednesday' => ['08:00-22:00'],
                    'thursday' => ['08:00-22:00'],
                    'friday' => ['08:00-22:00'],
                    'saturday' => ['09:00-20:00'],
                    'sunday' => ['09:00-20:00'],
                ],
                [2] // Tennis
            ],
            [
                'Parc des Sports', 
                'Public sports park with football fields, basketball courts, and running paths.',
                $centralLat + 0.0015, 
                $centralLng + 0.0025,
                '100 Avenue du Parc, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['06:00-22:00'],
                    'tuesday' => ['06:00-22:00'],
                    'wednesday' => ['06:00-22:00'],
                    'thursday' => ['06:00-22:00'],
                    'friday' => ['06:00-22:00'],
                    'saturday' => ['06:00-22:00'],
                    'sunday' => ['06:00-22:00'],
                ],
                [0, 1, 6] // Football, Basketball, Running
            ],
            [
                'Asnieres Aquatic Center', 
                'Modern swimming facility with lap pool, diving area, and water slides.',
                $centralLat - 0.0025, 
                $centralLng - 0.0015,
                '34 Rue des Bains, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['07:00-21:00'],
                    'tuesday' => ['07:00-21:00'],
                    'wednesday' => ['07:00-21:00'],
                    'thursday' => ['07:00-21:00'],
                    'friday' => ['07:00-21:00'],
                    'saturday' => ['08:00-20:00'],
                    'sunday' => ['09:00-19:00'],
                ],
                [3] // Swimming
            ],
            [
                'Beach Volleyball Arena', 
                'Indoor beach volleyball courts with sand imported from the Mediterranean.',
                $centralLat - 0.001, 
                $centralLng - 0.002,
                '12 Rue du Sable, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['10:00-22:00'],
                    'tuesday' => ['10:00-22:00'],
                    'wednesday' => ['10:00-22:00'],
                    'thursday' => ['10:00-22:00'],
                    'friday' => ['10:00-22:00'],
                    'saturday' => ['10:00-23:00'],
                    'sunday' => ['10:00-20:00'],
                ],
                [4] // Volleyball
            ],
            [
                'Urban Fitness Park', 
                'Outdoor fitness area with calisthenics equipment and running path.',
                $centralLat + 0.002, 
                $centralLng - 0.0025,
                '89 Boulevard Urbain, 92600 Asnieres-sur-Seine', 
                [
                    'monday' => ['00:00-23:59'],
                    'tuesday' => ['00:00-23:59'],
                    'wednesday' => ['00:00-23:59'],
                    'thursday' => ['00:00-23:59'],
                    'friday' => ['00:00-23:59'],
                    'saturday' => ['00:00-23:59'],
                    'sunday' => ['00:00-23:59'],
                ],
                [5, 6] // Fitness, Running
            ]
        ];
        
        $sportPlaceEntities = [];
        foreach ($sportPlaceData as $index => $placeData) {
            $sportPlace = new SportPlace();
            $sportPlace->setName($placeData[0]);
            $sportPlace->setDescription($placeData[1]);
            $sportPlace->setLatitude($placeData[2]);
            $sportPlace->setLongitude($placeData[3]);
            $sportPlace->setAddress($placeData[4]);
            $sportPlace->setOpeningHours($placeData[5]);
            $sportPlace->setCreatedBy($index % 2 == 0 ? $admin : $user1);
            
            // Add the sports
            foreach ($placeData[6] as $sportIndex) {
                $sportPlace->addSport($sportEntities[$sportIndex]);
            }
            
            $manager->persist($sportPlace);
            $sportPlaceEntities[] = $sportPlace;
        }
        
        // Create media
        $mediaUrls = [
            'https://example.com/images/sportplace1-1.jpg',
            'https://example.com/images/sportplace1-2.jpg',
            'https://example.com/images/sportplace2-1.jpg',
            'https://example.com/images/sportplace2-2.jpg',
            'https://example.com/images/sportplace3-1.jpg',
            'https://example.com/images/sportplace3-2.jpg',
            'https://example.com/images/sportplace4-1.jpg',
            'https://example.com/images/sportplace4-2.jpg',
            'https://example.com/images/sportplace5-1.jpg',
            'https://example.com/images/sportplace5-2.jpg',
        ];
        
        foreach ($mediaUrls as $index => $url) {
            $media = new Media();
            $media->setUrl($url);
            $media->setType(Media::TYPE_IMAGE);
            $media->setSportPlace($sportPlaceEntities[intdiv($index, 2)]);
            $media->setUploadedBy($index % 3 == 0 ? $admin : ($index % 3 == 1 ? $user1 : $user2));
            $manager->persist($media);
        }
        
        // Create reviews
        $reviewsData = [
            [5, 'Excellent facilities, highly recommend!', $user1, $sportPlaceEntities[0]],
            [4, 'Great place, but could use more equipment.', $user2, $sportPlaceEntities[0]],
            [5, 'Best sports center in the area.', $user1, $sportPlaceEntities[1]],
            [3, 'Good value for money but gets crowded on weekends.', $user2, $sportPlaceEntities[1]],
            [4, 'Great football field, nice atmosphere.', $user2, $sportPlaceEntities[2]],
            [5, 'Top notch gym with latest equipment.', $user1, $sportPlaceEntities[3]],
            [5, 'Very peaceful yoga studio, great instructors.', $user2, $sportPlaceEntities[4]],
            [4, 'Good tennis courts but booking can be difficult.', $user1, $sportPlaceEntities[5]],
            [3, 'Nice park but maintenance could be better.', $user2, $sportPlaceEntities[6]],
            [5, 'Fantastic swimming facility, very clean.', $user1, $sportPlaceEntities[7]],
            [4, 'Great volleyball courts, feels like being at the beach!', $user2, $sportPlaceEntities[8]],
            [5, 'Love this outdoor fitness area, available 24/7.', $user1, $sportPlaceEntities[9]]
        ];
        
        foreach ($reviewsData as $reviewData) {
            $review = new Review();
            $review->setRating($reviewData[0]);
            $review->setComment($reviewData[1]);
            $review->setUser($reviewData[2]);
            $review->setSportPlace($reviewData[3]);
            $manager->persist($review);
        }
        
        $manager->flush();
    }
}