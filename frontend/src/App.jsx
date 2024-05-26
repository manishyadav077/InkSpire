import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  About,
  AuthLayout,
  CreatePost,
  Dashboard,
  Home,
  PostPage,
  RootLayout,
  Search,
  SignIn,
  SignUp,
  UpdatePost,
} from "./pages";
import { FooterCom, Header, ScrollToTop } from "./components";


const App = () => {
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
          <Route path="/search" element={<Search />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
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
