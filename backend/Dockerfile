FROM maven:3.8-openjdk-17 as builder

WORKDIR /app

# Copy the POM file
COPY pom.xml .

# Download all dependencies
RUN mvn dependency:go-offline -B

# Copy the source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the jar file from the builder stage
COPY --from=builder /app/target/sport-app-backend-1.0-SNAPSHOT.jar app.jar

EXPOSE 8080

# Set Spring profiles (if needed)
ENV SPRING_PROFILES_ACTIVE=prod

# Run with proper Java options for containerized environments
CMD ["java", "-jar", "app.jar"]