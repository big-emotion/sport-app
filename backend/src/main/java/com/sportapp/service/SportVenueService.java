package com.sportapp.service;

import com.sportapp.exception.ResourceNotFoundException;
import com.sportapp.model.SportVenue;
import com.sportapp.model.SportVenueDTO;
import com.sportapp.repository.SportVenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SportVenueService {

    private final SportVenueRepository venueRepository;
    
    @Transactional(readOnly = true)
    public List<SportVenueDTO> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(SportVenueDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public SportVenueDTO getVenueById(Long id) {
        SportVenue venue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SportVenue", "id", id));
        return SportVenueDTO.fromEntity(venue);
    }
    
    @Transactional
    public SportVenueDTO createVenue(SportVenueDTO venueDTO) {
        // The creationDate is set by @PrePersist in the entity
        venueDTO.setPublicationDate(LocalDateTime.now());
        SportVenue venue = venueDTO.toEntity();
        venue = venueRepository.save(venue);
        return SportVenueDTO.fromEntity(venue);
    }
    
    @Transactional
    public SportVenueDTO updateVenue(Long id, SportVenueDTO venueDTO) {
        SportVenue existingVenue = venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SportVenue", "id", id));
        
        // Preserve creation date
        LocalDateTime creationDate = existingVenue.getCreationDate();
        
        // Update with new values
        SportVenue updatedVenue = venueDTO.toEntity();
        updatedVenue.setId(id);
        updatedVenue.setCreationDate(creationDate);
        
        updatedVenue = venueRepository.save(updatedVenue);
        return SportVenueDTO.fromEntity(updatedVenue);
    }
    
    @Transactional
    public void deleteVenue(Long id) {
        if (!venueRepository.existsById(id)) {
            throw new ResourceNotFoundException("SportVenue", "id", id);
        }
        venueRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public List<SportVenueDTO> getVenuesByType(SportVenue.VenueType venueType) {
        return venueRepository.findByVenueType(venueType).stream()
                .map(SportVenueDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<SportVenueDTO> searchVenuesByName(String name) {
        return venueRepository.findByNameContainingIgnoreCase(name).stream()
                .map(SportVenueDTO::fromEntity)
                .collect(Collectors.toList());
    }
}