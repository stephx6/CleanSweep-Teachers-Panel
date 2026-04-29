import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./protection/ProtectedRoute";
import { BrowserRouter, Routes , Route } from "react-router-dom";


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
          </Routes>
        </BrowserRouter>
      </>
    ); 
}
export default App;
