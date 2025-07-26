import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { SearchResultsPage } from '@/pages/SearchResultsPage'
import { TripDetailsPage } from '@/pages/TripDetailsPage'
import BookingPage from './pages/BookingPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBookings from './pages/admin/AdminBookings'
import { Toaster } from '@/components/ui/toaster'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <main><HomePage /></main>
            </>
          } />
          <Route path="/search" element={
            <>
              <Header />
              <main><SearchResultsPage /></main>
            </>
          } />
          <Route path="/trip/:tripId" element={
            <>
              <Header />
              <main><TripDetailsPage /></main>
            </>
          } />
          <Route path="/booking" element={
            <>
              <Header />
              <main><BookingPage /></main>
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/bookings" element={
            <AdminLayout>
              <AdminBookings />
            </AdminLayout>
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App