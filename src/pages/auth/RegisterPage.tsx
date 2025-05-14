import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      toast({
        title: "Terms and conditions",
        description: "Please agree to our terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 3) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password for better security.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await signUp(email, password, name);
      toast({
        title: "Registration successful",
        description: "Welcome to Trainify! Your account has been created.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains special char
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthClass = [
    "bg-red-500", // Very weak
    "bg-orange-500", // Weak
    "bg-yellow-500", // Fair
    "bg-blue-500", // Good
    "bg-green-500", // Strong
  ][passwordStrength - 1] || "";

  const strengthText = [
    "Very weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ][passwordStrength - 1] || "";

  return (
    <div className="min-h-screen bg-fitness-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 bg-fitness-card-bg rounded-2xl shadow-xl">
        <div className="mb-6">
          <Link to="/" className="text-fitness-gray hover:text-fitness-green flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Join <span className="text-fitness-green">TRAIN</span><span>ify</span>
          </h2>
          <p className="text-fitness-gray mt-2">Start your fitness journey today</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              className="bg-fitness-dark-gray border-fitness-dark-gray text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              className="bg-fitness-dark-gray border-fitness-dark-gray text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="bg-fitness-dark-gray border-fitness-dark-gray text-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fitness-gray"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-fitness-gray">Password strength:</div>
                  <div className="text-xs font-medium" style={{ color: strengthClass }}>
                    {strengthText}
                  </div>
                </div>
                <div className="h-1 w-full bg-fitness-dark-gray rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthClass} transition-all duration-300`} 
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-fitness-gray">
                    <span className={`mr-1 ${/[A-Z]/.test(password) ? "text-fitness-green" : ""}`}>
                      {/[A-Z]/.test(password) ? <Check size={12} /> : "•"}
                    </span>
                    Uppercase letter
                  </div>
                  <div className="flex items-center text-fitness-gray">
                    <span className={`mr-1 ${/[a-z]/.test(password) ? "text-fitness-green" : ""}`}>
                      {/[a-z]/.test(password) ? <Check size={12} /> : "•"}
                    </span>
                    Lowercase letter
                  </div>
                  <div className="flex items-center text-fitness-gray">
                    <span className={`mr-1 ${/\d/.test(password) ? "text-fitness-green" : ""}`}>
                      {/\d/.test(password) ? <Check size={12} /> : "•"}
                    </span>
                    Number
                  </div>
                  <div className="flex items-center text-fitness-gray">
                    <span className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? "text-fitness-green" : ""}`}>
                      {/[^A-Za-z0-9]/.test(password) ? <Check size={12} /> : "•"}
                    </span>
                    Special character
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="terms"
              className="text-sm text-fitness-gray cursor-pointer"
            >
              I agree to the{" "}
              <a href="#" className="text-fitness-green hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-fitness-green hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fitness-green hover:bg-fitness-green/80 text-black font-semibold py-6"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-fitness-gray">
            Already have an account?{" "}
            <Link to="/login" className="text-fitness-green hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
