"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useGetHotelsQuery } from "@/lib/api"
import GridMotion from "@/components/ui/GridMotion"
import { ChevronLeft, ChevronRight, Expand, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Hotel Gallery Component
export function HotelGallery() {
  const params = useParams()
  const hotelId = params?.hotelId ? Number(params.hotelId) : null
  const { data: hotels, isLoading, error } = useGetHotelsQuery()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  if (error) return <div className="p-8 text-center text-destructive">Error loading hotel data</div>
  if (!hotelId) return <div className="p-8 text-center">No hotel selected</div>

  const hotel = hotels?.find((hotel) => hotel.id === hotelId || hotel._id === hotelId)
  if (!hotel) return <div className="p-8 text-center">Hotel not found</div>

  // Prepare items for GridMotion component
  const gridItems = hotel.images.map((image, index) => (
    <div key={index} className="relative w-full h-full overflow-hidden rounded-lg">
      <img src={image || "/placeholder.svg"} alt={hotel.name} className="w-full h-full object-cover" />
    </div>
  ))

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === hotel.images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">{hotel.name} Gallery</h2>

      {/* Featured image with navigation */}
      <div className="relative mb-6 rounded-xl overflow-hidden aspect-[16/9] bg-muted">
        <img
          src={hotel.images[selectedImageIndex] || "/placeholder.svg"}
          alt={`${hotel.name} - Featured Image`}
          className="object-cover w-full h-full"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-background/80 backdrop-blur-sm"
              onClick={() => setIsFullscreenOpen(true)}
            >
              <Expand className="h-5 w-5" />
              <span className="sr-only">View fullscreen</span>
            </Button>
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handlePrevImage}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous image</span>
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleNextImage}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next image</span>
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
          {selectedImageIndex + 1} / {hotel.images.length}
        </div>
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mb-8">
        {hotel.images.map((image, index) => (
          <button
            key={index}
            className={`relative aspect-square rounded-md overflow-hidden ${
              index === selectedImageIndex ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`${hotel.name} - Thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </button>
        ))}
      </div>

      {/* Animated grid display */}
      <div className="mt-12 h-[50vh]">
        <h3 className="text-xl font-semibold mb-4">Immersive Gallery</h3>
        <GridMotion items={gridItems} gradientColor="rgba(0,0,0,0.8)" />
      </div>

      {/* Fullscreen dialog */}
      <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={hotel.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${hotel.name} - Fullscreen Image`}
              className="object-contain max-h-full max-w-full"
            />

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-4 rounded-full bg-background/20 hover:bg-background/40 text-white"
              onClick={() => setIsFullscreenOpen(false)}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close fullscreen</span>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40 text-white"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Previous image</span>
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-background/20 hover:bg-background/40 text-white"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Next image</span>
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full text-white">
              {selectedImageIndex + 1} / {hotel.images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Hotel Card Component
export function HotelCard({ hotel }) {
  return (
    <Link to={`/hotels/${hotel.id || hotel._id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <img src={hotel.images[0] || "/placeholder.svg"} alt={hotel.name} className="object-cover w-full h-full" />
          <div className="absolute top-2 right-2">
            <Badge className="bg-background/80 backdrop-blur-sm text-foreground">${hotel.price}/night</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{hotel.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{hotel.location}</p>
          <p className="text-sm line-clamp-2">{hotel.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

// Hotel Card Skeleton for loading states
export function HotelCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <div className="relative aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-6 bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 bg-muted rounded animate-pulse mb-2 w-2/3" />
        <div className="h-8 bg-muted rounded animate-pulse" />
      </CardContent>
    </Card>
  )
}

// Default export for convenience
export default {
  HotelGallery,
  HotelCard,
  HotelCardSkeleton,
}

