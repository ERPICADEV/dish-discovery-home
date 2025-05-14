
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoginRequiredPromptProps {
  message?: string;
  returnPath?: string;
}

const LoginRequiredPrompt = ({ 
  message = "You must log in to access this feature", 
  returnPath 
}: LoginRequiredPromptProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-6">{message}</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-lg mx-auto">
        Please log in or sign up to continue.
      </p>
      <div className="flex justify-center gap-4">
        <Button 
          onClick={() => navigate("/login", { 
            state: { returnPath: returnPath || window.location.pathname } 
          })}
        >
          Login
        </Button>
        <Button 
          variant="outline" 
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </Button>
        {returnPath && (
          <Button 
            variant="ghost" 
            onClick={() => navigate(returnPath)}
          >
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default LoginRequiredPrompt;
