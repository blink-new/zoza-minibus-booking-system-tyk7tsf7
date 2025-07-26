import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TripCard } from '@/components/trips/TripCard'
import { SearchFilters } from '@/components/trips/SearchFilters'
import { blink } from '@/blink/client'
import { Trip, City } from '@/types'

export function SearchResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [departureCity, setDepartureCity] = useState<City | null>(null)
  const [destinationCity, setDestinationCity] = useState<City | null>(null)

  const departure = searchParams.get('departure')
  const destination = searchParams.get('destination')
  const date = searchParams.get('date')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch cities
        const cities = await blink.db.cities.list()
        const depCity = cities.find(c => c.id === departure)
        const destCity = cities.find(c => c.id === destination)
        setDepartureCity(depCity || null)
        setDestinationCity(destCity || null)

        // Generate sample trips for demo
        const sampleTrips: Trip[] = [
          {
            id: 'trip-1',
            routeId: 'route-1',
            vehicleId: 'vehicle-1',
            driverId: 'driver-1',
            departureTime: new Date(`${date}T06:00:00`).toISOString(),
            arrivalTime: new Date(`${date}T10:30:00`).toISOString(),
            price: 450,
            totalSeats: 20,
            bookedSeats: 12,
            status: 'scheduled',
            estimatedDuration: '4h 30m',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            route: {
              id: 'route-1',
              departureCity: departure || '',
              destinationCity: destination || '',
              departureLocation: depCity?.name || 'Departure',
              destinationLocation: destCity?.name || 'Destination',
              distance: 450,
              estimatedDuration: '4h 30m',
              stops: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            vehicle: {
              id: 'vehicle-1',
              plateNumber: 'AA-123-456',
              model: 'Toyota Hiace',
              capacity: 20,
              operator: 'Zoza Transport',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            driver: {
              id: 'driver-1',
              name: 'Abebe Kebede',
              phone: '+251911234567',
              licenseNumber: 'DL-123456',
              experience: 8,
              rating: 4.8,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          {
            id: 'trip-2',
            routeId: 'route-1',
            vehicleId: 'vehicle-2',
            driverId: 'driver-2',
            departureTime: new Date(`${date}T08:30:00`).toISOString(),
            arrivalTime: new Date(`${date}T13:00:00`).toISOString(),
            price: 380,
            totalSeats: 18,
            bookedSeats: 15,
            status: 'scheduled',
            estimatedDuration: '4h 30m',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            route: {
              id: 'route-1',
              departureCity: departure || '',
              destinationCity: destination || '',
              departureLocation: depCity?.name || 'Departure',
              destinationLocation: destCity?.name || 'Destination',
              distance: 450,
              estimatedDuration: '4h 30m',
              stops: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            vehicle: {
              id: 'vehicle-2',
              plateNumber: 'AA-789-012',
              model: 'Nissan Urvan',
              capacity: 18,
              operator: 'Ethiopian Minibus Co.',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            driver: {
              id: 'driver-2',
              name: 'Mulugeta Tadesse',
              phone: '+251922345678',
              licenseNumber: 'DL-789012',
              experience: 12,
              rating: 4.9,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          },
          {
            id: 'trip-3',
            routeId: 'route-1',
            vehicleId: 'vehicle-3',
            driverId: 'driver-3',
            departureTime: new Date(`${date}T14:00:00`).toISOString(),
            arrivalTime: new Date(`${date}T18:30:00`).toISOString(),
            price: 520,
            totalSeats: 22,
            bookedSeats: 8,
            status: 'scheduled',
            estimatedDuration: '4h 30m',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            route: {
              id: 'route-1',
              departureCity: departure || '',
              destinationCity: destination || '',
              departureLocation: depCity?.name || 'Departure',
              destinationLocation: destCity?.name || 'Destination',
              distance: 450,
              estimatedDuration: '4h 30m',
              stops: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            vehicle: {
              id: 'vehicle-3',
              plateNumber: 'AA-345-678',
              model: 'Mercedes Sprinter',
              capacity: 22,
              operator: 'Addis Express',
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            driver: {
              id: 'driver-3',
              name: 'Dawit Haile',
              phone: '+251933456789',
              licenseNumber: 'DL-345678',
              experience: 6,
              rating: 4.7,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        ]

        setTrips(sampleTrips)
        setFilteredTrips(sampleTrips)
      } catch (error) {
        console.error('Error fetching trips:', error)
      } finally {
        setLoading(false)
      }
    }

    if (departure && destination && date) {
      fetchData()
    }
  }, [departure, destination, date])

  const handleFiltersChange = (filters: any) => {
    let filtered = [...trips]

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter(trip => 
        trip.price >= filters.priceRange[0] && trip.price <= filters.priceRange[1]
      )
    }

    // Operator filter
    if (filters.operators && filters.operators.length > 0) {
      filtered = filtered.filter(trip => 
        filters.operators.includes(trip.vehicle.operator)
      )
    }

    // Time filter
    if (filters.times && filters.times.length > 0) {
      filtered = filtered.filter(trip => {
        const hour = new Date(trip.departureTime).getHours()
        return filters.times.some((timeSlot: string) => {
          switch (timeSlot) {
            case 'early': return hour >= 5 && hour < 9
            case 'morning': return hour >= 9 && hour < 12
            case 'afternoon': return hour >= 12 && hour < 17
            case 'evening': return hour >= 17 && hour < 21
            default: return true
          }
        })
      })
    }

    setFilteredTrips(filtered)
  }

  const handleTripSelect = (trip: Trip) => {
    navigate(`/trip/${trip.id}?date=${date}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
              
              <div className="hidden md:flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{departureCity?.name}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-medium">{destinationCity?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(date || '').toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {filteredTrips.length} trips found
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Mobile trip info */}
          <div className="md:hidden mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{departureCity?.name}</span>
                <span className="text-gray-400">→</span>
                <span className="font-medium">{destinationCity?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(date || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Trip Results */}
          <div className="lg:col-span-3">
            {filteredTrips.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search for a different date.
                </p>
                <Button onClick={() => navigate('/')} variant="outline">
                  New Search
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Available Trips
                  </h2>
                  <div className="text-sm text-gray-600">
                    Showing {filteredTrips.length} of {trips.length} trips
                  </div>
                </div>

                {filteredTrips.map((trip) => (
                  <TripCard 
                    key={trip.id} 
                    trip={trip} 
                    onSelect={handleTripSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}