<?php

namespace App\DataFixtures;

use App\Entity\Event;
use App\Entity\Favorite;
use App\Entity\ForumPost;
use App\Entity\ForumReply;
use App\Entity\Itinerary;
use App\Entity\Media;
use App\Entity\Notification;
use App\Entity\Review;
use App\Entity\Sport;
use App\Entity\SportPlace;
use App\Entity\UsageStatistics;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;
    
    // Center coordinates of Asnières-sur-Seine
    private const ASNIÈRES_LAT = 48.9132;
    private const ASNIÈRES_LONG = 2.2883;
    
    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
    
    public function load(ObjectManager $manager): void
    {
        // Create Users
        $users = $this->loadUsers($manager);
        
        // Create Sports
        $sports = $this->loadSports($manager);
        
        // Create Sport Places
        $sportPlaces = $this->loadSportPlaces($manager, $users, $sports);
        
        // Create Reviews
        $this->loadReviews($manager, $users, $sportPlaces);
        
        // Create Favorites
        $this->loadFavorites($manager, $users, $sportPlaces);
        
        // Create Events
        $this->loadEvents($manager, $users, $sportPlaces);
        
        // Create Forum Posts and Replies
        $this->loadForumContent($manager, $users, $sportPlaces);
        
        // Create Media
        $this->loadMedia($manager, $users, $sportPlaces);
        
        // Create Itineraries
        $this->loadItineraries($manager, $users, $sportPlaces);
        
        // Create Usage Statistics
        $this->loadUsageStatistics($manager, $sportPlaces);
        
        // Create Notifications
        $this->loadNotifications($manager, $users);
        
        $manager->flush();
    }
    
    private function loadUsers(ObjectManager $manager): array
    {
        $users = [];
        
        // Admin User
        $admin = new User();
        $admin->setFirstName('Admin');
        $admin->setLastName('User');
        $admin->setEmail('admin@sportapp.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setAvatarUrl('https://randomuser.me/api/portraits/men/1.jpg');
        $manager->persist($admin);
        $users[] = $admin;
        
        // Regular Users
        $firstNames = ['Thomas', 'Sophie', 'Nicolas', 'Emma'];
        $lastNames = ['Dubois', 'Martin', 'Bernard', 'Petit'];
        
        for ($i = 0; $i < 4; $i++) {
            $user = new User();
            $user->setFirstName($firstNames[$i]);
            $user->setLastName($lastNames[$i]);
            $user->setEmail(strtolower($firstNames[$i]) . '.' . strtolower($lastNames[$i]) . '@example.com');
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $user->setAvatarUrl('https://randomuser.me/api/portraits/men/' . ($i + 2) . '.jpg');
            $manager->persist($user);
            $users[] = $user;
        }
        
        return $users;
    }
    
    private function loadSports(ObjectManager $manager): array
    {
        $sportsData = [
            [
                'name' => 'Football',
                'description' => 'Le football est un sport collectif qui se joue principalement au pied avec un ballon sphérique.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/1165/1165187.png'
            ],
            [
                'name' => 'Basketball',
                'description' => 'Le basketball est un sport d\'équipe où deux équipes de cinq joueurs tentent de marquer des points en lançant un ballon dans un panier.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/1165/1165187.png'
            ],
            [
                'name' => 'Tennis',
                'description' => 'Le tennis est un sport de raquette qui oppose soit deux joueurs (jeu en simple) soit quatre joueurs (jeu en double).',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/2158/2158793.png'
            ],
            [
                'name' => 'Natation',
                'description' => 'La natation est un sport aquatique qui consiste à se déplacer dans l\'eau sans aide artificielle.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/3208/3208809.png'
            ],
            [
                'name' => 'Course à pied',
                'description' => 'La course à pied est une activité physique de déplacement qui consiste à courir sur différentes distances et différents terrains.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/384/384276.png'
            ],
            [
                'name' => 'Cyclisme',
                'description' => 'Le cyclisme est une activité physique qui regroupe plusieurs disciplines utilisant un vélo.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png'
            ],
            [
                'name' => 'Fitness',
                'description' => 'Le fitness regroupe un ensemble d\'activités physiques visant à améliorer sa condition physique et son hygiène de vie.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png'
            ],
            [
                'name' => 'Pétanque',
                'description' => 'La pétanque est un jeu de boules dont le but est de lancer des boules métalliques le plus près possible d\'un cochonnet.',
                'iconUrl' => 'https://cdn-icons-png.flaticon.com/512/2271/2271709.png'
            ]
        ];
        
        $sports = [];
        
        foreach ($sportsData as $sportData) {
            $sport = new Sport();
            $sport->setName($sportData['name']);
            $sport->setDescription($sportData['description']);
            $sport->setIconUrl($sportData['iconUrl']);
            $manager->persist($sport);
            $sports[] = $sport;
        }
        
        return $sports;
    }
    
    private function loadSportPlaces(ObjectManager $manager, array $users, array $sports): array
    {
        $sportPlacesData = [
            [
                'name' => 'Stade Léo Lagrange',
                'description' => 'Stade municipal avec terrains de football, piste d\'athlétisme et gymnase.',
                'latitude' => 48.9156,
                'longitude' => 2.2987,
                'address' => '23 Rue Paul Bert, 92600 Asnières-sur-Seine',
                'sports' => [0, 4], // Football, Course à pied
                'createdBy' => 0 // Admin
            ],
            [
                'name' => 'Complexe Sportif Concorde-Arago',
                'description' => 'Complexe sportif avec courts de tennis, terrain de basketball et salle de fitness.',
                'latitude' => 48.9104,
                'longitude' => 2.2940,
                'address' => '27 Rue de la Concorde, 92600 Asnières-sur-Seine',
                'sports' => [1, 2, 6], // Basketball, Tennis, Fitness
                'createdBy' => 0 // Admin
            ],
            [
                'name' => 'Piscine municipale d\'Asnières',
                'description' => 'Piscine municipale avec plusieurs bassins de natation.',
                'latitude' => 48.9132,
                'longitude' => 2.2883,
                'address' => '1 Boulevard Pierre de Coubertin, 92600 Asnières-sur-Seine',
                'sports' => [3], // Natation
                'createdBy' => 1 // User 1
            ],
            [
                'name' => 'Parc Robinson',
                'description' => 'Parc public avec parcours de jogging, terrain de pétanque et espaces verts.',
                'latitude' => 48.9177,
                'longitude' => 2.2844,
                'address' => 'Avenue Laurent Cély, 92600 Asnières-sur-Seine',
                'sports' => [4, 7], // Course à pied, Pétanque
                'createdBy' => 1 // User 1
            ],
            [
                'name' => 'Gymnase Descartes',
                'description' => 'Gymnase municipal proposant des activités de basketball et de fitness.',
                'latitude' => 48.9210,
                'longitude' => 2.2980,
                'address' => '8 Rue René Descartes, 92600 Asnières-sur-Seine',
                'sports' => [1, 6], // Basketball, Fitness
                'createdBy' => 2 // User 2
            ],
            [
                'name' => 'Tennis Club d\'Asnières',
                'description' => 'Club de tennis avec plusieurs courts intérieurs et extérieurs.',
                'latitude' => 48.9230,
                'longitude' => 2.2910,
                'address' => '14 Rue Maurice Bokanowski, 92600 Asnières-sur-Seine',
                'sports' => [2], // Tennis
                'createdBy' => 0 // Admin
            ],
            [
                'name' => 'Parc des Sports et de Loisirs',
                'description' => 'Grand complexe sportif avec terrains de football, basketball et pistes cyclables.',
                'latitude' => 48.9170,
                'longitude' => 2.3020,
                'address' => '28 Avenue des Grésillons, 92600 Asnières-sur-Seine',
                'sports' => [0, 1, 5], // Football, Basketball, Cyclisme
                'createdBy' => 3 // User 3
            ],
            [
                'name' => 'City Stade des Hauts d\'Asnières',
                'description' => 'Terrain multisports en accès libre avec terrain de football et basketball.',
                'latitude' => 48.9260,
                'longitude' => 2.2950,
                'address' => 'Rue Henri Poincaré, 92600 Asnières-sur-Seine',
                'sports' => [0, 1], // Football, Basketball
                'createdBy' => 3 // User 3
            ],
            [
                'name' => 'Centre Aquatique',
                'description' => 'Centre aquatique moderne avec plusieurs bassins, toboggans et espace bien-être.',
                'latitude' => 48.9090,
                'longitude' => 2.2830,
                'address' => '25 Boulevard de la République, 92600 Asnières-sur-Seine',
                'sports' => [3], // Natation
                'createdBy' => 4 // User 4
            ],
            [
                'name' => 'Fitness Park Asnières',
                'description' => 'Salle de fitness avec équipements modernes et cours collectifs.',
                'latitude' => 48.9120,
                'longitude' => 2.2920,
                'address' => '42 Avenue de la Marne, 92600 Asnières-sur-Seine',
                'sports' => [6], // Fitness
                'createdBy' => 4 // User 4
            ],
            [
                'name' => 'Boulodrome Municipal',
                'description' => 'Terrain de pétanque couvert et extérieur pour pratiquer la pétanque toute l\'année.',
                'latitude' => 48.9150,
                'longitude' => 2.2850,
                'address' => '10 Rue Victor Hugo, 92600 Asnières-sur-Seine',
                'sports' => [7], // Pétanque
                'createdBy' => 2 // User 2
            ],
            [
                'name' => 'Piste Cyclable des Berges de Seine',
                'description' => 'Piste cyclable le long des berges de la Seine pour le vélo et la course à pied.',
                'latitude' => 48.9086,
                'longitude' => 2.2800,
                'address' => 'Quai du Docteur Dervaux, 92600 Asnières-sur-Seine',
                'sports' => [4, 5], // Course à pied, Cyclisme
                'createdBy' => 1 // User 1
            ],
            [
                'name' => 'Stade Gabriel Péri',
                'description' => 'Stade avec terrain de football et piste d\'athlétisme.',
                'latitude' => 48.9230,
                'longitude' => 2.3000,
                'address' => '30 Avenue Gabriel Péri, 92600 Asnières-sur-Seine',
                'sports' => [0, 4], // Football, Course à pied
                'createdBy' => 0 // Admin
            ],
            [
                'name' => 'Gymnase Romain Rolland',
                'description' => 'Gymnase proposant des activités de basketball et de fitness.',
                'latitude' => 48.9200,
                'longitude' => 2.2930,
                'address' => '34 Rue Romain Rolland, 92600 Asnières-sur-Seine',
                'sports' => [1, 6], // Basketball, Fitness
                'createdBy' => 2 // User 2
            ],
            [
                'name' => 'Parc Voyer d\'Argenson',
                'description' => 'Parc avec parcours sportif, terrain de pétanque et espaces verts.',
                'latitude' => 48.9130,
                'longitude' => 2.2920,
                'address' => 'Rue du Ménil, 92600 Asnières-sur-Seine',
                'sports' => [4, 7], // Course à pied, Pétanque
                'createdBy' => 3 // User 3
            ],
            [
                'name' => 'Courts de Tennis Henri Vidal',
                'description' => 'Courts de tennis ouverts au public sur réservation.',
                'latitude' => 48.9180,
                'longitude' => 2.2870,
                'address' => '15 Rue Henri Vidal, 92600 Asnières-sur-Seine',
                'sports' => [2], // Tennis
                'createdBy' => 4 // User 4
            ],
            [
                'name' => 'Espace Sportif des Courtilles',
                'description' => 'Complexe sportif avec terrain de football, basketball et salle de fitness.',
                'latitude' => 48.9250,
                'longitude' => 2.2890,
                'address' => '42 Avenue des Courtilles, 92600 Asnières-sur-Seine',
                'sports' => [0, 1, 6], // Football, Basketball, Fitness
                'createdBy' => 1 // User 1
            ],
            [
                'name' => 'Parcours Santé du Parc des Impressionnistes',
                'description' => 'Parcours sportif avec équipements de fitness en plein air.',
                'latitude' => 48.9101,
                'longitude' => 2.2770,
                'address' => 'Boulevard du Général Leclerc, 92600 Asnières-sur-Seine',
                'sports' => [4, 6], // Course à pied, Fitness
                'createdBy' => 0 // Admin
            ],
            [
                'name' => 'Terrain de Basket des Agnettes',
                'description' => 'Terrain de basketball en accès libre dans le quartier des Agnettes.',
                'latitude' => 48.9220,
                'longitude' => 2.2940,
                'address' => 'Rue des Agnettes, 92600 Asnières-sur-Seine',
                'sports' => [1], // Basketball
                'createdBy' => 3 // User 3
            ],
            [
                'name' => 'Espace Multisports Métro Gabriel Péri',
                'description' => 'Espace sportif urbain près de la station de métro Gabriel Péri.',
                'latitude' => 48.9165,
                'longitude' => 2.3010,
                'address' => 'Place Aristide Briand, 92600 Asnières-sur-Seine',
                'sports' => [0, 1, 5], // Football, Basketball, Cyclisme
                'createdBy' => 4 // User 4
            ]
        ];
        
        $sportPlaces = [];
        
        foreach ($sportPlacesData as $placeData) {
            $place = new SportPlace();
            $place->setName($placeData['name']);
            $place->setDescription($placeData['description']);
            $place->setLatitude($placeData['latitude']);
            $place->setLongitude($placeData['longitude']);
            $place->setAddress($placeData['address']);
            $place->setCreatedBy($users[$placeData['createdBy']]);
            
            // Set opening hours
            $openingHours = $this->generateOpeningHours();
            $place->setOpeningHours($openingHours);
            
            // Add sports to place
            foreach ($placeData['sports'] as $sportIndex) {
                $place->addSport($sports[$sportIndex]);
            }
            
            $manager->persist($place);
            $sportPlaces[] = $place;
        }
        
        return $sportPlaces;
    }
    
    private function loadReviews(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        $reviewsData = [];
        
        // Generate about 2 reviews per place on average
        for ($i = 0; $i < 40; $i++) {
            $reviewsData[] = [
                'rating' => rand(1, 5),
                'comment' => $this->getRandomReviewComment(rand(1, 5)),
                'user' => rand(0, count($users) - 1),
                'sportPlace' => rand(0, count($sportPlaces) - 1)
            ];
        }
        
        foreach ($reviewsData as $reviewData) {
            $review = new Review();
            $review->setRating($reviewData['rating']);
            $review->setComment($reviewData['comment']);
            $review->setUser($users[$reviewData['user']]);
            $review->setSportPlace($sportPlaces[$reviewData['sportPlace']]);
            
            $manager->persist($review);
        }
    }
    
    private function loadFavorites(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        // Each user will have 2-4 favorite places
        foreach ($users as $user) {
            $numFavorites = rand(2, 4);
            $favoriteIndices = array_rand($sportPlaces, $numFavorites);
            
            if (!is_array($favoriteIndices)) {
                $favoriteIndices = [$favoriteIndices];
            }
            
            foreach ($favoriteIndices as $index) {
                $favorite = new Favorite();
                $favorite->setUser($user);
                $favorite->setSportPlace($sportPlaces[$index]);
                
                $manager->persist($favorite);
            }
        }
    }
    
    private function loadEvents(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        $eventTitles = [
            'Tournoi amical de football',
            'Compétition de basketball',
            'Cours de tennis pour débutants',
            'Journée portes ouvertes',
            'Séance d\'entraînement collectif',
            'Marathon local',
            'Rencontre sportive inter-quartiers',
            'Championnat local',
            'Séance de découverte',
            'Événement caritatif sportif'
        ];
        
        // Create 10 events
        for ($i = 0; $i < 10; $i++) {
            $event = new Event();
            $event->setTitle($eventTitles[$i]);
            $event->setDescription('Venez nombreux participer à cet événement sportif dans votre quartier ! Ambiance conviviale et sportive garantie.');
            
            // Random date in the next 30 days
            $daysInFuture = rand(1, 30);
            $eventDate = new \DateTimeImmutable("+$daysInFuture days");
            $event->setEventDate($eventDate);
            
            // Random organizer and location
            $event->setOrganizer($users[rand(0, count($users) - 1)]);
            $event->setSportPlace($sportPlaces[rand(0, count($sportPlaces) - 1)]);
            
            $manager->persist($event);
        }
    }
    
    private function loadForumContent(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        $forumTopics = [
            'Horaires d\'ouverture pendant les vacances',
            'Recherche partenaire de tennis',
            'Équipement recommandé pour débutants',
            'Problème d\'accès au parking',
            'Organisation d\'un tournoi amical',
            'Cours collectifs disponibles ?',
            'État des équipements',
            'Tarifs pour les enfants'
        ];
        
        $forumReplies = [
            'Merci pour l\'information !',
            'Je suis intéressé, comment puis-je vous contacter ?',
            'J\'ai eu la même expérience la semaine dernière.',
            'Pouvez-vous préciser les horaires exacts ?',
            'Est-ce que c\'est adapté pour les débutants ?',
            'Super initiative, je serai présent.',
            'Je recommande vraiment cet endroit.',
            'Y a-t-il un numéro de téléphone pour réserver ?'
        ];
        
        // Create 8 forum posts
        $posts = [];
        for ($i = 0; $i < 8; $i++) {
            $post = new ForumPost();
            $post->setContent($forumTopics[$i] . "\n\nBonjour à tous, quelqu'un aurait des informations à ce sujet ? Merci d'avance pour votre aide !");
            $post->setUser($users[rand(0, count($users) - 1)]);
            $post->setSportPlace($sportPlaces[rand(0, count($sportPlaces) - 1)]);
            
            $manager->persist($post);
            $posts[] = $post;
        }
        
        // Create 1-3 replies for each post
        foreach ($posts as $post) {
            $numReplies = rand(1, 3);
            for ($j = 0; $j < $numReplies; $j++) {
                $reply = new ForumReply();
                $reply->setContent($forumReplies[array_rand($forumReplies)]);
                $reply->setUser($users[rand(0, count($users) - 1)]);
                $reply->setForumPost($post);
                
                $manager->persist($reply);
            }
        }
    }
    
    private function loadMedia(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        // Image URLs for different sports
        $sportImageUrls = [
            'Football' => [
                'https://images.unsplash.com/photo-1551958219-acbc608c6377',
                'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
                'https://images.unsplash.com/photo-1579952363873-27f3bade9f55'
            ],
            'Basketball' => [
                'https://images.unsplash.com/photo-1546519638-68e109498ffc',
                'https://images.unsplash.com/photo-1519861531473-9200262188bf',
                'https://images.unsplash.com/photo-1504450758481-7338eba7524a'
            ],
            'Tennis' => [
                'https://images.unsplash.com/photo-1595435934847-5ec0dcdfd01c',
                'https://images.unsplash.com/photo-1554068865-24cecd4e34b8',
                'https://images.unsplash.com/photo-1594880950016-8e215aad3310'
            ],
            'Natation' => [
                'https://images.unsplash.com/photo-1560090995-01632a28895b',
                'https://images.unsplash.com/photo-1527499456709-838ffdcfee3d',
                'https://images.unsplash.com/photo-1575140841234-8371fbcf6cb9'
            ],
            'Course à pied' => [
                'https://images.unsplash.com/photo-1571008887538-b36bb32f4571',
                'https://images.unsplash.com/photo-1606257689016-7eebb7683096',
                'https://images.unsplash.com/photo-1598136490929-292a0a7890c2'
            ],
            'Cyclisme' => [
                'https://images.unsplash.com/photo-1541625602330-2277a4c46182',
                'https://images.unsplash.com/photo-1530143584546-02191bc84eb5',
                'https://images.unsplash.com/photo-1571188654248-7a89213915f7'
            ],
            'Fitness' => [
                'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
                'https://images.unsplash.com/photo-1571902943202-507ec2618e8f',
                'https://images.unsplash.com/photo-1574680096145-d05b474e2155'
            ],
            'Pétanque' => [
                'https://images.unsplash.com/photo-1595972445083-53659fa6dbb4',
                'https://images.unsplash.com/photo-1572204292164-b35ba943fca7',
                'https://images.unsplash.com/photo-1584682395831-5b1b99646525'
            ]
        ];
        
        // Add 2-4 images for each sport place
        foreach ($sportPlaces as $place) {
            $numImages = rand(2, 4);
            $placeHasSports = [];
            
            // Get all sports for this place
            foreach ($place->getSports() as $sport) {
                $placeHasSports[] = $sport->getName();
            }
            
            for ($i = 0; $i < $numImages; $i++) {
                $media = new Media();
                
                // Select a random sport this place has
                $sportName = $placeHasSports[array_rand($placeHasSports)];
                
                // Get a random image URL for that sport
                $sportImages = $sportImageUrls[$sportName];
                $imageUrl = $sportImages[array_rand($sportImages)];
                
                $media->setUrl($imageUrl);
                $media->setType(Media::TYPE_IMAGE);
                $media->setSportPlace($place);
                $media->setUploadedBy($users[rand(0, count($users) - 1)]);
                
                $manager->persist($media);
            }
        }
    }
    
    private function loadItineraries(ObjectManager $manager, array $users, array $sportPlaces): void
    {
        // Create 10 random itineraries
        for ($i = 0; $i < 10; $i++) {
            $itinerary = new Itinerary();
            
            // Random starting point around Asnières
            $startLat = self::ASNIÈRES_LAT + (rand(-100, 100) / 1000);
            $startLong = self::ASNIÈRES_LONG + (rand(-100, 100) / 1000);
            
            $itinerary->setStartLatitude($startLat);
            $itinerary->setStartLongitude($startLong);
            $itinerary->setUser($users[rand(0, count($users) - 1)]);
            $itinerary->setDestinationPlace($sportPlaces[rand(0, count($sportPlaces) - 1)]);
            
            $manager->persist($itinerary);
        }
    }
    
    private function loadUsageStatistics(ObjectManager $manager, array $sportPlaces): void
    {
        // Create usage statistics for each sport place
        foreach ($sportPlaces as $place) {
            $stats = new UsageStatistics();
            $stats->setViews(rand(50, 1000));
            $stats->setVisitCount(rand(10, 200));
            $stats->setLastVisited(new \DateTimeImmutable('-' . rand(1, 30) . ' days'));
            $stats->setSportPlace($place);
            
            $manager->persist($stats);
        }
    }
    
    private function loadNotifications(ObjectManager $manager, array $users): void
    {
        $notificationTypes = [
            Notification::TYPE_NEW_REPLY,
            Notification::TYPE_NEW_EVENT,
            Notification::TYPE_NEW_REVIEW,
            Notification::TYPE_SYSTEM
        ];
        
        $notificationContents = [
            Notification::TYPE_NEW_REPLY => [
                'Quelqu\'un a répondu à votre message sur "Recherche partenaire de tennis"',
                'Nouvelle réponse à votre discussion "Horaires d\'ouverture pendant les vacances"',
                'Une personne a répondu à votre post sur "Organisation d\'un tournoi amical"'
            ],
            Notification::TYPE_NEW_EVENT => [
                'Nouvel événement : "Tournoi amical de football" près de chez vous !',
                'Un "Cours de tennis pour débutants" vient d\'être programmé',
                'Nouvel événement : "Marathon local" ce week-end'
            ],
            Notification::TYPE_NEW_REVIEW => [
                'Votre lieu favori "Stade Léo Lagrange" a reçu un nouvel avis',
                'Nouvel avis sur "Piscine municipale d\'Asnières"',
                'Quelqu\'un a posté un avis sur "Tennis Club d\'Asnières"'
            ],
            Notification::TYPE_SYSTEM => [
                'Bienvenue sur SportApp ! Découvrez les lieux sportifs autour de vous',
                'Mise à jour de notre politique de confidentialité',
                'Nouvelles fonctionnalités disponibles dans l\'application'
            ]
        ];
        
        // Create 2-5 notifications for each user
        foreach ($users as $user) {
            $numNotifications = rand(2, 5);
            
            for ($i = 0; $i < $numNotifications; $i++) {
                $notification = new Notification();
                
                // Random type
                $type = $notificationTypes[array_rand($notificationTypes)];
                $notification->setType($type);
                
                // Get content based on type
                $contents = $notificationContents[$type];
                $notification->setContent($contents[array_rand($contents)]);
                
                // Random read status with most being unread
                $notification->setIsRead(rand(0, 5) > 4);
                $notification->setUser($user);
                
                $manager->persist($notification);
            }
        }
    }
    
    private function generateOpeningHours(): array
    {
        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        $openingHours = [];
        
        foreach ($days as $day) {
            // Some places closed on Sunday or have different weekend hours
            if ($day === 'sunday' && rand(0, 1) === 0) {
                $openingHours[$day] = ['closed' => true];
                continue;
            }
            
            // Weekend hours might be different
            if (in_array($day, ['saturday', 'sunday'])) {
                $openHour = rand(8, 10);
                $closeHour = rand(17, 19);
            } else {
                $openHour = rand(7, 9);
                $closeHour = rand(19, 22);
            }
            
            // Some places might close for lunch
            $hasLunchBreak = rand(0, 1) === 1;
            
            if ($hasLunchBreak) {
                $openingHours[$day] = [
                    'morning' => [
                        'open' => sprintf('%02d:00', $openHour),
                        'close' => '12:30'
                    ],
                    'afternoon' => [
                        'open' => '14:00',
                        'close' => sprintf('%02d:00', $closeHour)
                    ]
                ];
            } else {
                $openingHours[$day] = [
                    'open' => sprintf('%02d:00', $openHour),
                    'close' => sprintf('%02d:00', $closeHour)
                ];
            }
        }
        
        return $openingHours;
    }
    
    private function getRandomReviewComment(int $rating): string
    {
        $positiveComments = [
            'Superbe endroit pour pratiquer le sport, très bien entretenu et personnel accueillant.',
            'Les installations sont modernes et très propres. Je recommande vivement !',
            'Excellente ambiance et bonne organisation. J\'y retournerai sans hésiter.',
            'Parfait pour les débutants comme pour les plus expérimentés. Un vrai plaisir.',
            'L\'équipe est très professionnelle et les équipements de haute qualité.'
        ];
        
        $neutralComments = [
            'Bon endroit dans l\'ensemble, mais parfois un peu trop fréquenté aux heures de pointe.',
            'Installations correctes mais qui mériteraient quelques rénovations.',
            'Service acceptable mais pourrait être amélioré en termes d\'organisation.',
            'Rapport qualité-prix moyen. Ni exceptionnel, ni mauvais.',
            'Lieu agréable mais un peu difficile d\'accès en transports en commun.'
        ];
        
        $negativeComments = [
            'Déçu par la propreté des lieux et le manque d\'entretien des équipements.',
            'Personnel peu aimable et horaires pas toujours respectés.',
            'Trop cher pour la qualité des services proposés.',
            'Très fréquenté, difficile de pratiquer dans de bonnes conditions.',
            'Installations vétustes qui nécessiteraient une rénovation urgente.'
        ];
        
        if ($rating >= 4) {
            return $positiveComments[array_rand($positiveComments)];
        } elseif ($rating >= 2) {
            return $neutralComments[array_rand($neutralComments)];
        } else {
            return $negativeComments[array_rand($negativeComments)];
        }
    }
}