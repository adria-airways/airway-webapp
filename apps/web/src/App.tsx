import "./global.css"
import { Routes, Route } from 'react-router-dom';
import Landing  from "./components/landing";
import Dashboard from "./components/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  );
}
