import Button from "../components/ui/Button";
import { logOutUser } from "../features/auth/auth.service";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  
  const navigate = useNavigate();

  return (
    <>
      <DefaultLayout>Dashboard</DefaultLayout>
    </>
  );
}
