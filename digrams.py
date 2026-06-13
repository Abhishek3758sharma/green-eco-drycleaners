import cairosvg, os

diagrams = {}

# ── Fig 2.1  Use Case Diagram ─────────────────────────────────────────────────
diagrams["usecase"] = """
<svg width="780" height="420" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="420" fill="#F8FBFF" rx="10"/>
  <!-- Title -->
  <text x="390" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3864">Use Case Diagram — Online Laundry Management System</text>

  <!-- System boundary -->
  <rect x="180" y="45" width="420" height="330" fill="#EBF3FB" stroke="#2E74B5" stroke-width="2" rx="8"/>
  <text x="390" y="68" text-anchor="middle" font-size="13" font-weight="bold" fill="#2E74B5">Online Laundry Management System</text>

  <!-- Customer actor (left) -->
  <circle cx="80" cy="160" r="18" fill="#D0E8FF" stroke="#1F3864" stroke-width="2"/>
  <line x1="80" y1="178" x2="80" y2="220" stroke="#1F3864" stroke-width="2"/>
  <line x1="55" y1="195" x2="105" y2="195" stroke="#1F3864" stroke-width="2"/>
  <line x1="80" y1="220" x2="58" y2="248" stroke="#1F3864" stroke-width="2"/>
  <line x1="80" y1="220" x2="102" y2="248" stroke="#1F3864" stroke-width="2"/>
  <text x="80" y="268" text-anchor="middle" font-size="13" font-weight="bold" fill="#1F3864">Customer</text>

  <!-- Admin actor (right) -->
  <circle cx="700" cy="200" r="18" fill="#D0FFE8" stroke="#1F3864" stroke-width="2"/>
  <line x1="700" y1="218" x2="700" y2="260" stroke="#1F3864" stroke-width="2"/>
  <line x1="675" y1="235" x2="725" y2="235" stroke="#1F3864" stroke-width="2"/>
  <line x1="700" y1="260" x2="678" y2="288" stroke="#1F3864" stroke-width="2"/>
  <line x1="700" y1="260" x2="722" y2="288" stroke="#1F3864" stroke-width="2"/>
  <text x="700" y="308" text-anchor="middle" font-size="13" font-weight="bold" fill="#1F3864">Admin</text>

  <!-- Customer use cases -->
  <ellipse cx="310" cy="115" rx="110" ry="26" fill="#FFFFFF" stroke="#2E74B5" stroke-width="1.5"/>
  <text x="310" y="119" text-anchor="middle" font-size="11" fill="#1F3864">Book Laundry Order</text>

  <ellipse cx="310" cy="175" rx="110" ry="26" fill="#FFFFFF" stroke="#2E74B5" stroke-width="1.5"/>
  <text x="310" y="179" text-anchor="middle" font-size="11" fill="#1F3864">View Order Confirmation</text>

  <!-- Admin use cases -->
  <ellipse cx="500" cy="100" rx="110" ry="26" fill="#FFFFFF" stroke="#00A896" stroke-width="1.5"/>
  <text x="500" y="104" text-anchor="middle" font-size="11" fill="#1F3864">View All Bookings</text>

  <ellipse cx="500" cy="160" rx="110" ry="26" fill="#FFFFFF" stroke="#00A896" stroke-width="1.5"/>
  <text x="500" y="164" text-anchor="middle" font-size="11" fill="#1F3864">Update Order Status</text>

  <ellipse cx="500" cy="220" rx="110" ry="26" fill="#FFFFFF" stroke="#00A896" stroke-width="1.5"/>
  <text x="500" y="224" text-anchor="middle" font-size="11" fill="#1F3864">Create Counter Order</text>

  <ellipse cx="500" cy="280" rx="110" ry="26" fill="#FFFFFF" stroke="#00A896" stroke-width="1.5"/>
  <text x="500" y="284" text-anchor="middle" font-size="11" fill="#1F3864">Monitor Revenue</text>

  <ellipse cx="500" cy="340" rx="110" ry="26" fill="#FFF3E0" stroke="#F4A261" stroke-width="1.5"/>
  <text x="500" y="344" text-anchor="middle" font-size="11" fill="#1F3864">Send WhatsApp Notification</text>

  <!-- Arrows: Customer to use cases -->
  <line x1="98" y1="155" x2="200" y2="118" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="98" y1="165" x2="200" y2="172" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- Arrows: Admin to use cases -->
  <line x1="682" y1="196" x2="610" y2="105" stroke="#00A896" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="682" y1="200" x2="610" y2="163" stroke="#00A896" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="682" y1="205" x2="610" y2="222" stroke="#00A896" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="682" y1="210" x2="610" y2="280" stroke="#00A896" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="682" y1="215" x2="610" y2="338" stroke="#00A896" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- include: Update Status includes WhatsApp -->
  <line x1="500" y1="186" x2="500" y2="314" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="6,3" marker-end="url(#arrorange)"/>
  <text x="510" y="255" font-size="10" fill="#F4A261">&lt;&lt;include&gt;&gt;</text>

  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#2E74B5"/>
    </marker>
    <marker id="arrorange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#F4A261"/>
    </marker>
  </defs>
</svg>
"""

