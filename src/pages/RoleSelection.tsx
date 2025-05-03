
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import authService from "@/services/authService";
import { useEffect } from "react";

const RoleSelection = () => {
  useEffect(() => {
    document.title = "Select your role | Urgent2kay";
    
    // Check if we're already logged in
    const isLoggedIn = sessionStorage.getItem('token') && sessionStorage.getItem('user');
    console.log("RoleSelection - Authentication check:", { isLoggedIn });
  }, []);
  
  const handleGoogleLogin = (redirectTarget: string) => {
    console.log(`RoleSelection - Initiating Google login with redirect to: ${redirectTarget}`);
    // Direct the Google auth flow to go directly to the Dashboard with the token in the URL
    authService.loginWithGoogle(redirectTarget);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Choose your role</h1>
          <p className="text-gray-500 mt-2">Select how you want to use Urgent2k</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Beneficiary Card */}
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">I'm a Beneficiary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-500 text-sm">
                <p className="mb-4">
                  Register to receive recurring directed bill payments from
                  sponsors.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Create bundles of bills
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Request payment from sponsors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Get bills paid directly
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/beneficiary-signup">
                    Register now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleLogin("/dashboard")}
                >
                  <img
                    src="/src/images/google.png"
                    alt="Google logo"
                    className="h-4 w-4 mr-2"
                  />
                  Register with Google
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sponsor Card */}
          <Card className="border-2 hover:border-primary transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">I'm a Sponsor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-gray-500 text-sm">
                <p className="mb-4">
                  Register to sponsor individuals by paying their bills
                  directly.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    View bill payment requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Approve or reject requests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Track your sponsorships
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link to="/sponsor-signup">
                    Register now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleGoogleLogin("/dashboard")}
                >
                  <img
                    src="/src/images/google.png"
                    alt="Google logo"
                    className="h-4 w-4 mr-2"
                  />
                  Register with Google
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
