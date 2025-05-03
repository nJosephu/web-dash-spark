
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
      console.log("Registering new user:", { email: userData.email, role: userData.role });
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Registration failed:", data.error);
        throw new Error(data.error || 'Registration failed');
      }
      
      console.log("Registration successful:", { userId: data.user?.id });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
        throw error;
      }
      console.error("Unknown registration error");
      throw new Error('Registration request failed');
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log("Attempting login for:", email);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Login failed:", data.error);
        throw new Error(data.error || 'Login failed');
      }
      
      console.log("Login successful:", { userId: data.user?.id });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        throw error;
      }
      console.error("Unknown login error");
      throw new Error('Login request failed');
    }
  },
  
  // Google OAuth registration/login - redirects user to Google auth page
  loginWithGoogle: () => {
    console.log("Redirecting to Google OAuth login");
    window.location.href = `${API_URL}/auth/google`;
  },

  // Use the same Google auth endpoint for signup
  registerWithGoogle: () => {
    console.log("Redirecting to Google OAuth signup");
    window.location.href = `${API_URL}/auth/google`;
  },
  
  // Helper method to get auth token
  getToken: (): string | null => {
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log("Token retrieved from sessionStorage:", token.substring(0, 5) + "...");
    } else {
      console.log("No token found in sessionStorage");
    }
    return token;
  },
  
  // For future use with API requests that require authentication
  getAuthHeader: (): Record<string, string> | undefined => {
    const token = authService.getToken();
    if (token) {
      console.log("Creating auth header with token");
      return { Authorization: `Bearer ${token}` };
    }
    console.log("No auth header created (no token)");
    return undefined;
  },

  // Check if token is valid
  isAuthenticated: (): boolean => {
    const token = sessionStorage.getItem('token');
    const user = sessionStorage.getItem('user');
    
    console.log("Authentication check details:", { 
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token ? token.length : 0,
      userDataExists: user ? "yes" : "no"
    });
    
    // If we have the user data, try parsing it to make sure it's valid
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("User data parsed successfully:", {
          id: parsedUser.id,
          name: parsedUser.name,
          role: parsedUser.role
        });
      } catch (e) {
        console.error("Error parsing user data from sessionStorage:", e);
        return false;
      }
    }
    
    const isAuth = !!token && !!user;
    console.log("Authentication result:", isAuth ? "Authenticated" : "Not authenticated");
    return isAuth;
  },
  
  // Clear authentication data
  clearAuth: (): void => {
    console.log("Clearing all authentication data from sessionStorage");
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authenticated');
  }
}

export default authService;