# ── Fig 2.2  Sequence Diagram – Customer Booking ─────────────────────────────
diagrams["seq_customer"] = """
<svg width="780" height="340" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="340" fill="#F8FBFF" rx="10"/>
  <text x="390" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">Sequence Diagram — Customer Booking Flow</text>

  <!-- Lifeline headers -->
  <rect x="30"  y="38" width="100" height="34" rx="6" fill="#1F3864"/><text x="80"  y="59" text-anchor="middle" font-size="11" fill="white">Customer</text>
  <rect x="170" y="38" width="110" height="34" rx="6" fill="#2E74B5"/><text x="225" y="59" text-anchor="middle" font-size="11" fill="white">BookingForm</text>
  <rect x="320" y="38" width="110" height="34" rx="6" fill="#2E74B5"/><text x="375" y="59" text-anchor="middle" font-size="11" fill="white">Validation</text>
  <rect x="470" y="38" width="120" height="34" rx="6" fill="#00A896"/><text x="530" y="59" text-anchor="middle" font-size="11" fill="white">SupabaseClient</text>
  <rect x="630" y="38" width="110" height="34" rx="6" fill="#375623"/><text x="685" y="59" text-anchor="middle" font-size="11" fill="white">OrderID Gen</text>

  <!-- Lifelines -->
  <line x1="80"  y1="72" x2="80"  y2="320" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="225" y1="72" x2="225" y2="320" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="375" y1="72" x2="375" y2="320" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="530" y1="72" x2="530" y2="320" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="685" y1="72" x2="685" y2="320" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>

  <!-- Messages -->
  <!-- 1 -->
  <line x1="80" y1="100" x2="218" y2="100" stroke="#1F3864" stroke-width="1.5" marker-end="url(#blk)"/>
  <text x="148" y="95" text-anchor="middle" font-size="10" fill="#1F3864">1. Open booking page</text>

  <!-- 2 -->
  <line x1="225" y1="130" x2="80"  y2="130" stroke="#2E74B5" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#blk)"/>
  <text x="148" y="125" text-anchor="middle" font-size="10" fill="#2E74B5">2. Render booking form</text>

  <!-- 3 -->
  <line x1="80" y1="160" x2="218" y2="160" stroke="#1F3864" stroke-width="1.5" marker-end="url(#blk)"/>
  <text x="148" y="155" text-anchor="middle" font-size="10" fill="#1F3864">3. Submit form data</text>

  <!-- 4 -->
  <line x1="225" y1="190" x2="368" y2="190" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#blk)"/>
  <text x="298" y="185" text-anchor="middle" font-size="10" fill="#2E74B5">4. validate(data)</text>

  <!-- 5 -->
  <line x1="375" y1="215" x2="232" y2="215" stroke="#2E74B5" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#blk)"/>
  <text x="298" y="210" text-anchor="middle" font-size="10" fill="#375623">5. validationOK</text>

  <!-- 6 -->
  <line x1="225" y1="243" x2="523" y2="243" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#blk)"/>
  <text x="373" y="238" text-anchor="middle" font-size="10" fill="#2E74B5">6. insert(bookingData)</text>

  <!-- 7 -->
  <line x1="530" y1="268" x2="678" y2="268" stroke="#00A896" stroke-width="1.5" marker-end="url(#blk)"/>
  <text x="603" y="263" text-anchor="middle" font-size="10" fill="#00A896">7. generateID()</text>

  <!-- 8 -->
  <line x1="685" y1="290" x2="537" y2="290" stroke="#375623" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#blk)"/>
  <text x="610" y="285" text-anchor="middle" font-size="10" fill="#375623">8. ORD-2025-xxxx</text>

  <!-- 9 -->
  <line x1="530" y1="308" x2="87"  y2="308" stroke="#00A896" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#blk)"/>
  <text x="310" y="303" text-anchor="middle" font-size="10" fill="#00A896">9. Show Order ID confirmation</text>

  <defs>
    <marker id="blk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#1F3864"/>
    </marker>
  </defs>
</svg>
"""

