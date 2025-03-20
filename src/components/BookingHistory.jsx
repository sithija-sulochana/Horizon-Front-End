"use client"

import { useEffect, useState } from "react"
import { useGetUserBookingsQuery, useGetHotelsQuery } from "@/lib/api"
import { CalendarDays, Search, Download, Printer, Eye, FileEdit, XCircle, ArrowUpDown } from "lucide-react"

// Import the shadcn/ui components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BookingHistory() {
  const { data: bookings, error: bookingError, isLoading: bookingLoading } = useGetUserBookingsQuery()
  const { data: hotels, error: hotelError, isLoading: hotelLoading } = useGetHotelsQuery()

  const [validatedBookings, setValidatedBookings] = useState([])
  const [sortOrder, setSortOrder] = useState("desc")
  const [expandedBooking, setExpandedBooking] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (bookings && hotels) {
      // Match bookings with their hotel names and calculate additional data
      const now = new Date()
      const combinedData = bookings.map((booking) => {
        const matchedHotel = hotels.find((hotel) => hotel._id === booking.hotelId)
        const checkInDate = new Date(booking.checkIn)
        const checkOutDate = new Date(booking.checkOut)

        // Calculate total nights
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime())
        const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        // Determine booking status
        let status = "upcoming"
        if (checkOutDate < now) {
          status = "completed"
        } else if (checkInDate > now) {
          status = "upcoming"
        }

        // Add some sample data for a more complete booking record
        return {
          ...booking,
          hotelName: matchedHotel ? matchedHotel.name : "Unknown Hotel",
          totalNights,
          status,
          bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          confirmationNumber: `HB${Math.floor(100000 + Math.random() * 900000)}`,
          totalAmount: (Math.floor(100 + Math.random() * 900) * totalNights).toFixed(2),
          paymentMethod: "Credit Card",
          guestCount: Math.floor(1 + Math.random() * 4),
        }
      })

      // Sort by check-in date
      const sortedData = [...combinedData].sort((a, b) => {
        const dateA = new Date(a.checkIn).getTime()
        const dateB = new Date(b.checkIn).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      })

      setValidatedBookings(sortedData)
    }
  }, [bookings, hotels, sortOrder])

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  const toggleExpand = (bookingId) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
  }

  // Filter bookings based on tab and search term
  const filteredBookings = validatedBookings
    .filter((booking) => activeTab === "all" || booking.status === activeTab)
    .filter(
      (booking) =>
        searchTerm === "" ||
        booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking._id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (dateString) => {
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Loading state with better UI
  if (bookingLoading || hotelLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Booking History</h2>
          <div className="w-1/3 bg-gray-200 h-10 animate-pulse rounded-md"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6 animate-pulse">
          <div className="h-8 bg-gray-200 w-1/4 rounded mb-2"></div>
          <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4">
            <div className="grid grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="divide-y">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="grid grid-cols-6 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div key={j} className="h-6 bg-gray-100 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state with better UI
  if (bookingError || hotelError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Booking History</h3>
          <p className="text-red-700 mb-4">
            We encountered a problem while retrieving your booking data. Please try again later.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Booking History</h2>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by hotel or confirmation #"
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Info card */}
      <Card className="mb-6 bg-blue-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800">Manage Your Bookings</h3>
              <p className="text-blue-700 text-sm">
                View your upcoming and past stays. You can download booking confirmations or modify upcoming
                reservations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and actions row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select defaultValue="recent">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={toggleSort}>
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{sortOrder === "asc" ? "Sort Newest First" : "Sort Oldest First"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print Booking History</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as CSV</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Empty state */}
      {filteredBookings.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Bookings Found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? `No bookings match your search for "${searchTerm}"`
              : `You don't have any ${activeTab !== "all" ? activeTab : ""} bookings yet.`}
          </p>
          <Button>Browse Hotels</Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          <Table>
            <TableCaption>Your hotel booking history • {filteredBookings.length} bookings found</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[180px]">Confirmation</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead className="hidden md:table-cell">Dates</TableHead>
                <TableHead className="hidden md:table-cell">Guests</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking._id} className="group">
                  <TableCell className="font-medium">
                    <div>{booking.confirmationNumber}</div>
                    <div className="text-xs text-gray-500">{formatDate(booking.bookingDate)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.hotelName}</div>
                    <div className="text-xs text-gray-500">Room #{booking.roomNumber}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <div className="text-sm">
                        {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{booking.totalNights} nights</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {booking.guestCount} {booking.guestCount === 1 ? "guest" : "guests"}
                  </TableCell>
                  <TableCell className="text-right font-medium">${booking.totalAmount}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => viewBookingDetails(booking)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {booking.status === "upcoming" && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FileEdit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modify Booking</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Booking details dialog */}
      {selectedBooking && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Confirmation #{selectedBooking.confirmationNumber}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{selectedBooking.hotelName}</h3>
                <p className="text-sm text-gray-500 mb-4">Room #{selectedBooking.roomNumber}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check-in</h4>
                    <p className="font-medium">{formatDate(selectedBooking.checkIn)}</p>
                    <p className="text-sm text-gray-500">After 3:00 PM</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Check-out</h4>
                    <p className="font-medium">{formatDate(selectedBooking.checkOut)}</p>
                    <p className="text-sm text-gray-500">Before 11:00 AM</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Duration</h4>
                    <p className="font-medium">{selectedBooking.totalNights} nights</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Guests</h4>
                    <p className="font-medium">
                      {selectedBooking.guestCount} {selectedBooking.guestCount === 1 ? "guest" : "guests"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Payment Information</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Booking Date</h4>
                    <p className="font-medium">{formatDate(selectedBooking.bookingDate)}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment Method</h4>
                    <p className="font-medium">{selectedBooking.paymentMethod}</p>
                    <p className="text-sm text-gray-500">•••• 4242</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Booking Status</h4>
                    <Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge>
                  </div>

                  <Separator className="my-2" />

                  <div className="pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Room Rate ({selectedBooking.totalNights} nights)</span>
                      <span className="font-medium">${selectedBooking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Taxes & Fees</span>
                      <span>Included</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold mt-2">
                      <span>Total</span>
                      <span>${selectedBooking.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                {selectedBooking.status === "upcoming" && (
                  <Button>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Modify Booking
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

