import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import DashboardImage from "../images/signupDashboard.png";
import googleIcon from "../images/google.png";
import logo from "../images/logo2k.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupFormSchema,
  SignupFormValues,
  mapSignupToApiFormat,
} from "@/schemas/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import authService from "@/services/authService";

const BeneficiarySignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const handleSignUp = async (values: SignupFormValues) => {
    try {
      setIsSubmitting(true);
      // Convert form values to API format with role "BENEFACTEE"
      const userData = mapSignupToApiFormat(values, "benefactee");
      await register(userData);
      // Navigation is handled in the register function
    } catch (error) {
      console.error("Registration error:", error);
      // Error is already handled in the register function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Pass benefactee role for beneficiary signup
    authService.registerWithGoogle("benefactee");
  };

  return (
    <div className="flex min-h-screen p-0 sm:p-8">
      {/* Left Panel - Background with Overlay */}
      <div className="relative hidden md:flex md:w-1/2 bg-[#5A3CCA] flex-col justify-between p-10 rounded-[20px] ">
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

      {/* Right Panel - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white max-w-[380px] mx-auto">
        <Card className="w-full max-w-md border-none shadow-none">
          <CardContent className="p-0">
            <div className="mb-8">
              <h2 className="text-2xl md:text-[30px] font-medium">
                Beneficiary Account
              </h2>
              <p className="mt-2">Create your account to get started</p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSignUp)}
                className="space-y-4"
              >
                {/* Google Sign-in Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center mb-6"
                  onClick={handleGoogleSignUp}
                  disabled={isSubmitting}
                >
                  <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
                  Sign up with Google
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Or sign up with email
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Username Input */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Username"
                              className="pl-4 py-6 text-base"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Input */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="Email address"
                              className="pl-4 py-6 text-base"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone Input */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="tel"
                              placeholder="Phone number"
                              className="pl-4 py-6 text-base"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Input */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              className="pl-4 py-6 pr-10 text-base"
                              disabled={isSubmitting}
                              {...field}
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password Input */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              className="pl-4 py-6 pr-10 text-base"
                              disabled={isSubmitting}
                              {...field}
                            />
                            <div
                              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff size={18} className="text-gray-400" />
                              ) : (
                                <Eye size={18} className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          By signing up, I agree to the{" "}
                          <Link
                            to="#"
                            className="text-[#7B68EE] hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            to="#"
                            className="text-[#7B68EE] hover:underline"
                          >
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#6544E4] hover:bg-[#6A57DD] rounded-md py-6 mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Creating Account..."
                    : "Create Beneficiary Account"}
                </Button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-[#7B68EE] hover:underline"
                  >
                    Sign in
                  </Link>
                </p>

                <p className="text-center text-sm text-gray-500">
                  Want to sign up as a Sponsor instead?{" "}
                  <Link
                    to="/role-selection"
                    className="font-medium text-[#7B68EE] hover:underline"
                  >
                    Go back to role selection
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BeneficiarySignUp;
