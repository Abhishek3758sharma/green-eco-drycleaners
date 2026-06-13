export const BUSINESS = {
  name: "Green Eco Drycleaners",
  address: "Shop No. 4, Near Regal Gardens, Sector-90, Gurugram, Haryana",
  phones: ["8796422972", "9517401294"],
  primaryPhone: "8796422972",
  whatsapp: "919517401294",
  hours: [
    { day: "Monday – Saturday", time: "8:00 AM – 9:00 PM" },
    { day: "Sunday", time: "9:00 AM – 7:00 PM" },
  ],
  email: "greenecodrycleaners@gmail.com",
};

export interface Service {
  name: string;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  category: "Men's Wear" | "Women's Wear" | "Home Care";
}

export const SERVICES_DATA: Service[] = [
  // Men's Wear
  { name: "Gents Suit 2 Pcs.", price: 370, category: "Men's Wear" },
  { name: "Gents Suit 3 Pcs.", price: 500, category: "Men's Wear" },
  { name: "Coat / Blazer", price: 250, category: "Men's Wear" },
  { name: "Jacket (Light)", price: 250, category: "Men's Wear" },
  { name: "Jacket (Heavy)", price: 300, category: "Men's Wear" },
  { name: "Half Sweater", price: 150, category: "Men's Wear" },
  { name: "Full Sweater", price: 180, category: "Men's Wear" },
  { name: "Long Coat", price: 300, category: "Men's Wear" },
  { name: "Long Coat (Heavy)", price: 350, category: "Men's Wear" },
  { name: "Cap / Hat", price: 100, category: "Men's Wear" },
  { name: "Tie", price: 70, category: "Men's Wear" },
  { name: "Pant", price: 120, category: "Men's Wear" },
  { name: "Shirt / T-Shirt", price: 120, category: "Men's Wear" },
  { name: "T-Shirt FS", price: 120, category: "Men's Wear" },
  { name: "Baby T-Shirt", price: 100, category: "Men's Wear" },
  { name: "Jeans", price: 120, category: "Men's Wear" },
  { name: "Kurta Payjama", price: 250, category: "Men's Wear" },
  { name: "Achkan", price: 300, category: "Men's Wear" },
  { name: "Sherwani (Simple)", price: 400, category: "Men's Wear" },
  { name: "Sherwani (Heavy Work)", price: 600, category: "Men's Wear" },
  { name: "Sweat Shirt", price: 150, category: "Men's Wear" },
  { name: "Waistcoat", price: 150, category: "Men's Wear" },
  { name: "Turban (Pagri)", price: 200, category: "Men's Wear" },
  
  // Women's Wear
  { name: "Saree Plain", price: 250, category: "Women's Wear" },
  { name: "Saree (Heavy/Designer)", minPrice: 350, maxPrice: 600, category: "Women's Wear" },
  { name: "Saree Chark", price: 150, category: "Women's Wear" },
  { name: "Saree Chark Bandani", price: 180, category: "Women's Wear" },
  { name: "Saree Roll Press", price: 120, category: "Women's Wear" },
  { name: "Saree Polish", price: 200, category: "Women's Wear" },
  { name: "Ladies Suit Plain 3 Pcs.", price: 350, category: "Women's Wear" },
  { name: "Ladies Suit Plain 2 Pcs.", price: 250, category: "Women's Wear" },
  { name: "Ladies Suit (Heavy Work)", minPrice: 400, maxPrice: 800, category: "Women's Wear" },
  { name: "Ladies Kurta", price: 150, category: "Women's Wear" },
  { name: "Dupatta (Plain)", price: 80, category: "Women's Wear" },
  { name: "Dupatta (Heavy)", price: 150, category: "Women's Wear" },
  { name: "Salwar / Leggings", price: 100, category: "Women's Wear" },
  { name: "Stole / Scarf", price: 100, category: "Women's Wear" },
  { name: "Blouse Plain", price: 80, category: "Women's Wear" },
  { name: "Blouse (Heavy/Work)", price: 150, category: "Women's Wear" },
  { name: "Petticoat", price: 100, category: "Women's Wear" },
  { name: "Shawl", price: 180, category: "Women's Wear" },
  { name: "Shawl Pashmina", price: 300, category: "Women's Wear" },
  { name: "Lehanga (Simple)", minPrice: 500, maxPrice: 800, category: "Women's Wear" },
  { name: "Lehanga (Heavy/3 Pcs.)", minPrice: 800, maxPrice: 2500, category: "Women's Wear" },
  { name: "Cardigan", price: 180, category: "Women's Wear" },
  { name: "Cardigan (Long)", price: 220, category: "Women's Wear" },
  { name: "Top / Tunics", price: 120, category: "Women's Wear" },
  { name: "Skirt", price: 150, category: "Women's Wear" },
  { name: "Slack / Palazo", price: 120, category: "Women's Wear" },

  // Home Care
  { name: "Blanket (Single)", price: 300, category: "Home Care" },
  { name: "Blanket (Double)", minPrice: 400, maxPrice: 500, category: "Home Care" },
  { name: "Blanket (Heavy/Double)", minPrice: 500, maxPrice: 650, category: "Home Care" },
  { name: "Quilt (Single)", price: 300, category: "Home Care" },
  { name: "Quilt (Double)", minPrice: 400, maxPrice: 600, category: "Home Care" },
  { name: "Bed Sheet (Single)", price: 150, category: "Home Care" },
  { name: "Bed Sheet (Double)", price: 250, category: "Home Care" },
  { name: "Bed Cover (Single)", price: 200, category: "Home Care" },
  { name: "Bed Cover (Double)", price: 300, category: "Home Care" },
  { name: "Cushion Cover", minPrice: 60, maxPrice: 150, category: "Home Care" },
  { name: "Curtain (Per Panel)", minPrice: 200, maxPrice: 350, category: "Home Care" },
  { name: "Curtain (With Lining)", minPrice: 300, maxPrice: 450, category: "Home Care" },
  { name: "Table Cloth", price: 150, category: "Home Care" },
  { name: "Bag (School/Small)", price: 150, category: "Home Care" },
  { name: "Bag (Large/Travel)", minPrice: 300, maxPrice: 600, category: "Home Care" },
  { name: "Carpet (Per Sq. Ft.)", price: 25, category: "Home Care" },
  { name: "Sofa (Per Seat)", minPrice: 250, maxPrice: 400, category: "Home Care" },
  { name: "Bath Mat", price: 100, category: "Home Care" },
  { name: "Soft Toy (Small)", price: 150, category: "Home Care" },
  { name: "Soft Toy (Large)", minPrice: 300, maxPrice: 800, category: "Home Care" },
];

