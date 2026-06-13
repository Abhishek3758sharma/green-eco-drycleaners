import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { UPI_ID, MERCHANT_NAME, Booking } from "@/lib/business";
import { ArrowLeft, Copy, Download, Printer, ZoomIn, CreditCard, Trash2, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Booking | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
      fetchOrders();
    }
  }

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch orders");
    } else {
      setOrders(data || []);
    }
  }

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", orderToDelete.id);

      if (error) throw error;

      toast.success("Order deleted successfully.");
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      setDeleteConfirmText("");
      fetchOrders();
    } catch (err: any) {
      toast.error(`Deletion failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.mobile.includes(search)
    );
  }, [orders, search]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID Copied!");
  };

  const printQR = () => {
    window.print();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Checking access...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => navigate({ to: "/admin" })}
            className="flex items-center gap-2 text-primary font-black hover:underline"
          >
            <ArrowLeft className="h-5 w-5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Settings</h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Payment Settings Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl shadow-soft border border-border overflow-hidden sticky top-8">
              <div className="bg-primary p-6 text-white text-center">
                 <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-80" />
                 <h2 className="text-2xl font-black">Payment Settings</h2>
                 <p className="font-bold opacity-80 mt-1 tracking-tight text-xs uppercase">Manage Business UPI & QR</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Business Name</p>
                    <p className="text-lg font-black text-gray-900">{MERCHANT_NAME}</p>
                  </div>

                  <div className="flex justify-between items-end border-b border-border pb-4">
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">UPI ID</p>
                      <p className="text-lg font-mono font-black text-primary truncate mr-2">{UPI_ID}</p>
                    </div>
                    <button 
                      onClick={copyUPI}
                      className="bg-primary/10 text-primary p-2.5 rounded-xl hover:bg-primary hover:text-white transition-all shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-border text-center space-y-4 print:border-0 print:p-0">
                   <div className="bg-white p-4 rounded-2xl shadow-sm inline-block border-2 border-primary/10">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&cu=INR`)}`} 
                        alt="Payment QR"
                        className="w-40 h-40 mx-auto"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto print:hidden">
                     <button 
                      onClick={printQR}
                      className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform"
                     >
                       <Printer className="h-3.5 w-3.5" /> Print
                     </button>
                     <a 
                       href={`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=${MERCHANT_NAME}&cu=INR`)}`}
                       download="green-eco-qr.png"
                       target="_blank"
                       className="flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-bold text-xs hover:scale-[1.02] transition-transform"
                     >
                       <Download className="h-3.5 w-3.5" /> Save
                     </a>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Management Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl shadow-soft border border-border overflow-hidden flex flex-col min-h-[600px]">
              <div className="bg-gray-900 p-6 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black">Order Management</h2>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Search and Delete Records</p>
                  </div>
                </div>
                
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input 
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    placeholder="Search orders..."
                    className="w-full bg-white/10 border-none rounded-xl py-2 pl-9 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/50 text-white placeholder:text-white/30 outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-border">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginatedOrders.length > 0 ? paginatedOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-black text-gray-900">{o.order_id}</p>
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 uppercase">{o.booking_source || "WEBSITE"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 text-sm">{o.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">{o.mobile}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-black text-primary">₹{o.amount_min}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                            o.status === "Completed" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-gray-600">{new Date(o.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => {
                              setOrderToDelete(o);
                              setIsDeleteModalOpen(true);
                            }}
                            className="h-9 w-9 bg-red-50 text-red-500 rounded-xl inline-flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground font-medium italic">
                          No orders found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-border bg-gray-50 flex justify-between items-center shrink-0">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="p-2 rounded-xl bg-white border border-border disabled:opacity-30 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-1 px-4 font-black text-sm">
                      {currentPage} / {totalPages}
                    </div>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="p-2 rounded-xl bg-white border border-border disabled:opacity-30 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-red-600 p-8 text-white text-center">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black">Delete Order</h2>
              <p className="font-bold opacity-80 mt-1 uppercase tracking-widest text-xs">Permanently remove record</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-red-800 leading-relaxed">
                  Are you sure you want to permanently delete order <strong className="font-black">{orderToDelete.order_id}</strong>? 
                  <br /><br />
                  This action cannot be undone. All related data will be removed.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Type <span className="text-red-600">DELETE</span> to confirm</label>
                <input 
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE here..."
                  className="w-full bg-gray-50 border-2 border-border rounded-xl px-4 py-4 font-black text-center focus:ring-4 focus:ring-red-500/10 focus:border-red-600 transition-all outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setOrderToDelete(null);
                    setDeleteConfirmText("");
                  }}
                  className="bg-gray-100 text-gray-600 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  disabled={isDeleting || deleteConfirmText !== "DELETE"}
                  onClick={handleDeleteOrder}
                  className="bg-red-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-soft hover:bg-red-700 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

