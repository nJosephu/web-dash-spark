
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Web3Provider } from '@/context/Web3Context';

const queryClient = new QueryClient();

function App() {
  // Remove the useAuth hook from here since it's causing a circular dependency
  
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
