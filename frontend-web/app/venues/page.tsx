'use client';

import { useEffect, useState } from 'react';
import { SportVenue, VenueType } from '@/app/types/venue';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const VENUE_TYPES: VenueType[] = [
  'BASKETBALL',
  'FOOTBALL',
  'TENNIS',
  'SWIMMING',
  'RUNNING',
  'VOLLEYBALL',
  'GOLF',
  'OTHER'
];

export default function VenuesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [venues, setVenues] = useState<SportVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<VenueType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(searchParams);
        const page = params.get('page') || '1';
        const type = params.get('venueType') || '';
        const name = params.get('name') || '';
        
        const response = await fetch(`/api/sport_venues?page=${page}&venueType=${type}&name=${name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        
        const data = await response.json();
        setVenues(data['hydra:member']);
        setTotalItems(data['hydra:totalItems']);
        setCurrentPage(parseInt(page));
        setSelectedType(type as VenueType);
        setSearchQuery(name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedType) params.set('venueType', selectedType);
    if (searchQuery) params.set('name', searchQuery);
    params.set('page', '1');
    router.push(`/venues?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/venues?${params.toString()}`);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sports Venues</h1>
      
      {/* Search and Filter Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as VenueType)}
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            {VENUE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => (
          <Link
            key={venue.id}
            href={`/venues/${venue.id}`}
            className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
            <p className="text-gray-600 mb-2">
              {venue.venueType.charAt(0) + venue.venueType.slice(1).toLowerCase()}
            </p>
            {venue.address && (
              <p className="text-gray-600 mb-2">{venue.address}</p>
            )}
            {venue.averageRating && (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{venue.averageRating.toFixed(1)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from(
            { length: Math.ceil(totalItems / 10) },
            (_, i) => i + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 