# ── Fig 2.3  Sequence Diagram – Admin Status Update ──────────────────────────
diagrams["seq_admin"] = """
<svg width="780" height="300" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="300" fill="#F8FBFF" rx="10"/>
  <text x="390" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">Sequence Diagram — Admin Order Status Update</text>

  <rect x="30"  y="38" width="100" height="34" rx="6" fill="#1F3864"/><text x="80"  y="59" text-anchor="middle" font-size="11" fill="white">Admin</text>
  <rect x="165" y="38" width="120" height="34" rx="6" fill="#2E74B5"/><text x="225" y="59" text-anchor="middle" font-size="11" fill="white">AdminDashboard</text>
  <rect x="320" y="38" width="120" height="34" rx="6" fill="#00A896"/><text x="380" y="59" text-anchor="middle" font-size="11" fill="white">SupabaseClient</text>
  <rect x="470" y="38" width="130" height="34" rx="6" fill="#375623"/><text x="535" y="59" text-anchor="middle" font-size="11" fill="white">NotificationSvc</text>
  <rect x="630" y="38" width="120" height="34" rx="6" fill="#F4A261"/><text x="690" y="59" text-anchor="middle" font-size="11" fill="white">WhatsApp GW</text>

  <line x1="80"  y1="72" x2="80"  y2="285" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="225" y1="72" x2="225" y2="285" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="380" y1="72" x2="380" y2="285" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="535" y1="72" x2="535" y2="285" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>
  <line x1="690" y1="72" x2="690" y2="285" stroke="#AAAAAA" stroke-width="1.5" stroke-dasharray="5,4"/>

  <line x1="80" y1="105" x2="218" y2="105" stroke="#1F3864" stroke-width="1.5" marker-end="url(#b2)"/>
  <text x="148" y="100" text-anchor="middle" font-size="10" fill="#1F3864">1. Click status dropdown</text>

  <line x1="225" y1="133" x2="373" y2="133" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#b2)"/>
  <text x="298" y="128" text-anchor="middle" font-size="10" fill="#2E74B5">2. update(bookingId, status)</text>

  <line x1="380" y1="158" x2="232" y2="158" stroke="#00A896" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#b2)"/>
  <text x="298" y="153" text-anchor="middle" font-size="10" fill="#00A896">3. updateSuccess</text>

  <line x1="225" y1="185" x2="528" y2="185" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#b2)"/>
  <text x="375" y="180" text-anchor="middle" font-size="10" fill="#2E74B5">4. notify(mobile, orderId, status)</text>

  <line x1="535" y1="210" x2="683" y2="210" stroke="#375623" stroke-width="1.5" marker-end="url(#b2)"/>
  <text x="610" y="205" text-anchor="middle" font-size="10" fill="#375623">5. POST WhatsApp msg</text>

  <line x1="690" y1="235" x2="542" y2="235" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#b2)"/>
  <text x="614" y="230" text-anchor="middle" font-size="10" fill="#F4A261">6. delivered</text>

  <line x1="535" y1="260" x2="87" y2="260" stroke="#375623" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#b2)"/>
  <text x="310" y="255" text-anchor="middle" font-size="10" fill="#375623">7. Show success toast to admin</text>

  <defs>
    <marker id="b2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#1F3864"/>
    </marker>
  </defs>
</svg>
"""