export type OrderStatus = 
  | "Pending" 
  | "Pickup Scheduled" 
  | "Picked Up" 
  | "In Cleaning" 
  | "Ready" 
  | "Out For Delivery" 
  | "Completed";

export type PaymentStatus = 
  | "Pending Payment" 
  | "Pending Verification" 
  | "Verified" 
  | "Pay At Pickup" 
  | "Received" 
  | "Rejected" 
  | "Paid" 
  | "Pending";

export type PaymentMethod = "Online" | "Pickup" | "Cash" | "Later";

export interface OrderItem {
  serviceName: string;
  quantity: number;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface Booking {
  id: number;
  order_id: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  pickup_date: string;
  items: OrderItem[];
  amount_min: number | null;
  amount_max: number | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_screenshot_url?: string;
  transaction_id?: string;
  user_id?: string;
  source: string;
  booking_source: "website" | "counter";
  notes?: string;
  created_at: string;
}

// Generate Order ID in format GE-YYYY-RANDOM
export const generateOrderId = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4 digit random
  return `GE-${year}-${random}`;
};

// Generate Counter Order ID in format GE-COUNTER-XXXX
export const generateCounterOrderId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `GE-COUNTER-${random}`;
};

export const UPI_ID = "bk4945636-1@okicici";
export const MERCHANT_NAME = "Green Eco Drycleaners";

export const calculateOrderTotal = (items: OrderItem[]) => {
  let min = 0;
  let max = 0;
  let hasRange = false;

  items.forEach(item => {
    if (item.price !== undefined) {
      min += item.price * item.quantity;
      max += item.price * item.quantity;
    } else if (item.minPrice !== undefined && item.maxPrice !== undefined) {
      min += item.minPrice * item.quantity;
      max += item.maxPrice * item.quantity;
      hasRange = true;
    }
  });

  return { min, max, hasRange };
};

// Helper to format price for display
export const formatPrice = (service: Service) => {
  if (service.price !== undefined) return `₹${service.price}`;
  if (service.minPrice !== undefined && service.maxPrice !== undefined) {
    return `₹${service.minPrice}–₹${service.maxPrice}`;
  }
  return "-";
};

// Helper for Steam Iron Price
export const getSteamIronPriceDisplay = (service: Service) => {
  if (service.price !== undefined) {
    return `₹${service.price / 2}`;
  }
  return "50% of confirmed price";
};
