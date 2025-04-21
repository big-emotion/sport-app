'use client';

import { useEffect, useState } from 'react';
import { SportVenue, Review, Booking } from '@/app/types/venue';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VenueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [venue, setVenue] = useState<SportVenue | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [newBooking, setNewBooking] = useState({
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch venue details
        const venueResponse = await fetch(`/api/venues/${params.id}`);
        if (!venueResponse.ok) throw new Error('Failed to fetch venue');
        const venueData = await venueResponse.json();
        setVenue(venueData);

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/reviews?venue.id=${params.id}`);
        if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData['hydra:member']);

        // Fetch bookings
        const bookingsResponse = await fetch(`/api/bookings?venue.id=${params.id}`);
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData['hydra:member']);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          venue: `/api/sport-venues/${params.id}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit review');
      
      // Refresh reviews
      const reviewsResponse = await fetch(`/api/reviews?venue.id=${params.id}`);
      const reviewsData = await reviewsResponse.json();
      setReviews(reviewsData['hydra:member']);
      
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newBooking,
          venue: `/api/sport-venues/${params.id}`,
          status: 'PENDING',
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');
      
      // Refresh bookings
      const bookingsResponse = await fetch(`/api/bookings?venue.id=${params.id}`);
      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData['hydra:member']);
      
      setNewBooking({ startTime: '', endTime: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!venue) return <div className="p-4">Venue not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/venues" className="text-blue-500 hover:underline mb-4 block">
        ← Back to Venues
      </Link>

      {/* Venue Details */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Type:</span>{' '}
              {venue.venueType.charAt(0) + venue.venueType.slice(1).toLowerCase()}
            </p>
            {venue.address && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Address:</span> {venue.address}
              </p>
            )}
            {venue.description && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Description:</span> {venue.description}
              </p>
            )}
            {venue.averageRating && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Rating:</span>{' '}
                <span className="text-yellow-500">★</span> {venue.averageRating.toFixed(1)}
              </p>
            )}
          </div>
          <div>
            {venue.openingTime && venue.closingTime && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Hours:</span>{' '}
                {new Date(venue.openingTime).toLocaleTimeString()} -{' '}
                {new Date(venue.closingTime).toLocaleTimeString()}
              </p>
            )}
            {venue.entranceFee && (
              <p className="text-gray-600 mb-2">
                <span className="font-semibold">Entrance Fee:</span> ${venue.entranceFee}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        
        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Rating</label>
            <select
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Stars
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded p-4">
              <div className="flex items-center mb-2">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="font-semibold">{review.rating}</span>
                <span className="text-gray-500 ml-2">
                  by {review.user.firstName} {review.user.lastName}
                </span>
              </div>
              {review.comment && <p className="text-gray-600">{review.comment}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Bookings Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Book a Time</h2>
        
        {/* Booking Form */}
        <form onSubmit={handleBookingSubmit} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={newBooking.startTime}
                onChange={(e) => setNewBooking({ ...newBooking, startTime: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">End Time</label>
              <input
                type="datetime-local"
                value={newBooking.endTime}
                onChange={(e) => setNewBooking({ ...newBooking, endTime: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Book Now
          </button>
        </form>

        {/* Bookings List */}
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="border rounded p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {new Date(booking.startTime).toLocaleString()} -{' '}
                    {new Date(booking.endTime).toLocaleString()}
                  </p>
                  <p className="text-gray-600">Status: {booking.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 