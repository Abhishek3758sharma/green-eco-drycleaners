import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/contact")({
  head: () => {
    const canonical = "https://greenecodrycleaners.com/contact";
    return {
      meta: [
        { title: "Contact — Green Eco Drycleaners" },
        { name: "description", content: "Contact Green Eco Drycleaners in Sector-90, Gurugram. Call us at +91 8796422972, WhatsApp, or visit our store for premium laundry care." },
        { name: "keywords", content: "contact dry cleaners gurugram, dry cleaner near me sector 90, laundry service phone number, WhatsApp laundry gurugram" },
        { property: "og:title", content: "Contact — Green Eco Drycleaners" },
        { property: "og:description", content: "Reach us by phone, WhatsApp or store visit in Gurugram." },
        { property: "og:url", content: canonical },
      ],
      links: [
        { rel: "canonical", href: canonical },
      ],
    };
  },
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([{
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message
    }]);

    setLoading(false);
    
    if (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
      return;
    }

    setSent(true);
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Questions, custom requests, or bulk pickups — we're here to help.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card icon={MapPin} title="Visit Us"><p>{BUSINESS.address}</p></Card>
          <Card icon={Phone} title="Call Us">
            <div className="space-y-1">
              {BUSINESS.phones.map((p) => (
                <a key={p} href={`tel:${p}`} className="block font-semibold hover:text-primary">{p}</a>
              ))}
            </div>
          </Card>
          <Card icon={Mail} title="Email">
            <a href={`mailto:${BUSINESS.email}`} className="hover:text-primary">{BUSINESS.email}</a>
          </Card>
          <Card icon={Clock} title="Business Hours">
            <div className="space-y-1">
              {BUSINESS.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <span className="font-medium">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
                </div>
              ))}
            </div>
          </Card>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-[color:var(--whatsapp)] px-5 py-4 font-semibold text-white shadow-soft hover:opacity-90"
          >
            <MessageCircle className="h-5 w-5" /> Chat with us on WhatsApp
          </a>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card shadow-card p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4">Send us a message</h2>
            {sent ? (
              <div className="flex items-start gap-3 rounded-xl bg-primary/10 border border-primary/20 p-4 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">Message sent!</p>
                  <p className="text-muted-foreground mt-1">We'll get back to you within a few hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={inputCls} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="Email (optional)" className={inputCls} />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inputCls} />
                </div>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" className={inputCls} />
                <button disabled={loading} type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary-dark disabled:opacity-50">
                  <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div className="rounded-2xl overflow-hidden border border-border shadow-card aspect-[4/3]">
            <iframe
              title="Map"
              src="https://www.google.com/maps?q=Sector+90+Gurugram+Haryana&output=embed"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

function Card({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-card p-5 flex gap-4">
      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <div className="mt-1 text-sm text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
