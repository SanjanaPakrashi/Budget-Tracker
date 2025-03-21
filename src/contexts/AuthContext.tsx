
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('budgetUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // For a simple demo, we'll just store username/password pairs in localStorage
  // In a real app, this would be handled by a proper backend
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll store user credentials in localStorage
      // In a real app, NEVER store passwords in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      
      // If user doesn't exist yet, create a new account
      if (!storedUsers[username]) {
        const newUser = { id: crypto.randomUUID(), username, password };
        storedUsers[username] = newUser;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        
        // Set current user
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('budgetUser', JSON.stringify(userWithoutPassword));
        
        toast({
          title: "Account created",
          description: `Welcome ${username}! Your account has been created.`,
        });
        navigate('/');
        return;
      }
      
      // If user exists, check password
      if (storedUsers[username].password !== password) {
        throw new Error('Invalid password');
      }
      
      // Password matches, log the user in
      const { password: _, ...userWithoutPassword } = storedUsers[username];
      setUser(userWithoutPassword);
      localStorage.setItem('budgetUser', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('budgetUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/login');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
