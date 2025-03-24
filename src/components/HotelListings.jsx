"use client"

import { useState } from "react"
import { useGetHotelsQuery } from "@/lib/api"
import HotelCard, { HotelCardSkeleton } from "./HotelCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Hotel, Search, SlidersHorizontal, ArrowUpDown, MapPin, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import BlurText from "@/components/ui/BlurText"
import Description from "@/components/TravelStatus"


export default function HotelListings() {
  const { data: hotels = [], isLoading, isError, error, refetch } = useGetHotelsQuery()

  // Locations derived from hotel data with counts
  const getLocations = () => {
    if (!hotels || hotels.length === 0) return [{ name: "ALL", count: 0 }]

    const locationCounts = hotels.reduce((acc, hotel) => {
      const location = hotel.location.split(",")[0].trim() // Get first part of location (city)
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {})

    const locations = [
      { name: "ALL", count: hotels.length },
      ...Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
    ]

    return locations
  }

  const locations = isLoading
    ? [
        { name: "ALL", count: 0 },
        { name: "France", count: 0 },
        { name: "Italy", count: 0 },
        { name: "Australia", count: 0 },
        { name: "Japan", count: 0 },
      ]
    : getLocations()

  const [selectedLocation, setSelectedLocation] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("recommended")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [minRating, setMinRating] = useState("")

  // Filter hotels based on all criteria
  const filteredHotels = !hotels
    ? []
    : hotels
        .filter((hotel) => {
          // Location filter
          const locationMatch =
            selectedLocation === "ALL" || hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())

          // Search query filter
          const searchMatch =
            !searchQuery ||
            hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hotel.location.toLowerCase().includes(searchQuery.toLowerCase())

          // Price range filter
          const priceMatch =
            (!priceRange.min || hotel.price >= Number(priceRange.min)) &&
            (!priceRange.max || hotel.price <= Number(priceRange.max))

          // Rating filter
          const ratingMatch = !minRating || hotel.rating >= Number(minRating)

          return locationMatch && searchMatch && priceMatch && ratingMatch
        })
        .sort((a, b) => {
          switch (sortOption) {
            case "price-low":
              return a.price - b.price
            case "price-high":
              return b.price - a.price
            case "rating":
              return b.rating - a.rating
            default: // recommended
              return 0 // No specific sorting
          }
        })

  // Reset filters
  const handleResetFilters = () => {
    setSelectedLocation("ALL")
    setSearchQuery("")
    setSortOption("recommended")
    setPriceRange({ min: "", max: "" })
    setMinRating("")
  }

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };  

  // Animation variants for hotel cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 mb-2">
          <Hotel className="h-6 w-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold">Top trending hotels worldwide</h2>
        </div>
        <BlurText
          text="Discover the most trending hotels worldwide for an unforgettable experience. Filter by location, price, and
          more to find your perfect stay!"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-[20px] mb-8 text-muted-foreground font-light "
        />
      </div>


      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search hotels by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border rounded-lg bg-muted/30 animate-in slide-in-from-top">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-grow">
              <label className="text-sm font-medium">Price Range</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-24"
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-24"
                />
              </div>
            </div>

            <div className="space-y-2 w-full md:w-48">
              <label className="text-sm font-medium">Minimum Rating</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      )}

      {/* Location Tabs */}
      <Tabs value={selectedLocation} onValueChange={setSelectedLocation} className="mb-6">
        <TabsList className="bg-muted/50 p-1 h-auto flex flex-nowrap overflow-x-auto hide-scrollbar">
          {locations.map((location) => (
            <TabsTrigger
              key={location.name}
              value={location.name}
              className="flex items-center gap-2 py-2 px-4 data-[state=active]:bg-background"
            >
              {location.name === "ALL" ? <Hotel className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {location.name}
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {location.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
  
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, index) => (
              <HotelCardSkeleton key={index} />
            ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading hotels</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>There was a problem loading the hotel listings. Please try again.</p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="w-fit">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Results Count */}
      {!isLoading && !isError && (
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredHotels.length} {filteredHotels.length === 1 ? "hotel" : "hotels"}
          {selectedLocation !== "ALL" && ` in ${selectedLocation}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Hotel Cards */}
      {!isLoading && !isError && (
        <>
          {filteredHotels.length > 0 ? (
            <AnimatePresence>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredHotels.map((hotel) => (
                  <motion.div key={hotel._id} variants={itemVariants}>
                    <HotelCard hotel={hotel} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <Hotel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
              <p className="text-muted-foreground mb-6">We couldn't find any hotels matching your current filters.</p>
              <Button onClick={handleResetFilters}>Reset All Filters</Button>
            </div>
          )}
        </>
      )}
        <Description />
    </section>
  )
}

