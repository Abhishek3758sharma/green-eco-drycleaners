import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { SERVICES_DATA, formatPrice, PaymentStatus, OrderStatus, Booking, generateCounterOrderId, OrderItem, calculateOrderTotal, PaymentMethod } from "@/lib/business";
import { printReceipt } from "@/lib/receipt";
import { Check, X, Filter, LogOut, Search, MessageCircle, MoreVertical, Eye, Settings, Calendar, MapPin, Package, CreditCard, ChevronRight, Ban, Plus, ShoppingCart, Trash2, Smartphone, Printer } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Website" | "Counter" | "Paid" | "Pending Verification" | "Unpaid" | "Pickup" | "Completed">("All");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Booking | null>(null);
  
  // Counter Order State
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [counterLoading, setCounterLoading] = useState(false);
  const [counterItems, setCounterItems] = useState<OrderItem[]>([]);
  const [counterForm, setCounterForm] = useState({
    name: "", mobile: "", email: "", address: "", date: new Date().toISOString().slice(0, 10),
    payment_method: "Cash" as PaymentMethod,
    transaction_id: ""
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    const adminEmail = "abhishek3758sharma@gmail.com";

    if (!session) {
      navigate({ to: "/login", replace: true });
    } else if (session.user.email !== adminEmail) {
      toast.error("Unauthorized access. Admin only.");
      await supabase.auth.signOut();
      navigate({ to: "/", replace: true });
    } else {
      setLoading(false);
      fetchBookings();
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  async function fetchBookings() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }
    setBookings(data || []);
  }

  async function updateStatus(id: number, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const updates: any = { status };
    if (paymentStatus) updates.payment_status = paymentStatus;

    const { error } = await supabase
      .from("bookings")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }
    
    toast.success(paymentStatus === "Paid" ? "Payment Verified Successfully" : "Status Updated");
    
    // Update local state if a detail view is open
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder({ ...selectedOrder, ...updates });
    }
    
    fetchBookings();
  }

  const handleCreateCounterOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (counterItems.length === 0) return toast.error("Add at least one service");
    if (!counterForm.name || !counterForm.mobile || !counterForm.email) return toast.error("Name, Mobile, and Email are required");

    setCounterLoading(true);
    const orderId = generateCounterOrderId();
    const totals = calculateOrderTotal(counterItems);

    let paymentStatus: PaymentStatus = "Pending";
    if (counterForm.payment_method === "Cash" || counterForm.payment_method === "Online") {
      paymentStatus = "Paid";
    }

    try {
      // Check if a user with this email already exists in profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", counterForm.email.toLowerCase())
        .maybeSingle();

      const { error } = await supabase.from("bookings").insert([{
        order_id: orderId,
        name: counterForm.name,
        mobile: counterForm.mobile,
        email: counterForm.email.toLowerCase(),
        user_id: profile?.id || null,
        address: counterForm.address,
        pickup_date: counterForm.date,
        items: counterItems,
        amount_min: totals.min,
        amount_max: totals.max,
        status: "Pending",
        payment_method: counterForm.payment_method,
        payment_status: paymentStatus,
        transaction_id: counterForm.transaction_id || null,
        source: "admin",
        booking_source: "counter"
      }]);

      if (error) throw error;

      toast.success("Counter Order Created Successfully!");
      setIsCounterModalOpen(false);
      setCounterItems([]);
      setCounterForm({
        name: "", mobile: "", email: "", address: "", date: new Date().toISOString().slice(0, 10),
        payment_method: "Cash",
        transaction_id: ""
      });
      fetchBookings();
    } catch (err: any) {
      toast.error(`Failed to create order: ${err.message}`);
    } finally {
      setCounterLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = 
        b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.mobile?.includes(search) ||
        b.order_id?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filter === "Website") return b.booking_source === "website";
      if (filter === "Counter") return b.booking_source === "counter";
      if (filter === "Paid") return b.payment_status === "Paid" || b.payment_status === "Verified" || b.payment_status === "Received";
      if (filter === "Pending Verification") return b.payment_method === "Online" && b.payment_status === "Pending";
      if (filter === "Unpaid") return b.payment_status === "Pending" || b.payment_status === "Pending Payment" || b.payment_status === "Pay At Pickup";
      if (filter === "Pickup") return b.payment_method === "Pickup";
      if (filter === "Completed") return b.status === "Completed";
      
      return true;
    });
  }, [bookings, search, filter]);

  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    return {
      total: bookings.length,
      website: bookings.filter(b => b.booking_source === "website").length,
      counter: bookings.filter(b => b.booking_source === "counter").length,
      pending: bookings.filter(b => b.status === "Pending").length,
      ready: bookings.filter(b => b.status === "Ready").length,
      delivered: bookings.filter(b => b.status === "Completed").length,
      revenueToday: bookings.filter(b => ["Verified", "Received", "Paid"].includes(b.payment_status) && b.created_at.startsWith(todayStr))
                     .reduce((sum, b) => sum + Number(b.amount_min || 0), 0),
      revenueMonth: bookings.filter(b => ["Verified", "Received", "Paid"].includes(b.payment_status) && b.created_at >= firstDayOfMonth)
                     .reduce((sum, b) => sum + Number(b.amount_min || 0), 0),
      revenue: bookings.filter(b => ["Verified", "Received", "Paid"].includes(b.payment_status))
                     .reduce((sum, b) => sum + Number(b.amount_min || 0), 0),
      verificationNeeded: bookings.filter(b => b.payment_method === "Online" && b.payment_status === "Pending").length
    };
  }, [bookings]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-muted-foreground">Loading Admin Console...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-soft">G</Link>
          <h1 className="text-xl font-black text-gray-900 hidden sm:block tracking-tight">Admin Console</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsCounterModalOpen(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-soft hover:bg-green-700 transition-all"
          >
            <Plus className="h-4 w-4" /> <span>Create Counter Order</span>
          </button>
          <Link 
            to="/admin/settings"
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all"
          >
            <Settings className="h-4 w-4" /> <span className="hidden sm:inline">Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard title="Total Orders" value={stats.total} />
          <StatCard title="Pending Verif." value={stats.verificationNeeded} color={stats.verificationNeeded > 0 ? "text-orange-500 animate-pulse" : ""} />
          <StatCard title="Pending" value={stats.pending} />
          <StatCard title="Ready" value={stats.ready} color="text-blue-600" />
          <StatCard title="Delivered" value={stats.delivered} color="text-green-600" />
          <StatCard title="Rev. Today" value={`₹${stats.revenueToday}`} color="text-green-600" />
          <StatCard title="Rev. Month" value={`₹${stats.revenueMonth}`} color="text-green-600" />
          <StatCard title="Website Orders" value={stats.website} />
          <StatCard title="Counter Orders" value={stats.counter} />
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl shadow-soft border border-border p-4 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Name, Order ID, or Mobile..."
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
          <div className="flex overflow-x-auto gap-2 pb-2 lg:pb-0 no-scrollbar">
            {["All", "Website", "Counter", "Paid", "Pending Verification", "Unpaid", "Pickup", "Completed"].map((f: any) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                  filter === f ? "bg-primary text-white shadow-soft" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-3xl shadow-soft border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order ID</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Items</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Payment</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Verification</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                             b.booking_source === "counter" ? "border-green-200 bg-green-50 text-green-700" : "border-blue-200 bg-blue-50 text-blue-700"
                           }`}>
                             {b.booking_source?.toUpperCase() || "WEBSITE"}
                           </span>
                           <p className="font-black text-gray-900 text-lg">{b.order_id}</p>
                        </div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-tighter mt-1">{new Date(b.created_at).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">{b.name}</p>
                      <p className="text-sm text-muted-foreground font-medium">{b.mobile}</p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[120px]">{b.email}</p>
                    </td>
                    <td className="px-6 py-5">
                       <p className="text-sm font-bold text-gray-700">{b.items?.length || 0} Items</p>
                       <p className="text-[10px] text-muted-foreground truncate max-w-[150px] font-medium">
                         {b.items?.map(it => it.serviceName).join(", ")}
                       </p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block w-fit uppercase tracking-widest ${
                          b.payment_method === "Online" ? "bg-blue-100 text-blue-700" : 
                          b.payment_method === "Cash" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {b.payment_method}
                        </span>
                        <p className={`text-xs font-black mt-1 ${
                          ["Verified", "Received", "Paid"].includes(b.payment_status) ? "text-green-600" : 
                          b.payment_status === "Verification Pending" || (b.payment_method === "Online" && b.payment_status === "Pending") ? "text-orange-500" : "text-gray-500"
                        }`}>
                          {b.payment_method === "Online" && b.payment_status === "Pending" ? "Pending Verification" : b.payment_status}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       {b.payment_method === "Online" ? (
                         <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                           b.payment_status === "Paid" || b.payment_status === "Verified" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                         }`}>
                           {b.payment_status === "Paid" || b.payment_status === "Verified" ? "Verified" : "Pending"}
                         </span>
                       ) : (
                         <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Not Required</span>
                       )}
                    </td>
                    <td className="px-6 py-5">
                       <span className={`text-xs font-black px-3 py-1 rounded-xl inline-block ${
                         b.status === "Completed" ? "bg-green-100 text-green-700" : 
                         b.status === "Pending" ? "bg-gray-100 text-gray-700" : "bg-primary/10 text-primary"
                       }`}>
                         {b.status}
                       </span>
                    </td>
