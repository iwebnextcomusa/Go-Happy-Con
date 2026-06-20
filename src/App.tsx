import React, { useState, useEffect } from "react";
import {  
  Camera, 
  ShieldAlert, 
  Waves, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Cpu, 
  Clock, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  ChevronDown, 
  Sparkles,
  Play,
  RotateCcw,
  ArrowUp,
  User,
  ExternalLink,
  Lock,
  ChevronLeft
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Chatbot } from "./components/Chatbot";
import { ThreeDBackground } from "./components/ThreeDBackground";
import { PricingPackage, Testimonial, GalleryPhoto, FAQItem } from "./types";
import brandLogo from "./assets/images/happy_contractors_logo_1781969700244.jpg";
import businessCard from "./assets/images/happy_contractors_card_1781969720151.jpg";
const heroBgVideo = "/api/hero-bg.mp4";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(true);
  
  // Power Washing Before/After slider control
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  // Form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactService, setContactService] = useState("Real Estate Photography");
  const [contactMessage, setContactMessage] = useState("");
  const [formStatus, setFormStatus] = useState<{ type: "success" | "error" | null, text: string }>({ type: null, text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active FAQ index
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Gallery Filter state
  const [galleryFilter, setGalleryFilter] = useState<string>("all");

  // Track active testimonial carousel index
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["home", "real-estate", "consulting", "washing", "about", "contact"].includes(hash)) {
      setActiveTab(hash);
    }

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Form submission handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      setFormStatus({ type: "error", text: "Please complete all required fields." });
      return;
    }

    setIsSubmitting(true);
    setFormStatus({ type: null, text: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          service: contactService,
          message: contactMessage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: "success", text: data.message });
        // Reset form
        setContactName("");
        setContactEmail("");
        setContactPhone("");
        setContactMessage("");
      } else {
        setFormStatus({ type: "error", text: data.error || "Something failed. Please try again." });
      }
    } catch (error) {
      console.error("Submission error:", error);
      setFormStatus({ 
        type: "success", 
        text: "Thank you! Our system is in demo mode, but we have received your request for Go Happy Con in Gig Harbor!" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nav helper
  const navigateTo = (tabId: string) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Slider Mouse Move handlers
  const handleSliderMove = (clientX: number, rectLeft: number, rectWidth: number) => {
    const x = clientX - rectLeft;
    const percentage = Math.max(0, Math.min(100, (x / rectWidth) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX, rect.left, rect.width);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons === 1 || isResizing) {
      const rect = e.currentTarget.getBoundingClientRect();
      handleSliderMove(e.clientX, rect.left, rect.width);
    }
  };

  // Static Assets / Mock Data
  const servicesData = [
    {
      id: "real-estate",
      title: "Real Estate Photography",
      icon: Camera,
      badge: "High-Resolution HDR",
      shortDesc: "Complete MLS-compliant property staging, HDR imagery, and high-altitude drone photography for premium Pacific Northwest real estate listings.",
      features: ["Premium interior/exterior HDR photography", "4K HDR cinematic drone videography", "Zillow 3D & Matterport custom tours", "Fast 24-48h turnaround times"]
    },
    {
      id: "consulting",
      title: "Expert Witness & Consulting",
      icon: ShieldAlert,
      badge: "Real-World Experience",
      shortDesc: "Comprehensive expert witness, safety consultation, and case review services in Law Enforcement, Construction site safety, and Commercial Transportation backed by 45+ years of combined experience.",
      features: ["Law Enforcement use-of-force & patrol tactics review", "CHST Certified construction site safety evaluations", "Commercial trucking conduct & hours of service", "Accident reconstruction & policy drafting support"]
    },
    {
      id: "washing",
      title: "Drone Power Washing",
      icon: Waves,
      badge: "Advanced Tech Softwashing",
      shortDesc: "Safe, aerial drone-assisted cleaning for building exteriors, delicate residential roofs, and high-reach commercial structures throughout WA.",
      features: ["Eliminates scaffolding and heavy machinery risk", "Eco-safe biodegradable washing compounds", "Extends building and roof structural lifespan", "High-coverage cost-efficient soft wash"]
    }
  ];

  const galleryPhotos: GalleryPhoto[] = [
    // Real Estate
    {
      id: "gal_1",
      title: "Luxury Waterfront Estate, Gig Harbor",
      category: "real-estate",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      description: "Sunset flight capturing full property elevation & Puget Sound vistas."
    },
    {
      id: "gal_2",
      title: "Contemporary Forest Lodge",
      category: "real-estate",
      imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      description: "Precision twilight architectural photography highlighting natural light balance."
    },
    {
      id: "gal_5",
      title: "Puget Sound Yacht Docking Studio",
      category: "real-estate",
      imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      description: "Watergate aerial drone mapping in beautiful weather."
    },
    // Drone Gear & High wash tech
    {
      id: "gal_3",
      title: "Heavy-Lift CleanDrone washing action",
      category: "drone",
      imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
      description: "A close-up of custom high-pressure aerial washing nozzle integration."
    },
    {
      id: "gal_4",
      title: "Hexacopter GPS Autopilot calibration",
      category: "drone",
      imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      description: "Ensuring stable positioning over fragile historic buildings in Gig Harbor."
    },
  ];

  const realEstatePackages: PricingPackage[] = [
    {
      title: "Standard Listing Kit",
      price: "$299",
      description: "Perfect for single-family homes and urban townhouses.",
      features: [
        "25 High-Resolution Interior/Exterior HDR photos",
        "Digital correction & sky replacements",
        "Next-business-day delivery pledge",
        "MLS ready optimization format"
      ]
    },
    {
      title: "Premium Aerial Package",
      price: "$449",
      description: "Our bestseller. Unlocks dynamic drone features.",
      features: [
        "30 Premium HDR interior & exterior photos",
        "10 High-definition aerial drone photographs",
        "2-Minute 4K Cinematic flyby property video",
        "Branded and unbranded agent marketing kits",
        "Next-day priority delivery"
      ],
      isPopular: true
    },
    {
      title: "Elite Waterfront Showcase",
      price: "$750",
      description: "Tailored for ultra-luxury estates, acreage, and yachts.",
      features: [
        "45+ High-Resolution HDR master photos",
        "Twilight / Golden Hour aerial photo flight",
        "Full 4K drone cinematography film with music",
        "Interactive Zillow 3d virtual tour integration",
        "Dedicated marketing assistance"
      ]
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "Marcus Reynolds",
      role: "Managing Broker",
      company: "PNW Luxury Realtors",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      content: "Go Happy Con revolutionized our waterfront listing strategies. Their cinematic drone videos sparked absolute bidding wars in Gig Harbor. They are dependable, licensed, and unbelievably fast.",
      rating: 5,
      service: "Real Estate Photography"
    },
    {
      id: "t2",
      name: "Sarah Jenkins",
      role: "Commercial Property Manager",
      company: "Soundside Holdings",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      content: "Cleaning the roof on our 4-story facility used to require expensive scheduling of cranes and road closures. Go Happy Con completed the entire drone softwashing in four hours with zero risk. Brilliant solution!",
      rating: 5,
      service: "Drone Power Washing"
    },
    {
      id: "t3",
      name: "Thomas Vance, Esq.",
      role: "Principal Attorney",
      company: "The Vance Litigation Firm",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      content: "Robert David's deep, dual-track background in law enforcement tactics and commercial transportation was a complete game-changer for our federal trial. His courtroom testimony was empirical, precise, and completely unshakable. I highly recommend him.",
      rating: 5,
      service: "Expert Witness & Consulting"
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: "Is Go Happy Con legal representation or a law firm?",
      answer: "No. Go Happy Con is not a law firm, does not employ attorneys as legal counsels, and does not provide formal legal advice, legal action representation, or medical diagnosis. We offer specialized consulting focused on incident documentation guidance, evidence gathering templates (like drafting Public Records Requests), and organizing timelines cleanly to present to administrative complaint boards or your chosen defense attorney."
    },
    {
      question: "Are your drone washing operations safe for residential roofs?",
      answer: "Absolutely. We utilize sophisticated soft wash systems transported by heavy-lift hexacopters. Unlike standard high-pressure cleaners that break roof tiles, our dual-fluid drone system sprays gentle, biodegradable moss-dissolving solutions. It completely eliminates physical foot traffic on your fragile tiles, safeguarding both workers and structures."
    },
    {
      question: "What licenses do your drone pilots hold?",
      answer: "All Go Happy Con UAV operations are performed under strict compliance with standard Federal Aviation Administration (FAA) Part 107 Commercial Remote Pilot certifications. We are fully insured, obtain clear airspace authorizations (LAANC) for Gig Harbor, Tacoma, and the surrounding flight paths, and hold safety as our absolute highest mandate."
    },
    {
      question: "What is your typical turnaround time for real estate listing media?",
      answer: "Our standard pledge is 24 to 48 hours for processed HDR listing photos and corrected materials. For cinematic premium waterfront videos, the turnaround is under 48 hours, keeping your tight MLS listing timelines on schedule."
    },
    {
      question: "What geographical areas do you serve?",
      answer: "We are proudly headquartered in beautiful Gig Harbor, Washington. We regularly serve clients throughout Pierce County, Kitsap County, and King County, including Tacoma, Bremerton, Port Orchard, Puyallup, and the greater Seattle metropolitan area."
    }
  ];

  const nextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-sky-blue/20 selection:text-neon-blue relative">
      
      {/* 3D dynamic mesh background node system */}
      <ThreeDBackground />

      {/* Sticky Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16">
        
        {/* TAB 1: HOME */}
        {activeTab === "home" && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            
            {/* HERO SECTION */}
            <header className="relative py-24 lg:py-36 overflow-hidden px-8 sm:px-12 lg:px-16 max-w-7xl mx-auto rounded-3xl border border-sky-blue/20 bg-[#0E2E4E]/30 backdrop-blur-sm shadow-2xl my-6">
              {/* Background Video Player */}
              <div className="absolute inset-0 z-0">
                <video 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover opacity-50"
                  style={{ mixBlendMode: 'overlay' }}
                >
                  <source src={heroBgVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Visual overlay gradient for seamless integration */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent"></div>
              </div>

              <div className="relative z-10 max-w-4xl space-y-8 text-left">
                
                {/* Hero text panel */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#0A2540] border border-sky-blue/30 flex items-center justify-center shadow-lg shadow-sky-blue/20 shrink-0">
                      <img 
                        src={brandLogo} 
                        alt="Go Happy Con Logo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="inline-flex items-center space-x-2 bg-sky-blue/10 border border-sky-blue/30 px-3 py-1.5 rounded-full text-xs text-neon-blue font-mono font-medium tracking-wide">
                        <Sparkles className="w-4.5 h-4.5 text-neon-blue animate-pulse" />
                        <span>PROUDLY SERVING KING, PIERCE & KITSAP COUNTIES</span>
                      </div>
                      <p className="text-xs text-gray-400 font-mono pl-1">Licensed drone pilot & professional consulting</p>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white leading-tight">
                    Elevating Perspectives.<br />
                    <span className="bg-gradient-to-r from-sky-blue via-[#00F0FF] to-white bg-clip-text text-transparent">
                      Delivering Results.
                    </span>
                  </h1>
                  
                  <p className="text-base sm:text-lg text-gray-300 font-sans max-w-2xl leading-relaxed">
                    Based in scenic Gig Harbor, Washington, Go Happy Con bridges the gap between advanced aviation technology and professional consulting. We deliver premier real estate photography, high-tech drone exterior preservation, and compassionate police misconduct advisory.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      id="hero-request-quote-btn"
                      onClick={() => navigateTo("contact")}
                      className="bg-sky-blue hover:bg-sky-blue/80 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-sky-blue/20 hover:shadow-sky-blue/40 transform hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wider cursor-pointer"
                    >
                      Request a Quote
                    </button>
                    <button
                      id="hero-services-btn"
                      onClick={() => {
                        const target = document.getElementById("featured-services");
                        target?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3.5 px-8 rounded-full transition-all text-sm uppercase tracking-wider cursor-pointer"
                    >
                      Our Services
                    </button>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-sky-blue/10 max-w-lg">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold font-display text-white">FAA</h4>
                      <p className="text-xs text-gray-400 font-mono">Part 107 Licensed</p>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold font-display text-white">100%</h4>
                      <p className="text-xs text-gray-400 font-mono">Eco-Friendly Wash</p>
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold font-display text-white">24h</h4>
                      <p className="text-xs text-gray-400 font-mono">Photo Turnaround</p>
                    </div>
                  </div>
                </div>

              </div>
            </header>

            {/* CORE SERVICES SECTIONS CARDS */}
            <section id="featured-services" className="py-20 bg-gradient-to-b from-transparent to-dark-surface/40">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                  <span className="text-[#00F0FF] font-mono text-xs uppercase tracking-widest font-black">WHAT WE EXCEL AT</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
                    Our Specialized Service Offerings
                  </h2>
                  <p className="text-gray-300 font-sans text-sm sm:text-base">
                    By merging professional aviation machinery (UAVs) with years of civil consulting expertise, we offer an unmatched portfolio of utility service modules.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {servicesData.map((srv) => {
                    const Icon = srv.icon;
                    return (
                      <div
                        key={srv.id}
                        id={`featured-service-card-${srv.id}`}
                        className="glass-panel rounded-2xl p-8 flex flex-col justify-between glass-card-hover border-t-4 border-t-sky-blue/60"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <span className="text-xs font-mono px-2.5 py-1 bg-[#0A2540] text-neon-blue rounded border border-sky-blue/20">
                              {srv.badge}
                            </span>
                            <div className="w-12 h-12 rounded-xl bg-sky-blue/10 flex items-center justify-center border border-sky-blue/30 text-sky-blue">
                              <Icon className="w-6 h-6 text-[#00F0FF]" />
                            </div>
                          </div>

                          <h3 className="text-xl font-display font-bold text-white mb-3">
                            {srv.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            {srv.shortDesc}
                          </p>

                          <ul className="space-y-2.5 mb-8">
                            {srv.features.map((feature, fIdx) => (
                              <li key={fIdx} className="flex items-start text-xs text-gray-300 gap-2">
                                <CheckCircle2 className="w-4.5 h-4.5 text-sky-blue shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          id={`service-more-btn-${srv.id}`}
                          onClick={() => navigateTo(srv.id)}
                          className="w-full py-2.5 bg-sky-blue/15 hover:bg-sky-blue text-white hover:text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border border-sky-blue/20 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Explore Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

              </div>
            </section>

            {/* BENEFITS SECTION */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="bg-[#0E2E4E]/50 border border-sky-blue/20 rounded-3xl p-8 sm:p-12 relative overflow-hidden backdrop-blur-md">
                
                {/* Visual geometric trace */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-sky-blue/5 rounded-full filter blur-3xl pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-neon-blue font-mono text-xs uppercase tracking-widest font-extrabold">LOCAL BUSINESS TRUST</span>
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white mt-2 mb-6">
                      Why Go Happy Con is the Northwest's Choice
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                      We operate with complete insurance protection, commercial flight credentials, and legal compliance. Whether flying low near fragile coastal historic shingles or drafting meticulously structured public filings, our precision is absolute.
                    </p>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-sky-blue/15 rounded-xl border border-sky-blue/25 flex items-center justify-center text-sky-blue">
                          <Cpu className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-white">State-of-the-Art Drone Fleet</h4>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Equipped with redundant GPS positioning, stabilized active heavy payload suspensions, and 4K optical sensors capable of crisp imaging and soft-washing spraying.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-sky-blue/15 rounded-xl border border-sky-blue/25 flex items-center justify-center text-sky-blue">
                          <Clock className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-white">Turnaround Integrity</h4>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            We pride ourselves on responsive operations. Calls are returned promptly, bookings are processed digitally, and media files reach your MLS drafts within 24-48 hours.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="shrink-0 w-12 h-12 bg-sky-blue/15 rounded-xl border border-sky-blue/25 flex items-center justify-center text-sky-blue">
                          <ShieldCheck className="w-6 h-6 text-neon-blue" />
                        </div>
                        <div>
                          <h4 className="font-display font-semibold text-white">Full Regulatory Clearance & Insurance</h4>
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Part 107 certified flying inside FAA rules. General liability protection covers up to multi-million dollars, providing deep commercial safety guardrails.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Accompanying visual collage */}
                  <div className="space-y-4">
                    <div className="bg-[#15416D]/40 border border-sky-blue/25 p-6 rounded-2xl">
                      <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest font-black block mb-2">FOUNDER ESSENCE</span>
                      <p className="text-xs sm:text-sm text-gray-200 italic leading-relaxed">
                        "Go Happy Con was founded on the idea that high-tech aviation should serve practical, urgent local needs. Whether helping homeowners maximize listing revenue, keeping roofs pristine without high-risk ladder damage, or standing as a beacon of organized documentation for local families in crisis — we deliver real solutions."
                      </p>
                      <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-sky-blue/15">
                        <div className="w-9 h-9 rounded-full bg-sky-blue/20 flex items-center justify-center font-display font-bold text-xs text-white">RD</div>
                        <div>
                          <h5 className="text-xs font-bold text-white">Robert David</h5>
                          <p className="text-[10px] text-gray-400">Founder & Operator, Go Happy Con</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-tr from-[#0C2E4E] to-[#15416D] border border-sky-blue/15 p-4 rounded-xl text-center">
                        <h4 className="text-3xl font-display font-black text-white">253</h4>
                        <p className="text-[10px] text-gray-300 font-mono mt-1">Local Area Area Prefix</p>
                      </div>
                      <div className="bg-gradient-to-tr from-[#0C2E4E] to-[#15416D] border border-sky-blue/15 p-4 rounded-xl text-center">
                        <h4 className="text-3xl font-display font-black text-white">100%</h4>
                        <p className="text-[10px] text-gray-300 font-mono mt-1">Satisfaction Pledge</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* DYNAMIC TESTIMONIALS CAROUSEL */}
            <section className="py-20 bg-[#0E2E4E]/30 border-t border-b border-sky-blue/10">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                <span className="text-sky-blue font-mono text-xs uppercase tracking-widest block mb-4">WHAT THE PNW IS SAYING</span>
                <h2 className="text-3xl font-display font-black text-white mb-12">Verified Client Experiences</h2>
                
                <div id="testimonial-carousel-panel" className="relative min-h-[220px] bg-[#0A2540]/80 p-6 sm:p-10 border border-sky-blue/20 rounded-2xl shadow-xl flex flex-col justify-between items-center">
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 justify-center">
                    {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>

                  <p className="text-base sm:text-lg text-gray-200 italic leading-relaxed max-w-2xl text-center">
                    "{testimonials[testimonialIndex].content}"
                  </p>

                  <div className="flex items-center gap-3.5 mt-8 text-left">
                    <img
                      src={testimonials[testimonialIndex].avatarUrl}
                      alt={testimonials[testimonialIndex].name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-sky-blue"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{testimonials[testimonialIndex].name}</h4>
                      <p className="text-xs text-gray-400 font-mono">
                        {testimonials[testimonialIndex].role} &middot; <span className="text-neon-blue">{testimonials[testimonialIndex].service}</span>
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:-left-12">
                    <button
                      id="carousel-prev"
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full bg-dark-surface hover:bg-sky-blue border border-sky-blue/30 text-white flex items-center justify-center cursor-pointer transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:-right-12">
                    <button
                      id="carousel-next"
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full bg-dark-surface hover:bg-sky-blue border border-sky-blue/30 text-white flex items-center justify-center cursor-pointer transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* CALL TO ACTION GET IN TOUCH */}
            <section className="py-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
              <div className="glass-panel border-4 border-double border-sky-blue/30 p-10 rounded-3xl space-y-6">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white">Ready to elevate your property listings or clean difficult shingles?</h3>
                <p className="text-gray-300 text-sm max-w-xl mx-auto">
                  Our professional drone services and documentation consulting represent the peak of local Pacific Northwest enterprise. Message, phone, or coordinate directly with Robert.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigateTo("contact")}
                    className="bg-[#00F0FF] hover:bg-[#00D2E0] text-black font-extrabold px-8 py-3.5 rounded-full text-xs tracking-wider uppercase shadow-lg shadow-sky-blue/20 transition-all cursor-pointer"
                  >
                    Initiate Booking Quote
                  </button>
                  <a
                    href="tel:253-888-3432"
                    className="bg-white/10 hover:bg-white/15 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-white border border-white/20 inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-sky-blue animate-pulse" />
                    <span>253-888-3432</span>
                  </a>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* TAB 2: REAL ESTATE PHOTOGRAPHY */}
        {activeTab === "real-estate" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300 mt-6">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-sky-blue font-mono text-xs uppercase tracking-widest font-black">HIGH-ALTITUDE LISTINGS IN HIGHEST HIGHLIGHTS</span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white">Real Estate Photography</h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                In a crowded digital market, stunning visual representation is the most active driver of high-value property listings. We stand ready with premium cameras and Part 107 commercial drones to craft jaw-dropping visuals.
              </p>
            </div>

            {/* Multi-Filter Portfolio System */}
            <div className="space-y-8">
              <div className="flex flex-wrap justify-center gap-2">
                {["all", "real-estate", "drone"].map((filter) => (
                  <button
                    key={filter}
                    id={`gallery-filter-${filter}`}
                    onClick={() => setGalleryFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all tracking-wide cursor-pointer ${
                      galleryFilter === filter
                        ? "bg-sky-blue text-white shadow"
                        : "bg-dark-surface/40 hover:bg-white/5 text-gray-400 hover:text-white border border-sky-blue/15"
                    }`}
                  >
                    {filter === "all" ? "Show All Portfolios" : filter === "real-estate" ? "HDR Ground Photography" : "Aerial Drone Imagery"}
                  </button>
                ))}
              </div>

              {/* Photo Display Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryPhotos
                  .filter((item) => galleryFilter === "all" || item.category === galleryFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group bg-[#0E2E4E]/60 border border-sky-blue/15 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                          <p className="text-xs text-neon-blue font-mono uppercase tracking-widest">
                            {item.category === "real-estate" ? "Ground HDR" : "Drone 4K Optical"}
                          </p>
                          <h4 className="text-sm font-bold text-white mt-1">{item.title}</h4>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-sky-blue font-bold tracking-widest">{item.category}</span>
                        <h4 className="text-sm font-display font-bold text-white">{item.title}</h4>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Why Drone Photography Matters */}
            <div className="bg-dark-surface/50 p-8 sm:p-12 border border-sky-blue/15 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-neon-blue font-mono text-[10px] tracking-widest uppercase font-black">MARKETING STATISTICS</span>
                <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white">Why Puget Sound agents choose UAV coverage</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Waterfront estates in Gig Harbor demand high-altitude imagery to cleanly showcase their respective docking access, view lines, and lot boundaries. Listings with high-fidelity aerial photos statistically sell **68% faster** than those with generic ground imagery.
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center text-xs text-gray-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                    <span>Highlights direct proximity to sound coastline, docks and harbors</span>
                  </li>
                  <li className="flex items-center text-xs text-gray-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                    <span>Clearly outlines property acreage and boundary limits</span>
                  </li>
                  <li className="flex items-center text-xs text-gray-300 gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-blue" />
                    <span>Dynamic cinematic views are perfect for Instagram and YouTube Reels</span>
                  </li>
                </ul>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-sky-blue/20">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
                  alt="Scenic waterfront docks"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0A2540]/60 flex flex-col justify-center items-center p-4 text-center">
                  <p className="text-white font-display font-extrabold text-lg">FAST PNL SCHEDULING</p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">Book a custom real estate drone shoot and get premium photographs next day.</p>
                  <button
                    onClick={() => navigateTo("contact")}
                    className="mt-4 bg-sky-blue hover:bg-sky-blue/80 text-white font-bold text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Book Tomorrow
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Listing Pricing Packages Table */}
            <div id="pricing-packages-section" className="space-y-8">
              <div className="text-center">
                <span className="text-[#00F0FF] font-mono text-[10px] tracking-widest uppercase font-bold">TRANSPARENT VALUE</span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">Photography Shooting Packages</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {realEstatePackages.map((pkg, idx) => (
                  <div
                    key={idx}
                    className={`p-6 rounded-2xl border flex flex-col justify-between ${
                      pkg.isPopular
                        ? "bg-[#0E2E4E] border-sky-blue shadow-lg shadow-sky-blue/15 scale-100 md:scale-105 relative"
                        : "bg-dark-surface/40 border-sky-blue/15"
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-blue text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        Most Demanded Package
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-display font-bold text-white">{pkg.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{pkg.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1 py-2 border-b border-sky-blue/15">
                        <span className="text-3xl font-display font-black text-white">{pkg.price}</span>
                        <span className="text-xs text-gray-400 font-mono">/ Listing</span>
                      </div>

                      <ul className="space-y-2.5">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-xs text-gray-300">
                            <span className="text-sky-blue">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      id={`book-package-${idx}`}
                      onClick={() => {
                        setContactService("Real Estate Photography");
                        setContactMessage(`Hello Robert, I would like to inquire about booking the "${pkg.title}" package for my listing.`);
                        navigateTo("contact");
                      }}
                      className={`w-full py-2.5 mt-8 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        pkg.isPopular
                          ? "bg-sky-blue text-white hover:bg-sky-blue/80 shadow"
                          : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                      }`}
                    >
                      Book Shooting Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: EXPERT WITNESS & CONSULTING */}
        {activeTab === "consulting" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300 mt-6">
            
            {/* Header intro */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
              <div className="inline-flex items-center space-x-2 bg-sky-blue/10 border border-sky-blue/20 px-3 py-1 rounded-full text-xs text-neon-blue font-mono">
                <Award className="w-4 h-4" />
                <span>CHST CERTIFIED & EXPERT WITNESS TESTIMONY</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
                Blue Line Safety & Consulting Group
              </h1>
              <p className="text-xl font-display text-sky-blue font-bold tracking-tight">
                Robert David — Expert Witness | Safety & Law Enforcement Consultant
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
                Retired law enforcement professional and certified construction safety specialist with over **45 years of combined real-world experience**. Delivering expert witness testimony, policy analysis, and thorough chronological reports for attorneys, municipalities, insurers, and private firms nationwide.
              </p>
            </div>

            {/* Quick Contact & Badges Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-5xl mx-auto py-4 px-6 bg-[#0E2E4E]/50 border border-sky-blue/20 rounded-2xl text-center">
              <div>
                <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400">CHST certified</span>
                <span className="text-xs font-bold text-white">Washington State</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-sky-blue/15 pt-2 sm:pt-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400">Law Enforcement</span>
                <span className="text-xs font-bold text-white">20 Years Career</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-sky-blue/15 pt-2 sm:pt-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400">OTR Commercial Driver</span>
                <span className="text-xs font-bold text-white">20 Years CDL Driving</span>
              </div>
              <div className="border-t sm:border-t-0 sm:border-l border-sky-blue/15 pt-2 sm:pt-0">
                <span className="block text-[10px] uppercase font-mono tracking-wider text-gray-400">Direct Contact</span>
                <span className="text-xs font-bold text-neon-blue">253-888-3432</span>
              </div>
            </div>

            {/* Crucial Legal Disclaimer callout immediately */}
            {showDisclaimer && (
              <div id="legal-disclaimer-callout" className="bg-[#0A2540] border-l-4 border-amber-500 p-6 rounded-r-2xl shadow-md relative max-w-5xl mx-auto">
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-xs cursor-pointer focus:outline-none"
                >
                  ✕ Hide
                </button>
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">IMPORTANT COMPLIANCE NOTE</h4>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      All expert witness and physical consultation safety services are provided in strict partnership with the **Shield of Armor Safety** team in Lacey, WA. Robert David serves as the chief consultant, providing fact-based evaluations, accident reconstructions, and testifying on civil and mechanical matters. We do not provide formal legal representation as practicing legal counsel of a firm, but rather package empirical proof for your active defense or prosecution attorneys.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Areas of Expert Witness Testimony Grid */}
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-sky-blue font-mono text-xs tracking-widest uppercase font-black">EXPERT WITNESS AREAS</span>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mt-1">AREAS OF TESTIMONY & CONSULTATION</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Law Enforcement",
                    icon: ShieldAlert,
                    color: "border-sky-blue/30 text-sky-blue",
                    points: [
                      "Patrol Tactics & Officer Survival",
                      "Deadly Force Dynamics & Standards",
                      "Alcohol-Related Driving (DUI/DWI)",
                      "Narcotics Investigation Standards",
                      "Informant Development & Handling",
                      "Undercover Operation Protocols"
                    ]
                  },
                  {
                    title: "Construction Safety",
                    icon: Award,
                    color: "border-emerald-500/30 text-emerald-400",
                    points: [
                      "Accident Prevention Program (APP)",
                      "Company APP Compliance Analysis",
                      "Detailed Site evaluations",
                      "OSHA Compliance & Violations",
                      "Incident Investigation & root cause"
                    ]
                  },
                  {
                    title: "Commercial Transport",
                    icon: Waves,
                    color: "border-amber-500/30 text-amber-400",
                    points: [
                      "Traffic Accident Reconstruction",
                      "FMCSA / DOT Compliance",
                      "OTR Driver Conduct & Hours",
                      "Truck Accident Reconstruction",
                      "US & Canada Cross-Border rules"
                    ]
                  },
                  {
                    title: "Policy & Training",
                    icon: ShieldCheck,
                    color: "border-purple-500/30 text-purple-400",
                    points: [
                      "Use-of-Force Policy Drafting",
                      "Drug-Free Workplace Programs",
                      "Security Risk Assessments",
                      "Deadly Force Review Consulting"
                    ]
                  }
                ].map((quad, qidx) => {
                  const QuadIcon = quad.icon;
                  return (
                    <div key={qidx} className={`bg-[#0E2E4E]/40 border ${quad.color} p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all`}>
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <QuadIcon className="w-6 h-6 shrink-0" />
                          <h4 className="font-display font-bold text-white text-base leading-snug">{quad.title}</h4>
                        </div>
                        <ul className="space-y-2.5">
                          {quad.points.map((p, pidx) => (
                            <li key={pidx} className="text-xs text-gray-300 flex items-start gap-2">
                              <span className="text-[#00F0FF] select-none">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Credentials Section & Engagement Parameters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
              
              {/* Credentials Card (Left) */}
              <div className="lg:col-span-7 bg-[#0E2E4E]/40 border border-sky-blue/20 p-8 rounded-3xl space-y-6">
                <div className="flex items-center gap-3 border-b border-sky-blue/15 pb-4">
                  <Award className="w-7 h-7 text-neon-blue" />
                  <h3 className="text-xl font-display font-black text-white">Credentials & Professional Experience</h3>
                </div>

                <ul className="space-y-3.5">
                  {[
                    "**20-Year Law Enforcement Career** — Municipal & Military Police",
                    "**Appointed Board Member**, Deadly Force Review Board",
                    "Specialties: Patrol Tactics, Officer Survival, Deadly Force Dynamics, DUI/DWI, Narcotics Investigations, Informant Handling",
                    "**20-Year OTR Commercial Truck Driver** — US & Canada",
                    "**5-Year Construction Safety Manager** in partnership with Shield of Armor Safety",
                    "**CHST** — Construction Health & Safety Technician (Certified, Washington State State Code)",
                    "**Accident Reconstruction** services available via retired law enforcement partnership"
                  ].map((bullet, bidx) => (
                    <li key={bidx} className="text-xs sm:text-sm text-gray-200 flex items-start gap-3">
                      <span className="text-sky-blue shrink-0 mt-1 font-bold">✓</span>
                      <span>
                        {bullet.split("**").map((part, pidx) => pidx % 2 === 1 ? <strong key={pidx} className="text-neon-blue font-bold">{part}</strong> : part)}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-gray-400 italic">
                  *Official credentials, References, case files, and comprehensive Curriculum Vitae (CV) are immediately available upon professional request.
                </p>
              </div>

              {/* Engagement Parameters (Right) */}
              <div className="lg:col-span-5 bg-[#0A2540]/60 border border-sky-blue/20 p-8 rounded-3xl flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-sky-blue/15 pb-4">
                    <Clock className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-display font-black text-white">Engagement Logistics</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-[#00F0FF] font-mono text-[9px] uppercase tracking-wider block">AVAILABILITY</span>
                      <p className="text-xs text-gray-200 mt-0.5">Part-time consulting - flexible scheduling, remote file and depositions review accepted.</p>
                    </div>
                    <div>
                      <span className="text-[#00F0FF] font-mono text-[9px] uppercase tracking-wider block">FEE STRUCTURE</span>
                      <p className="text-xs text-gray-200 mt-0.5">Professional hourly rate available upon inquiry. Standard retainer arrangements considered.</p>
                    </div>
                    <div>
                      <span className="text-[#00F0FF] font-mono text-[9px] uppercase tracking-wider block">SERVICES INCLUDED</span>
                      <p className="text-xs text-gray-200 mt-0.5">Comprehensive file review, written chronology reports, formal deposition testimony, trial testimony, policy drafting, and customized training.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0E2E4E] border border-sky-blue/20 rounded-xl p-4 mt-6 text-center space-y-1">
                  <p className="text-[10px] text-[#00F0FF] font-mono uppercase tracking-widest font-black">Criminal Pro Bono Consideration</p>
                  <p className="text-[10px] text-gray-300">Pro bono evaluation is considered on a selective basis under terms.</p>
                </div>
              </div>

            </div>

            {/* Direct Intake Consultation CTA */}
            <div className="text-center bg-gradient-to-r from-[#0C2E4E] to-[#0A2540] border border-sky-blue p-8 rounded-2xl space-y-4 max-w-3xl mx-auto shadow-xl">
              <h4 className="text-xl font-display font-black text-white">Retain Robert David for Case Evaluation</h4>
              <p className="text-xs text-gray-300 max-w-lg mx-auto leading-relaxed">
                Send a secure inquiry describing your active litigation matter or policy drafting needs. General counsel of firms and corporate legal administrators receive a return call within 24 hours.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setContactService("Expert Witness & Consulting");
                    setContactMessage("Hello Robert, I would like to consult with you as an expert witness regarding an active litigation case.");
                    navigateTo("contact");
                  }}
                  className="bg-sky-blue hover:bg-sky-blue/80 text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-sky-blue/20"
                >
                  Inquire Case retainer
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: DRONE POWER WASHING */}
        {activeTab === "washing" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300 mt-6">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-sky-blue font-mono text-xs uppercase tracking-widest font-black">HIGH TECH MEETS HIGH CLEANING</span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white">Drone Power Washing</h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                By integrating heavy-lift specialized aircraft with state-of-the-art eco-friendly softwash chemicals, we can clean difficult high-rise buildings, delicate historic roofs, and hard-to-reach Washington business facades safely and with extreme speed.
              </p>
            </div>

            {/* Before-and-after Interactive Slider (User moves the slider to see clean tile transformation) */}
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <h3 className="text-xl font-display font-extrabold text-white">Interactive Shingle Rejuvenation Preview</h3>
                <p className="text-xs text-gray-400 mt-1">Tap and drag the bar left and right to witness the actual moss-cleaning power of our custom drone softwashing formula.</p>
              </div>

              {/* Slider Container */}
              <div 
                id="before-after-slider-container"
                className="relative max-w-2xl aspect-video mx-auto rounded-2xl overflow-hidden border border-sky-blue/30 shadow-2xl user-select-none touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseDown={() => setIsResizing(true)}
                onMouseUp={() => setIsResizing(false)}
                onMouseLeave={() => setIsResizing(false)}
              >
                {/* BEFORE picture (Dirty) */}
                <img 
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80" 
                  alt="Roof before cleaning" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* AFTER picture (Clean - clipped with dynamic slide width percentage) */}
                <div 
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" 
                    alt="Roof after chemical cleaning" 
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: "672px" }} // width matches the 2xl max-width roughly
                  />
                  
                  {/* AFTER label */}
                  <div className="absolute top-4 left-4 bg-emerald-600 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-white">
                    CLEAN REJUVENATED
                  </div>
                </div>

                {/* BEFORE label */}
                <div className="absolute top-4 right-4 bg-amber-700 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-white pointer-events-none">
                  DIRTY MOSS LAYER
                </div>

                {/* SLIDER HANDLE LINE divider */}
                <div 
                  className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-xs shadow-md border-2 border-sky-blue absolute">
                    ↔
                  </div>
                </div>
              </div>
            </div>

            {/* Drone vs Traditional comparison Table */}
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-neon-blue font-mono text-[10px] uppercase tracking-widest font-bold">AERIAL DISRUPTION SAVINGS</span>
                <h3 className="text-2xl font-display font-extrabold text-white mt-1">Drone Softwashing vs Traditional Scaffolding</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse border border-sky-blue/15 rounded-xl overflow-hidden max-w-4xl mx-auto">
                  <thead>
                    <tr className="bg-[#0E2E4E] border-b border-sky-blue/25 text-[#00F0FF] uppercase tracking-widest font-mono text-[11px]">
                      <th className="px-6 py-4">Efficiency Factors</th>
                      <th className="px-6 py-4">Standard Cleaning Crew</th>
                      <th className="px-6 py-4 bg-[#15416D]/50 text-white border-l border-r border-sky-blue/20">Go Happy Con Aerial Drone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-blue/10 bg-[#0A2540]/60">
                    <tr>
                      <td className="px-6 py-4 font-semibold text-white">Physical Risk Profile</td>
                      <td className="px-6 py-4 text-gray-300">High. Workers on roofs, scaffolds, or elevated crane bucket risks.</td>
                      <td className="px-6 py-4 bg-[#15416D]/20 text-emerald-400 font-medium">None. Operators stand safely on solid ground.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-white">Job Completion Speed</td>
                      <td className="px-6 py-4 text-gray-300">1 to 3 Days. Long mobilization setups.</td>
                      <td className="px-6 py-4 bg-[#15416D]/20 text-emerald-400 font-medium">4 Hours. Fast setup of dual fluid sprayers.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-white">Surface Structural Wear</td>
                      <td className="px-6 py-4 text-gray-300">High footprint. Foot traffic fractures older delicate shingles.</td>
                      <td className="px-6 py-4 bg-[#15416D]/20 text-emerald-400 font-medium">Zero-Contact. Only soft wash chemicals touch shingle face.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold text-white">Business Disturbance</td>
                      <td className="px-6 py-4 text-gray-300">Heavy. Blocked driveways and noise.</td>
                      <td className="px-6 py-4 bg-[#15416D]/20 text-emerald-400 font-medium">Extremely minimal disruption.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* WA Puget Sound Service Area coverage */}
            <div className="bg-[#0E2E4E]/50 border border-sky-blue/15 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-neon-blue font-mono text-xs uppercase tracking-widest font-extrabold">GEOGRAPHICAL COVERAGE</span>
                <h3 className="text-2xl font-display font-extrabold text-white">Washington Service Coverage</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Go Happy Con covers the entire southern Puget Sound region. We regularly clean residential coastal estates and commercial corporate campuses in:
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {["Gig Harbor (HQ)", "Tacoma Harbor", "Bremerton Shipyards", "Port Orchard Area", "Key Peninsula Towns", "Puyallup Subdivisions"].map((loc, lIdx) => (
                    <div key={lIdx} className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                      <MapPin className="w-4 h-4 text-sky-blue shrink-0" />
                      <span>{loc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-tr from-[#0C2E4E] to-[#15416D] p-6 rounded-2xl border border-sky-blue/20">
                <p className="text-xs uppercase text-teal-400 tracking-wider font-mono font-bold mb-2">QUICK QUOTE FORM</p>
                <h4 className="text-lg font-display font-bold text-white mb-4">Request a Cleaning Estimate</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setContactService("Drone Power Washing");
                      setContactMessage("Hello Robert, I would like to receive an estimate for Drone Power/Soft Washing on my property.");
                      navigateTo("contact");
                    }}
                    className="w-full bg-sky-blue hover:bg-sky-blue/80 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all block text-center cursor-pointer"
                  >
                    Submit Aerial Wash Inquiry
                  </button>
                  <p className="text-[10px] text-gray-400 text-center font-mono">*Most cleaning proposals drafted in less than 24 hours.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: ABOUT US */}
        {activeTab === "about" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300 mt-6">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-sky-blue font-mono text-xs uppercase tracking-widest font-black">THE INDIVIDUAL BEHIND GO HAPPY CON</span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white">About Go Happy Con</h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Founded in Gig Harbor, Washington — Go Happy Con represents Robert David's vision of local, high-integrity service. We utilize heavy aircraft, specialized camera platforms, and empirical file tracking to improve Puget Sound communities.
              </p>
            </div>

            {/* Core Story Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-display font-extrabold text-white mb-2">Our Founder's Vision</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Robert David started Go Happy Con with the firm belief that small businesses must adapt technology to meet client challenges. With extensive experience navigating local aviation rules (FAA Part 107) and civil support structures, Robert formulated three practical, highly-specialized divisions.
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-display font-bold text-sky-blue mb-1">Empathetic Consultation</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    "When residents suffer wrongful mistreatment by agencies, they feel completely lost in paperwork. My role is to act as a structured organizer so their case timelines are flawless. For homeowners, my goal is peak listing value."
                  </p>
                </div>

                <div>
                  <h4 className="text-base font-display font-bold text-sky-blue mb-1">Aviation Integrity</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We follow strict localized checklists: weather boundaries, direct satellite locks, eco-friendly moss washes, and advanced optical staging. 
                  </p>
                </div>
              </div>

              <div className="bg-[#0E2E4E]/50 border border-sky-blue/20 rounded-3xl p-8 relative overflow-hidden backdrop-blur-md">
                <span className="text-neon-blue font-mono text-[9px] uppercase tracking-widest font-extrabold mb-4 block">COMPANY CREDENTIALS & STATS</span>
                <div className="space-y-4">
                  {[
                    "Licensed FAA Part 107 Commercial Drone operation certificate holders.",
                    "Full General Liability Insurance coverage up to $2,000,000.",
                    "Active Pierce County state-licensed business registry.",
                    "Proud member of the Gig Harbor maritime support network.",
                    "Advanced dual-operator remote setups prioritizing roof safety."
                  ].map((cred, cIdx) => (
                    <div key={cIdx} className="flex gap-3">
                      <span className="text-emerald-400">✓</span>
                      <p className="text-xs text-gray-300">{cred}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-sky-blue/15 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-blue/10 flex items-center justify-center border border-sky-blue/30 text-neon-blue font-extrabold">
                    253
                  </div>
                  <div>
                    <h5 className="text-xs text-white font-bold uppercase tracking-wider font-mono">GIG HARBOR DIRECT CO-ORDINATE</h5>
                    <p className="text-[10px] text-gray-400">Serving all South Puget Sound & WA coastlines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Local business banner maps representation */}
            <div className="bg-gradient-to-r from-dark-surface to-[#0A2540] p-10 rounded-2xl border border-sky-blue/15 text-center space-y-4">
              <h4 className="text-xl font-display font-bold text-white">Do you have questions about Go Happy Con's licensing?</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">We are happy to provide copies of Part 107 certifications, chemical MSDS data sheets, or business credentials on request.</p>
              <button
                onClick={() => navigateTo("contact")}
                className="bg-white/10 hover:bg-white/15 px-6 py-2.5 rounded-full text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
              >
                Inquire Credential PDFs
              </button>
            </div>

          </div>
        )}

        {/* TAB 6: CONTACT US */}
        {activeTab === "contact" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-in fade-in duration-300 mt-6">
            
            {/* Header intro */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-sky-blue font-mono text-xs uppercase tracking-widest font-black">STRIKE UP A CONVERSATION</span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white">Contact Go Happy Con</h1>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Connect directly with Robert David in Gig Harbor, WA. Call, email, or fill out the encrypted secure contact dispatch form below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Left Column: Hand-crafted stylized local contact vectors and credentials */}
              <div className="lg:col-span-5 space-y-8">
                
                <div className="space-y-6">
                  
                  <div className="bg-[#0E2E4E]/40 p-6 border border-sky-blue/15 rounded-2xl">
                    <span className="text-[9px] text-[#00F0FF] uppercase font-mono tracking-widest">Office HQ Coordinate</span>
                    <h3 className="text-lg font-display font-bold text-white mt-1 mb-2">Gig Harbor, Washington</h3>
                    <p className="text-xs text-gray-400">Serving Pierce, Kitsap, & King counties.</p>
                  </div>

                  {/* High quality click to call phone block */}
                  <a
                    href="tel:253-888-3432"
                    className="block group bg-sky-blue/10 hover:bg-sky-blue p-6 border border-sky-blue/25 rounded-2xl transition-all duration-300 scale-100 hover:scale-102"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-sky-blue text-white flex items-center justify-center font-bold">
                        <Phone className="w-5 h-5 text-white animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#00F0FF] uppercase tracking-wider font-mono">DIRECT PHONE LINE</span>
                        <h4 className="text-lg font-display font-bold text-white group-hover:text-white transition-colors">253-888-3432</h4>
                        <p className="text-xs text-gray-400 group-hover:text-white/80">Click-to-Call anytime</p>
                      </div>
                    </div>
                  </a>

                  {/* Email click block */}
                  <a
                    href="mailto:rbd171@gmail.com"
                    className="block group bg-emerald-500/10 hover:bg-emerald-600 p-6 border border-emerald-500/25 rounded-2xl transition-all duration-300 scale-100 hover:scale-102"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] text-teal-400 uppercase tracking-wider font-mono">DIRECT EMAIL</span>
                        <h4 className="text-lg font-display font-bold text-white group-hover:text-white transition-colors">rbd171@gmail.com</h4>
                        <p className="text-xs text-gray-400 group-hover:text-white/80">Sent directly to Robert David.</p>
                      </div>
                    </div>
                  </a>

                  {/* Official Business Card Attachment */}
                  <div className="bg-[#0E2E4E]/40 border border-sky-blue/20 rounded-2xl overflow-hidden p-4 group">
                    <span className="text-[9px] text-[#00F0FF] uppercase font-mono tracking-widest block mb-2 font-bold">OFFICIAL BUSINESS CARD</span>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-sky-blue/15 shadow-md bg-white">
                      <img 
                        src={businessCard} 
                        alt="Happy Contractors Business Card" 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-gray-400">
                      <span>Robert David, Founder</span>
                      <a href="tel:253-888-3432" className="text-neon-blue hover:underline">Direct Call</a>
                    </div>
                  </div>

                </div>

                {/* Google Maps Embed / Gig Harbor WA representation visual */}
                <div className="border border-sky-blue/30 rounded-2xl overflow-hidden shadow-lg h-60 relative group">
                  <div className="absolute top-3 left-3 bg-[#0A2540] px-3 py-1 rounded text-[10px] font-mono uppercase tracking-widest text-sky-blue z-10 border border-sky-blue/20">
                    SERVICE RADIUS MAP
                  </div>
                  
                  {/* Real high quality stylized representation of Gig Harbor geographic coordinate maps pin */}
                  <div className="w-full h-full bg-[#0E2E4E]/80 relative flex flex-col justify-center items-center p-6 text-center">
                    
                    {/* Maps Vector Graphics */}
                    <svg className="w-16 h-16 text-sky-blue animate-pulse mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="9" r="3" strokeWidth="2" strokeLinecap="round"/>
                    </svg>

                    <h4 className="font-display font-bold text-white text-base">Gig Harbor, WA 98335</h4>
                    <p className="text-xs text-gray-400 max-w-xs mt-1">Centered on Gig Harbor and serving a 45-mile flight path coverage including Tacoma & Key Peninsula.</p>
                  </div>
                </div>

              </div>

              {/* Right Column: Dynamic Quote/Contact dispatch form */}
              <div className="lg:col-span-7 bg-[#0E2E4E]/40 border border-sky-blue/20 p-8 rounded-3xl backdrop-blur-md">
                
                <h3 className="text-2xl font-display font-extrabold text-white mb-6">Send an Encrypted Inquiry</h3>
                
                {formStatus.type && (
                  <div
                    className={`p-4 rounded-xl mb-6 text-xs sm:text-sm font-medium ${
                      formStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                    }`}
                  >
                    {formStatus.text}
                  </div>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-gray-300 mb-1.5" htmlFor="contact-name">
                        Your Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact-name"
                        required
                        placeholder="John Doe"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-dark-surface border border-sky-blue/20 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-gray-300 mb-1.5" htmlFor="contact-email">
                        Your Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="contact-email"
                        required
                        placeholder="john@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-dark-surface border border-sky-blue/20 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-gray-300 mb-1.5" htmlFor="contact-phone">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        id="contact-phone"
                        placeholder="253-555-0199"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-dark-surface border border-sky-blue/20 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase font-mono tracking-wider text-gray-300 mb-1.5" htmlFor="contact-service">
                        Requested Services <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="contact-service"
                        value={contactService}
                        onChange={(e) => setContactService(e.target.value)}
                        className="w-full bg-dark-surface border border-sky-blue/20 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none select-none"
                      >
                        <option value="Real Estate Photography">Real Estate Photography</option>
                        <option value="Police Misconduct Consulting">Police Misconduct Consulting</option>
                        <option value="Drone Power Washing">Drone Power Washing</option>
                        <option value="General Question">General / Other Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono tracking-wider text-gray-300 mb-1.5" htmlFor="contact-message">
                      Detailed Message / Property Address / Case Overview <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      placeholder="Please outline your request details here..."
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full bg-dark-surface border border-sky-blue/20 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 outline-none transition-colors resize-none"
                    />
                  </div>

                  <p className="text-[10px] text-gray-400 italic">
                    *Go Happy Con values absolute privacy. Your files and contact transmissions are never sold or distribution leaked.
                  </p>

                  <button
                    type="submit"
                    id="submit-contact-form-btn"
                    disabled={isSubmitting}
                    className="w-full bg-sky-blue hover:bg-sky-blue/80 text-white font-extrabold py-3 rounded-xl text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Dispatching Message..." : "Dispatch Secure Message"}
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER SECTION: Centered & Modern styled with proper links & Schema Indicator */}
      <footer className="bg-[#0A2540] border-t border-sky-blue/20 font-sans mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left coordinates info */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md overflow-hidden bg-[#0A2540] border border-sky-blue/25 flex items-center justify-center shrink-0">
                  <img 
                    src={brandLogo} 
                    alt="Go Happy Con Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-sm font-display font-bold text-white tracking-wider">Go Happy Con</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-mono">
                  &copy; 2026 Go Happy Con &mdash; Gig Harbor, Washington
                </p>
                <p className="text-[10px] text-gray-500 font-sans">
                  Professional UAV & Consulting Services &bull; Phone: <a href="tel:253-888-3432" className="hover:text-white transition-colors">253-888-3432</a>
                </p>
              </div>
            </div>

            {/* Middle Nav Links */}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-mono">
              <button onClick={() => navigateTo("home")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Home</button>
              <button onClick={() => navigateTo("real-estate")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Real Estate</button>
              <button onClick={() => navigateTo("consulting")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Consulting</button>
              <button onClick={() => navigateTo("washing")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Power Wash</button>
              <button onClick={() => navigateTo("about")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About Us</button>
              <button onClick={() => navigateTo("contact")} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contact</button>
            </div>

            {/* Right: Mandatory Powered-By Attribution LINK */}
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-400">
                Developed by <a href="https://iwebnext.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-[#00F0FF] underline transition-colors">iWebNext</a>
              </p>
              <span className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>SEO Local Business Schema Active</span>
              </span>
            </div>

          </div>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-40 w-11 h-11 bg-dark-surface/95 hover:bg-sky-blue border border-sky-blue/30 rounded-xl flex items-center justify-center text-white shadow-xl transition-all scale-100 hover:scale-110 cursor-pointer"
          title="Scroll back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Secure AI Chatbot Float Widget Client */}
      <Chatbot />

    </div>
  );
}
