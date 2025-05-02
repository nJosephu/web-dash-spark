
import { useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";
import DashboardImage from "../images/signupDashboard.png";

const Login = () => {
  useEffect(() => {
    document.title = "Login | Urgent2kay";
  }, []);

  return (
    <AuthLayout 
      title="Login"
      bannerImage={DashboardImage}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
