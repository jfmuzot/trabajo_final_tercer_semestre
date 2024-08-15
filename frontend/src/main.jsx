import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from './App.jsx';
import Home from "./views/pages/HomePage.jsx";
import Login from "./views/pages/Login.jsx";
import Register from './views/Register.jsx';
import Settings from './views/Settings.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />}>
          <Route path="settings" element={<Settings />} />
        </Route>
      <Route path="/login" element={<Login />}>
          <Route path="register" element={<Register />} />
        </Route>
    </Routes>
  </Router>
);


/*ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
*/