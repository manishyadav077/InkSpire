import { BrowserRouter, Routes, Route } from "react-router-dom";
import { About, Dashboard, Home, Project, SignIn, SignUp } from "./pages";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import UpdatePost from "./pages/UpdatePost";
import Search from "./pages/Search";
import { useSelector } from "react-redux";
import RootLayout from "./pages/RootLayout";
import AuthLayout from "./pages/AuthLayout";

const App = () => {
  const status = useSelector((state) => state.user.currentUser);
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/search" element={<Search />} />
          <Route path="/post/:postslug" element={<PostPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
};

export default App;
