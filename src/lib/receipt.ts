import { Booking, BUSINESS } from "./business";

export const printReceipt = (booking: Booking) => {
  const printWindow = window.open("", "_blank", "width=800,height=900");
  if (!printWindow) {
    alert("Please allow popups to print/download the receipt");
    return;
  }

  const itemsHtml = (booking.items || [])
    .map((it) => {
      const priceDisplay = it.price 
        ? `₹${it.price * it.quantity}` 
        : `₹${it.minPrice! * it.quantity}–₹${it.maxPrice! * it.quantity}`;
      
      const rateDisplay = it.price 
        ? `₹${it.price}` 
        : `₹${it.minPrice!}–₹${it.maxPrice!}`;

      return `
        <tr class="border-b border-gray-100">
          <td class="py-3 text-sm font-medium text-gray-800">${it.serviceName}</td>
          <td class="py-3 text-sm text-center text-gray-600">${it.quantity}</td>
          <td class="py-3 text-sm text-right text-gray-600">${rateDisplay}</td>
          <td class="py-3 text-sm text-right font-semibold text-gray-900">${priceDisplay}</td>
        </tr>
      `;
    })
    .join("");

  const formattedOrderDate = new Date(booking.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedPickupDate = new Date(booking.pickup_date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const totalAmount = booking.amount_min === booking.amount_max || !booking.amount_max
    ? `₹${booking.amount_min}`
    : `₹${booking.amount_min}–₹${booking.amount_max}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Receipt - ${booking.order_id}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border {
            border: 1px solid #e5e7eb !important;
          }
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #f9fafb;
        }
      </style>
    </head>
    <body class="p-0 sm:p-6 md:p-12">
      <!-- Top Action Bar (hidden when printed) -->
      <div class="no-print max-w-3xl mx-auto mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
        <span class="text-sm font-semibold text-gray-600">Receipt Preview</span>
        <div class="flex gap-3">
          <button onclick="window.print()" class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print / Save PDF
          </button>
          <button onclick="window.close()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
            Close Window
          </button>
        </div>
      </div>

      <!-- Main Receipt Card -->
      <div class="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-[2rem] shadow-md border border-gray-100 print:shadow-none print:border-0 print:p-0">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-8 gap-6">
          <div>
            <h1 class="text-3xl font-extrabold text-green-600 tracking-tight">${BUSINESS.name}</h1>
            <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Dry Cleaning & Laundry</p>
            <p class="text-sm text-gray-500 mt-2 max-w-md font-medium">${BUSINESS.address}</p>
          </div>
          <div class="text-left sm:text-right space-y-1">
            <p class="text-sm font-bold text-gray-800">Phone: <span class="font-medium text-gray-600">${BUSINESS.phones.join(", ")}</span></p>
            <p class="text-sm font-bold text-gray-800">Email: <span class="font-medium text-gray-600">${BUSINESS.email}</span></p>
            <p class="text-sm font-bold text-gray-800">Hours: <span class="font-medium text-gray-600">8:00 AM – 9:00 PM</span></p>
          </div>
        </div>

        <!-- Meta Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b border-gray-100">
          <!-- Order Information -->
          <div class="space-y-2">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-400">Order Information</h3>
            <div class="text-sm space-y-1.5">
              <p class="text-gray-500 font-medium">Receipt No / Order ID: <span class="font-extrabold text-gray-900">${booking.order_id}</span></p>
              <p class="text-gray-500 font-medium">Order Date: <span class="font-semibold text-gray-900">${formattedOrderDate}</span></p>
              <p class="text-gray-500 font-medium">Booking Source: <span class="font-extrabold uppercase text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs print:border print-border">${booking.booking_source || "Website"}</span></p>
              <p class="text-gray-500 font-medium">Status: <span class="font-bold text-gray-900">${booking.status}</span></p>
            </div>
          </div>

          <!-- Customer Details -->
          <div class="space-y-2">
            <h3 class="text-xs font-black uppercase tracking-widest text-gray-400">Customer Details</h3>
            <div class="text-sm space-y-1.5">
              <p class="text-gray-500 font-medium">Name: <span class="font-bold text-gray-900">${booking.name}</span></p>
              <p class="text-gray-500 font-medium">Phone: <span class="font-semibold text-gray-900">${booking.mobile}</span></p>
              <p class="text-gray-500 font-medium">Email: <span class="font-semibold text-gray-900">${booking.email || "N/A"}</span></p>
              <p class="text-gray-500 font-medium">Pickup/Delivery Date: <span class="font-bold text-gray-900">${formattedPickupDate}</span></p>
              <p class="text-gray-500 font-medium">Address: <span class="font-semibold text-gray-900">${booking.address || "Counter Pickup"}</span></p>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="py-8">
          <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Garment & Service List</h3>
          <table class="w-full">
            <thead>
              <tr class="border-b-2 border-gray-100 text-left">
                <th class="pb-3 text-xs font-bold text-gray-400 uppercase">Service Description</th>
                <th class="pb-3 text-xs font-bold text-gray-400 uppercase text-center w-16">Qty</th>
                <th class="pb-3 text-xs font-bold text-gray-400 uppercase text-right w-32">Rate</th>
                <th class="pb-3 text-xs font-bold text-gray-400 uppercase text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <!-- Summary & Payment Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-t border-gray-100">
          <!-- Payment status -->
          <div class="bg-gray-50 p-6 rounded-2xl space-y-2 border border-gray-100 print:bg-white print:border print-border">
            <h4 class="text-xs font-black uppercase tracking-widest text-gray-400">Payment Status</h4>
            <div class="text-sm space-y-1.5">
              <p class="text-gray-500 font-medium">Payment Method: <span class="font-bold text-gray-900">${booking.payment_method}</span></p>
              <p class="text-gray-500 font-medium">Payment Status: <span class="font-extrabold text-green-700 uppercase bg-green-50 px-2 py-0.5 rounded text-xs print:border print-border">${booking.payment_status}</span></p>
              ${booking.transaction_id ? `<p class="text-gray-500 font-medium">Txn ID: <span class="font-bold text-gray-900 select-all">${booking.transaction_id}</span></p>` : ""}
            </div>
          </div>

          <!-- Totals -->
          <div class="flex flex-col justify-center space-y-3 md:pl-12">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-500">Subtotal</span>
              <span class="text-sm font-semibold text-gray-900">${totalAmount}</span>
            </div>
            <div class="flex justify-between items-center border-t border-gray-100 pt-3">
              <span class="text-base font-bold text-gray-900">Total Estimate</span>
              <span class="text-2xl font-black text-green-600">${totalAmount}</span>
            </div>
          </div>
        </div>

        <!-- Terms & Conditions -->
        <div class="border-t border-gray-100 pt-8 mt-4 space-y-3">
          <h4 class="text-xs font-black uppercase tracking-widest text-gray-400">Terms & Conditions</h4>
          <ol class="text-[10px] text-gray-400 space-y-1 list-decimal pl-4 leading-relaxed font-medium">
            <li>Please count garments and verify items before leaving the counter or at delivery. No complaints will be entertained afterward.</li>
            <li>We exercise extreme caution in processing your garments, but we cannot assume responsibility for color bleeding, fabric shrinkage, or damage to aged/fragile materials.</li>
            <li>Any discrepancy or damage must be reported in writing within 24 hours of delivery, accompanied by this original receipt.</li>
            <li>Our liabilities in case of damage or loss shall not exceed 5 times the laundry/dry cleaning charges of that particular garment.</li>
          </ol>
        </div>

        <!-- Thank you Footer -->
        <div class="text-center pt-10 mt-8 border-t border-gray-50">
          <p class="text-sm font-bold text-gray-800">Thank you for choosing Green Eco Drycleaners!</p>
          <p class="text-xs text-gray-400 mt-1">Keep this receipt safe for collecting your garments.</p>
        </div>
      </div>

      <script>
        // Trigger print after Tailwind styles load
        window.addEventListener('load', () => {
          setTimeout(() => {
            window.print();
          }, 400);
        });
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
