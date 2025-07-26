import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { blink } from '../blink/client'
import BookingForm from '../components/booking/BookingForm'
import BookingConfirmation from '../components/booking/BookingConfirmation'

interface BookingData {
  passengers: {
    name: string
    phone: string
    seatNumber: string
  }[]
}

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<'booking' | 'confirmation'>('booking')
  const [bookingId, setBookingId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [tripDetails, setTripDetails] = useState<any>(null)

  const tripId = searchParams.get('tripId')
  const date = searchParams.get('date')
  const selectedSeats = useMemo(() => searchParams.get('seats')?.split(',') || [], [searchParams])
  const totalPrice = parseInt(searchParams.get('price') || '0')

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true)
        
        // Generate sample trip data for demo
        const sampleTrip = {
          id: tripId || 'trip-1',
          from: 'Addis Ababa',
          to: 'Bahir Dar',
          date: date || new Date().toISOString().split('T')[0],
          time: '06:00 AM',
          duration: '4h 30m',
          vehicle: 'Toyota Hiace - AA-123-456',
          driver: 'Abebe Kebede',
          price: 450
        }

        setTripDetails(sampleTrip)
      } catch (error) {
        console.error('Error fetching trip details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (tripId && date && selectedSeats.length > 0) {
      fetchTripDetails()
    } else {
      navigate('/')
    }
  }, [tripId, date, selectedSeats, navigate])

  const handleBookingSubmit = async (bookingData: BookingData) => {
    try {
      // Get current user
      const user = await blink.auth.me()
      
      // Generate booking ID
      const newBookingId = `BK${Date.now()}`
      
      // Create booking record in database
      await blink.db.bookings.create({
        id: newBookingId,
        userId: user.id,
        tripId: tripId || '',
        seatNumbers: selectedSeats.join(','),
        totalAmount: totalPrice,
        paymentMethod: 'pending', // Admin will send payment link later
        paymentStatus: 'pending',
        status: 'confirmed',
        passengerDetails: JSON.stringify(bookingData.passengers),
        bookingDate: new Date().toISOString(),
        travelDate: date || new Date().toISOString()
      })

      // Update trip seat availability (in a real app, this would be handled server-side)
      // For demo purposes, we'll skip this step

      setBookingId(newBookingId)
      setCurrentStep('confirmation')
      
      // Send confirmation notifications (placeholder)
      console.log('Booking confirmed:', newBookingId)
      
    } catch (error) {
      console.error('Booking failed:', error)
      throw error
    }
  }

  const handleNewBooking = () => {
    navigate('/')
  }

  const handleBackToSeatSelection = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (!tripDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Booking</h2>
          <p className="text-gray-600 mb-4">Please select seats from a valid trip.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'booking' && (
        <BookingForm
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onSubmit={handleBookingSubmit}
          onBack={handleBackToSeatSelection}
        />
      )}

      {currentStep === 'confirmation' && (
        <BookingConfirmation
          bookingId={bookingId}
          tripDetails={tripDetails}
          passengers={[]} // This would be populated from the booking form
          totalAmount={totalPrice}
          paymentMethod="pending"
          onNewBooking={handleNewBooking}
        />
      )}
    </div>
  )
}