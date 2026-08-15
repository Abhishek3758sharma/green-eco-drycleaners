import { createFileRoute, Link } from "@tanstack/react-router";
import { Shirt, User, Home as HomeIcon, Check, ArrowRight, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { SERVICES_DATA, formatPrice } from "@/lib/business";

export const Route = createFileRoute("/services")({
  head: () => {
    const canonical = "https://greenecodrycleaners.com/services";
    return {
      meta: [
        { title: "Services — Green Eco Drycleaners" },
        { name: "description", content: "Expert dry cleaning for men's wear, women's wear and home care in Gurugram. From silk sarees to heavy blankets, we handle everything with care." },
        { name: "keywords", content: "dry cleaning services gurugram, saree dry cleaning, suit cleaning, home care dry cleaning, blanket cleaning gurugram" },
        { property: "og:title", content: "Services — Green Eco Drycleaners" },
        { property: "og:description", content: "Full-service dry cleaning for clothes & home care items with free pickup." },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  component: ServicesPage,
});

const ICONS = {
  "Men's Wear": Shirt,
  "Women's Wear": User,
  "Home Care": HomeIcon,
} as const;

function ServicesPage() {
  const grouped = useMemo(() => {
    return SERVICES_DATA.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof SERVICES_DATA>);
  }, []);

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert care for every fabric. Choose from our wide range of professional dry cleaning services.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Steam Iron Available at 50% Off
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {Object.entries(grouped).map(([cat, items]) => {
          const Icon = ICONS[cat as keyof typeof ICONS];
          return (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{cat}</h2>
                  <p className="text-sm text-muted-foreground">{items.length} services available</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                  <div key={item.name} className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-soft hover:border-primary/40 transition-all flex flex-col justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Starts from</span>
                      <span className="font-bold text-primary">{formatPrice(item)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="text-center pt-6">
          <Link to="/book" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary-dark">
            Book Pickup <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

import { useMemo } from "react";