<td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => printReceipt(b)}
                          className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl inline-flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                          title="Print Order"
                          aria-label="Print Order"
                        >
                          <Printer className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(b)}
                          className="h-10 w-10 bg-gray-100 text-gray-600 rounded-xl inline-flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Counter Order Modal */}
      {isCounterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-5xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
              <div className="bg-green-600 p-6 text-white flex justify-between items-center shrink-0">
                 <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                       <Plus className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-black">Create Counter Order</h2>
                 </div>
                 <button onClick={() => setIsCounterModalOpen(false)} className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors">
                    <X className="h-5 w-5" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
                 <form onSubmit={handleCreateCounterOrder} id="counter-form" className="grid lg:grid-cols-12 gap-10">
                    {/* Customer Info */}
                    <div className="lg:col-span-4 space-y-6">
                       <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Customer Details</h3>
                       <div className="space-y-4">
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Full Name *</label>
                             <input required value={counterForm.name} onChange={e => setCounterForm({...counterForm, name: e.target.value})} className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" placeholder="e.g. Rahul" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Mobile Number *</label>
                             <input required value={counterForm.mobile} onChange={e => setCounterForm({...counterForm, mobile: e.target.value.replace(/\D/g, "").slice(0, 10)})} className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" placeholder="10-digit mobile" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Email Address *</label>
                             <input required type="email" value={counterForm.email} onChange={e => setCounterForm({...counterForm, email: e.target.value})} className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" placeholder="customer@example.com" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Address</label>
                             <textarea value={counterForm.address} onChange={e => setCounterForm({...counterForm, address: e.target.value})} className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" rows={2} placeholder="Optional" />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Date</label>
                             <input type="date" value={counterForm.date} onChange={e => setCounterForm({...counterForm, date: e.target.value})} className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" />
                          </div>
                       </div>

                       <div className="pt-6 border-t border-border">
                          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Payment Selection</h3>
                          <div className="grid grid-cols-1 gap-2">
                             {[
                                { id: "Cash", label: "Paid Cash", icon: CreditCard },
                                { id: "Online", label: "Paid Online", icon: Smartphone },
                                { id: "Later", label: "Pay Later", icon: Calendar }
                             ].map((m) => (
                                <button
                                   key={m.id}
                                   type="button"
                                   onClick={() => setCounterForm({...counterForm, payment_method: m.id as any})}
                                   className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                                      counterForm.payment_method === m.id ? "border-green-600 bg-green-50" : "border-border bg-white hover:border-green-200"
                                   }`}
                                >
                                   <div className="flex items-center gap-3">
                                      <m.icon className={`h-5 w-5 ${counterForm.payment_method === m.id ? "text-green-600" : "text-gray-400"}`} />
                                      <span className="font-bold">{m.label}</span>
                                   </div>
                                   <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${counterForm.payment_method === m.id ? "border-green-600 bg-green-600" : "border-border"}`}>
                                      {counterForm.payment_method === m.id && <Check className="h-3 w-3 text-white" strokeWidth={4} />}
                                   </div>
                                </button>
                             ))}
                          </div>
                          {counterForm.payment_method === "Online" && (
                             <div className="mt-4 space-y-1.5 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Transaction ID</label>
                                <input value={counterForm.transaction_id} onChange={e => setCounterForm({...counterForm, transaction_id: e.target.value})} className="w-full bg-white border-2 border-green-600 rounded-xl px-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none" placeholder="UPI Transaction Ref..." />
                             </div>
                          )}
                       </div>
                    </div>

                    {/* Service Selection */}
                    <div className="lg:col-span-8 space-y-6">
                       <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Select Services</h3>
                       <div className="bg-gray-50 rounded-3xl p-6 border border-border space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-muted-foreground ml-1">Search Service</label>
                                <div className="relative">
                                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                   <select 
                                      className="w-full bg-white border-2 border-border rounded-xl pl-10 pr-4 py-3 font-bold focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                                      onChange={(e) => {
                                         const s = SERVICES_DATA.find(x => x.name === e.target.value);
                                         if (s) {
                                            const existingIdx = counterItems.findIndex(it => it.serviceName === s.name);
                                            if (existingIdx > -1) {
                                               const newItems = [...counterItems];
                                               newItems[existingIdx].quantity += 1;
                                               setCounterItems(newItems);
                                            } else {
                                               setCounterItems([...counterItems, { 
                                                  serviceName: s.name, 
                                                  quantity: 1, 
                                                  price: s.price, 
                                                  minPrice: s.minPrice, 
                                                  maxPrice: s.maxPrice 
                                               }]);
                                            }
                                            e.target.value = "";
                                         }
                                      }}
                                   >
                                      <option value="">Select a service...</option>
                                      {SERVICES_DATA.map(s => <option key={s.name} value={s.name}>{s.name} ({formatPrice(s)})</option>)}
                                   </select>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Order Items ({counterItems.length})</p>
                                {counterItems.length > 0 && <button type="button" onClick={() => setCounterItems([])} className="text-[10px] font-black uppercase text-red-500 hover:underline">Clear List</button>}
                             </div>
                             
                             <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border bg-white">
                                {counterItems.length === 0 ? (
                                   <div className="p-10 text-center text-muted-foreground italic text-sm">No services added yet.</div>
                                ) : counterItems.map((it, idx) => (
                                   <div key={idx} className="flex justify-between items-center p-4">
                                      <div className="flex-1">
                                         <p className="font-bold text-gray-900">{it.serviceName}</p>
                                         <p className="text-[10px] font-black text-green-600 uppercase">
                                            {it.price ? `₹${it.price * it.quantity}` : `₹${it.minPrice! * it.quantity}–₹${it.maxPrice! * it.quantity}`}
                                         </p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                         <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1 border border-border">
                                            <button type="button" onClick={() => {
                                               const newItems = [...counterItems];
                                               if (newItems[idx].quantity > 1) {
                                                  newItems[idx].quantity -= 1;
                                                  setCounterItems(newItems);
                                               }
                                            }} className="h-6 w-6 flex items-center justify-center font-black hover:text-green-600">-</button>
                                            <span className="font-black text-sm min-w-[20px] text-center">{it.quantity}</span>
                                            <button type="button" onClick={() => {
                                               const newItems = [...counterItems];
                                               newItems[idx].quantity += 1;
                                               setCounterItems(newItems);
                                            }} className="h-6 w-6 flex items-center justify-center font-black hover:text-green-600">+</button>
                                         </div>
                                         <button type="button" onClick={() => setCounterItems(counterItems.filter((_, i) => i !== idx))} className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 className="h-4 w-4" />
                                         </button>
                                      </div>
                                   </div>
                                ))}
                             </div>

                             {counterItems.length > 0 && (
                                <div className="bg-green-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                                   <div>
                                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Estimated Total</p>
                                      <p className="text-3xl font-black">₹{calculateOrderTotal(counterItems).min}{calculateOrderTotal(counterItems).hasRange ? `–₹${calculateOrderTotal(counterItems).max}` : ""}</p>
                                   </div>
                                   <ShoppingCart className="h-10 w-10 opacity-30" />
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </form>
              </div>

              <div className="p-8 border-t border-border bg-gray-50 flex justify-between items-center shrink-0">
                 <button type="button" onClick={() => setIsCounterModalOpen(false)} className="px-8 py-4 font-black text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                 <button 
                    disabled={counterLoading}
                    form="counter-form"
                    type="submit" 
                    className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-soft hover:bg-green-700 transition-all flex items-center gap-3 disabled:opacity-50"
                 >
                    {counterLoading ? "Creating..." : <><Check className="h-6 w-6" strokeWidth={3} /> Create Order</>}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className={`p-8 text-white flex justify-between items-center ${selectedOrder.booking_source === "counter" ? "bg-green-600" : "bg-primary"}`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded">{selectedOrder.booking_source?.toUpperCase() || "WEBSITE"}</span>
                   <p className="text-xs font-black uppercase tracking-[0.2em] opacity-70">Order Details</p>
                </div>
                <h2 className="text-3xl font-black">{selectedOrder.order_id}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-10">
                {/* Left Column: Customer & Items */}
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Customer Info
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-3 border border-border">
                      <DetailRow label="Name" value={selectedOrder.name} />
                      <DetailRow label="Phone" value={selectedOrder.mobile} />
                      <DetailRow label="Email" value={selectedOrder.email || "N/A"} />
                      <DetailRow label="Pickup Date" value={new Date(selectedOrder.pickup_date).toLocaleDateString("en-IN")} />
                      <DetailRow label="Address" value={selectedOrder.address || "No address provided"} fullWidth />
                      {selectedOrder.notes && <DetailRow label="Notes" value={selectedOrder.notes} fullWidth />}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Package className="h-4 w-4" /> Order Items
                    </h3>
                    <div className="border border-border rounded-2xl overflow-hidden">
                      {selectedOrder.items?.map((it, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white border-b border-border last:border-0">
                          <p className="font-bold text-gray-800">{it.quantity} × {it.serviceName}</p>
                          <p className="font-black text-primary text-sm">
                             {it.price ? `₹${it.price * it.quantity}` : `₹${it.minPrice! * it.quantity}–₹${it.maxPrice! * it.quantity}`}
                          </p>
                        </div>
                      ))}
                      <div className="bg-primary/5 p-4 flex justify-between items-center border-t border-primary/10">
                         <span className="font-black text-xs uppercase tracking-widest opacity-60">Total Estimate</span>
                         <span className="font-black text-xl text-primary">₹{selectedOrder.amount_min}{selectedOrder.amount_max && selectedOrder.amount_max > selectedOrder.amount_min ? `–₹${selectedOrder.amount_max}` : ""}</span>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Status & Payment */}
                <div className="space-y-8">
                  <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Order Management</h3>
                    <div className="space-y-4">
                       <div className="flex flex-col gap-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Status</label>
                         <select 
                            value={selectedOrder.status}
                            onChange={e => updateStatus(selectedOrder.id, e.target.value as OrderStatus)}
                            className="w-full bg-gray-50 border-2 border-border rounded-2xl px-4 py-4 font-black text-lg focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                         >
                           <option>Pending</option>
                           <option>Pickup Scheduled</option>
                           <option>Picked Up</option>
                           <option>In Cleaning</option>
                           <option>Ready</option>
                           <option>Out For Delivery</option>
                           <option>Completed</option>
                         </select>
                       </div>
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Payment Verification
                    </h3>
                    <div className="bg-gray-50 rounded-3xl p-6 border border-border space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Method</span>
                            <span className={`text-xs font-black px-2 py-1 rounded-lg inline-block w-fit uppercase tracking-tighter ${
                               selectedOrder.payment_method === "Online" ? "bg-blue-100 text-blue-700" : 
                               selectedOrder.payment_method === "Cash" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                            }`}>
                               {selectedOrder.payment_method}
                            </span>
                         </div>
                         <div className="flex flex-col gap-0.5 text-right">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</span>
                            <span className={`font-black text-sm uppercase ${["Verified", "Received", "Paid"].includes(selectedOrder.payment_status) ? "text-green-600" : "text-orange-500"}`}>
                               {selectedOrder.payment_method === "Online" && selectedOrder.payment_status === "Pending" ? "Pending Verification" : selectedOrder.payment_status}
                            </span>
                         </div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-border">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Transaction ID</p>
                         <p className="font-black text-lg text-foreground tracking-tight select-all">
                            {selectedOrder.transaction_id || <span className="opacity-30 italic">Not Submitted</span>}
                         </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 gap-3">
                         {selectedOrder.payment_method === "Online" && selectedOrder.payment_status === "Pending" && (
                           <div className="grid grid-cols-2 gap-2">
                             <button 
                               onClick={() => {
                                 if (window.confirm("Verify this payment? This will update status to PAID.")) {
                                   updateStatus(selectedOrder.id, selectedOrder.status, "Paid");
                                 }
                               }}
                               className="bg-green-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-soft hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                             >
                               <Check className="h-4 w-4" /> Verify
                             </button>
                             <button 
                               onClick={() => {
                                 if (window.confirm("Reject this payment? Customer will need to resubmit.")) {
                                   updateStatus(selectedOrder.id, selectedOrder.status, "Pending");
                                 }
                               }}
                               className="bg-red-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-soft hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                             >
                               <X className="h-4 w-4" /> Reject
                             </button>
                           </div>
                         )}
                         
                         {["Paid", "Verified", "Received"].includes(selectedOrder.payment_status) && (
                           <button 
                             onClick={() => {
                               if (window.confirm("Mark this order as UNPAID?")) {
                                 updateStatus(selectedOrder.id, selectedOrder.status, "Pending");
                               }
                             }}
                             className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                           >
                             <Ban className="h-4 w-4" /> Mark Unpaid
                           </button>
                         )}

                         {selectedOrder.payment_method === "Pickup" && selectedOrder.payment_status === "Pay At Pickup" && (
                           <button 
                             onClick={() => updateStatus(selectedOrder.id, selectedOrder.status, "Paid")}
                             className="w-full bg-primary text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-soft hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                           >
                             <CreditCard className="h-5 w-5" /> Mark Paid
                           </button>
                         )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-8 border-t border-border bg-gray-50/50 flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
               <div className="flex gap-2 flex-1 sm:flex-none">
                  <a 
                    href={`https://wa.me/91${selectedOrder.mobile}?text=${encodeURIComponent(`Hello ${selectedOrder.name}\n\nYour Green Eco Drycleaners order has been created.\n\nOrder ID:\n${selectedOrder.order_id}\n\nAmount:\n₹${selectedOrder.amount_min}${selectedOrder.amount_max && selectedOrder.amount_max > selectedOrder.amount_min ? `–₹${selectedOrder.amount_max}` : ""}\n\nStatus:\n${selectedOrder.status}\n\nTrack your order here:\n${window.location.origin}/order/${selectedOrder.order_id}`)}`}
                    target="_blank"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[color:var(--whatsapp)] text-white px-6 py-4 rounded-xl font-bold shadow-soft hover:scale-105 transition-all"
                  >
                    <MessageCircle className="h-5 w-5" /> Send Order on WhatsApp
                  </a>
               </div>
               <button 
                 onClick={() => setSelectedOrder(null)}
                 className="flex-1 sm:flex-none px-6 py-4 font-bold text-gray-500 hover:text-gray-900 transition-colors bg-white border border-border rounded-xl"
               >
                 Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, color = "text-gray-900" }: { title: string, value: string | number, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-border shadow-soft flex flex-col gap-2 text-center sm:text-left">
      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
      <p className={`text-2xl sm:text-3xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
  );
}

function DetailRow({ label, value, fullWidth = false }: { label: string, value: string, fullWidth?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${fullWidth ? "" : ""}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-bold text-gray-900 leading-tight break-words">{value}</span>
    </div>
  );
}
