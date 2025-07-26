import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Car } from 'lucide-react'

interface SeatSelectionProps {
  totalSeats: number
  bookedSeats: number[]
  selectedSeats: number[]
  onSeatSelect: (seatNumber: number) => void
  maxSeats?: number
}

export function SeatSelection({ 
  totalSeats, 
  bookedSeats, 
  selectedSeats, 
  onSeatSelect,
  maxSeats = 4 
}: SeatSelectionProps) {
  const generateSeatLayout = () => {
    const seats = []
    const seatsPerRow = 4 // 2 seats on each side of aisle
    const rows = Math.ceil(totalSeats / seatsPerRow)

    for (let row = 0; row < rows; row++) {
      const rowSeats = []
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatNumber = row * seatsPerRow + seat + 1
        if (seatNumber <= totalSeats) {
          rowSeats.push(seatNumber)
        }
      }
      seats.push(rowSeats)
    }
    return seats
  }

  const getSeatStatus = (seatNumber: number) => {
    if (bookedSeats.includes(seatNumber)) return 'booked'
    if (selectedSeats.includes(seatNumber)) return 'selected'
    return 'available'
  }

  const getSeatColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-red-500 text-white cursor-not-allowed'
      case 'selected': return 'bg-blue-600 text-white cursor-pointer'
      case 'available': return 'bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700'
      default: return 'bg-gray-200'
    }
  }

  const handleSeatClick = (seatNumber: number) => {
    const status = getSeatStatus(seatNumber)
    if (status === 'booked') return

    if (status === 'selected') {
      onSeatSelect(seatNumber) // Deselect
    } else if (selectedSeats.length < maxSeats) {
      onSeatSelect(seatNumber) // Select
    }
  }

  const seatLayout = generateSeatLayout()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Select Your Seats</span>
          <Badge variant="secondary">
            {selectedSeats.length}/{maxSeats} selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Booked</span>
          </div>
        </div>

        {/* Minibus Layout */}
        <div className="max-w-md mx-auto">
          {/* Driver Section */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-8 bg-gray-800 text-white rounded-t-lg">
              <Car className="w-4 h-4" />
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-2">
            {seatLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2">
                {/* Left side seats */}
                <div className="flex gap-1">
                  {row.slice(0, 2).map((seatNumber) => {
                    const status = getSeatStatus(seatNumber)
                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={status === 'booked'}
                        className={`
                          w-10 h-10 rounded flex items-center justify-center text-xs font-medium
                          transition-colors duration-200 border-2 border-transparent
                          ${getSeatColor(status)}
                          ${status === 'selected' ? 'border-blue-800' : ''}
                        `}
                        title={`Seat ${seatNumber} - ${status}`}
                      >
                        {status === 'booked' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          seatNumber
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Aisle */}
                <div className="w-6"></div>

                {/* Right side seats */}
                <div className="flex gap-1">
                  {row.slice(2, 4).map((seatNumber) => {
                    if (seatNumber > totalSeats) return null
                    const status = getSeatStatus(seatNumber)
                    return (
                      <button
                        key={seatNumber}
                        onClick={() => handleSeatClick(seatNumber)}
                        disabled={status === 'booked'}
                        className={`
                          w-10 h-10 rounded flex items-center justify-center text-xs font-medium
                          transition-colors duration-200 border-2 border-transparent
                          ${getSeatColor(status)}
                          ${status === 'selected' ? 'border-blue-800' : ''}
                        `}
                        title={`Seat ${seatNumber} - ${status}`}
                      >
                        {status === 'booked' ? (
                          <User className="w-3 h-3" />
                        ) : (
                          seatNumber
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Door indicator */}
          <div className="flex justify-center mt-4">
            <div className="w-16 h-2 bg-gray-300 rounded-b-lg"></div>
          </div>
        </div>

        {/* Selected Seats Summary */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Selected Seats:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <Badge key={seat} className="bg-blue-600 text-white">
                  Seat {seat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Seat Selection Limit Warning */}
        {selectedSeats.length >= maxSeats && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              Maximum {maxSeats} seats can be selected per booking.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}