
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { currentUser, loginUser } = useUser();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Redirect if already logged in
  if (currentUser) {
    console.log("User already logged in, redirecting to home");
    return <Navigate to="/" />;
  }
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt started for user:", username);
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      console.log("Calling loginUser function with:", username);
      const success = await loginUser(username, password);
      console.log("Login result:", success);
                      
      if (success) {
        toast.success('Logged in successfully');
        console.log("Login successful, navigating to home page");
        
        // Force a small delay to ensure the auth state is updated
        setTimeout(() => {
          console.log("Redirecting to homepage after delay");
          navigate("/", { replace: true });
        }, 500);
      } else {
        toast.error('Invalid username or password');
        console.log("Login failed - invalid credentials");
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://www.leegality.com/static/media/logo_vertical_dark.024be63e.svg" 
              alt="Leegality Logo" 
              className="h-16"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#7f56d9' }}>Leegality Bulk Signer On-prem</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Secure document signing for your organization
          </p>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" 
                        style={{ backgroundColor: '#7f56d9' }}
                        disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
