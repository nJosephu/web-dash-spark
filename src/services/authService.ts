
interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    [key: string]: any; // For any additional fields
  };
}

interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    [key: string]: any; // For any additional fields
  };
}

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

const authService = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Registration request failed');
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Login request failed');
    }
  },
  
  // Google OAuth registration/login - redirects user to Google auth page
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Use the same Google auth endpoint for signup
  registerWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  
  // Helper method to get auth token
  getToken: (): string | null => {
    const token = sessionStorage.getItem('token');
    console.log("Getting token from sessionStorage:", token ? "Token exists" : "No token found");
    return token;
  },
  
  // For future use with API requests that require authentication
  getAuthHeader: (): Record<string, string> | undefined => {
    const token = authService.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  },

  // Check if token is valid
  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    const isAuth = !!token && !!user;
    console.log("Authentication check:", isAuth ? "Authenticated" : "Not authenticated");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!user);
    return isAuth;
  },
  
  // Clear authentication data
  clearAuth: (): void => {
    console.log("Clearing authentication data from sessionStorage");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authenticated');
  }
}

export default authService;
