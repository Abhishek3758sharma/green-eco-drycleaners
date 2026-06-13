import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/SiteLayout";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const adminEmail = "abhishek3758sharma@gmail.com";

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      toast.error(signInError.message);
    } else {
      toast.success("Logged in successfully!");
      
      // Auto-claim old orders
      if (data.user) {
        const { error: claimError } = await supabase
          .from("bookings")
          .update({ user_id: data.user.id })
          .eq("email", data.user.email!.toLowerCase())
          .is("user_id", null);
          
        if (claimError) console.error("Auto-claim error:", claimError);
      }

      if (data.user?.email === adminEmail) {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/" });
      }
    }
    setLoading(false);
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border min-h-[calc(100vh-140px)] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-card p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="rahul@example.com"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-sm font-bold text-primary-foreground shadow-soft hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
            <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">
              Admin Access: abhishek3758sharma@gmail.com
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
