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
import Logo from '../../assets/icon-android-circle-240px.png';
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
          <div className="flex flex-col items-center text-center space-y-2">
            <img
              src={Logo}
              alt="Cleansweep logo"
              className="w-28 sm:w-32 transition-transform duration-300 hover:scale-105"
            />

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-linear-to-r from-[#14532D] to-[#16A34A] bg-clip-text text-transparent">
                Welcome to Cleansweep
              </h1>

              <p className="text-sm font-medium text-[#166534]">
                Teacher Panel
              </p>
            </div>
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
          <div className="flex items-center justify-between mx-5 text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>

            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => navigate("signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
