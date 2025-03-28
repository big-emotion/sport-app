package com.sportapp.config;

import com.sportapp.model.SportVenue;
import com.sportapp.repository.SportVenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final SportVenueRepository venueRepository;
    
    @Bean
    @Profile("!test")
    public CommandLineRunner initData() {
        return args -> {
            // Only initialize if no data exists
            if (venueRepository.count() == 0) {
                List<SportVenue> venues = List.of(
                    // Basketball
                    SportVenue.builder()
                        .name("Downtown Basketball Court")
                        .latitude(48.856614)
                        .longitude(2.3522219)
                        .openingTime(LocalTime.of(8, 0))
                        .closingTime(LocalTime.of(22, 0))
                        .entranceFee(BigDecimal.valueOf(0))
                        .description("Public basketball court with 3 hoops, located in the heart of downtown")
                        .creationDate(LocalDateTime.now())
                        .publicationDate(LocalDateTime.now())
                        .averageRating(4.5)
                        .address("123 Downtown Square, Paris, France")
                        .venueType(SportVenue.VenueType.BASKETBALL)
                        .build(),
                        
                    // Football
                    SportVenue.builder()
                        .name("Riverside Football Field")
                        .latitude(48.858844)
                        .longitude(2.294351)
                        .openingTime(LocalTime.of(7, 0))
                        .closingTime(LocalTime.of(20, 0))
                        .entranceFee(BigDecimal.valueOf(5.00))
                        .description("Professional football field with artificial turf, near the riverside")
                        .creationDate(LocalDateTime.now())
                        .publicationDate(LocalDateTime.now())
                        .averageRating(4.7)
                        .address("45 Riverside Road, Paris, France")
                        .venueType(SportVenue.VenueType.FOOTBALL)
                        .build(),
                        
                    // Tennis
                    SportVenue.builder()
                        .name("Summit Tennis Club")
                        .latitude(48.852968)
                        .longitude(2.349902)
                        .openingTime(LocalTime.of(9, 0))
                        .closingTime(LocalTime.of(21, 0))
                        .entranceFee(BigDecimal.valueOf(15.00))
                        .description("Private tennis club with 6 courts, 2 indoor and 4 outdoor")
                        .creationDate(LocalDateTime.now())
                        .publicationDate(LocalDateTime.now())
                        .averageRating(4.8)
                        .address("78 Mountain View Road, Paris, France")
                        .venueType(SportVenue.VenueType.TENNIS)
                        .build(),
                        
                    // Swimming
                    SportVenue.builder()
                        .name("Aquatic Center")
                        .latitude(48.860294)
                        .longitude(2.338629)
                        .openingTime(LocalTime.of(6, 0))
                        .closingTime(LocalTime.of(22, 0))
                        .entranceFee(BigDecimal.valueOf(8.50))
                        .description("Olympic-sized swimming pool with diving platforms and children's area")
                        .creationDate(LocalDateTime.now())
                        .publicationDate(LocalDateTime.now())
                        .averageRating(4.6)
                        .address("156 Water Lane, Paris, France")
                        .venueType(SportVenue.VenueType.SWIMMING)
                        .build(),
                        
                    // Running
                    SportVenue.builder()
                        .name("City Park Running Track")
                        .latitude(48.845587)
                        .longitude(2.341699)
                        .openingTime(LocalTime.of(6, 0))
                        .closingTime(LocalTime.of(23, 0))
                        .entranceFee(BigDecimal.valueOf(0))
                        .description("400m running track in the city park, with a special rubberized surface")
                        .creationDate(LocalDateTime.now())
                        .publicationDate(LocalDateTime.now())
                        .averageRating(4.3)
                        .address("City Park, Paris, France")
                        .venueType(SportVenue.VenueType.RUNNING)
                        .build()
                );
                
                venueRepository.saveAll(venues);
                
                System.out.println("Initialized sample data: " + venues.size() + " sport venues created");
            }
        };
    }
}