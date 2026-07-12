import { Routes, Route } from "react-router";
import Chat from "./pages/Chat/Chat";
import Auth from "./pages/Auth/Auth";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
};

export default App;
