export interface FAQItem {
  question: string;
  answer: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "real-estate" | "drone" | "before-after" | "equipment";
  imageUrl: string;
  aspectRatio?: string;
  description?: string;
  beforeUrl?: string; // for power washing before-after
  afterUrl?: string; // for power washing before-after
}

export interface PricingPackage {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatarUrl: string;
  content: string;
  rating: number;
  service: "Real Estate Photography" | "Drone Power Washing" | "Police Misconduct Consulting" | "Expert Witness & Consulting";
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}
