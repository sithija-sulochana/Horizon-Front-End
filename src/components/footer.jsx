import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Horizon Hotels</h3>
            <p className="text-gray-400 text-sm mb-4">
              Providing exceptional hospitality and unforgettable experiences for our guests since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-primary" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-primary" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-primary" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary">
                  Our Hotels
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary">
                  Rooms & Suites
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary">
                  Special Offers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary">
                  Events & Meetings
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-primary">
                  Dining
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-sm text-gray-400">123 Luxury Avenue, Resort City, RC 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-gray-400">+78 2795694</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm text-gray-400">horizonhotel@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for special deals and updates.</p>
            <div className="flex flex-col space-y-2">
              <input type="email" placeholder="Your email address" className="px-3 py-2 border rounded-md text-sm" />
              <button className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Horizon Hotels. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-xs text-gray-400 hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-primary">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

