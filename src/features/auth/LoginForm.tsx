import Input from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useLogin } from "./useLogin";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, loading, error } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      // error is already set in useLogin
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form
          className="bg-[#FFFFFF] rounded-2xl shadow-xl px-8 py-10 space-y-6 border border-[#BBF7D0]"
          onSubmit={handleLogin}
        >
          {/* Logo Section */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-linear-to-br from-[#16A34A] to-[#4ADE80] rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-[#14532D] to-[#16A34A] bg-clip-text text-transparent">
              Welcome to Cleansweep
            </h1>
            <p className="text-sm text-[#166534] font-medium">Teachers Panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="teacher@school.edu"
              leftIcon={<EnvelopeIcon className="w-5 h-5" />}
              size="md"
              fullWidth={true}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              leftIcon={<LockClosedIcon className="w-5 h-5" />}
              showPasswordToggle
              size="md"
              fullWidth={true} // Added fullWidth
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>

         

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRightIcon className="w-4 h-4" />}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
