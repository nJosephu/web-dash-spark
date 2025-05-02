
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import logo from "../../images/logo2k.png";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBanner?: boolean;
  bannerImage?: string;
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle = "Bundle your bills the easy way, all in one app", 
  showBanner = true, 
  bannerImage 
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen p-0 sm:p-8">
      {/* Left Panel - Background with Overlay */}
      {showBanner && (
        <div className="relative hidden md:flex md:w-1/2 bg-[#5A3CCA] flex-col justify-between p-10 rounded-[20px]">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <img src={logo} alt="Urgent 2kay" className="h-6 md:h-8" />
            </div>

            <div className="mt-20 max-w-[556px]">
              <h1 className="text-4xl font-bold text-white mb-4">
                Bundle all your bills in one app — Bill payment made easy
              </h1>
              <p className="text-gray-100 text-lg max-w-md">
                We simplify financial support by bundling bills into one clear
                request and sending payments directly to service providers.
              </p>
            </div>

            <div className="mt-12">
              {bannerImage && (
                <img
                  src={bannerImage}
                  alt="Urgent2kay Dashboard"
                  className="w-full max-w-[650px] rounded-lg absolute right-0 bottom-0"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Right Panel - Content Form */}
      <div className={`w-full ${showBanner ? 'md:w-1/2' : ''} flex items-center justify-center p-6 bg-white max-w-[380px] mx-auto`}>
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-0">
            <div className="mb-8">
              <h2 className="text-3xl font-medium">{title}</h2>
              {subtitle && <p className="mt-2">{subtitle}</p>}
            </div>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
