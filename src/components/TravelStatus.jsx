"use client"

import { Users, Building2, MapPin } from "lucide-react"
import CountUp from "@/components/ui/countUp"
import GridMotion from "@/components/ui/GridMotion"

export default function TravelStatistics() {
  // note: you'll need to make sure the parent container of this component is sized properly
  const items = [
    "Luxury Resorts",
    <div key="jsx-item-1" className="font-medium text-gray-800">
      Experience world-class luxury
    </div>,
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    "Beach Getaways",
    <div key="jsx-item-2" className="font-medium text-gray-800">
      Pristine beaches await
    </div>,
    "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    <div key="jsx-item-3" className="font-medium text-gray-800">
      Unforgettable experiences
    </div>,
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    "Mountain Retreats",
    <div key="jsx-item-4" className="font-medium text-gray-800">
      Escape to serenity
    </div>,
    "Urban Exploration",
    <div key="jsx-item-5" className="font-medium text-gray-800">
      Discover vibrant city life
    </div>,
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    "Culinary Journeys",
    <div key="jsx-item-6" className="font-medium text-gray-800">
      Taste the world
    </div>,
    "https://images.unsplash.com/photo-1540304453527-62f979142a17?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
    "Historic Landmarks",
    <div key="jsx-item-7" className="font-medium text-gray-800">
      Step back in time
    </div>,
    "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80",
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-8 my-12">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Our Global Impact</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Happy Travelers */}
        <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm transition-all hover:shadow-md">
          <div className="p-3 bg-blue-100 rounded-full mb-4">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Happy Travelers Served</h3>
          <div className="flex items-baseline">
            <CountUp
              from={0}
              to={100}
              separator=","
              direction="up"
              duration={2.5}
              className="text-3xl font-bold text-blue-600"
              startWhen={true}
              onEnd={() => console.log("Travelers count animation completed")}
            />
            <span className="text-2xl font-bold text-blue-600 ml-1">K+</span>
          </div>
        </div>

        {/* Luxury Hotels */}
        <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm transition-all hover:shadow-md">
          <div className="p-3 bg-purple-100 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Luxury Hotels Listed</h3>
          <div className="flex items-baseline">
            <CountUp
              from={0}
              to={300}
              separator=","
              direction="up"
              duration={2.5}
              delay={0.2}
              className="text-3xl font-bold text-purple-600"
              startWhen={true}
              onEnd={() => console.log("Hotels count animation completed")}
            />
            <span className="text-2xl font-bold text-purple-600 ml-1">+</span>
          </div>
        </div>

        {/* Destinations */}
        <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm transition-all hover:shadow-md">
          <div className="p-3 bg-emerald-100 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Destinations Covered</h3>
          <div className="flex items-baseline">
            <CountUp
              from={0}
              to={50}
              separator=","
              direction="up"
              duration={2.5}
              delay={0.4}
              className="text-3xl font-bold text-emerald-600"
              startWhen={true}
              onEnd={() => console.log("Destinations count animation completed")}
            />
            <span className="text-2xl font-bold text-emerald-600 ml-1">+</span>
          </div>
        </div>
      </div>
      <div className="mt-[30px] p-[10px] h-[10%] py-10">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Explore Dream Destinations</h2>
        <GridMotion items={items} />
      </div>
    </div>
  )
}

