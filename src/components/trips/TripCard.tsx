import { Clock, MapPin, Users, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trip } from '@/types'

interface TripCardProps {
  trip: Trip
  onSelect: (trip: Trip) => void
}

export function TripCard({ trip, onSelect }: TripCardProps) {
  const availableSeats = trip.totalSeats - trip.bookedSeats
  const departureTime = new Date(trip.departureTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  const arrivalTime = new Date(trip.arrivalTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-600">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Trip Info */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{departureTime}</span>
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{trip.route.departureLocation}</span>
              </div>
              <div className="hidden lg:block w-8 h-px bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{arrivalTime}</span>
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{trip.route.destinationLocation}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{trip.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{availableSeats} seats left</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm text-gray-600">Operator: </span>
              <span className="font-medium text-gray-900">{trip.vehicle.operator}</span>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex flex-col items-end gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {trip.price.toLocaleString()} ETB
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
            
            <div className="flex gap-2">
              <Badge 
                variant={availableSeats > 5 ? "default" : "destructive"}
                className={availableSeats > 5 ? "bg-green-100 text-green-800" : ""}
              >
                {availableSeats > 5 ? "Available" : "Few seats left"}
              </Badge>
            </div>

            <Button 
              onClick={() => onSelect(trip)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              disabled={availableSeats === 0}
            >
              {availableSeats === 0 ? "Sold Out" : "Select Trip"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}