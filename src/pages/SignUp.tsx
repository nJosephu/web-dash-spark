
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
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
      {/* Left Panel - Purple Sidebar */}
      <div className="hidden md:flex md:w-1/2 bg-[#1A1F2C] flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.1 4C25.2 6.2 26.6 9.3 26.6 12.7C26.6 16.1 25.2 19.2 23.1 21.4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M4.9 21.4C2.8 19.2 1.4 16.1 1.4 12.7C1.4 9.3 2.8 6.2 4.9 4" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M18.2 7.80005C19.4 9.00005 20.3 10.8 20.3 12.7C20.3 14.6 19.5 16.4 18.2 17.6" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <path d="M9.8 17.6C8.6 16.4 7.7 14.6 7.7 12.7C7.7 10.8 8.5 9.00005 9.8 7.80005" stroke="#7B68EE" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="14" cy="12.7" r="3.5" fill="#7B68EE"/>
            </svg>
            <span className="text-2xl font-bold text-white">Urgent2kay</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Join Urgent2kay</h1>
          <p className="text-gray-300 text-lg">
            Create an account to start managing your urgent bills or become a sponsor.
          </p>
        </div>
        <div className="text-gray-400 text-sm">
          <p>© 2023 Urgent2kay. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Panel - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
              <p className="text-gray-500 mt-2">Enter your details below to sign up</p>
            </div>
            
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                />
              </div>
              
              <div className="flex items-start space-x-2">
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
              
              <Button type="submit" className="w-full bg-[#7B68EE] hover:bg-[#6A57DD]">
                Create account
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignUp}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                  <path d="M15.4001 8.116C15.4001 7.48636 15.3478 7.02688 15.2346 6.55224H8.00012V9.39669H12.2868C12.2084 10.0983 11.7696 11.1541 10.7478 11.8328L10.7321 11.9386L13.0301 13.7258L13.1993 13.7421C14.6835 12.3947 15.4001 10.4571 15.4001 8.116Z" fill="#4285F4"/>
                  <path d="M8.00012 15.9999C10.16 15.9999 11.9706 15.2958 13.1993 13.742L10.7478 11.8328C10.0988 12.2745 9.20292 12.5762 8.00012 12.5762C5.99254 12.5762 4.2726 11.2323 3.65568 9.36337L3.55514 9.37161L1.1398 11.228L1.10779 11.3233C2.3129 14.0513 4.93423 15.9999 8.00012 15.9999Z" fill="#34A853"/>
                  <path d="M3.65566 9.36339C3.49624 8.88876 3.396 8.38225 3.396 7.85714C3.396 7.33193 3.49624 6.82552 3.64707 6.35088L3.64221 6.23833L1.19183 4.3407L1.10777 4.39102C0.590334 5.44545 0.285706 6.6233 0.285706 7.85714C0.285706 9.09097 0.590334 10.2688 1.10777 11.3233L3.65566 9.36339Z" fill="#FBBC05"/>
                  <path d="M8.00012 3.13812C9.4746 3.13812 10.4629 3.77117 11.0275 4.30553L13.1993 2.15882C11.9619 0.998815 10.16 0.142822 8.00012 0.142822C4.93423 0.142822 2.3129 2.09135 1.10779 4.8194L3.64709 6.35092C4.2726 4.48196 5.99254 3.13812 8.00012 3.13812Z" fill="#EB4335"/>
                </svg>
                Sign up with Google
              </Button>
              
              <p className="text-center text-sm text-gray-500">
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