# ── Fig 3.1  System Architecture ─────────────────────────────────────────────
diagrams["architecture"] = """
<svg width="780" height="380" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="380" fill="#F0F6FF" rx="10"/>
  <text x="390" y="28" text-anchor="middle" font-size="16" font-weight="bold" fill="#1F3864">System Architecture — Three-Tier Deployment</text>

  <!-- Tier labels -->
  <text x="28" y="85"  font-size="11" font-weight="bold" fill="#2E74B5" transform="rotate(-90,28,85)">Presentation</text>
  <text x="28" y="200" font-size="11" font-weight="bold" fill="#00A896" transform="rotate(-90,28,200)">Logic</text>
  <text x="28" y="320" font-size="11" font-weight="bold" fill="#375623" transform="rotate(-90,28,320)">Data</text>

  <!-- Tier bands -->
  <rect x="48" y="48"  width="710" height="90"  fill="#E8F2FF" rx="6" stroke="#2E74B5" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="48" y="158" width="710" height="90"  fill="#E8FFF5" rx="6" stroke="#00A896" stroke-width="1" stroke-dasharray="4,3"/>
  <rect x="48" y="268" width="710" height="90"  fill="#EFFAEF" rx="6" stroke="#375623" stroke-width="1" stroke-dasharray="4,3"/>

  <!-- Presentation tier boxes -->
  <rect x="80"  y="68" width="155" height="54" rx="8" fill="#1F3864"/>
  <text x="157" y="89" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Customer Browser</text>
  <text x="157" y="107" text-anchor="middle" font-size="10" fill="#AACCEE">Booking Form (React)</text>

  <rect x="280" y="68" width="155" height="54" rx="8" fill="#1F3864"/>
  <text x="357" y="89" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Admin Browser</text>
  <text x="357" y="107" text-anchor="middle" font-size="10" fill="#AACCEE">Dashboard (React)</text>

  <rect x="480" y="68" width="240" height="54" rx="8" fill="#2E74B5"/>
  <text x="600" y="89" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Vercel CDN</text>
  <text x="600" y="107" text-anchor="middle" font-size="10" fill="#CCE4FF">Serves React SPA (static files)</text>

  <!-- Logic tier -->
  <rect x="80"  y="175" width="300" height="54" rx="8" fill="#007A6E"/>
  <text x="230" y="196" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Vercel Serverless Functions</text>
  <text x="230" y="214" text-anchor="middle" font-size="10" fill="#CCFFF5">/api/notify — WhatsApp proxy</text>

  <rect x="420" y="175" width="300" height="54" rx="8" fill="#375623"/>
  <text x="570" y="196" text-anchor="middle" font-size="12" font-weight="bold" fill="white">WhatsApp Business API</text>
  <text x="570" y="214" text-anchor="middle" font-size="10" fill="#CCFFCC">Sends status SMS to customer</text>

  <!-- Data tier -->
  <rect x="180" y="285" width="400" height="54" rx="8" fill="#1F5C2E"/>
  <text x="380" y="306" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Supabase PostgreSQL</text>
  <text x="380" y="324" text-anchor="middle" font-size="10" fill="#CCFFCC">Bookings · Admins · Real-time API · Auto backups</text>

  <!-- Arrows -->
  <defs>
    <marker id="a3" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
  </defs>
  <line x1="157" y1="122" x2="157" y2="170" stroke="#555" stroke-width="1.5" marker-end="url(#a3)"/>
  <line x1="357" y1="122" x2="320" y2="170" stroke="#555" stroke-width="1.5" marker-end="url(#a3)"/>
  <line x1="600" y1="122" x2="600" y2="170" stroke="#555" stroke-width="1.5" marker-end="url(#a3)" stroke-dasharray="4,3"/>
  <line x1="380" y1="229" x2="380" y2="280" stroke="#555" stroke-width="1.5" marker-end="url(#a3)"/>
  <line x1="230" y1="229" x2="330" y2="280" stroke="#555" stroke-width="1.5" marker-end="url(#a3)"/>

  <!-- HTTPS label -->
  <text x="620" y="150" font-size="10" fill="#2E74B5">HTTPS / REST</text>
  <line x1="565" y1="143" x2="157" y2="143" stroke="#2E74B5" stroke-width="1" stroke-dasharray="3,3"/>
  <line x1="157" y1="122" x2="157" y2="145" stroke="#2E74B5" stroke-width="1"/>
  <line x1="380" y1="122" x2="380" y2="143" stroke="#2E74B5" stroke-width="1"/>
</svg>
"""

