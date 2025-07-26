import React, { useState } from 'react'
import { User, Phone } from 'lucide-react'

interface BookingFormProps {
  selectedSeats: string[]
  totalPrice: number
  onSubmit: (bookingData: BookingData) => void
  onBack: () => void
}

interface BookingData {
  passengers: {
    name: string
    phone: string
    seatNumber: string
  }[]
}

export default function BookingForm({ selectedSeats, totalPrice, onSubmit, onBack }: BookingFormProps) {
  const [passengers, setPassengers] = useState(
    selectedSeats.map(seat => ({
      name: '',
      phone: '',
      seatNumber: seat
    }))
  )
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updatePassenger = (index: number, field: string, value: string) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate form
    const isValid = passengers.every(p => p.name.trim() && p.phone.trim())
    
    if (!isValid) {
      alert('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit({
        passengers
      })
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Booking failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Seat Selection
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Passenger Details</h1>
        <p className="text-gray-600">Please provide details for all passengers</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Passenger Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Passenger Information
          </h2>
          
          {passengers.map((passenger, index) => (
            <div key={passenger.seatNumber} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">
                Seat {passenger.seatNumber} - Passenger {index + 1}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={passenger.name}
                      onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={passenger.phone}
                      onChange={(e) => updatePassenger(index, 'phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Booking Summary
          </h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Selected Seats:</span>
              <span className="font-medium">{selectedSeats.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Passengers:</span>
              <span className="font-medium">{passengers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Price per Seat:</span>
              <span className="font-medium">{(totalPrice / passengers.length).toFixed(0)} ETB</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-600">{totalPrice} ETB</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Payment:</strong> Our admin will send you a payment link via SMS after booking confirmation.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </div>
  )
}