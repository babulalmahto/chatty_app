import { Routes, Route } from "react-router";
import Chat from "./pages/Chat/Chat";
import Auth from "./pages/Auth/Auth";

import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
