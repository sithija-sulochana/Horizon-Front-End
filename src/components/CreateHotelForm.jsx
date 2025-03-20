"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useCreateHotelMutation } from "@/lib/api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Building2, Camera, Hotel, MapPin, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  name: z.string().min(1, { message: "Hotel name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  image: z.string().min(1, { message: "Image URL is required" }),
  price: z.number().positive("Price must be positive"),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  rating: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  hotelType: z.string().optional(),
})

const amenitiesOptions = [
  { id: "wifi", label: "Free WiFi" },
  { id: "parking", label: "Free Parking" },
  { id: "breakfast", label: "Breakfast Included" },
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Fitness Center" },
  { id: "spa", label: "Spa & Wellness" },
  { id: "restaurant", label: "Restaurant" },
  { id: "bar", label: "Bar/Lounge" },
  { id: "roomService", label: "Room Service" },
  { id: "airConditioning", label: "Air Conditioning" },
]

const hotelTypes = [
  { value: "luxury", label: "Luxury Hotel" },
  { value: "boutique", label: "Boutique Hotel" },
  { value: "resort", label: "Resort" },
  { value: "business", label: "Business Hotel" },
  { value: "budget", label: "Budget Hotel" },
  { value: "apartment", label: "Serviced Apartment" },
  { value: "villa", label: "Villa" },
]

const CreateHotelForm = () => {
  const [createHotel, { isLoading }] = useCreateHotelMutation()
  const [activeTab, setActiveTab] = useState("basic")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      image: "",
      price: undefined,
      description: "",
      rating: "3",
      checkInTime: "14:00",
      checkOutTime: "11:00",
      amenities: ["wifi"],
      hotelType: "luxury",
    },
  })

  const onSubmit = (values) => {
    setFormData(values)
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = async () => {
    if (!formData) return

    try {
      toast.loading("Creating hotel...")
      await createHotel(formData).unwrap()
      toast.success("Hotel created successfully")
      form.reset()
      setActiveTab("basic")
    } catch (error) {
      toast.error("Hotel creation failed")
    } finally {
      setShowConfirmDialog(false)
    }
  }

  const handleReset = () => {
    form.reset()
    toast.info("Form has been reset")
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Create New Hotel</CardTitle>
        </div>
        <CardDescription>Fill in the details below to add a new hotel to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Basic Information</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Grand Hotel & Spa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hotelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hotel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hotelTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <Input placeholder="123 Main St, New York, NY 10001" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>Enter the full address of the hotel</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price per Night ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            placeholder="199"
                            className="pl-8"
                            onChange={(e) => {
                              field.onChange(Number.parseFloat(e.target.value))
                            }}
                            value={field.value || ""}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                    Next: Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Hotel Details</h3>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A luxurious hotel in the heart of the city..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the hotel and its unique features
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Star Rating</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">⭐ 1 Star</SelectItem>
                            <SelectItem value="2">⭐⭐ 2 Stars</SelectItem>
                            <SelectItem value="3">⭐⭐⭐ 3 Stars</SelectItem>
                            <SelectItem value="4">⭐⭐⭐⭐ 4 Stars</SelectItem>
                            <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkInTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-in Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="checkOutTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Check-out Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Camera className="w-4 h-4 mr-2 text-muted-foreground" />
                            <Input placeholder="https://example.com/hotel-image.jpg" {...field} />
                          </div>

                          {field.value && (
                            <div className="relative aspect-video rounded-md overflow-hidden border">
                              <img
                                src={field.value || "/placeholder.svg"}
                                alt="Hotel preview"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg?height=400&width=600"
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Enter a URL for the main hotel image</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Info
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setActiveTab("amenities")}>
                    Next: Amenities
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="amenities" className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Hotel Amenities</h3>
                </div>

                <FormField
                  control={form.control}
                  name="amenities"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Available Amenities</FormLabel>
                        <FormDescription>Select all amenities that are available at this hotel</FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {amenitiesOptions.map((amenity) => (
                          <FormField
                            key={amenity.id}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                              return (
                                <FormItem key={amenity.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(amenity.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), amenity.id])
                                          : field.onChange(field.value?.filter((value) => value !== amenity.id))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">{amenity.label}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                    Back: Details
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Hotel"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button variant="outline" onClick={handleReset}>
          Reset Form
        </Button>
        <div className="text-sm text-muted-foreground">All fields marked with * are required</div>
      </CardFooter>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Hotel Creation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this hotel? Please review the details below:
            </AlertDialogDescription>
          </AlertDialogHeader>

          {formData && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Hotel Name:</div>
                <div className="font-medium">{formData.name}</div>

                <div className="text-muted-foreground">Location:</div>
                <div className="font-medium">{formData.location}</div>

                <div className="text-muted-foreground">Price per Night:</div>
                <div className="font-medium">${formData.price}</div>

                <div className="text-muted-foreground">Hotel Type:</div>
                <div className="font-medium">
                  {hotelTypes.find((t) => t.value === formData.hotelType)?.label || formData.hotelType}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-muted-foreground mb-1">Description:</div>
                <div className="text-sm">{formData.description}</div>
              </div>

              {formData.amenities?.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground mb-1">Amenities:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.amenities.map((amenityId) => (
                        <span key={amenityId} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {amenitiesOptions.find((a) => a.id === amenityId)?.label || amenityId}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>Confirm & Create</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default CreateHotelForm

