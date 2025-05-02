
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

const API_URL = "https://urgent-2kay-directed-bill-payment-system.onrender.com";

const authService = {
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
  
  // Google OAuth login - redirects user to Google auth page
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },
  
  // Helper method to get auth token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  // For future use with API requests that require authentication
  getAuthHeader: (): Record<string, string> | undefined => {
    const token = authService.getToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return undefined;
  }
};

export default authService;
