import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Package, Clock, CreditCard, Banknote, CheckCircle2, XCircle, AlertCircle, QrCode, MessageCircle, MapPin, Truck, WashingMachine, Check } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/lib/supabase";
import { Booking, UPI_ID, MERCHANT_NAME, BUSINESS } from "@/lib/business";

export const Route = createFileRoute("/order/$orderId")({
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { orderId } = Route.useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .or(`order_id.eq.${orderId},mobile.eq.${orderId}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !data) {
      setError("Order not found. Please check your Order ID or Mobile Number.");
    } else {
      setBooking(data);
    }
    setLoading(false);
  };

  if (loading) return <SiteLayout><div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-muted-foreground">Loading Order Status...</div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-3xl font-black">Order Tracking</h1>
          <p className="mt-2 text-muted-foreground font-medium">Real-time updates for {orderId}</p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12">
        {error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center space-y-4">
            <XCircle className="h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-black text-destructive">Order Not Found</h2>
            <p className="text-muted-foreground font-medium">{error}</p>
            <button onClick={() => window.location.href = "/"} className="bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-soft">Go Back Home</button>
          </div>
        ) : booking && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="rounded-[2.5rem] border border-border bg-card shadow-card overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-8 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-1">Status</p>
                    <h2 className="text-2xl font-black">{booking.status}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70 mb-1">Estimate</p>
                    <h2 className="text-2xl font-black">₹{booking.amount_min}{booking.amount_max && booking.amount_max > booking.amount_min ? `–₹${booking.amount_max}` : ""}</h2>
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="p-8 border-b border-border bg-gray-50/50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Order Summary</h3>
                 <div className="space-y-3">
                   {booking.items?.map((it, i) => (
                     <div key={i} className="flex justify-between items-center">
                       <p className="font-bold text-gray-800">{it.quantity} × {it.serviceName}</p>
                       <p className="font-black text-primary text-sm">
                         {it.price ? `₹${it.price * it.quantity}` : `₹${it.minPrice! * it.quantity}–₹${it.maxPrice! * it.quantity}`}
                       </p>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Timeline */}
              <div className="p-8 space-y-10">
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />
                  <div className="space-y-10 relative">
                    <TimelineStep 
                      icon={Package} 
                      title="Order Received" 
                      desc="We have received your booking request."
                      active={true}
                      completed={true}
                    />
                    <TimelineStep 
                      icon={Truck} 
                      title="Pickup Scheduled" 
                      desc={`Our team will arrive on ${new Date(booking.pickup_date).toLocaleDateString("en-IN")}`}
                      active={booking.status !== "Pending"}
                      completed={["Picked Up", "In Cleaning", "Ready", "Out For Delivery", "Completed"].includes(booking.status)}
                    />
                    <TimelineStep 
                      icon={WashingMachine} 
                      title="Cleaning In Progress" 
                      desc="Your garments are being professionally cleaned."
                      active={["In Cleaning", "Ready", "Out For Delivery", "Completed"].includes(booking.status)}
                      completed={["Ready", "Out For Delivery", "Completed"].includes(booking.status)}
                    />
                    <TimelineStep 
                      icon={CheckCircle2} 
                      title="Ready & Delivered" 
                      desc="Order is ready for you!"
                      active={booking.status === "Completed"}
                      completed={booking.status === "Completed"}
                    />
                  </div>
                </div>

                {/* Payment Section */}
                <div className="pt-8 border-t border-border space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                      <p className="font-bold">{booking.payment_method === "Online" ? "Online (UPI)" : "Pay At Pickup"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Status</p>
                      <p className={`font-black ${["Verified", "Received", "Paid"].includes(booking.payment_status) ? "text-green-600" : "text-orange-500"}`}>
                        {booking.payment_status === "Pending" ? "Pending Verification" : booking.payment_status}
                      </p>
                    </div>
                  </div>

                  {booking.transaction_id && (
                    <div className="p-4 bg-white border border-border rounded-2xl flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Transaction ID</span>
                      <span className="font-black text-gray-900 tracking-tight">{booking.transaction_id}</span>
                    </div>
                  )}

                  {booking.payment_method === "Online" && !["Paid", "Verified", "Received"].includes(booking.payment_status) && (
                    <div className="bg-primary/5 rounded-[2rem] p-6 sm:p-8 border border-primary/20 space-y-6">
                      <div className="flex items-center gap-3">
                        <QrCode className="h-6 w-6 text-primary" />
                        <h4 className="font-black text-lg">UPI Payment Required</h4>
                      </div>
                      
                      <button 
                        onClick={() => setShowQR(!showQR)}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-soft hover:scale-[1.02] transition-transform"
                      >
                        {showQR ? "Hide QR Code" : "Show Payment QR"}
                      </button>
                      
                      {showQR && (
                        <div className="text-center space-y-6 pt-4 animate-in zoom-in-95">
                          <div className="bg-white p-6 rounded-3xl inline-block border-4 border-primary/10 shadow-soft">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&am=${booking.amount_min}&cu=INR`)}`} 
                              alt="UPI QR Code" 
                              className="w-56 h-56 mx-auto"
                            />
                          </div>
                          <div className="text-xs font-bold text-muted-foreground">
                            <p className="text-gray-900 text-base">{MERCHANT_NAME}</p>
                            <p className="font-mono text-primary text-sm">{UPI_ID}</p>
                          </div>
                          <div className="bg-white rounded-2xl p-6 border border-border text-left space-y-4 shadow-sm">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground text-center">Verification Instruction</p>
                            <div className="h-px bg-border" />
                            <p className="text-sm font-medium leading-relaxed text-center">
                              After payment, please send your payment screenshot on WhatsApp for verification.
                            </p>
                            <a 
                              href={`https://wa.me/918796422972?text=${encodeURIComponent(`Hello,\nI have completed payment for Order: ${booking.order_id}.\n\nPlease verify.`)}`}
                              target="_blank"
                              className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-[color:var(--whatsapp)] py-4 text-white font-black text-sm shadow-soft hover:scale-[1.02] transition-transform"
                            >
                              <MessageCircle className="h-5 w-5" /> Send Screenshot on WhatsApp
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="rounded-[2rem] border border-border bg-gray-50 p-8 flex items-start gap-5">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-lg">Need help?</h3>
                <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">Our support team is available on WhatsApp for any queries regarding your order.</p>
                <a 
                  href={`https://wa.me/${BUSINESS.whatsapp}?text=Hi, I have a question about my Order ${booking.order_id}`}
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-2 bg-[color:var(--whatsapp)] text-white px-6 py-3 rounded-xl font-bold shadow-soft hover:scale-105 transition-all"
                >
                  Chat with Support
                </a>
              </div>
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}

function TimelineStep({ icon: Icon, title, desc, active, completed }: { icon: any, title: string, desc: string, active: boolean, completed: boolean }) {
  return (
    <div className={`flex gap-6 ${active ? "opacity-100" : "opacity-30 grayscale"}`}>
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all shadow-soft ${
        completed ? "bg-primary text-white" : 
        active ? "bg-white border-2 border-primary text-primary" : "bg-gray-100 text-muted-foreground"
      }`}>
        {completed ? <Check className="h-6 w-6" strokeWidth={3} /> : <Icon className="h-6 w-6" />}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="font-black text-base leading-tight text-gray-900">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 font-bold leading-snug">{desc}</p>
      </div>
    </div>
  );
}
