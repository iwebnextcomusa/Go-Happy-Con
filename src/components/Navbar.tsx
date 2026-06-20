import { useState, useEffect } from "react";
import { Camera, ShieldAlert, Waves, Info, Mail, Menu, X, Phone, Compass } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home", icon: Compass },
    { id: "real-estate", label: "Real Estate Photography", icon: Camera },
    { id: "consulting", label: "Expert Witness & Consulting", icon: ShieldAlert },
    { id: "washing", label: "Drone Power Wash", icon: Waves },
    { id: "about", label: "About Us", icon: Info },
    { id: "contact", label: "Contact Us", icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Also push matching hash
    window.location.hash = id;
  };

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0A2540]/90 backdrop-blur-md py-2 border-b border-sky-blue/20 shadow-lg shadow-deep-blue/40"
          : "bg-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand Title */}
          <div
            id="brand-logo"
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => handleNavClick("home")}
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-sky-blue/30 flex items-center justify-center shadow-lg shadow-sky-blue/20 transition-transform group-hover:rotate-12 duration-300 bg-[#0A2540]">
              <img 
                src="/src/assets/images/happy_contractors_logo_1781969700244.jpg" 
                alt="Go Happy Con Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-lg font-display font-bold tracking-tight bg-gradient-to-r from-white via-[#F5F7FA] to-sky-blue bg-clip-text text-transparent group-hover:text-neon-blue transition-colors">
                Go Happy Con
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#00F0FF] uppercase leading-none">
                Gig Harbor, WA
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-sans text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-sky-blue bg-sky-blue/10 border border-sky-blue/25"
                      : "text-gray-300 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-neon-blue animate-pulse" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Header Action phone call links */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              id="header-phone-button"
              href="tel:253-888-3432"
              className="flex items-center space-x-2 text-white bg-sky-blue hover:bg-sky-blue/80 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-sky-blue/15 hover:shadow-sky-blue/30 scale-100 hover:scale-105"
            >
              <Phone className="w-4 h-4 text-white animate-bounce" />
              <span>253-888-3432</span>
            </a>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="flex lg:hidden">
            <button
              id="mobile-menu-trigger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu list */}
      <div
        id="mobile-nav-drawer"
        className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-screen opacity-100 pb-6 border-b border-sky-blue/10 bg-[#0A2540]/95 backdrop-blur-xl" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? "bg-sky-blue/20 text-sky-blue border-l-4 border-neon-blue"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#00F0FF]" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-4 px-4">
            <a
              id="mobile-phone-link-btn"
              href="tel:253-888-3432"
              className="flex items-center justify-center space-x-2.5 w-full bg-sky-blue hover:bg-sky-blue/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-transform"
            >
              <Phone className="w-5 h-5" />
              <span>Call Us: 253-888-3432</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
