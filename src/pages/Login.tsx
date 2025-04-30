import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";
import DashboardImage from "../images/signupDashboard.png";
import googleIcon from "../images/google.png";
import logo from "../images/logo2k.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simple mock authentication
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("user", JSON.stringify({ email }));

    toast.success("Login successful");
    navigate("/");
  };

  const handleGoogleLogin = () => {
    toast.info("Google login not implemented yet");
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen p-0 sm:p-8">
      {/* Left Panel - Background with Overlay */}
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
            <img
              src={DashboardImage}
              alt="Urgent2kay Dashboard"
              className="w-full max-w-[650px] rounded-lg absolute right-0 bottom-0"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white max-w-[380px] mx-auto">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-0">
            <div className=" mb-8">
              <h2 className="text-3xl font-medium">Login</h2>
              <p className="mt-2">
                Bundle your bills the easy way, all in one app
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Google Sign-in Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-4 flex items-center justify-center"
                onClick={handleGoogleLogin}
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                Sign in with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Email Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-400"
                    >
                      <path
                        d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="#"
                  className="text-sm text-urgent-purple hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#6544E4] hover:bg-[#6A57DD] rounded-md"
              >
                Login in
              </Button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#7B68EE] hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
