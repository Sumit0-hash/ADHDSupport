import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Mail, 
  MapPin, 
  Heart 
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#263A47] text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">About Us</h3>
            <p className="leading-relaxed text-sm">
              We are dedicated to providing a supportive environment for individuals and families navigating ADHD and Autism. 
              Our mission is to offer accessible resources, community connection, and expert guidance to help you thrive.
            </p>
          </div>

          {/* Column 2: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#469CA4] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">ADHD Support Australia</p>
                  <p>PO Box 1576</p>
                  <p>Warriewood, NSW 2102</p>
                  <p>Australia</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#469CA4] flex-shrink-0" />
                <a 
                  href="mailto:vivian@adhdsupportaustralia.com.au" 
                  className="hover:text-white transition-colors"
                >
                  vivian@adhdsupportaustralia.com.au
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Social & Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Stay Connected</h3>
            <p className="text-sm mb-4">
              Follow us on social media for updates, events, and daily inspiration.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="bg-[#30506C] p-2 rounded-full hover:bg-[#469CA4] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="bg-[#30506C] p-2 rounded-full hover:bg-[#469CA4] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="bg-[#30506C] p-2 rounded-full hover:bg-[#469CA4] hover:text-white transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="border-t border-gray-700 bg-[#1F303B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p>&copy; {currentYear} ADHD Support Australia. All rights reserved.</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-[#469CA4] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#469CA4] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};