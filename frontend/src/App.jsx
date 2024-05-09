import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Dashboard, Home, Project, SignIn, SignUp } from "./pages";
import Header from "./components/Header";

const App = () => {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