# ── Fig 3.3  DFD Level 0 ─────────────────────────────────────────────────────
diagrams["dfd0"] = """
<svg width="780" height="360" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="360" fill="#F8FBFF" rx="10"/>
  <text x="390" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">DFD Level 0 — Context Diagram</text>

  <!-- External entities -->
  <rect x="30"  y="100" width="130" height="60" rx="6" fill="#1F3864"/>
  <text x="95"  y="126" text-anchor="middle" font-size="13" font-weight="bold" fill="white">Customer</text>
  <text x="95"  y="146" text-anchor="middle" font-size="10" fill="#AACCEE">(External Entity)</text>

  <rect x="30"  y="210" width="130" height="60" rx="6" fill="#2E74B5"/>
  <text x="95"  y="236" text-anchor="middle" font-size="13" font-weight="bold" fill="white">Admin</text>
  <text x="95"  y="256" text-anchor="middle" font-size="10" fill="#CCE4FF">(External Entity)</text>

  <rect x="620" y="155" width="130" height="60" rx="6" fill="#375623"/>
  <text x="685" y="181" text-anchor="middle" font-size="13" font-weight="bold" fill="white">WhatsApp</text>
  <text x="685" y="199" text-anchor="middle" font-size="10" fill="#CCFFCC">Service</text>

  <!-- Central process -->
  <ellipse cx="390" cy="185" rx="140" ry="80" fill="#EBF3FB" stroke="#2E74B5" stroke-width="2.5"/>
  <text x="390" y="178" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3864">Laundry</text>
  <text x="390" y="198" text-anchor="middle" font-size="14" font-weight="bold" fill="#1F3864">Management</text>
  <text x="390" y="218" text-anchor="middle" font-size="12" fill="#2E74B5">System</text>

  <!-- Data store -->
  <rect x="290" y="310" width="200" height="38" fill="#FFFDE7" stroke="#F4A261" stroke-width="1.5"/>
  <text x="390" y="334" text-anchor="middle" font-size="12" fill="#1F3864">D1: Bookings (Supabase)</text>

  <!-- Flows: Customer ↔ System -->
  <line x1="160" y1="120" x2="250" y2="155" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a4)"/>
  <text x="198" y="128" font-size="10" fill="#1F3864">Booking Request</text>

  <line x1="250" y1="170" x2="160" y2="145" stroke="#2E74B5" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#a4)"/>
  <text x="175" y="165" font-size="10" fill="#2E74B5">Order ID</text>

  <!-- Flows: Admin ↔ System -->
  <line x1="160" y1="225" x2="252" y2="200" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#a4)"/>
  <text x="175" y="220" font-size="10" fill="#2E74B5">Status Update</text>

  <line x1="252" y1="215" x2="160" y2="240" stroke="#1F3864" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#a4)"/>
  <text x="175" y="248" font-size="10" fill="#1F3864">Booking List</text>

  <!-- Flows: System ↔ WhatsApp -->
  <line x1="530" y1="175" x2="620" y2="178" stroke="#375623" stroke-width="1.5" marker-end="url(#a4)"/>
  <text x="540" y="168" font-size="10" fill="#375623">Notification</text>

  <line x1="620" y1="192" x2="530" y2="195" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="5,3" marker-end="url(#a4)"/>
  <text x="543" y="207" font-size="10" fill="#F4A261">Delivered</text>

  <!-- System ↔ Data store -->
  <line x1="390" y1="265" x2="390" y2="310" stroke="#555" stroke-width="1.5" marker-end="url(#a4)"/>
  <line x1="400" y1="310" x2="400" y2="265" stroke="#555" stroke-width="1.5" stroke-dasharray="4,3" marker-end="url(#a4)"/>

  <defs>
    <marker id="a4" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#1F3864"/>
    </marker>
  </defs>
</svg>
"""

