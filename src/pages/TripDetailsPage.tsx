import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, MapPin, Users, Star, Phone, Shield, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SeatSelection } from '@/components/booking/SeatSelection'
import { Trip } from '@/types'

export function TripDetailsPage() {
  const { tripId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  const date = searchParams.get('date')

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true)
        
        // Generate sample trip data for demo
        const sampleTrip: Trip = {
          id: tripId || 'trip-1',
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
            departureCity: 'addis-ababa',
            destinationCity: 'bahir-dar',
            departureLocation: 'Meskel Square Terminal',
            destinationLocation: 'Bahir Dar Bus Station',
            distance: 450,
            estimatedDuration: '4h 30m',
            stops: ['Debre Markos', 'Finote Selam'],
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
        }

        setTrip(sampleTrip)
      } catch (error) {
        console.error('Error fetching trip:', error)
      } finally {
        setLoading(false)
      }
    }

    if (tripId && date) {
      fetchTrip()
    }
  }, [tripId, date])

  const handleSeatSelect = (seatNumber: number) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(seat => seat !== seatNumber)
      } else {
        return [...prev, seatNumber]
      }
    })
  }

  const handleProceedToBooking = () => {
    if (selectedSeats.length === 0) return
    
    const searchParams = new URLSearchParams({
      tripId: trip?.id || '',
      date: date || '',
      seats: selectedSeats.join(','),
      price: (trip.price * selectedSeats.length).toString()
    })
    
    navigate(`/booking?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h2>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Back to Search</Button>
        </div>
      </div>
    )
  }

  const availableSeats = trip.totalSeats - trip.bookedSeats
  const bookedSeatNumbers = Array.from({ length: trip.bookedSeats }, (_, i) => i + 1)
  const departureTime = new Date(trip.departureTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const arrivalTime = new Date(trip.arrivalTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Trip Details</h1>
              <p className="text-sm text-gray-600">
                {trip.route.departureLocation} → {trip.route.destinationLocation}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trip Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Trip Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {trip.route.departureLocation} → {trip.route.destinationLocation}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">
                    {availableSeats} seats available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Time and Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{departureTime}</p>
                      <p className="text-sm text-gray-600">{trip.route.departureLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">{arrivalTime}</p>
                      <p className="text-sm text-gray-600">{trip.route.destinationLocation}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{trip.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{trip.route.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{trip.totalSeats} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(date || '').toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stops */}
                {trip.route.stops && trip.route.stops.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Stops along the way</h4>
                      <div className="flex flex-wrap gap-2">
                        {trip.route.stops.map((stop, index) => (
                          <Badge key={index} variant="outline">
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Vehicle & Driver Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Operator</p>
                    <p className="font-medium">{trip.vehicle.operator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{trip.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plate Number</p>
                    <p className="font-medium">{trip.vehicle.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium">{trip.vehicle.capacity} passengers</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Driver Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{trip.driver.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{trip.driver.experience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{trip.driver.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{trip.driver.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Booking Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Cancellation Policy</h4>
                  <p className="text-gray-600">
                    Free cancellation up to 2 hours before departure. 50% refund for cancellations within 2 hours.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Baggage Policy</h4>
                  <p className="text-gray-600">
                    One carry-on bag and one checked bag (up to 20kg) included per passenger.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Check-in</h4>
                  <p className="text-gray-600">
                    Please arrive at the departure location 15 minutes before scheduled departure.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seat Selection & Booking */}
          <div className="space-y-6">
            <SeatSelection
              totalSeats={trip.totalSeats}
              bookedSeats={bookedSeatNumbers}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              maxSeats={4}
            />

            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per seat</span>
                  <span className="font-medium">{trip.price.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected seats</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    {(trip.price * selectedSeats.length).toLocaleString()} ETB
                  </span>
                </div>

                <Button 
                  onClick={handleProceedToBooking}
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  {selectedSeats.length === 0 
                    ? 'Select seats to continue' 
                    : `Book ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}`
                  }
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  You can select up to 4 seats per booking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}