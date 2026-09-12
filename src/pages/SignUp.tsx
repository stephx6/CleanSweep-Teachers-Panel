import SignUpForm from "../features/auth/SignUpForm";
import AuthLayout from "../layout/AuthLayout";
import { signUpUser } from "../features/auth/auth.service";
import { useState } from "react";
export default function SignUp() {
  const [loading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      await signUpUser(data.email, data.password, data.name);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <SignUpForm onSubmit={handleSignUp} loading={loading} />
    </AuthLayout>
  );
}