# ── Fig 3.4  DFD Level 1 ─────────────────────────────────────────────────────
diagrams["dfd1"] = """
<svg width="780" height="420" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="420" fill="#F8FBFF" rx="10"/>
  <text x="390" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">DFD Level 1 — Expanded System Processes</text>

  <!-- External entities -->
  <rect x="10"  y="90"  width="110" height="48" rx="5" fill="#1F3864"/>
  <text x="65"  y="118" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Customer</text>

  <rect x="10"  y="210" width="110" height="48" rx="5" fill="#2E74B5"/>
  <text x="65"  y="238" text-anchor="middle" font-size="12" font-weight="bold" fill="white">Admin</text>

  <rect x="660" y="150" width="110" height="48" rx="5" fill="#375623"/>
  <text x="715" y="178" text-anchor="middle" font-size="12" font-weight="bold" fill="white">WhatsApp</text>

  <!-- Data store -->
  <rect x="260" y="375" width="260" height="36" fill="#FFFDE7" stroke="#F4A261" stroke-width="1.5"/>
  <text x="390" y="398" text-anchor="middle" font-size="11" fill="#1F3864">D1: Bookings Store (Supabase)</text>

  <!-- Processes -->
  <!-- P1 Booking Mgmt -->
  <ellipse cx="260" cy="110" rx="90" ry="38" fill="#EBF3FB" stroke="#2E74B5" stroke-width="2"/>
  <text x="260" y="104" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">P1: Booking</text>
  <text x="260" y="120" text-anchor="middle" font-size="10" fill="#1F3864">Management</text>

  <!-- P2 Status Mgmt -->
  <ellipse cx="260" cy="240" rx="90" ry="38" fill="#E8FFF5" stroke="#00A896" stroke-width="2"/>
  <text x="260" y="234" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">P2: Order Status</text>
  <text x="260" y="250" text-anchor="middle" font-size="10" fill="#1F3864">Management</text>

  <!-- P3 Counter Orders -->
  <ellipse cx="520" cy="240" rx="90" ry="38" fill="#FFF3E0" stroke="#F4A261" stroke-width="2"/>
  <text x="520" y="234" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">P3: Counter</text>
  <text x="520" y="250" text-anchor="middle" font-size="10" fill="#1F3864">Order Mgmt</text>

  <!-- P4 Revenue -->
  <ellipse cx="520" cy="110" rx="90" ry="38" fill="#EFFAEF" stroke="#375623" stroke-width="2"/>
  <text x="520" y="104" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">P4: Revenue</text>
  <text x="520" y="120" text-anchor="middle" font-size="10" fill="#1F3864">Analytics</text>

  <!-- P5 Notification -->
  <ellipse cx="390" cy="310" rx="90" ry="38" fill="#FCE8FF" stroke="#9B30FF" stroke-width="2"/>
  <text x="390" y="304" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">P5: WhatsApp</text>
  <text x="390" y="320" text-anchor="middle" font-size="10" fill="#1F3864">Notification</text>

  <!-- Flows -->
  <defs><marker id="a5" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#555"/></marker></defs>

  <line x1="120" y1="108" x2="170" y2="108" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a5)"/>
  <text x="140" y="103" font-size="9" fill="#1F3864">Booking</text>

  <line x1="120" y1="228" x2="170" y2="230" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#a5)"/>
  <text x="130" y="222" font-size="9" fill="#2E74B5">Status</text>

  <line x1="120" y1="242" x2="430" y2="242" stroke="#2E74B5" stroke-width="1.5" marker-end="url(#a5)"/>
  <text x="290" y="237" font-size="9" fill="#F4A261">Counter order</text>

  <line x1="260" y1="148" x2="260" y2="375" stroke="#555" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#a5)"/>
  <line x1="520" y1="148" x2="520" y2="375" stroke="#555" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#a5)"/>

  <line x1="260" y1="278" x2="300" y2="272" stroke="#555" stroke-width="1.5" marker-end="url(#a5)"/>
  <line x1="480" y1="278" x2="478" y2="272" stroke="#555" stroke-width="1.5" marker-end="url(#a5)"/>

  <line x1="390" y1="348" x2="630" y2="166" stroke="#375623" stroke-width="1.5" marker-end="url(#a5)"/>
  <text x="530" y="270" font-size="9" fill="#375623">WhatsApp msg</text>

  <!-- P1 → P4 read -->
  <line x1="350" y1="110" x2="430" y2="110" stroke="#555" stroke-width="1" stroke-dasharray="3,2" marker-end="url(#a5)"/>
</svg>
"""

