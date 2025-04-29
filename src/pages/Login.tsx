
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Eye, EyeOff } from "lucide-react";

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
    setShowPassword(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Gradient Background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.1 4C25.2 6.2 26.6 9.3 26.6 12.7C26.6 16.1 25.2 19.2 23.1 21.4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4.9 21.4C2.8 19.2 1.4 16.1 1.4 12.7C1.4 9.3 2.8 6.2 4.9 4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M18.2 7.80005C19.4 9.00005 20.3 10.8 20.3 12.7C20.3 14.6 19.5 16.4 18.2 17.6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M9.8 17.6C8.6 16.4 7.7 14.6 7.7 12.7C7.7 10.8 8.5 9.00005 9.8 7.80005" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="12.7" r="3.5" fill="#FFFFFF"/>
            </svg>
            <span className="text-2xl font-bold text-white">Urgent2kay</span>
          </div>
          
          <div className="mt-20">
            <h1 className="text-4xl font-bold text-white mb-4">Let's get you logged in</h1>
            <p className="text-gray-100 text-lg max-w-md">
              Welcome back! Enter your details to access your account and manage your urgent bills.
            </p>
          </div>
          
          <div className="mt-12">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
              alt="Technology" 
              className="rounded-lg max-w-md opacity-80"
            />
          </div>
        </div>
        
        <div className="text-white text-sm">
          <p>© 2023 Urgent2kay. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Panel - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Login</h2>
              <p className="text-gray-500 mt-2">Enter your details to continue</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Google Sign-in Button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full mb-4 flex items-center justify-center"
                onClick={handleGoogleLogin}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M17.3251 9.13059C17.3251 8.40717 17.2661 7.7802 17.1389 7.17627H9.00012V10.3213H13.7227C13.5311 11.3517 12.9208 12.2981 11.966 12.9372L11.9486 13.0309L14.5589 15.0389L14.7494 15.0591C16.3676 13.5815 17.3251 11.5582 17.3251 9.13059Z" fill="#4285F4"/>
                  <path d="M9.00012 17.9998C11.3551 17.9998 13.3663 17.1983 14.7495 15.0591L11.9661 12.9372C11.2421 13.4369 10.2581 13.7979 9.00012 13.7979C6.74514 13.7979 4.82918 12.3139 4.11264 10.2844L4.00453 10.2944L1.2904 12.3868L1.24634 12.4706C2.60201 15.7472 5.54852 17.9998 9.00012 17.9998Z" fill="#34A853"/>
                  <path d="M4.11261 10.2844C3.92589 9.6805 3.82053 9.03646 3.82053 8.37466C3.82053 7.71277 3.92589 7.06882 4.10324 6.4649L4.09824 6.36518L1.34484 4.23358L1.24631 4.27874C0.66411 5.5281 0.335693 6.91712 0.335693 8.37466C0.335693 9.83221 0.66411 11.2212 1.24631 12.4706L4.11261 10.2844Z" fill="#FBBC05"/>
                  <path d="M9.00012 2.95141C10.5719 2.95141 11.6474 3.58861 12.2484 4.15663L14.7364 1.73507C13.3569 0.469687 11.3551 0 9.00012 0C5.54852 0 2.60201 2.2525 1.24634 5.52918L4.10327 7.4649C4.82918 5.43525 6.74514 2.95141 9.00012 2.95141Z" fill="#EB4335"/>
                </svg>
                Sign in with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                      <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={toggleShowPassword}>
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
                    onCheckedChange={(checked) => setRememberMe(checked === true)} 
                  />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me
                  </Label>
                </div>
                <Link to="#" className="text-sm text-urgent-purple hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full bg-[#7B68EE] hover:bg-[#6A57DD] rounded-full">
                Sign in
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-[#7B68EE] hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
            
            <div className="mt-8 text-center text-xs text-gray-400">
              By signing in, you agree to our Terms and Privacy Policy
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
