// Dummy API for demo. Replace with real API call.
export async function fetchCommunityProperties() {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 800))

  return [
    {
      id: 1,
      title: 'Tokyo Central Hotel',
      image: '/images/hotels/tokyo-central.jpg',
      price: 120,
      rating: 4.7,
      lat: 35.6895,
      lng: 139.6917,
      type: 'hotel',
      amenities: ['wifi', 'parking', 'pool'],
      availableDates: ['2026-03-20', '2026-04-10']
    },
    {
      id: 2,
      title: 'Shibuya Cozy Rental',
      image: '/images/rentals/shibuya-cozy.jpg',
      price: 80,
      rating: 4.3,
      lat: 35.6618,
      lng: 139.7041,
      type: 'rental',
      amenities: ['wifi', 'kitchen', 'pets-allowed'],
      availableDates: ['2026-03-25', '2026-04-15']
    },
    {
      id: 3,
      title: 'Osaka Riverside Rental',
      image: '/images/rentals/osaka-riverside.jpg',
      price: 95,
      rating: 4.5,
      lat: 34.6937,
      lng: 135.5023,
      type: 'rental',
      amenities: ['wifi', 'parking', 'gym'],
      availableDates: ['2026-03-28', '2026-04-20']
    },
    {
      id: 4,
      title: 'Kyoto Zen Hotel',
      image: '/images/hotels/kyoto-zen.jpg',
      price: 150,
      rating: 4.9,
      lat: 35.0116,
      lng: 135.7681,
      type: 'hotel',
      amenities: ['wifi', 'pool', 'gym'],
      availableDates: ['2026-03-22', '2026-04-18']
    }
  ]
}
