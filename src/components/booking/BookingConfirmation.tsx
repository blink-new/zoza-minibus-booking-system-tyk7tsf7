import React from 'react'
import { CheckCircle, Download, Mail, MessageSquare, Calendar, MapPin, Users, CreditCard } from 'lucide-react'

interface BookingConfirmationProps {
  bookingId: string
  tripDetails: {
    from: string
    to: string
    date: string
    time: string
    duration: string
    vehicle: string
    driver: string
  }
  passengers: {
    name: string
    phone: string
    email: string
    seatNumber: string
  }[]
  totalAmount: number
  paymentMethod: string
  onNewBooking: () => void
}

export default function BookingConfirmation({
  bookingId,
  tripDetails,
  passengers,
  totalAmount,
  paymentMethod,
  onNewBooking
}: BookingConfirmationProps) {
  const handleDownloadTicket = () => {
    // In a real app, this would generate and download a PDF ticket
    alert('Ticket download functionality will be implemented with PDF generation')
  }

  const handleSendSMS = () => {
    // In a real app, this would send SMS confirmation
    alert('SMS confirmation sent to all passengers!')
  }

  const handleSendEmail = () => {
    // In a real app, this would send email confirmation
    alert('Email confirmation sent to all passengers!')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your minibus trip has been successfully booked</p>
        <div className="mt-4 inline-block bg-blue-50 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">Booking ID: </span>
          <span className="font-mono font-semibold text-blue-600">{bookingId}</span>
        </div>
      </div>

      {/* Trip Details Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Trip Details
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Route:</span>
                <p className="font-medium">{tripDetails.from} → {tripDetails.to}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Date & Time:</span>
                <p className="font-medium">{tripDetails.date} at {tripDetails.time}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Vehicle:</span>
                <p className="font-medium">{tripDetails.vehicle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <span className="text-sm text-gray-600">Payment:</span>
                <p className="font-medium capitalize">{paymentMethod.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Details Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-600" />
          Passenger Details
        </h2>
        
        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{passenger.seatNumber}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{passenger.name}</p>
                  <p className="text-sm text-gray-600">{passenger.phone} • {passenger.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Seat {passenger.seatNumber}</p>
                <p className="font-medium">{(totalAmount / passengers.length).toFixed(0)} ETB</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <span className="text-2xl font-bold text-blue-600">{totalAmount} ETB</span>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Payment & Important Information</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Payment:</strong> Our admin will send you a payment link via SMS shortly</li>
          <li>• Please arrive at the departure location 15 minutes before departure time</li>
          <li>• Bring a valid ID for verification</li>
          <li>• Keep your booking confirmation for reference</li>
          <li>• Contact our support team if you need to make any changes</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={handleDownloadTicket}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download Ticket</span>
        </button>
        
        <button
          onClick={handleSendEmail}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Mail className="h-4 w-4" />
          <span>Send Email</span>
        </button>
        
        <button
          onClick={handleSendSMS}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Send SMS</span>
        </button>
        
        <button
          onClick={onNewBooking}
          className="flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span>New Booking</span>
        </button>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Customer Support:</p>
            <p className="font-medium">+251 911 123 456</p>
          </div>
          <div>
            <p className="text-gray-600">Email Support:</p>
            <p className="font-medium">support@zoza.et</p>
          </div>
        </div>
      </div>
    </div>
  )
}