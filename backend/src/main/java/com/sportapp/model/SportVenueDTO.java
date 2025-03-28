package com.sportapp.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SportVenueDTO {
    private Long id;
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotNull(message = "Latitude is required")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    private Double longitude;
    
    private LocalTime openingTime;
    private LocalTime closingTime;
    private BigDecimal entranceFee;
    private String description;
    private LocalDateTime creationDate;
    private LocalDateTime publicationDate;
    private Double averageRating;
    private String address;
    private SportVenue.VenueType venueType;
    
    // Static method to convert Entity to DTO
    public static SportVenueDTO fromEntity(SportVenue venue) {
        return SportVenueDTO.builder()
                .id(venue.getId())
                .name(venue.getName())
                .latitude(venue.getLatitude())
                .longitude(venue.getLongitude())
                .openingTime(venue.getOpeningTime())
                .closingTime(venue.getClosingTime())
                .entranceFee(venue.getEntranceFee())
                .description(venue.getDescription())
                .creationDate(venue.getCreationDate())
                .publicationDate(venue.getPublicationDate())
                .averageRating(venue.getAverageRating())
                .address(venue.getAddress())
                .venueType(venue.getVenueType())
                .build();
    }
    
    // Method to convert DTO to Entity
    public SportVenue toEntity() {
        return SportVenue.builder()
                .id(this.id)
                .name(this.name)
                .latitude(this.latitude)
                .longitude(this.longitude)
                .openingTime(this.openingTime)
                .closingTime(this.closingTime)
                .entranceFee(this.entranceFee)
                .description(this.description)
                .creationDate(this.creationDate)
                .publicationDate(this.publicationDate)
                .averageRating(this.averageRating)
                .address(this.address)
                .venueType(this.venueType)
                .build();
    }
}