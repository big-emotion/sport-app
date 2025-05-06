# How to Access API Platform

## API Endpoints

The API is accessible through HTTPS with self-signed certificates. Use the following URLs:

- API Entrypoint: `https://localhost/api` (use `-k` flag with curl to bypass certificate verification)
- API Documentation: `https://localhost/api/docs`
- Swagger UI: `https://localhost/api/docs?ui=swagger-ui`

## Available Resources

The following resources are available:

- `/api/bookings` - Booking resources
- `/api/contents` - Content resources
- `/api/facilities` - Facility resources
- `/api/images` - Image resources
- `/api/media` - Media resources
- `/api/messages` - Message resources
- `/api/notifications` - Notification resources
- `/api/reviews` - Review resources
- `/api/sports` - Sport resources
- `/api/sport_venues` - SportVenue resources
- `/api/users` - User resources
- `/api/venue_sports` - VenueSport resources

## Example Commands

```bash
# Get API entrypoint
curl -k https://localhost/api

# Get API documentation
curl -k https://localhost/api/docs

# Get all sports
curl -k https://localhost/api/sports

# Get a specific venue
curl -k https://localhost/api/sport_venues/1
```

Note: The port 8080 will redirect to HTTPS, so use https://localhost instead of http://localhost:8080 for direct access.
