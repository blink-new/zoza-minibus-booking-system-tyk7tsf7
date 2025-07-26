export interface User {
  id: string
  email: string
  phone?: string
  fullName: string
  createdAt: string
  updatedAt: string
  isAdmin: boolean
  userId: string
}

export interface City {
  id: string
  name: string
  region?: string
  createdAt: string
  userId: string
}

export interface Route {
  id: string
  name: string
  departureCityId: string
  destinationCityId: string
  distanceKm?: number
  estimatedDurationMinutes?: number
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Vehicle {
  id: string
  plateNumber: string
  model: string
  capacity: number
  vehicleType: string
  status: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Driver {
  id: string
  fullName: string
  phone: string
  licenseNumber: string
  experienceYears: number
  status: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Trip {
  id: string
  routeId: string
  vehicleId: string
  driverId: string
  departureTime: string
  arrivalTime?: string
  priceBirr: number
  availableSeats: number
  totalSeats: number
  status: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Booking {
  id: string
  tripId: string
  passengerName: string
  passengerPhone: string
  passengerEmail?: string
  seatNumber: number
  bookingStatus: string
  paymentStatus: string
  paymentMethod: string
  totalAmount: number
  bookingDate: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface TripSearchParams {
  departureCity: string
  destinationCity: string
  departureDate: string
  vehicleType?: string
}

export interface TripWithDetails extends Trip {
  route: Route & {
    departureCity: City
    destinationCity: City
  }
  vehicle: Vehicle
  driver: Driver
}