import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Search, MapPin, Calendar, Bus } from 'lucide-react'
import { blink } from '@/blink/client'
import type { City, TripSearchParams } from '@/types'

interface TripSearchFormProps {
  onSearch: (params: TripSearchParams) => void
  loading?: boolean
}

export function TripSearchForm({ onSearch, loading = false }: TripSearchFormProps) {
  const [cities, setCities] = useState<City[]>([])
  const [searchParams, setSearchParams] = useState<TripSearchParams>({
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    vehicleType: 'any'
  })

  const loadCities = async () => {
    try {
      const citiesData = await blink.db.cities.list({
        orderBy: { name: 'asc' }
      })
      setCities(citiesData)
    } catch (error) {
      console.error('Failed to load cities:', error)
    }
  }

  useEffect(() => {
    loadCities()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchParams.departureCity && searchParams.destinationCity && searchParams.departureDate) {
      onSearch(searchParams)
    }
  }

  const handleSwapCities = () => {
    setSearchParams(prev => ({
      ...prev,
      departureCity: prev.destinationCity,
      destinationCity: prev.departureCity
    }))
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Departure City */}
            <div className="space-y-2">
              <Label htmlFor="departure" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                From
              </Label>
              <Select
                value={searchParams.departureCity}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, departureCity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select departure location" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination City */}
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                To
              </Label>
              <div className="relative">
                <Select
                  value={searchParams.destinationCity}
                  onValueChange={(value) => setSearchParams(prev => ({ ...prev, destinationCity: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination location" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.filter(city => city.id !== searchParams.departureCity).map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {searchParams.departureCity && searchParams.destinationCity && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute -right-12 top-0 h-full px-2"
                    onClick={handleSwapCities}
                  >
                    ⇄
                  </Button>
                )}
              </div>
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Date
              </Label>
              <Input
                type="date"
                min={today}
                value={searchParams.departureDate}
                onChange={(e) => setSearchParams(prev => ({ ...prev, departureDate: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Vehicle Type (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-sm font-medium flex items-center gap-2">
                <Bus className="h-4 w-4 text-accent" />
                Vehicle Type
              </Label>
              <Select
                value={searchParams.vehicleType}
                onValueChange={(value) => setSearchParams(prev => ({ ...prev, vehicleType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any vehicle</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="coaster">Coaster</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              size="lg"
              className="px-8 py-3 text-base font-medium"
              disabled={loading || !searchParams.departureCity || !searchParams.destinationCity || !searchParams.departureDate}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Search Trips
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}