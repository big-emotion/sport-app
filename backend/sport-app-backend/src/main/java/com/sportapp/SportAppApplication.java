package com.sportapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import javax.persistence.*;
import java.util.List;

@SpringBootApplication
public class SportAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(SportAppApplication.class, args);
    }
}

@Entity
class SportLocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;
    private String sportType;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getSportType() { return sportType; }
    public void setSportType(String sportType) { this.sportType = sportType; }
}

@Repository
interface SportLocationRepository extends JpaRepository<SportLocation, Long> {}

@Service
class SportLocationService {
    @Autowired
    private SportLocationRepository repository;

    public List<SportLocation> getAllLocations() { return repository.findAll(); }
    public SportLocation saveLocation(SportLocation location) { return repository.save(location); }
    public void deleteLocation(Long id) { repository.deleteById(id); }
}

@RestController
@RequestMapping("/api/sport-locations")
class SportLocationController {
    @Autowired
    private SportLocationService service;

    @GetMapping
    public List<SportLocation> getAllLocations() {
        return service.getAllLocations();
    }

    @PostMapping
    public ResponseEntity<SportLocation> addLocation(@RequestBody SportLocation location) {
        return new ResponseEntity<>(service.saveLocation(location), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        service.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}

// Ajout du fichier Dockerfile pour conteneuriser l'application
/*
Dockerfile
*/
/*
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
*/
