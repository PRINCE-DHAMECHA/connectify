import "./App.css";
import Home from "./pages/Home";
import Headers from "./Components/Headers";
import Login from "./pages/Login";
import Error from "./Components/Error";
import { Routes, Route } from "react-router-dom";
import Stack from "@mui/material/Stack";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import Connections from "./pages/Connections";
import PendingConnections from "./pages/PendingConnections";
import UpdateProfile from "./pages/updateProfile";

function App() {
  return (
    <Stack>
      <Headers />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProfile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/update/:id" element={<UpdateProfile />} />
        <Route path="/connections/:id" element={<Connections />} />
        <Route path="/pendingConnections" element={<PendingConnections />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Stack>
  );
}

export default App;
