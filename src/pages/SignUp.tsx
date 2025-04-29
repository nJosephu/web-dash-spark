
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    // Simple mock user registration
    localStorage.setItem("user", JSON.stringify({ email }));
    toast.success("Account created successfully");
    navigate("/role-selection");
  };

  const handleGoogleSignUp = () => {
    toast.info("Google signup not implemented yet");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Gradient Background */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] flex-col justify-center p-10">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.1 4C25.2 6.2 26.6 9.3 26.6 12.7C26.6 16.1 25.2 19.2 23.1 21.4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4.9 21.4C2.8 19.2 1.4 16.1 1.4 12.7C1.4 9.3 2.8 6.2 4.9 4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M18.2 7.80005C19.4 9.00005 20.3 10.8 20.3 12.7C20.3 14.6 19.5 16.4 18.2 17.6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <path d="M9.8 17.6C8.6 16.4 7.7 14.6 7.7 12.7C7.7 10.8 8.5 9.00005 9.8 7.80005" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="12.7" r="3.5" fill="#FFFFFF"/>
            </svg>
            <span className="text-2xl font-bold text-white">Urgent2kay</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Bundle all your urgent bills in one place</h1>
          <p className="text-xl text-white/90 mb-8">
            Connect with sponsors who can help with your urgent bills. Get the money you need quickly and easily.
          </p>
          
          <div className="mt-12">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
              alt="Urgent2kay Dashboard" 
              className="rounded-xl shadow-lg w-full"
            />
          </div>
        </div>
        
        <div className="mt-auto text-white/70 text-sm">
          <p>© 2023 Urgent2kay. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Panel - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Urgent2kay</h2>
              <p className="text-gray-500 mt-2">Create an account to get started</p>
            </div>
            
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Google Sign-in Button */}
              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center mb-6"
                onClick={handleGoogleSignUp}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M17.3251 9.13059C17.3251 8.40717 17.2661 7.7802 17.1389 7.17627H9.00012V10.3213H13.7227C13.5311 11.3517 12.9208 12.2981 11.966 12.9372L11.9486 13.0309L14.5589 15.0389L14.7494 15.0591C16.3676 13.5815 17.3251 11.5582 17.3251 9.13059Z" fill="#4285F4"/>
                  <path d="M9.00012 17.9998C11.3551 17.9998 13.3663 17.1983 14.7495 15.0591L11.9661 12.9372C11.2421 13.4369 10.2581 13.7979 9.00012 13.7979C6.74514 13.7979 4.82918 12.3139 4.11264 10.2844L4.00453 10.2944L1.2904 12.3868L1.24634 12.4706C2.60201 15.7472 5.54852 17.9998 9.00012 17.9998Z" fill="#34A853"/>
                  <path d="M4.11261 10.2844C3.92589 9.6805 3.82053 9.03646 3.82053 8.37466C3.82053 7.71277 3.92589 7.06882 4.10324 6.4649L4.09824 6.36518L1.34484 4.23358L1.24631 4.27874C0.66411 5.5281 0.335693 6.91712 0.335693 8.37466C0.335693 9.83221 0.66411 11.2212 1.24631 12.4706L4.11261 10.2844Z" fill="#FBBC05"/>
                  <path d="M9.00012 2.95141C10.5719 2.95141 11.6474 3.58861 12.2484 4.15663L14.7364 1.73507C13.3569 0.469687 11.3551 0 9.00012 0C5.54852 0 2.60201 2.2525 1.24634 5.52918L4.10327 7.4649C4.82918 5.43525 6.74514 2.95141 9.00012 2.95141Z" fill="#EB4335"/>
                </svg>
                Sign up with Google
              </Button>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or sign up with email</span>
                </div>
              </div>
              
              {/* Email Input */}
              <div className="space-y-4">
                <div className="relative">
                  <Input 
                    type="email" 
                    placeholder="Email address" 
                    className="pl-4 py-6 text-base" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                {/* Password Input */}
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password" 
                    className="pl-4 py-6 pr-10 text-base" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Confirm Password Input */}
                <div className="relative">
                  <Input 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="Confirm password" 
                    className="pl-4 py-6 pr-10 text-base" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                  <div 
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-gray-400" />
                    ) : (
                      <Eye size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2 mt-4">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms} 
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)} 
                  className="mt-1"
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  By signing up, I agree to the{" "}
                  <Link to="#" className="text-[#7B68EE] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="#" className="text-[#7B68EE] hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#7B68EE] hover:bg-[#6A57DD] rounded-full py-6 mt-6"
              >
                Create account
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-[#7B68EE] hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
