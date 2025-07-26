import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SearchFiltersProps {
  onFiltersChange: (filters: any) => void
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])

  const operators = [
    'Zoza Transport',
    'Ethiopian Minibus Co.',
    'Addis Express',
    'Highland Transport',
    'Blue Nile Lines'
  ]

  const timeSlots = [
    { id: 'early', label: 'Early Morning (5:00 - 9:00)', value: 'early' },
    { id: 'morning', label: 'Morning (9:00 - 12:00)', value: 'morning' },
    { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)', value: 'afternoon' },
    { id: 'evening', label: 'Evening (17:00 - 21:00)', value: 'evening' }
  ]

  const handleOperatorChange = (operator: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedOperators, operator]
      : selectedOperators.filter(op => op !== operator)
    setSelectedOperators(updated)
    onFiltersChange({ operators: updated, priceRange, times: selectedTimes })
  }

  const handleTimeChange = (time: string, checked: boolean) => {
    const updated = checked 
      ? [...selectedTimes, time]
      : selectedTimes.filter(t => t !== time)
    setSelectedTimes(updated)
    onFiltersChange({ operators: selectedOperators, priceRange, times: updated })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({ operators: selectedOperators, priceRange: value, times: selectedTimes })
  }

  const clearFilters = () => {
    setPriceRange([0, 1000])
    setSelectedOperators([])
    setSelectedTimes([])
    onFiltersChange({ operators: [], priceRange: [0, 1000], times: [] })
  }

  const hasActiveFilters = selectedOperators.length > 0 || selectedTimes.length > 0 || 
    priceRange[0] > 0 || priceRange[1] < 1000

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h4 className="font-medium mb-3">Price Range (ETB)</h4>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={handlePriceChange}
              max={1000}
              min={0}
              step={50}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0]} ETB</span>
              <span>{priceRange[1]} ETB</span>
            </div>
          </div>
        </div>

        {/* Departure Time */}
        <div>
          <h4 className="font-medium mb-3">Departure Time</h4>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="flex items-center space-x-2">
                <Checkbox
                  id={slot.id}
                  checked={selectedTimes.includes(slot.value)}
                  onCheckedChange={(checked) => 
                    handleTimeChange(slot.value, checked as boolean)
                  }
                />
                <label 
                  htmlFor={slot.id} 
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {slot.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Operators */}
        <div>
          <h4 className="font-medium mb-3">Operators</h4>
          <div className="space-y-2">
            {operators.map((operator) => (
              <div key={operator} className="flex items-center space-x-2">
                <Checkbox
                  id={operator}
                  checked={selectedOperators.includes(operator)}
                  onCheckedChange={(checked) => 
                    handleOperatorChange(operator, checked as boolean)
                  }
                />
                <label 
                  htmlFor={operator} 
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {operator}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div>
            <h4 className="font-medium mb-2">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {selectedOperators.map((operator) => (
                <Badge key={operator} variant="secondary" className="text-xs">
                  {operator}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleOperatorChange(operator, false)}
                  />
                </Badge>
              ))}
              {selectedTimes.map((time) => (
                <Badge key={time} variant="secondary" className="text-xs">
                  {timeSlots.find(t => t.value === time)?.label.split(' ')[0]}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => handleTimeChange(time, false)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}