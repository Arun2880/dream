import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./Admin";
import Client from "./Client";
import Login from "./Login";
import AuthProtectedRoute from "./check_auth";  // Import the AuthProtectedRoute

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Protect the Admin route */}
          <Route
            path="/Admin/*"
            element={
              <AuthProtectedRoute>
                <Admin />
              </AuthProtectedRoute>
            }
          />
          {/* <Route path="/Client/*" element={<Client />} /> */}
          <Route path="/login" element={<Login />} />
          {/* Catch-all route */}
          <Route path="/*" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
