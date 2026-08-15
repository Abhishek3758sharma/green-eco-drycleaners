import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { CheckCircle2, MessageCircle, Phone, Sparkles, CreditCard, Banknote, QrCode, ArrowLeft, ArrowRight, Plus, Trash2, ShoppingCart } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SERVICES_DATA, BUSINESS, formatPrice, getSteamIronPriceDisplay, generateOrderId, UPI_ID, MERCHANT_NAME, calculateOrderTotal, OrderItem } from "@/lib/business";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  head: () => {
    const canonical = "https://greenecodrycleaners.com/book";
    return {
      meta: [
        { title: "Book Pickup — Green Eco Drycleaners" },
        { name: "description", content: "Schedule a free dry cleaning pickup in Gurugram. Professional eco-friendly dry cleaning service at your doorstep. Book online in seconds." },
        { name: "keywords", content: "book dry cleaning pickup gurugram, schedule dry cleaning, online dry cleaning booking, free pickup delivery dry cleaning" },
        { property: "og:title", content: "Book Pickup — Green Eco Drycleaners" },
        { property: "og:description", content: "Schedule a free dry cleaning pickup in Gurugram. Fast, easy, and eco-friendly." },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  component: BookPage,
});

type Form = {
  name: string; mobile: string; email: string; address: string;
  date: string; notes: string;
};

type Step = "services" | "details" | "payment" | "qr_payment" | "success";

function BookPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [step, setStep] = useState<Step>("services");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Service selection state
  const [activeCategory, setActiveCategory] = useState<string>("Men's Wear");
  const [serviceSearch, setServiceSearch] = useState("");
  const [currentService, setCurrentService] = useState(SERVICES_DATA[0].name);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [isSteamIronMode, setIsSteamIronMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setForm(f => ({ 
          ...f, 
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "" 
        }));
      }
    });
  }, []);

  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter(s => 
      s.category === activeCategory && 
      s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [activeCategory, serviceSearch]);

  const addItem = (serviceName?: string) => {
    const targetService = serviceName || currentService;
    const service = SERVICES_DATA.find(s => s.name === targetService)!;
    
    // Check if item already exists to update quantity
    const existingIdx = items.findIndex(it => it.serviceName === `${service.name}${isSteamIronMode ? " (Steam Iron)" : ""}`);
    
    if (existingIdx > -1) {
      const newItems = [...items];
      newItems[existingIdx].quantity += currentQuantity;
      setItems(newItems);
      toast.success("✓ Quantity Updated");
    } else {
      const newItem: OrderItem = {
        serviceName: `${service.name}${isSteamIronMode ? " (Steam Iron)" : ""}`,
        quantity: currentQuantity,
        price: isSteamIronMode && service.price ? service.price / 2 : service.price,
        minPrice: isSteamIronMode && service.minPrice ? service.minPrice / 2 : service.minPrice,
        maxPrice: isSteamIronMode && service.maxPrice ? service.maxPrice / 2 : service.maxPrice,
      };
      setItems([...items, newItem]);
      toast.success("✓ Added to cart");
    }
    
    // Reset quantity for next item
    setCurrentQuantity(1);
  };

  const [form, setForm] = useState<Form>({
    name: "", mobile: "", email: "", address: "",
    date: today, notes: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "Pickup" | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [transInput, setTransInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => calculateOrderTotal(items), [items]);

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validateDetails = () => {
    const er: Partial<Record<keyof Form, string>> = {};
    if (!form.name.trim()) er.name = "Required";
    if (!/^\d{10}$/.test(form.mobile)) er.mobile = "Enter a 10-digit mobile";
    if (!form.address.trim()) er.address = "Required";
    if (!form.date) er.date = "Required";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleBooking = async (method: "Online" | "Pickup") => {
    if (items.length === 0) return alert("Please add at least one service.");
    setPaymentMethod(method);
    if (method === "Pickup") {
      await submitBooking(method, "");
    } else {
      setStep("qr_payment");
    }
  };

  const submitBooking = async (method: "Online" | "Pickup", transId: string) => {
    setLoading(true);
    const newOrderId = generateOrderId();
    console.log("Creating booking...", { orderId: newOrderId, method });

    try {
      const bookingData = {
        order_id: newOrderId,
        user_id: user?.id || null,
        name: form.name,
        mobile: form.mobile,
        email: form.email || null,
        address: form.address,
        pickup_date: form.date,
        items: items,
        amount_min: totals.min,
        amount_max: totals.max,
        status: "Pending",
        payment_method: method,
        payment_status: method === "Online" ? "Pending" : "Pay At Pickup",
        source: "Website",
        booking_source: "website",
        notes: form.notes || null,
        transaction_id: transId || null
      };

      const { error } = await supabase
        .from("bookings")
        .insert([bookingData]);

      if (error) throw error;

      setOrderId(newOrderId);
      setTransactionId(transId);
      setStep("success");
      toast.success("Booking successful!");
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="bg-gradient-soft border-b border-border py-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold">Book a Pickup</h1>
        <div className="mt-4 flex justify-center gap-2 max-w-xs mx-auto px-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${
              (i === 1 && step === "services") || 
              (i === 2 && step === "details") || 
              (i === 3 && (step === "payment" || step === "qr_payment")) ||
              (i === 4 && step === "success")
              ? "bg-primary" : "bg-primary/20"
            }`} />
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-4xl px-4 py-12">
        {step === "services" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Step 1: Select Services
              </h2>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {["Men's Wear", "Women's Wear", "Home Care"].map(c => (
                    <button
                      key={c}
                      onClick={() => setActiveCategory(c)}
                      className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeCategory === c ? "bg-primary text-white shadow-soft" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsSteamIronMode(!isSteamIronMode)}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold border-2 transition-all ${
                      isSteamIronMode ? "bg-primary/10 text-primary border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <Sparkles className="h-4 w-4" /> Steam Iron Mode (50% Off)
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-2 custom-scrollbar border border-border rounded-xl p-4 bg-gray-50/50">
                  {SERVICES_DATA.filter(s => s.category === activeCategory).map(s => (
                    <div key={s.name} className="flex justify-between items-center p-3 bg-white rounded-xl border border-border hover:border-primary/40 transition-all group">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{s.name}</p>
                        <p className="text-xs text-primary font-black">{isSteamIronMode ? getSteamIronPriceDisplay(s) : formatPrice(s)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            addItem(s.name);
                          }}
                          className="bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {items.length > 0 && (
                <div className="mt-8 space-y-4 pt-6 border-t border-border">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-primary" /> Your Selection ({items.length})
                    </h3>
                    <button onClick={() => setItems([])} className="text-xs font-bold text-red-500 hover:underline">Clear All</button>
                  </div>
                  <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white">
                        <div className="flex-1">
                          <p className="font-bold text-sm">{item.quantity} × {item.serviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.price ? `₹${item.price * item.quantity}` : `₹${item.minPrice! * item.quantity}–₹${item.maxPrice! * item.quantity}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg border border-border">
                              <button onClick={() => {
                                const newItems = [...items];
                                if (newItems[idx].quantity > 1) {
                                  newItems[idx].quantity -= 1;
                                  setItems(newItems);
                                }
                              }} className="text-gray-500 hover:text-primary p-1">
                                <span className="text-lg font-black">-</span>
                              </button>
                              <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                              <button onClick={() => {
                                const newItems = [...items];
                                newItems[idx].quantity += 1;
                                setItems(newItems);
                                toast.success("✓ Quantity Updated");
                              }} className="text-gray-500 hover:text-primary p-1">
                                <span className="text-lg font-black">+</span>
                              </button>
                           </div>
                           <button onClick={() => removeItem(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 rounded-xl border border-primary/10 p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-muted-foreground uppercase text-xs tracking-wider">Estimated Total</span>
                      <span className="text-2xl font-black text-primary">
                        ₹{totals.min}{totals.hasRange ? `–₹${totals.max}` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              disabled={items.length === 0}
              onClick={() => setStep("details")} 
              className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-black text-xl shadow-soft flex items-center justify-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:grayscale"
            >
              Continue to Details <ArrowRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-5">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" /> Step 2: Customer Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" error={errors.name}>
                  <input value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} placeholder="e.g. Rahul Sharma" />
                </Field>
                <Field label="Mobile Number" error={errors.mobile}>
                  <input value={form.mobile} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} className={inputCls} placeholder="10-digit number" />
                </Field>
                <Field label="Pickup Date">
                  <input type="date" min={today} value={form.date} onChange={(e) => update("date", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Email Address">
                  <input value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} placeholder="rahul@example.com" />
                </Field>
              </div>
              <Field label="Pickup Address" error={errors.address}>
                <textarea rows={3} value={form.address} onChange={(e) => update("address", e.target.value)} className={inputCls} placeholder="House No, Street, Sector, Landmarks" />
              </Field>
              <Field label="Special Notes (Optional)">
                <textarea rows={2} value={form.notes} onChange={(e) => update("notes", e.target.value)} className={inputCls} placeholder="Any specific instructions..." />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setStep("services")} className="bg-secondary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all">
                <ArrowLeft className="h-5 w-5" /> Back
              </button>
              <button onClick={() => validateDetails() && setStep("payment")} className="bg-primary text-primary-foreground py-5 rounded-2xl font-black shadow-soft flex items-center justify-center gap-2 hover:bg-primary-dark transition-all">
                Next: Payment <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Step 3: Choose Payment
              </h2>
              
              <div className="grid gap-4">
                <button 
                  disabled={loading}
                  onClick={() => handleBooking("Online")}
                  className="group relative flex items-center gap-4 w-full p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg">Pay Online Now</h3>
                    <p className="text-sm text-muted-foreground">Instant UPI Payment via QR Code</p>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary" />
                </button>

                <button 
                  disabled={loading}
                  onClick={() => handleBooking("Pickup")}
                  className="group relative flex items-center gap-4 w-full p-6 rounded-2xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Banknote className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-lg">Pay at Pickup</h3>
                    <p className="text-sm text-muted-foreground">Pay when we collect your clothes</p>
                  </div>
                  <div className="h-6 w-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border border-border">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Order Summary</span>
                </div>
                <div className="space-y-2 mb-4">
                  {items.map((it, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{it.quantity} × {it.serviceName}</span>
                      <span className="font-bold">
                        {it.price ? `₹${it.price * it.quantity}` : `₹${it.minPrice! * it.quantity}–₹${it.maxPrice! * it.quantity}`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-black">Total Estimate</span>
                  <span className="text-xl font-black text-primary">
                    ₹{totals.min}{totals.hasRange ? `–₹${totals.max}` : ""}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={() => setStep("details")} className="w-full bg-secondary py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all">
              <ArrowLeft className="h-5 w-5" /> Back to Details
            </button>
          </div>
        )}

        {step === "qr_payment" && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="rounded-2xl border border-primary/30 bg-card shadow-card p-8 text-center space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-6">
                  <h3 className="font-black text-xl">Pay Online Now</h3>
                  <div className="bg-white p-6 rounded-2xl inline-block border-4 border-primary/20 shadow-soft">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${totals.min}&cu=INR`)}`} 
                      alt="UPI QR Code" 
                      className="w-56 h-56 mx-auto"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-lg">{MERCHANT_NAME}</p>
                    <p className="text-primary font-mono text-sm">{UPI_ID}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 border border-border text-left space-y-4 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Payment Instructions</p>
                    <div className="h-px bg-border" />
                    <p className="text-sm font-medium leading-relaxed">
                      1. Scan the QR code and complete payment.<br />
                      2. Enter your UPI Transaction ID below.<br />
                      3. Click Submit to confirm your booking.
                    </p>
                  </div>

                  <div className="space-y-3 text-left">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Transaction ID *</label>
                    <div className="flex flex-col gap-3">
                      <input 
                        type="text" 
                        value={transInput}
                        onChange={(e) => setTransInput(e.target.value)}
                        placeholder="Enter UPI Transaction ID" 
                        className="w-full bg-white border-2 border-border rounded-xl px-4 py-4 text-lg font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                      />
                      <p className="text-[10px] text-muted-foreground italic font-medium px-1">
                        * Required to create your online booking.
                      </p>
                    </div>
                  </div>

                  <button 
                    disabled={loading || !transInput.trim()}
                    onClick={() => submitBooking("Online", transInput.trim())}
                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-primary py-5 text-white font-black text-lg shadow-soft hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50"
                  >
                    {loading ? "Creating Order..." : "Submit Transaction ID"}
                  </button>
              </div>
              <button onClick={() => setStep("payment")} className="text-muted-foreground font-bold hover:text-foreground">
                Back to Payment Methods
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="animate-in zoom-in-95 duration-300">
            <div className="rounded-2xl border border-primary/30 bg-card shadow-card p-8 text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CheckCircle2 className="h-14 w-14" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-black">Booking Success!</h2>
                <p className="text-muted-foreground mt-4 text-lg">
                  Order created successfully. Your payment is awaiting admin verification. Please share your payment screenshot on WhatsApp for faster verification.
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-4 text-left">
                <div className="flex justify-between items-center py-2 border-b border-primary/10">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Order ID</span>
                  <span className="font-black text-lg">{orderId}</span>
                </div>
                {transactionId && (
                  <div className="flex justify-between items-center py-2 border-b border-primary/10">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Transaction ID</span>
                    <span className="font-black text-lg">{transactionId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Payment Status</span>
                  <span className="font-black text-lg text-orange-600">Pending Verification</span>
                </div>
              </div>

              {paymentMethod === "Online" ? (
                <a 
                  href={`https://wa.me/918796422972?text=${encodeURIComponent(`Hello,\nI have completed payment for Order: ${orderId}.\n\nMy Transaction ID is: ${transactionId}\n\nPlease verify my payment.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-[color:var(--whatsapp)] py-5 text-white font-black text-lg shadow-soft hover:scale-[1.02] active:scale-95 transition-transform"
                >
                  <MessageCircle className="h-6 w-6" /> Share Screenshot on WhatsApp
                </a>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 text-green-800 text-sm rounded-xl border border-green-200 font-bold">
                    Payment Method: Pay At Pickup
                  </div>
                  <a 
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(`Hello Green Eco Drycleaners,\n\nOrder ID: ${orderId}\n\nItems:\n${items.map(it => `${it.quantity} × ${it.serviceName}`).join("\n")}\n\nEstimated Total: ₹${totals.min}${totals.hasRange ? `–₹${totals.max}` : ""}\n\nPayment Method: Pay at Pickup\n\nPlease confirm my booking.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-[color:var(--whatsapp)] py-5 text-white font-black text-lg shadow-soft hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <MessageCircle className="h-6 w-6" /> Confirm on WhatsApp
                  </a>
                </div>
              )}

              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <button 
                  onClick={() => window.location.href = `/order/${orderId}`}
                  className="text-primary font-black text-lg hover:underline underline-offset-4"
                >
                  Go to Order Tracking
                </button>
                <button onClick={() => window.location.href = "/"} className="text-muted-foreground font-bold hover:text-foreground">
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

const inputCls = "w-full rounded-2xl border border-input bg-background px-4 py-4 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-left-2">⚠ {error}</span>}
    </div>
  );
}
