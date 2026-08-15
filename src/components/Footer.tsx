import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Leaf } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-soft mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Green Eco</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Premium eco-friendly dry cleaning with free pickup and delivery across Gurugram.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/services", label: "Services" },
              { to: "/pricing", label: "Pricing" },
              { to: "/book", label: "Book Pickup" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <span>{BUSINESS.address}</span>
            </li>
            {BUSINESS.phones.map((p) => (
              <li key={p} className="flex gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <a href={`tel:${p}`} className="hover:text-primary">{p}</a>
              </li>
            ))}
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">{BUSINESS.email}</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">Business Hours</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {BUSINESS.hours.map((h) => (
              <li key={h.day} className="flex flex-col">
                <span className="font-medium text-foreground">{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
