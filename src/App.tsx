import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Web3Provider } from '@/context/Web3Context';

const queryClient = new QueryClient();

function App() {
  const { checkAuthentication } = useAuth();

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Web3Provider>
          <RouterProvider router={router} />
          <Toaster />
        </Web3Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
