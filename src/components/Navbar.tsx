import { Link, useNavigate } from "@tanstack/react-router";
import { Phone, Menu, X, User, LogOut, Package } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { BUSINESS } from "@/lib/business";
import { supabase } from "@/lib/supabase";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/book", label: "Book Pickup" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(uid: string) {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) setProfile(data);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Green Eco Drycleaners" width={40} height={40} className="h-10 w-10" />
          <div className="hidden sm:block leading-tight">
            <div className="text-base font-bold text-foreground">Green Eco</div>
            <div className="text-[11px] text-primary font-medium tracking-wide uppercase">Drycleaners</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary rounded-md" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              to="/my-orders"
              className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-md"
              activeProps={{ className: "px-3 py-2 text-sm font-semibold text-primary rounded-md" }}
            >
              My Orders
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${BUSINESS.primaryPhone}`} className="hover:text-primary transition-colors">{BUSINESS.primaryPhone}</a>
          </div>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Hello,</span>
                <span className="text-sm font-black text-foreground">{profile?.full_name || user.email?.split("@")[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-bold text-foreground hover:text-primary transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary-dark transition-all"
              >
                Book Pickup
              </Link>
            </div>
          )}
        </div>

        <button
          aria-label="Menu"
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-accent flex items-center justify-between"
                activeProps={{ className: "px-4 py-3 rounded-xl text-sm font-black bg-primary/10 text-primary flex items-center justify-between" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/my-orders"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold hover:bg-accent flex items-center gap-2"
                activeProps={{ className: "px-4 py-3 rounded-xl text-sm font-black bg-primary/10 text-primary flex items-center gap-2" }}
              >
                <Package className="h-4 w-4" /> My Orders
              </Link>
            )}
            
            <div className="h-px bg-border my-2" />
            
            {user ? (
              <div className="px-4 py-2 flex items-center justify-between bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Logged in as</span>
                    <span className="text-sm font-black text-foreground">{profile?.full_name || user.email}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-red-600 p-2">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Link to="/login" onClick={() => setOpen(false)} className="py-4 text-center font-bold text-sm bg-gray-100 rounded-2xl">Sign In</Link>
                <Link to="/book" onClick={() => setOpen(false)} className="py-4 text-center font-bold text-sm bg-primary text-white rounded-2xl">Book Now</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
