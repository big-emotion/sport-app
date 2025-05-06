"use client";
import { useEffect, useState } from "react";
import { SportVenue } from "./types/venue";

export default function Home() {
  const [venues, setVenues] = useState<SportVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Use our Next.js API route as a proxy
    const apiUrl = '/api/venues';
    console.log("Fetching from URL:", apiUrl);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Data received:", data);
        console.log("Data type:", typeof data);
        
        // Extract venues from hydra:member field of the API Platform response
        if (data && data['hydra:member'] && Array.isArray(data['hydra:member'])) {
          console.log("Using hydra:member data:", data['hydra:member'].length, "items");
          setVenues(data['hydra:member']);
        } else if (Array.isArray(data)) {
          console.log("Using direct array data:", data.length, "items");
          setVenues(data);
        } else {
          console.error("Unexpected API response format:", data);
          // Ensure venues is always an array
          setVenues([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sport venues:", error);
        setError("Failed to load sport venues. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  console.log("Before rendering - venues:", venues, "isArray:", Array.isArray(venues));
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Loading sport venues...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  // Always ensure venues is an array before rendering
  const venuesArray = Array.isArray(venues) ? venues : [];
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sport Venues</h1>
      
      {venuesArray.length === 0 ? (
        <p>No sport venues found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {venuesArray.map((venue: SportVenue) => (
            <div key={venue.id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold">{venue.name}</h2>
              <div className="mb-2 text-sm bg-blue-100 inline-block px-2 py-1 rounded">
                {venue.venueType}
              </div>
              <p className="text-gray-600 mb-2">{venue.address || 'No address provided'}</p>
              <p className="mb-2">{venue.description || 'No description available'}</p>
              
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Opening:</span>{' '}
                  {venue.openingTime ? venue.openingTime.substring(0, 5) : 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Closing:</span>{' '}
                  {venue.closingTime ? venue.closingTime.substring(0, 5) : 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Fee:</span>{' '}
                  {venue.entranceFee === '0' || !venue.entranceFee ? 'Free' : `€${venue.entranceFee}`}
                </div>
                <div>
                  <span className="font-semibold">Rating:</span>{' '}
                  {venue.averageRating ? `${venue.averageRating}/5` : 'Not rated'}
                </div>
              </div>
              
              <div className="mt-3 text-right">
                <a 
                  href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Map
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
