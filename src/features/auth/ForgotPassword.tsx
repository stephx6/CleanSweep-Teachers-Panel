import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import Logo from "../../assets/icon-android-circle-240px.png";
import Input from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { FirebaseError } from "firebase/app";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setSuccess(
        "Password reset email sent. Please check your inbox (and spam folder).",
      );
      setEmail("");
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found") {
          setError("No account was found with this email.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (err.code === "auth/too-many-requests") {
          setError("Too many attempts. Please try again later.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <form
          className="bg-[#FFFFFF] rounded-2xl shadow-xl px-8 py-10 space-y-6 border border-[#BBF7D0]"
          onSubmit={handleForgotPassword}
          noValidate
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
                Forgot Password?
              </h1>

              <p className="text-sm font-medium text-[#166534]">
                Teacher Panel
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-sm rounded-lg px-4 py-3">
            Enter your email address and we'll send you a link to reset your
            password.
          </div>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3"
            >
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div
              role="status"
              className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3"
            >
              {success}
            </div>
          )}

          {/* Form Field */}
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
              autoComplete="email"
              disabled={loading}
            />

            {/* Back to Login */}
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                className="text-sm font-medium text-[#16A34A] hover:text-[#14532D] hover:underline transition-colors"
                onClick={() => navigate("/")}
              >
                ← Back to Login
              </button>
            </div>
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
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>

          {/* Sign Up */}
          <div className="flex items-center justify-between mx-5 text-sm">
            <span className="text-muted-foreground">
              Don't have an account?
            </span>

            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
