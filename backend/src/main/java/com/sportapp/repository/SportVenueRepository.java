package com.sportapp.repository;

import com.sportapp.model.SportVenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SportVenueRepository extends JpaRepository<SportVenue, Long> {
    
    List<SportVenue> findByVenueType(SportVenue.VenueType venueType);
    
    List<SportVenue> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT v FROM SportVenue v WHERE " +
           "FUNCTION('earth_distance', " +
           "FUNCTION('ll_to_earth', :lat, :lon), " +
           "FUNCTION('ll_to_earth', v.latitude, v.longitude)) <= :radius")
    List<SportVenue> findVenuesWithinRadius(Double lat, Double lon, Double radius);
}