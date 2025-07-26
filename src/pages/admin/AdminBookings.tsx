import React, { useState, useEffect } from 'react'
import { blink } from '../../blink/client'
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Send, 
  Phone,
  MapPin,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react'

interface Booking {
  id: string
  customerName: string
  customerPhone: string
  route: string
  date: string
  time: string
  seats: string
  amount: number
  status: string
  paymentStatus: string
  bookingDate: string
  passengerCount: number
}

interface NewBookingForm {
  customerName: string
  customerPhone: string
  fromLocation: string
  toLocation: string
  travelDate: string
  selectedSeats: string[]
  notes: string
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [showNewBookingModal, setShowNewBookingModal] = useState(false)
  const [newBooking, setNewBooking] = useState<NewBookingForm>({
    customerName: '',
    customerPhone: '',
    fromLocation: '',
    toLocation: '',
    travelDate: '',
    selectedSeats: [],
    notes: ''
  })

  const locations = [
    'Merkato', 'Bole', 'Piazza', 'Megenagna', '4 Kilo', 'Kality', 
    'Stadium', 'Gerji', 'CMC', 'Kazanchis', 'Arat Kilo', 'Mexico'
  ]

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const bookingsData = await blink.db.bookings.list({
        orderBy: { bookingDate: 'desc' },
        limit: 100
      })

      const formattedBookings: Booking[] = bookingsData.map(booking => {
        const passengerDetails = booking.passengerDetails ? 
          JSON.parse(booking.passengerDetails) : [{ name: 'Unknown', phone: 'N/A' }]
        const firstPassenger = passengerDetails[0] || { name: 'Unknown', phone: 'N/A' }
        
        return {
          id: booking.id,
          customerName: firstPassenger.name,
          customerPhone: firstPassenger.phone,
          route: 'Merkato → Bole', // Sample route
          date: new Date(booking.travelDate || booking.bookingDate).toLocaleDateString(),
          time: '08:30 AM', // Sample time
          seats: booking.seatNumbers || 'N/A',
          amount: booking.totalAmount || 0,
          status: booking.status || 'confirmed',
          paymentStatus: booking.paymentStatus || 'pending',
          bookingDate: new Date(booking.bookingDate).toLocaleDateString(),
          passengerCount: passengerDetails.length
        }
      })

      setBookings(formattedBookings)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleNewBooking = async () => {
    try {
      if (!newBooking.customerName || !newBooking.customerPhone || 
          !newBooking.fromLocation || !newBooking.toLocation || 
          !newBooking.travelDate || newBooking.selectedSeats.length === 0) {
        alert('Please fill in all required fields')
        return
      }

      const bookingId = `BK${Date.now()}`
      const totalAmount = newBooking.selectedSeats.length * 15 // 15 ETB per seat

      // Create passenger details
      const passengerDetails = newBooking.selectedSeats.map((seat, index) => ({
        name: index === 0 ? newBooking.customerName : `Passenger ${index + 1}`,
        phone: newBooking.customerPhone,
        seatNumber: seat
      }))

      await blink.db.bookings.create({
        id: bookingId,
        userId: 'admin', // Admin booking
        tripId: 'admin-booking',
        seatNumbers: newBooking.selectedSeats.join(','),
        totalAmount,
        paymentMethod: 'pending',
        paymentStatus: 'pending',
        status: 'confirmed',
        passengerDetails: JSON.stringify(passengerDetails),
        bookingDate: new Date().toISOString(),
        travelDate: new Date(newBooking.travelDate).toISOString(),
        notes: newBooking.notes
      })

      // Reset form and close modal
      setNewBooking({
        customerName: '',
        customerPhone: '',
        fromLocation: '',
        toLocation: '',
        travelDate: '',
        selectedSeats: [],
        notes: ''
      })
      setShowNewBookingModal(false)
      
      // Refresh bookings
      fetchBookings()
      
      alert(`Booking ${bookingId} created successfully!`)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  const handleSendPaymentLink = async (bookingId: string, phone: string) => {
    // In a real app, this would integrate with SMS service
    alert(`Payment link sent to ${phone} for booking ${bookingId}`)
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerPhone.includes(searchTerm) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusStyles = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
  }

  const toggleSeatSelection = (seat: string) => {
    setNewBooking(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.includes(seat)
        ? prev.selectedSeats.filter(s => s !== seat)
        : [...prev.selectedSeats, seat]
    }))
  }

  const generateSeats = () => {
    const seats = []
    for (let i = 1; i <= 20; i++) {
      seats.push(i.toString())
    }
    return seats
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600 mt-1">Manage all customer bookings and create new ones</p>
        </div>
        <button
          onClick={() => setShowNewBookingModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                    <div className="text-sm text-gray-500">Booked: {booking.bookingDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.customerPhone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.route}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>{booking.date}</div>
                        <div className="text-gray-500">{booking.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="h-4 w-4 mr-1 text-gray-400" />
                      <div>
                        <div>{booking.seats}</div>
                        <div className="text-gray-500">{booking.passengerCount} passenger(s)</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.amount} ETB
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Eye className="h-4 w-4" />
                      </button>
                      {booking.paymentStatus === 'pending' && (
                        <button
                          onClick={() => handleSendPaymentLink(booking.id, booking.customerPhone)}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Send Payment Link"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowNewBookingModal(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Booking</h3>
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={newBooking.customerName}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={newBooking.customerPhone}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+251 9XX XXX XXX"
                    />
                  </div>
                </div>

                {/* Route Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Location *
                    </label>
                    <select
                      value={newBooking.fromLocation}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, fromLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Location *
                    </label>
                    <select
                      value={newBooking.toLocation}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, toLocation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Travel Date *
                    </label>
                    <input
                      type="date"
                      value={newBooking.travelDate}
                      onChange={(e) => setNewBooking(prev => ({ ...prev, travelDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Seat Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Seats * ({newBooking.selectedSeats.length} selected)
                  </label>
                  <div className="grid grid-cols-5 gap-2 max-w-md">
                    {generateSeats().map(seat => (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => toggleSeatSelection(seat)}
                        className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
                          newBooking.selectedSeats.includes(seat)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={newBooking.notes}
                    onChange={(e) => setNewBooking(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional notes..."
                  />
                </div>

                {/* Summary */}
                {newBooking.selectedSeats.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Booking Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>Route: {newBooking.fromLocation} → {newBooking.toLocation}</div>
                      <div>Seats: {newBooking.selectedSeats.join(', ')}</div>
                      <div>Total Amount: {newBooking.selectedSeats.length * 15} ETB</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNewBooking}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}