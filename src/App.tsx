import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Classrooms from "./pages/Classrooms";
import ClassroomSection from "./pages/ClassroomSection";
import ProtectedRoute from "./protection/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminProvider from "./context/AdminProvider";
import Reports from "./pages/Reports";
import ClassPlayers from "./pages/ClassPlayers";

function App() {
  return (
    <>
      <AdminProvider>
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
              path="/classrooms"
              element={
                <ProtectedRoute>
                  <Classrooms />
                </ProtectedRoute>
              }
            ></Route>

            {/* Sub-Routes */}
            <Route
              path="/classrooms/:classroomId"
              element={
                <ProtectedRoute>
                  <ClassroomSection />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/classrooms/:classroomId/mystudents"
              element={
                <ProtectedRoute>
                  <ClassPlayers/>
                </ProtectedRoute>
              }
              />
              
            <Route
              path="/dashboard/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </>
  );
}
export default App;