# ── Fig 3.5  Activity Diagram ─────────────────────────────────────────────────
diagrams["activity"] = """
<svg width="780" height="520" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="520" fill="#F8FBFF" rx="10"/>
  <text x="390" y="28" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">Activity Diagram — Customer Booking Flow</text>

  <defs>
    <marker id="a6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#1F3864"/>
    </marker>
  </defs>

  <!-- Start -->
  <circle cx="390" cy="60" r="16" fill="#1F3864"/>
  <text x="415" y="65" font-size="11" fill="#555">Start</text>

  <!-- Open Page -->
  <rect x="270" y="92" width="240" height="42" rx="20" fill="#2E74B5"/>
  <text x="390" y="118" text-anchor="middle" font-size="12" fill="white">Customer Opens Booking Page</text>

  <!-- Fill Form -->
  <rect x="270" y="156" width="240" height="42" rx="20" fill="#2E74B5"/>
  <text x="390" y="182" text-anchor="middle" font-size="12" fill="white">Fill in Form Fields</text>

  <!-- Diamond: form complete? -->
  <polygon points="390,218 450,248 390,278 330,248" fill="#EBF3FB" stroke="#2E74B5" stroke-width="2"/>
  <text x="390" y="252" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">Complete?</text>
  <text x="468" y="244" font-size="10" fill="#375623">Yes</text>
  <text x="295" y="265" font-size="10" fill="#CC0000">No</text>

  <!-- Loop back arrow -->
  <path d="M330,248 Q220,248 220,182 Q220,138 270,138" stroke="#CC0000" stroke-width="1.5" fill="none" stroke-dasharray="5,3" marker-end="url(#a6)"/>

  <!-- Submit -->
  <rect x="270" y="292" width="240" height="42" rx="20" fill="#00A896"/>
  <text x="390" y="318" text-anchor="middle" font-size="12" fill="white">Submit Booking</text>

  <!-- Validation diamond -->
  <polygon points="390,354 455,384 390,414 325,384" fill="#EBF3FB" stroke="#00A896" stroke-width="2"/>
  <text x="390" y="388" text-anchor="middle" font-size="11" font-weight="bold" fill="#1F3864">Valid?</text>
  <text x="463" y="381" font-size="10" fill="#375623">Yes</text>
  <text x="286" y="396" font-size="10" fill="#CC0000">No</text>

  <!-- Invalid: show error -->
  <rect x="100" y="370" width="160" height="38" rx="8" fill="#FFECEC" stroke="#CC0000" stroke-width="1.5"/>
  <text x="180" y="394" text-anchor="middle" font-size="11" fill="#CC0000">Show Error Message</text>
  <path d="M325,384 Q240,384 240,182 Q240,138 270,138" stroke="#CC0000" stroke-width="1.5" fill="none" stroke-dasharray="5,3" marker-end="url(#a6)"/>

  <!-- Fork bar -->
  <rect x="310" y="428" width="160" height="8" rx="2" fill="#1F3864"/>

  <!-- Parallel: Save + Generate ID -->
  <rect x="200" y="454" width="155" height="38" rx="8" fill="#375623"/>
  <text x="277" y="478" text-anchor="middle" font-size="11" fill="white">Save to Database</text>

  <rect x="425" y="454" width="155" height="38" rx="8" fill="#375623"/>
  <text x="502" y="478" text-anchor="middle" font-size="11" fill="white">Generate Order ID</text>

  <!-- Join bar -->
  <rect x="310" y="500" width="160" height="8" rx="2" fill="#1F3864"/>
  <text x="510" y="510" font-size="10" fill="#555">End</text>
  <circle cx="495" cy="508" r="10" fill="none" stroke="#1F3864" stroke-width="3"/>
  <circle cx="495" cy="508" r="6" fill="#1F3864"/>

  <!-- Arrows -->
  <line x1="390" y1="76"  x2="390" y2="92"  stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="390" y1="134" x2="390" y2="156" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="390" y1="198" x2="390" y2="218" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="390" y1="278" x2="390" y2="292" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="390" y1="334" x2="390" y2="354" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="390" y1="414" x2="390" y2="428" stroke="#375623" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="310" y1="458" x2="277" y2="454" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="470" y1="458" x2="502" y2="454" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="277" y1="492" x2="350" y2="500" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="502" y1="492" x2="430" y2="500" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
  <line x1="470" y1="504" x2="485" y2="498" stroke="#1F3864" stroke-width="1.5" marker-end="url(#a6)"/>
</svg>
"""

