"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX, BsFacebook, BsInstagram, BsThreads } from "react-icons/bs";

type SocialProvider = "google" | "twitter" | "facebook" | "instagram" | "threads";

interface SocialLoginButtonsProps {
  callbackURL?: string;
  mode?: "login" | "register";
}

export function SocialLoginButtons({ 
  callbackURL = "/", 
  mode = "login" 
}: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoading(provider);

      // For Instagram and Threads, show coming soon message
      if (provider === "instagram" || provider === "threads") {
        toast.info(`${provider === "instagram" ? "Instagram" : "Threads"} login coming soon!`);
        setLoading(null);
        return;
      }

      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL,
      });

      if (error) {
        toast.error(error.message || `Failed to ${mode === "login" ? "log in" : "sign up"} with ${provider}`);
        setLoading(null);
        return;
      }

      // Social login successful - better-auth handles redirect
    } catch (err) {
      console.error(`Social ${mode} error:`, err);
      toast.error(`An error occurred. Please try again.`);
      setLoading(null);
    }
  };

  const providers = [
    {
      id: "google" as SocialProvider,
      name: "Google",
      icon: <FcGoogle className="w-5 h-5" />,
      available: true,
    },
    {
      id: "twitter" as SocialProvider,
      name: "X",
      icon: <BsTwitterX className="w-4 h-4" />,
      available: true,
    },
    {
      id: "facebook" as SocialProvider,
      name: "Facebook",
      icon: <BsFacebook className="w-4 h-4 text-[#1877F2]" />,
      available: true,
    },
    {
      id: "instagram" as SocialProvider,
      name: "Instagram",
      icon: <BsInstagram className="w-4 h-4 text-[#E4405F]" />,
      available: false,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            disabled={loading !== null || !provider.available}
            onClick={() => handleSocialLogin(provider.id)}
            className="w-full border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {loading === provider.id ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {provider.icon}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {provider.name}
                </span>
              </>
            )}
          </Button>
        ))}
      </div>

      <p className="text-xs text-center text-gray-500 mt-4">
        {mode === "register" 
          ? "By signing up, you agree to our Terms of Service and Privacy Policy"
          : "Social accounts are automatically verified"}
      </p>
    </div>
  );
}
