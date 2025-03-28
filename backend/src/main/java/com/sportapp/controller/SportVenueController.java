package com.sportapp.controller;

import com.sportapp.model.SportVenue;
import com.sportapp.model.SportVenueDTO;
import com.sportapp.service.SportVenueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sport-venues")
@RequiredArgsConstructor
@Tag(name = "Sport Venues", description = "API for managing sport venues")
@CrossOrigin(origins = "*")
public class SportVenueController {

    private final SportVenueService venueService;
    
    @GetMapping
    @Operation(summary = "Get all sport venues", 
               description = "Retrieve a list of all sport venues")
    public ResponseEntity<List<SportVenueDTO>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get a sport venue by ID",
               description = "Retrieve a specific sport venue by its ID",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Venue found"),
                   @ApiResponse(responseCode = "404", description = "Venue not found", 
                              content = @Content)
               })
    public ResponseEntity<SportVenueDTO> getVenueById(
            @Parameter(description = "ID of the venue to retrieve") 
            @PathVariable Long id) {
        return ResponseEntity.ok(venueService.getVenueById(id));
    }
    
    @PostMapping
    @Operation(summary = "Create a new sport venue",
               description = "Create a new sport venue with the provided information")
    public ResponseEntity<SportVenueDTO> createVenue(
            @Valid @RequestBody SportVenueDTO venueDTO) {
        return new ResponseEntity<>(venueService.createVenue(venueDTO), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a sport venue",
               description = "Update an existing sport venue with the provided information",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Venue updated"),
                   @ApiResponse(responseCode = "404", description = "Venue not found", 
                              content = @Content)
               })
    public ResponseEntity<SportVenueDTO> updateVenue(
            @Parameter(description = "ID of the venue to update") 
            @PathVariable Long id,
            @Valid @RequestBody SportVenueDTO venueDTO) {
        return ResponseEntity.ok(venueService.updateVenue(id, venueDTO));
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a sport venue",
               description = "Delete a sport venue by its ID",
               responses = {
                   @ApiResponse(responseCode = "204", description = "Venue deleted"),
                   @ApiResponse(responseCode = "404", description = "Venue not found", 
                              content = @Content)
               })
    public ResponseEntity<Void> deleteVenue(
            @Parameter(description = "ID of the venue to delete") 
            @PathVariable Long id) {
        venueService.deleteVenue(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/type/{venueType}")
    @Operation(summary = "Get venues by type",
               description = "Retrieve all sport venues of a specific type")
    public ResponseEntity<List<SportVenueDTO>> getVenuesByType(
            @Parameter(description = "Type of the venues to retrieve") 
            @PathVariable SportVenue.VenueType venueType) {
        return ResponseEntity.ok(venueService.getVenuesByType(venueType));
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search venues by name",
               description = "Search for venues containing the specified text in their name")
    public ResponseEntity<List<SportVenueDTO>> searchVenuesByName(
            @Parameter(description = "Text to search for in venue names") 
            @RequestParam String name) {
        return ResponseEntity.ok(venueService.searchVenuesByName(name));
    }
}