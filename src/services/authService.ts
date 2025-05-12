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

const API_URL =
  "https://urgent-2kay-directed-bill-payment-system.onrender.com/api";

const authService = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }): Promise<RegisterResponse> => {
    try {
      console.log("Registering new user:", {
        email: userData.email,
        role: userData.role,
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Registration failed:", data.error);
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration successful:", { userId: data.user?.id });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Registration error:", error.message);
        throw error;
      }
      console.error("Unknown registration error");
      throw new Error("Registration request failed");
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      console.log("Attempting login for:", email);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.error);
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", { userId: data.user?.id });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        throw error;
      }
      console.error("Unknown login error");
      throw new Error("Login request failed");
    }
  },

  // Google OAuth registration/login with role parameter
  loginWithGoogle: () => {
    console.log("Redirecting to Google OAuth login");
    window.location.href = `https://urgent-2kay-directed-bill-payment-system.onrender.com/api/auth/login`;
  },

  // Updated to pass role parameter for signup
  registerWithGoogle: (role: string) => {
    console.log(`Redirecting to Google OAuth signup with role: ${role}`);
    const state = encodeURIComponent(JSON.stringify({ role }));
    window.location.href = `${API_URL}/auth/google?state=${state}`;
  },

  // Helper method to get auth token
  getToken: (): string | null => {
    const token = sessionStorage.getItem("token");
    if (token) {
      console.log(
        "Token retrieved from sessionStorage:",
        token.substring(0, 5) + "..."
      );
    } else {
      console.log("No token found in sessionStorage");
    }
    return token;
  },

  // Helper method to get user data
  getUser: () => {
    const userStr = sessionStorage.getItem("user");
    if (!userStr) {
      console.log("No user found in sessionStorage");
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log("User retrieved from sessionStorage:", {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      return user;
    } catch (error) {
      console.error("Error parsing user from sessionStorage:", error);
      return null;
    }
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
    const token = sessionStorage.getItem("token");
    const user = sessionStorage.getItem("user");

    console.log("Authentication check details:", {
      hasToken: !!token,
      hasUser: !!user,
      tokenLength: token ? token.length : 0,
      userDataExists: user ? "yes" : "no",
    });

    // If we have the user data, try parsing it to make sure it's valid
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        console.log("User data parsed successfully:", {
          id: parsedUser.id,
          name: parsedUser.name,
          role: parsedUser.role,
        });
      } catch (e) {
        console.error("Error parsing user data from sessionStorage:", e);
        return false;
      }
    }

    const isAuth = !!token && !!user;
    console.log(
      "Authentication result:",
      isAuth ? "Authenticated" : "Not authenticated"
    );
    return isAuth;
  },

  // Enhanced clear authentication data with browser history manipulation
  clearAuth: (): void => {
    console.log("Clearing all authentication data from sessionStorage");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authenticated");

    // Add cache control meta tag to prevent caching
    const metaTag = document.createElement("meta");
    metaTag.setAttribute("http-equiv", "Cache-Control");
    metaTag.setAttribute("content", "no-cache, no-store, must-revalidate");
    document.head.appendChild(metaTag);

    // Prevent going back to protected pages after logout
    if (window.history && window.history.pushState) {
      // Add a dummy history entry so going back doesn't take you to the protected page
      window.history.pushState(null, document.title, window.location.href);
      // Replace current state so we can't go forward to it again
      window.history.replaceState(null, document.title, window.location.href);
    }
  },
};

export default authService;
