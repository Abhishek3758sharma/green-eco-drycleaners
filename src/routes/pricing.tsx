import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SERVICES_DATA, formatPrice, getSteamIronPriceDisplay } from "@/lib/business";

export const Route = createFileRoute("/pricing")({
  head: () => {
    const canonical = "https://greenecodrycleaners.com/pricing";
    return {
      meta: [
        { title: "Pricing — Green Eco Drycleaners" },
        { name: "description", content: "Transparent and affordable pricing for dry cleaning and laundry services in Gurugram. Free pickup and delivery included." },
        { name: "keywords", content: "dry cleaning rates gurugram, laundry prices gurugram, affordable dry cleaners, laundry cost per kg, steam iron price" },
        { property: "og:title", content: "Pricing — Green Eco Drycleaners" },
        { property: "og:description", content: "Transparent, affordable dry cleaning rates with free pickup." },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  component: PricingPage,
});

const CATEGORIES = ["All", "Men's Wear", "Women's Wear", "Home Care"] as const;

function PricingPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [showSteamIron, setShowSteamIron] = useState(false);

  const filtered = useMemo(() => {
    return SERVICES_DATA.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, cat]);

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Transparent Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Fair, honest rates with no hidden fees. Free pickup and delivery always included.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
             <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 max-w-md">
              <div className="flex items-center justify-center gap-2 text-primary font-bold text-lg">
                <Sparkles className="h-5 w-5" /> Steam Iron Available
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                All steam ironing charges are calculated at 50% of the listed dry-cleaning rate.
              </p>
              <button 
                onClick={() => setShowSteamIron(!showSteamIron)}
                className={`mt-4 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold shadow-soft transition-colors ${
                  showSteamIron 
                  ? "bg-secondary text-secondary-foreground hover:bg-accent" 
                  : "bg-primary text-primary-foreground hover:bg-primary-dark"
                }`}
              >
                <Sparkles className="h-4 w-4" /> 
                {showSteamIron ? "Show Dry Cleaning Price" : "Calculate Steam Iron Price"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-md border border-input bg-background pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-primary/5">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Service</th>
                <th className="text-left px-5 py-3 font-semibold hidden sm:table-cell">Category</th>
                <th className="text-right px-5 py-3 font-semibold">
                  {showSteamIron ? "Steam Iron Price" : "Dry Cleaning Price"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={3} className="text-center py-10 text-muted-foreground">No services match your search.</td></tr>
              )}
              {filtered.map((p) => (
                <tr key={p.name} className="border-t border-border hover:bg-accent/30 transition-colors">
                  <td className="px-5 py-4 font-medium">{p.name}</td>
                  <td className="px-5 py-4 text-muted-foreground hidden sm:table-cell">{p.category}</td>
                  <td className="px-5 py-4 text-right font-bold text-primary">
                    {showSteamIron ? getSteamIronPriceDisplay(p) : formatPrice(p)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground text-center">
          * Prices may vary for heavily embroidered, embellished, or delicate garments. Free pickup & delivery in Gurugram.
        </p>
      </section>
    </SiteLayout>
  );
}
