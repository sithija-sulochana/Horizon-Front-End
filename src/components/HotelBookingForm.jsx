import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

export default function HotelBookingForm({ hotelName, onSubmit }) {
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [roomNumber, setRoomNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut || !roomNumber) {
      alert("Please fill all fields.");
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      alert("Check-out must be after check-in.");
      return;
    }

    onSubmit({
      hotelName,
      checkIn,
      checkOut,
      roomNumber: parseInt(roomNumber),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-lg">
      <h2 className="text-2xl font-semibold">Book Your Stay at {hotelName}</h2>

      <div>
        <label className="block mb-2 text-sm font-medium">Check-In Date</label>
        <Calendar selected={checkIn} onSelect={setCheckIn} />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Check-Out Date</label>
        <Calendar selected={checkOut} onSelect={setCheckOut} />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">Room Number</label>
        <Input
          type="number"
          placeholder="Enter room number"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">Submit Booking</Button>
    </form>
  );
}
