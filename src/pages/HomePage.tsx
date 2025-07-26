import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TripSearchForm } from '@/components/search/TripSearchForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MapPin, Users, Star } from 'lucide-react'
import type { TripSearchParams } from '@/types'

export function HomePage() {
  const [searchLoading, setSearchLoading] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (params: TripSearchParams) => {
    setSearchLoading(true)
    
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false)
      
      // Navigate to search results with query parameters
      const searchParams = new URLSearchParams({
        departure: params.departureCity,
        destination: params.destinationCity,
        date: params.departureDate,
        ...(params.vehicleType && { vehicleType: params.vehicleType })
      })
      
      navigate(`/search?${searchParams.toString()}`)
    }, 1000)
  }

  // Sample featured routes for display (Addis Ababa intra-city routes)
  const featuredRoutes = [
    {
      id: '1',
      from: 'Merkato',
      to: 'Bole',
      price: 15,
      duration: '35 min',
      rating: 4.8,
      trips: 24
    },
    {
      id: '2',
      from: 'Piazza',
      to: 'Megenagna',
      price: 12,
      duration: '25 min',
      rating: 4.6,
      trips: 18
    },
    {
      id: '3',
      from: '4 Kilo',
      to: 'Kality',
      price: 20,
      duration: '40 min',
      rating: 4.7,
      trips: 15
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Travel Addis Ababa with{' '}
            <span className="text-primary">Zoza</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Book scheduled minibus trips across Addis Ababa locations. Safe, reliable, and affordable transportation within the city.
          </p>
          
          {/* Search Form */}
          <div className="mb-16">
            <TripSearchForm onSearch={handleSearch} loading={searchLoading} />
          </div>
        </div>
      </section>

      {/* Featured Routes Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Routes</h2>
            <p className="text-gray-600">Discover the most traveled routes within Addis Ababa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRoutes.map((route) => (
              <Card key={route.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-gray-900">
                        {route.from} → {route.to}
                      </span>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent-foreground">
                      {route.trips} scheduled trips
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{route.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{route.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-2xl font-bold text-primary">
                        {route.price} <span className="text-sm font-normal text-gray-500">ETB</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">15-25 seats</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Zoza?</h2>
            <p className="text-gray-600">Experience the best in Addis Ababa minibus transportation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">On-Time Departure</h3>
              <p className="text-gray-600 text-sm">Reliable schedules you can count on</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comfortable Seating</h3>
              <p className="text-gray-600 text-sm">Modern minibuses with quality seats</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wide Coverage</h3>
              <p className="text-gray-600 text-sm">Routes to all major Addis Ababa locations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trusted Service</h3>
              <p className="text-gray-600 text-sm">Highly rated by thousands of passengers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}