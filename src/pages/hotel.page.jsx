  "use client"

  import { useState } from "react"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"
  import { Card, CardContent } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { useCreateBookingMutation, useGetHotelByIdQuery } from "@/lib/api"
  import {
    Calendar,
    Coffee,
    Heart,
    Info,
    MapPin,
    MenuIcon as Restaurant,
    Phone,
    Share,
    Star,
    Tv,
    Users,
    Wifi,
  } from "lucide-react"
  import { useParams } from "react-router"
  import { Skeleton } from "@/components/ui/skeleton"
  import { toast } from "sonner"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
  import { Separator } from "@/components/ui/separator"
  import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  import { Progress } from "@/components/ui/progress"
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  import { useUser } from "@clerk/clerk-react"
  import { Navigate } from "react-router";

  import { Outlet } from "react-router"



  export default function HotelPage() {
    const { id } = useParams()
    const { data: hotel, isLoading, isError } = useGetHotelByIdQuery(id)
    const [createBooking, { isLoading: isCreateBookingLoading }] = useCreateBookingMutation()
    const { isSignedIn } = useUser();

    // Booking form state
    const [checkIn, setCheckIn] = useState("")
    const [checkOut, setCheckOut] = useState("")
    const [roomNumber, setRoomNumber] = useState("")
    const [guests, setGuests] = useState("1")
    const [isFavorite, setIsFavorite] = useState(false)

    
    // To give the permision for accessing to the hotelBooking page if the user only sign in 
    if(!isSignedIn){
      return(<Navigate to="/sign-in"></Navigate>)
    }

    

    // Mock data for gallery and reviews
    const galleryImages = [
      { id: 1, url: hotel?.image || "/placeholder.svg?height=400&width=600", alt: "Hotel main view" },
      { id: 2, url: "/placeholder.svg?height=400&width=600", alt: "Hotel room" },
      { id: 3, url: "/placeholder.svg?height=400&width=600", alt: "Hotel bathroom" },
      { id: 4, url: "/placeholder.svg?height=400&width=600", alt: "Hotel restaurant" },
      { id: 5, url: "/placeholder.svg?height=400&width=600", alt: "Hotel pool" },
    ]

    const reviews = [
      {
        id: 1,
        name: "Sarah J.",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "2 weeks ago",
        comment: "Absolutely loved my stay! The staff was incredibly friendly and the amenities were top-notch.",
      },
      {
        id: 2,
        name: "Michael T.",
        avatar: "/placeholder.svg",
        rating: 4,
        date: "1 month ago",
        comment: "Great location and beautiful rooms. The breakfast could have more options though.",
      },
      {
        id: 3,
        name: "Emma R.",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "3 months ago",
        comment: "Perfect for our anniversary trip. The view from our room was breathtaking!",
      },
    ]

    const handleBook = async () => {
      if (!checkIn || !checkOut || !roomNumber) {
        toast.error("Please fill all booking details.")
        return
      }

      if (new Date(checkIn) >= new Date(checkOut)) {
        toast.error("Check-out date must be after check-in date.")
        return
      }

      try {
        await createBooking({
          hotelId: id,
          checkIn,
          checkOut,
          roomNumber: Number.parseInt(roomNumber, 10),
          guests: Number.parseInt(guests, 10),
        })
        toast.success("Booking Created Successfully 😊")
        // Reset form
        setCheckIn("")
        setCheckOut("")
        setRoomNumber("")
        setGuests("1")
      } catch (error) {
        console.error("Booking error:", error)
        toast.error("Booking failed. Please try again ☹️")
      }
    }

    if (isLoading)
      return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
          <div className="space-y-6">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      )

    if (isError)
      return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <Info className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Hotel</h2>
              <p className="text-muted-foreground mb-4">
                We couldn't load the hotel information. Please try again later.
              </p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      )

    // Calculate nights
    const calculateNights = () => {
      if (!checkIn || !checkOut) return 0
      const start = new Date(checkIn)
      const end = new Date(checkOut)
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const nights = calculateNights()
    const totalPrice = nights * (hotel?.price || 0)

    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Hotel Name and Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? "text-red-500" : ""}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500" : ""}`} />
              <span className="sr-only">Add to favorites</span>
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>

        {/* Location and Rating */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-muted-foreground mr-1" />
            <p className="text-muted-foreground">{hotel.location}</p>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold">{hotel?.rating ?? "No rating"}</span>
            <span className="text-muted-foreground">({hotel?.reviews?.toLocaleString() ?? "No"} reviews)</span>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary">Rooftop View</Badge>
            <Badge variant="secondary">French Cuisine</Badge>
            <Badge variant="secondary">City Center</Badge>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <Carousel className="w-full">
            <CarouselContent>
              {galleryImages.map((image) => (
                <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg aspect-video">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 pt-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-3">About this hotel</h2>
                  <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">Location</h3>
                  <div className="rounded-lg overflow-hidden h-[300px] bg-muted">
                    {/* Map placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Map view of {hotel.location}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="pt-4">
                <h2 className="text-2xl font-semibold mb-6">Hotel Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <Wifi className="h-5 w-5 mr-3 text-primary" />
                    <span>Free High-Speed Wi-Fi</span>
                  </div>
                  <div className="flex items-center">
                    <Restaurant className="h-5 w-5 mr-3 text-primary" />
                    <span>Gourmet Restaurant</span>
                  </div>
                  <div className="flex items-center">
                    <Tv className="h-5 w-5 mr-3 text-primary" />
                    <span>Flat-screen TV</span>
                  </div>
                  <div className="flex items-center">
                    <Coffee className="h-5 w-5 mr-3 text-primary" />
                    <span>Premium Coffee Maker</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-primary" />
                    <span>24/7 Room Service</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-3 text-primary" />
                    <span>Concierge Service</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-primary" />
                    <span>Conference Rooms</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-3 text-primary" />
                    <span>Spa & Wellness Center</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-4">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Guest Reviews</h2>
                    <Button variant="outline">Write a Review</Button>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{hotel?.rating}</div>
                      <div className="text-sm text-muted-foreground">out of 5</div>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="text-sm w-16">Excellent</div>
                        <Progress value={75} className="h-2" />
                        <div className="text-sm text-muted-foreground">75%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm w-16">Good</div>
                        <Progress value={20} className="h-2" />
                        <div className="text-sm text-muted-foreground">20%</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm w-16">Average</div>
                        <Progress value={5} className="h-2" />
                        <div className="text-sm text-muted-foreground">5%</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={review.avatar} alt={review.name} />
                                <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{review.name}</div>
                                <div className="text-sm text-muted-foreground">{review.date}</div>
                              </div>
                            </div>
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                                  />
                                ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    Load More Reviews
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">${hotel.price}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{hotel?.rating}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Book Your Stay</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="check-in" className="text-sm font-medium">
                        Check-in
                      </label>
                      <Input
                        id="check-in"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="check-out" className="text-sm font-medium">
                        Check-out
                      </label>
                      <Input
                        id="check-out"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="room-number" className="text-sm font-medium">
                        Room
                      </label>
                      <Input
                        id="room-number"
                        type="number"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                        placeholder="Room Number"
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="guests" className="text-sm font-medium">
                        Guests
                      </label>
                      <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {nights > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          ${hotel.price} × {nights} nights
                        </span>
                        <span>${totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span>${Math.round(totalPrice * 0.1)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>${totalPrice + Math.round(totalPrice * 0.1)}</span>
                      </div>
                    </div>
                  </>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBook}
                  disabled={isCreateBookingLoading || !checkIn || !checkOut || !roomNumber}
                >
                  {isCreateBookingLoading ? "Processing..." : "Book Now"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You won't be charged yet. Payment will be processed upon check-in.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

