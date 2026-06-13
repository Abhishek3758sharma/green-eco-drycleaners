import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/SiteLayout";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registration successful! You can now log in.");
      navigate({ to: "/login" });
    }
    setLoading(false);
  };

  return (
    <SiteLayout>
      <section className="bg-gradient-soft border-b border-border min-h-[calc(100vh-140px)] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-card p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Join Green Eco Drycleaners today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
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
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
