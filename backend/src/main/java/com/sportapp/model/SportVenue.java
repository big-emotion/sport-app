package com.sportapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "sport_venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SportVenue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @Column(name = "entrance_fee")
    private BigDecimal entranceFee;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "creation_date")
    @PastOrPresent
    private LocalDateTime creationDate;

    @Column(name = "publication_date")
    private LocalDateTime publicationDate;

    @Column(name = "average_rating")
    private Double averageRating;

    private String address;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "venue_type")
    private VenueType venueType;
    
    @PrePersist
    protected void onCreate() {
        creationDate = LocalDateTime.now();
    }
    
    public enum VenueType {
        BASKETBALL, FOOTBALL, TENNIS, SWIMMING, RUNNING, VOLLEYBALL, GOLF, OTHER
    }
}