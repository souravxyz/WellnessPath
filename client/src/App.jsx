import { Outlet } from "react-router-dom";
import Navbar from "./components/layouts/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
