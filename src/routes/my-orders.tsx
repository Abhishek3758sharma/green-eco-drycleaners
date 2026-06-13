import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/SiteLayout";
import { Package, Calendar, Clock, ChevronRight, Search, ShoppingBag } from "lucide-react";
import { Booking } from "@/lib/business";

export const Route = createFileRoute("/my-orders")({
  component: MyOrdersPage,
});

function MyOrdersPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate({ to: "/login", replace: true });
    } else {
      setUser(session.user);
      fetchMyOrders(session.user.id, session.user.email!);
    }
  }

  async function fetchMyOrders(userId: string, email: string) {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`user_id.eq.${userId},email.eq.${email}`)
      .order("created_at", { ascending: false });

    if (!error) {
      setBookings(data || []);
    }
    setLoading(false);
  }

  if (loading) return <SiteLayout><div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Your Orders...</div></SiteLayout>;

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">My Order History</h1>
          <p className="mt-2 text-muted-foreground font-medium">Track and manage your dry cleaning requests</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {bookings.length === 0 ? (
          <div className="rounded-[2.5rem] border border-border bg-card p-12 text-center space-y-6 shadow-soft">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">No orders found</h2>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">You haven't placed any orders yet. Start your first booking today!</p>
            </div>
            <Link to="/book" className="inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-black text-primary-foreground shadow-soft hover:bg-primary-dark transition-all">
              Book Your First Pickup
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div 
                key={b.id} 
                onClick={() => navigate({ to: `/order/${b.order_id}` })}
                className="group relative bg-white rounded-[2rem] border border-border p-6 sm:p-8 shadow-card hover:border-primary/40 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                      b.booking_source === "counter" ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-blue-50 text-blue-700"
                    }`}>
                      {b.booking_source?.toUpperCase() || "WEBSITE"}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">{b.order_id}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      b.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pickup Date</span>
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {new Date(b.pickup_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    {b.delivery_date && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Delivery Date</span>
                        <div className="flex items-center gap-2 font-bold text-gray-900">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {new Date(b.delivery_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</span>
                      <div className="font-black text-gray-900 text-lg">
                        ₹{b.amount_min}{b.amount_max && b.amount_max > b.amount_min ? `–₹${b.amount_max}` : ""}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</span>
                      <div className="font-bold text-gray-900 text-sm truncate max-w-[150px]">
                        {b.email}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Items</span>
                      <div className="flex items-center gap-2 font-bold text-muted-foreground text-sm">
                        <Package className="h-3.5 w-3.5" />
                        {b.items?.length || 0} Service{b.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                   <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${
                     b.payment_status === "Paid" || b.payment_status === "Verified" || b.payment_status === "Received"
                     ? "border-green-100 bg-green-50 text-green-700"
                     : "border-orange-100 bg-orange-50 text-orange-700"
                   }`}>
                     Payment: {b.payment_status === "Pending" ? "Pending Verification" : b.payment_status}
                   </div>
                   <button className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all">
                     <ChevronRight className="h-6 w-6" />
                   </button>
                   <button className="sm:hidden w-full py-4 rounded-2xl bg-primary/10 text-primary font-bold text-sm">View Order Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
