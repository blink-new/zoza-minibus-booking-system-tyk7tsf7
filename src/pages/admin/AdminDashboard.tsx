import React, { useState, useEffect } from 'react'
import { blink } from '../../blink/client'
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  Route, 
  TrendingUp, 
  Calendar,
  Clock,
  MapPin
} from 'lucide-react'

interface DashboardStats {
  totalBookings: number
  totalRevenue: number
  activeRoutes: number
  totalCustomers: number
  todayBookings: number
  pendingPayments: number
}

interface RecentBooking {
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
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalRevenue: 0,
    activeRoutes: 0,
    totalCustomers: 0,
    todayBookings: 0,
    pendingPayments: 0
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch bookings
        const bookings = await blink.db.bookings.list({
          orderBy: { bookingDate: 'desc' },
          limit: 10
        })

        // Calculate stats
        const totalBookings = bookings.length
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
        const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').length
        
        // Get today's bookings
        const today = new Date().toISOString().split('T')[0]
        const todayBookings = bookings.filter(b => 
          b.bookingDate?.startsWith(today)
        ).length

        setStats({
          totalBookings,
          totalRevenue,
          activeRoutes: 12, // Sample data
          totalCustomers: 156, // Sample data
          todayBookings,
          pendingPayments
        })

        // Format recent bookings
        const formattedBookings: RecentBooking[] = bookings.slice(0, 5).map(booking => {
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
            paymentStatus: booking.paymentStatus || 'pending'
          }
        })

        setRecentBookings(formattedBookings)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      name: 'Total Bookings',
      value: stats.totalBookings,
      icon: BookOpen,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Total Revenue',
      value: `${stats.totalRevenue.toLocaleString()} ETB`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Active Routes',
      value: stats.activeRoutes,
      icon: Route,
      color: 'bg-purple-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-orange-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Today\'s Bookings',
      value: stats.todayBookings,
      icon: Calendar,
      color: 'bg-indigo-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      name: 'Pending Payments',
      value: stats.pendingPayments,
      icon: Clock,
      color: 'bg-red-500',
      change: '-2',
      changeType: 'negative'
    }
  ]

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Zoza Admin</h1>
            <p className="text-gray-600 mt-1">Manage your minibus operations efficiently</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Today</p>
            <p className="text-lg font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                      {booking.route}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.date}</div>
                    <div className="text-sm text-gray-500">{booking.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {booking.amount} ETB
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      View
                    </button>
                    {booking.paymentStatus === 'pending' && (
                      <button className="text-green-600 hover:text-green-800">
                        Send Payment Link
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}