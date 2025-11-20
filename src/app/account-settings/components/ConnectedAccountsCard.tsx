/**
 * Connected Accounts Card Component
 * 
 * Displays social login connections (placeholder for future implementation).
 * Currently shows Google login option as coming soon.
 * 
 * @module account-settings/components/ConnectedAccountsCard
 */

import { Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { authClient } from "@/lib/auth-client";

/**
 * Connected accounts card
 * 
 * Shows available social login integrations.
 * Placeholder for future OAuth provider connections.
 */
export function ConnectedAccountsCard() {
  const { t } = useTranslation();
  const { data: session } = authClient.useSession();

  const handleLinkSocial = async (provider: "google" | "facebook" | "instagram" | "twitter") => {
    await authClient.linkSocial({
      provider,
      callbackURL: "/account-settings",
    });
  };

  const socialProviders = [
    {
      id: "google",
      name: t('accountSettings.google'),
      icon: (
        <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
    },
    {
      id: "facebook",
      name: t('accountSettings.facebook'),
      icon: (
        <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 4.16v1.957h3.696l-.597 3.667h-3.099v7.98C13.343 24.351 14.5 20.036 14.5 12c0-4.83-3.92-8.75-8.75-8.75S-3 7.17-3 12c0 8.036 1.157 12.351 12.101 11.691z"/>
        </svg>
      ),
    },
    {
      id: "instagram",
      name: t('accountSettings.instagram'),
      icon: (
        <svg className="w-5 h-5 text-[#E4405F]" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
        </svg>
      ),
    },
    {
      id: "twitter",
      name: t('accountSettings.twitter'),
      icon: (
        <svg className="w-5 h-5 text-[#1DA1F2]" viewBox="0 0 24 24">
          <path fill="currentColor" d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.06a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0 0 24 4.59z"/>
        </svg>
      ),
    },
  ] as const;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#283B73] to-[#1e2d5a] px-6 py-4">
        <div className="flex items-center gap-3">
          <LinkIcon className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold text-white">{t('accountSettings.connectedAccounts')}</h2>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-600 mb-4">
          {t('accountSettings.connectedAccountsMessage')}
        </p>
        
        <div className="space-y-3">
          {socialProviders.map((provider) => (
            <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  {provider.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{provider.name}</p>
                  <p className="text-xs text-gray-500">
                    {session?.user?.image?.includes(provider.id) 
                      ? t('accountSettings.connected') 
                      : t('accountSettings.notConnected')}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLinkSocial(provider.id)}
                disabled={session?.user?.image?.includes(provider.id)}
                className={session?.user?.image?.includes(provider.id) ? "opacity-50 cursor-not-allowed" : ""}
              >
                {session?.user?.image?.includes(provider.id) 
                  ? t('accountSettings.connected') 
                  : t('accountSettings.connect')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
