"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MapPin, TrendingUp, Search } from "lucide-react"
import TrueFocus from "@/components/ui/TrueForcus";
export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const popularDestinations = [
    { name: "New York", type: "City Break" },
    { name: "Bali", type: "Beach Resort" },
    { name: "Swiss Alps", type: "Mountain Retreat" },
    { name: "Paris", type: "Romantic Getaway" },
    { name: "Tokyo", type: "Urban Adventure" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      // Here you would typically navigate or perform the actual search
      console.log("Searching for:", searchQuery)
    }, 1500)
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/placeholder.svg?height=800&width=1600"
          alt="Luxury hotel view"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Animated Particles (optional visual effect) */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float"
            style={{
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-white justify-center px-4 sm:px-8 pt-24 md:pt-32 pb-24 md:pb-32 min-h-[80vh]">
        <Badge variant="outline" className="mb-6 px-4 py-1 text-sm border-white/20 bg-white/10 backdrop-blur-sm">
          <TrendingUp className="w-4 h-4 mr-2" /> Trending Destinations
        </Badge>

        <TrueFocus
          sentence="Find Your Perfect Staycation"
          manualMode={false}
          blurAmount={5}
          borderColor="red"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />

        <p className="text-lg md:text-xl mb-8 md:mb-12 text-center max-w-2xl text-white/80 animate-fade-in-delay">
          Describe your dream destination and experience, and we'll find the perfect place for you.
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-black/20 backdrop-blur-md rounded-full p-2 flex items-center shadow-lg transition-all duration-300 hover:bg-black/30 focus-within:ring-2 focus-within:ring-primary/50 animate-fade-in-delay-2"
        >
          <Search className="ml-4 w-5 h-5 text-white/70" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="A beachfront resort with infinity pool in Bali..."
            className="flex-grow bg-transparent text-base md:text-lg text-white placeholder:text-white/50 border-none outline-none focus:border-none focus:outline-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            disabled={isSearching}
            className="rounded-full w-auto md:w-48 flex items-center gap-x-2 h-10 md:h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                <span className="hidden md:inline text-base md:text-lg">Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-pulse text-white" />
                <span className="text-base md:text-lg">AI Search</span>
              </>
            )}
          </Button>
        </form>

        {/* Popular Destinations */}
        <div className="mt-8 md:mt-12 animate-fade-in-delay-3">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <span className="text-white/70 mr-1">Popular:</span>
            {popularDestinations.map((destination, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(`${destination.type} in ${destination.name}`)}
                className="flex items-center px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-sm"
              >
                <MapPin className="w-3 h-3 mr-1" />
                {destination.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-16 md:h-24 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full text-background"
          fill="currentColor"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </div>
  )
}

