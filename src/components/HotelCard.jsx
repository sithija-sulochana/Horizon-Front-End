"use client"

import { useState } from "react"
import { MapPin, Star, Heart, Award, Wifi, Coffee, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router"
import { cn } from "@/lib/utils"

function HotelCard({ hotel, className }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Determine if the hotel is highly rated
  const isHighlyRated = hotel?.rating >= 4.5

  // Determine if the hotel has a discount or promotion
  const hasDiscount = hotel?.discount || Math.random() > 0.7 // Randomly show discount for demo
  const discountAmount = hotel?.discount || "15%"

  // Mock amenities based on hotel data
  const getRandomAmenities = () => {
    const allAmenities = [
      { icon: <Wifi className="h-3 w-3" />, label: "Free WiFi" },
      { icon: <Coffee className="h-3 w-3" />, label: "Breakfast" },
    ]

    // Return 1-2 random amenities
    return allAmenities.slice(0, Math.floor(Math.random() * 2) + 1)
  }

  const amenities = hotel?.amenities || getRandomAmenities()

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className={cn(
        "block group relative rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50",
        className,
      )}
    >
      {/* Card Container with subtle border and shadow */}
      <div className="overflow-hidden rounded-xl border bg-card">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Loading Skeleton */}
          {!imageLoaded && !imageError && <Skeleton className="absolute inset-0 z-10" />}

          {/* Hotel Image */}
          <img
            src={imageError ? "/placeholder.svg?height=300&width=400" : hotel.image}
            alt={hotel.name}
            className={cn(
              "object-cover w-full h-full absolute transition-transform duration-500 group-hover:scale-110",
              !imageLoaded && "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
          />

          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white"
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isFavorite && "fill-red-500 text-red-500")} />
            <span className="sr-only">Add to favorites</span>
          </Button>

          {/* Badges */}
          <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1">
            {isHighlyRated && (
              <Badge
                variant="secondary"
                className="bg-yellow-500/90 text-white hover:bg-yellow-500/80 backdrop-blur-sm"
              >
                <Award className="h-3 w-3 mr-1" />
                Top Rated
              </Badge>
            )}

            {hasDiscount && (
              <Badge variant="secondary" className="bg-green-500/90 text-white hover:bg-green-500/80 backdrop-blur-sm">
                <Tag className="h-3 w-3 mr-1" />
                {discountAmount} OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {hotel.name}
            </h3>
          </div>

          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">{hotel.location}</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
              >
                {amenity.icon}
                <span className="ml-1">{amenity.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{hotel?.rating ?? "No rating"}</span>
            <span className="text-muted-foreground text-sm">({hotel.reviews?.toLocaleString() ?? "No"} Reviews)</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-xl font-bold">${hotel.price}</span>
              <span className="text-sm text-muted-foreground ml-1">/ night</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Loading skeleton for the hotel card
export function HotelCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  )
}

export default HotelCard