# ── Fig 3.6  ER Diagram ───────────────────────────────────────────────────────
diagrams["er"] = """
<svg width="780" height="380" xmlns="http://www.w3.org/2000/svg" font-family="Arial">
  <rect width="780" height="380" fill="#F8FBFF" rx="10"/>
  <text x="390" y="26" text-anchor="middle" font-size="15" font-weight="bold" fill="#1F3864">ER Diagram — Customer, Booking, Admin</text>

  <!-- Customer entity -->
  <rect x="40" y="80" width="180" height="200" rx="8" fill="#EBF3FB" stroke="#2E74B5" stroke-width="2"/>
  <rect x="40" y="80" width="180" height="36" rx="8" fill="#2E74B5"/>
  <text x="130" y="103" text-anchor="middle" font-size="13" font-weight="bold" fill="white">CUSTOMER</text>
  <text x="130" y="132" text-anchor="middle" font-size="11" fill="#1F3864">🔑 customer_id (PK)</text>
  <text x="130" y="155" text-anchor="middle" font-size="11" fill="#1F3864">name</text>
  <text x="130" y="175" text-anchor="middle" font-size="11" fill="#1F3864">mobile_number</text>
  <text x="130" y="195" text-anchor="middle" font-size="11" fill="#1F3864">address</text>
  <text x="130" y="215" text-anchor="middle" font-size="10" fill="#888">(future table)</text>

  <!-- Booking entity -->
  <rect x="290" y="50" width="220" height="290" rx="8" fill="#EFFAEF" stroke="#375623" stroke-width="2"/>
  <rect x="290" y="50" width="220" height="36" rx="8" fill="#375623"/>
  <text x="400" y="73" text-anchor="middle" font-size="13" font-weight="bold" fill="white">BOOKING</text>
  <text x="400" y="104" text-anchor="middle" font-size="11" fill="#1F3864">🔑 booking_id (PK)</text>
  <text x="400" y="124" text-anchor="middle" font-size="11" fill="#1F3864">order_id (UNIQUE)</text>
  <text x="400" y="144" text-anchor="middle" font-size="11" fill="#2E74B5">🔗 customer_id (FK)</text>
  <text x="400" y="164" text-anchor="middle" font-size="11" fill="#1F3864">booking_source</text>
  <text x="400" y="184" text-anchor="middle" font-size="11" fill="#1F3864">services (JSONB)</text>
  <text x="400" y="204" text-anchor="middle" font-size="11" fill="#1F3864">total_amount</text>
  <text x="400" y="224" text-anchor="middle" font-size="11" fill="#1F3864">pickup_datetime</text>
  <text x="400" y="244" text-anchor="middle" font-size="11" fill="#1F3864">status</text>
  <text x="400" y="264" text-anchor="middle" font-size="11" fill="#1F3864">created_at</text>
  <text x="400" y="284" text-anchor="middle" font-size="11" fill="#1F3864">updated_at</text>

  <!-- Admin entity -->
  <rect x="580" y="80" width="170" height="180" rx="8" fill="#FFF3E0" stroke="#F4A261" stroke-width="2"/>
  <rect x="580" y="80" width="170" height="36" rx="8" fill="#F4A261"/>
  <text x="665" y="103" text-anchor="middle" font-size="13" font-weight="bold" fill="white">ADMIN</text>
  <text x="665" y="132" text-anchor="middle" font-size="11" fill="#1F3864">🔑 admin_id (PK)</text>
  <text x="665" y="154" text-anchor="middle" font-size="11" fill="#1F3864">username</text>
  <text x="665" y="176" text-anchor="middle" font-size="11" fill="#1F3864">password_hash</text>
  <text x="665" y="198" text-anchor="middle" font-size="11" fill="#1F3864">created_at</text>

  <!-- Relationship lines -->
  <defs>
    <marker id="a7" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#555"/>
    </marker>
  </defs>

  <!-- Customer --< Booking (1:N) -->
  <line x1="220" y1="165" x2="290" y2="165" stroke="#555" stroke-width="2" marker-end="url(#a7)"/>
  <text x="252" y="156" text-anchor="middle" font-size="11" font-weight="bold" fill="#2E74B5">1 : N</text>
  <!-- crow foot for N side -->
  <line x1="285" y1="158" x2="292" y2="165" stroke="#555" stroke-width="1.5"/>
  <line x1="285" y1="172" x2="292" y2="165" stroke="#555" stroke-width="1.5"/>

  <!-- Admin --< Booking (manages) -->
  <line x1="580" y1="165" x2="510" y2="165" stroke="#555" stroke-width="2" marker-end="url(#a7)"/>
  <text x="546" y="156" text-anchor="middle" font-size="11" font-weight="bold" fill="#F4A261">manages</text>

  <!-- Relationship labels -->
  <text x="240" y="330" font-size="10" fill="#555">* Customer can have many Bookings (1:N)</text>
  <text x="240" y="350" font-size="10" fill="#555">* Admin manages all Bookings through the dashboard</text>
  <text x="240" y="370" font-size="10" fill="#555">* Services stored as JSONB array inside Booking</text>
</svg>
"""

os.makedirs("/home/claude/diagrams", exist_ok=True)

for name, svg in diagrams.items():
    svg_path = f"/home/claude/diagrams/{name}.svg"
    png_path = f"/home/claude/diagrams/{name}.png"
    with open(svg_path, "w") as f:
        f.write(svg.strip())
    cairosvg.svg2png(url=svg_path, write_to=png_path, scale=2.0)
    size = os.path.getsize(png_path)
    print(f"✓ {name}.png  ({size:,} bytes)")

print("\nAll diagrams generated!")