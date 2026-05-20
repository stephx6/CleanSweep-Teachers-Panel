import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import ClassroomCodes from "./pages/ClassroomCodes";
import ProtectedRoute from "./protection/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          ></Route>

        

          <Route
            path="/dashboard/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/dashboard/classroom-codes"
            element={
              <ProtectedRoute>
                <ClassroomCodes />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
