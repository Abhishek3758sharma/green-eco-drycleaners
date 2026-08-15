import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Leaf, Truck, Tag, Sparkles, Calendar, Package, Home as HomeIcon, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BUSINESS } from "@/lib/business";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => {
    const canonical = "https://greenecodrycleaners.com";
    return {
      meta: [
        { title: "Green Eco Drycleaners — Professional Dry Cleaning in Gurugram" },
        { name: "description", content: "Professional eco-friendly dry cleaning with free pickup & delivery across Gurugram. We care for your clothes using plant-based solvents. Book online." },
        { name: "keywords", content: "dry cleaners gurugram, professional dry cleaning, eco-friendly dry cleaning, free pickup delivery dry cleaning, best dry cleaner in gurugram" },
        { property: "og:title", content: "Green Eco Drycleaners — Best Dry Cleaning in Gurugram" },
        { property: "og:description", content: "Professional eco-friendly dry cleaning with free pickup & delivery across Gurugram." },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  component: Home,
});

const features = [
  { icon: Leaf, title: "Eco-Friendly Cleaning", desc: "Plant-based, biodegradable solvents that are gentle on your clothes and the planet." },
  { icon: Truck, title: "Free Pickup & Delivery", desc: "We collect and return your garments at your doorstep across Gurugram — at no extra cost." },
  { icon: Tag, title: "Affordable Pricing", desc: "Transparent rates with no hidden charges. Premium service at fair, honest prices." },
  { icon: Sparkles, title: "Professional Care", desc: "Trained staff and modern machinery for spotless, fresh, perfectly pressed results." },
];

const steps = [
  { icon: Calendar, title: "Schedule Pickup", desc: "Book online or call. Choose a date & time that works." },
  { icon: Package, title: "We Collect Clothes", desc: "Our team arrives at your door to collect your items." },
  { icon: Sparkles, title: "Professional Cleaning", desc: "Each garment is cleaned with care using eco-friendly methods." },
  { icon: HomeIcon, title: "Doorstep Delivery", desc: "Crisp, fresh and folded — delivered right back to you." },
];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute inset-0 -z-10 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-24 grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-7 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Leaf className="h-3.5 w-3.5" /> 100% Eco-Friendly Cleaning
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] lg:leading-[1.05] tracking-tight">
              Professional <span className="text-primary">Dry Cleaning</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
              Free Pickup & Delivery Across Gurugram. Premium care for every garment — from daily wear to your most precious sherwani.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary-dark transition-colors shrink-0">
                Book Pickup <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 rounded-md border-2 border-primary px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors shrink-0">
                <Sparkles className="h-4 w-4" /> Pricing
              </Link>
              <a href={`https://wa.me/${BUSINESS.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[color:var(--whatsapp)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shrink-0">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 inline-block">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Sparkles className="h-4 w-4" /> Steam Iron Available
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All steam ironing charges are calculated at 50% of the listed dry-cleaning rate.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 text-sm">
              {BUSINESS.phones.map((p) => (
                <a key={p} href={`tel:${p}`} className="flex items-center gap-2 font-semibold text-foreground hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> {p}
                </a>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-hero opacity-10 rounded-3xl blur-2xl" />
            <img src={hero} alt="Fresh, clean pressed garments on wooden hangers" width={1536} height={1024} className="relative rounded-2xl shadow-soft w-full h-auto object-cover aspect-[4/3]" />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-card hidden sm:flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-bold">10,000+</div>
                <div className="text-xs text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold">Why Choose Green Eco?</h2>
          <p className="mt-3 text-muted-foreground">Premium quality, eco-friendly methods, and a service experience built around you.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 shadow-card hover:shadow-soft hover:border-primary/30 hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Fresh, clean clothes in 4 simple steps.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl bg-card border border-border p-6 shadow-card">
                <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-soft">
                  {i + 1}
                </div>
                <s.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 sm:p-16 text-center text-primary-foreground">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready for a fresher wardrobe?</h2>
            <p className="mt-3 opacity-90 max-w-xl mx-auto">Schedule your free pickup today. Our team will be at your doorstep in no time.</p>
            <div className="mt-7 flex flex-wrap gap-3 justify-center">
              <Link to="/book" className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-primary hover:bg-white/90 transition-colors">
                Book Pickup Now
              </Link>
              <a href={`tel:${BUSINESS.primaryPhone}`} className="inline-flex items-center gap-2 rounded-md border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
                <Phone className="h-4 w-4" /> {BUSINESS.primaryPhone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
