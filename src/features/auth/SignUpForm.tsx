import Input from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/icon-android-circle-240px.png'

interface SignUpFormProps {
  onSubmit?: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
}

export default function SignUpForm({
  onSubmit,
  loading = false,
  error = null,
}: SignUpFormProps) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
   
    await onSubmit?.({
      name : fullName,
      email,
      password,
      confirmPassword,
    });

    alert("Account Created Successfully")
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
   

  };

  const displayError = validationError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#BBF7D0] bg-white px-8 py-10 shadow-xl sm:px-10"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <img
              src={Logo}
              alt="Cleansweep logo"
              className="w-28 sm:w-32 transition-transform duration-300 hover:scale-105"
            />

            <div className="mt-4 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight bg-linear-to-r from-[#14532D] to-[#16A34A] bg-clip-text text-transparent">
                Create your account
              </h1>

              <p className="text-sm font-medium text-[#166534]">
                Teacher Management Panel
              </p>
            </div>
          </div>

          {/* Error */}
          {displayError && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {displayError}
            </div>
          )}

          {/* Fields */}
          <div className="mt-8 space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              leftIcon={<UserIcon className="h-5 w-5" />}
              size="md"
              fullWidth
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="teacher@school.edu"
              leftIcon={<EnvelopeIcon className="h-5 w-5" />}
              size="md"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              leftIcon={<LockClosedIcon className="h-5 w-5" />}
              showPasswordToggle
              size="md"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              leftIcon={<LockClosedIcon className="h-5 w-5" />}
              showPasswordToggle
              size="md"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRightIcon className="h-4 w-4" />}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </div>

          {/* Login Link */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-sm">
            <span className="text-muted-foreground">
              Already have an account?
            </span>

            <button
              type="button"
              className="font-semibold text-primary transition-colors hover:underline"
              onClick={() => navigate("/")}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
