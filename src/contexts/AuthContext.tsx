
import React, { createContext, useContext, useState, useEffect } from "react";

// Define types for our context
type User = {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  updateUserProfile: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock user data for demo purposes
const MOCK_USER: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  profilePicture: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&auto=format&fit=crop",
};

// Mock credentials for demo
const VALID_CREDENTIALS = [
  { email: "john@example.com", password: "password123" },
  { email: "demo@example.com", password: "demo123" },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function with credential validation
  const login = async (email: string, password: string) => {
    // Simulate API call delay
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Validate credentials against mock data
    const validCredential = VALID_CREDENTIALS.find(
      cred => cred.email === email && cred.password === password
    );
    
    if (validCredential) {
      // Create user based on matched credential
      const loggedInUser = {
        ...MOCK_USER,
        email: validCredential.email,
      };
      
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
    } else {
      throw new Error("Invalid credentials");
    }
    setLoading(false);
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    // Simulate API call delay
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would send the registration data to your backend
    if (name && email && password) {
      const newUser = { ...MOCK_USER, name, email };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      
      // Add the new user to valid credentials (in a real app this would be done on the backend)
      VALID_CREDENTIALS.push({ email, password });
    } else {
      throw new Error("All fields are required");
    }
    setLoading(false);
  };

  // Update user profile
  const updateUserProfile = async (userData: Partial<User>) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    
    setLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
