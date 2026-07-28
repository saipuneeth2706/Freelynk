"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, User, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{
    email: string | null;
    full_name: string | null;
    role: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;

      const { data: profile } = await supabase
        .from("user_table")
        .select("email, full_name, role")
        .eq("user_id", data.user.id)
        .maybeSingle();

      setUser({
        email: profile?.email || data.user.email,
        full_name:
          profile?.full_name || data.user.user_metadata?.full_name || null,
        role: profile?.role || null,
      });
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-neutral-400 py-20">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
          <h2 className="text-sm font-medium text-neutral-300">
            Account Information
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <User className="h-4 w-4 text-neutral-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-sm text-white">
                  {user?.full_name || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <Mail className="h-4 w-4 text-neutral-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <Shield className="h-4 w-4 text-neutral-400" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">Role</p>
                <p className="text-sm capitalize text-white">
                  {user?.role || "freelancer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#141418] p-6 ring-1 ring-white/[0.06]">
          <h2 className="text-sm font-medium text-neutral-300">Session</h2>
          <div className="mt-4">
            <Button
              onClick={handleLogout}
              disabled={signingOut}
              variant="ghost"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              {signingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
