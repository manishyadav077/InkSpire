import { Button, Navbar, TextInput, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Moon, Sun, Menu, X, Feather } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { toggleTheme } from "../redux/theme/themeSlice";
import API_BASE_URL from "../../config";

const Header = () => {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="sticky top-0 z-50 bg-white/80 dark:bg-dark-background/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
      <Link
        to="/"
        className="flex items-center gap-2 self-center whitespace-nowrap text-xl sm:text-2xl font-outfit font-extrabold tracking-tight dark:text-white"
      >
        <div className="bg-primary-500 p-1.5 rounded-xl text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
          <Feather size={20} />
        </div>
        <span className="text-gradient">InkSpire</span>
      </Link>

      <form onSubmit={handleSubmit} className="hidden lg:block">
        <TextInput
          type="text"
          placeholder="Explore stories..."
          rightIcon={() => <Search size={18} className="text-slate-400" />}
          className="w-80"
          theme={{
            field: {
              input: {
                base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-slate-100/50 dark:!bg-slate-800/50 !rounded-full !border-transparent focus:!ring-2 focus:!ring-primary-400 transition-all",
              }
            }
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="flex gap-3 md:order-2">
        <button
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <div className="p-0.5 rounded-full ring-2 ring-primary-400/30">
                <Avatar alt="user" img={currentUser.profilePicture} rounded size="sm" />
              </div>
            }
          >
            <Dropdown.Header>
              <span className="block text-sm font-semibold">@{currentUser.username}</span>
              <span className="block text-sm font-medium text-slate-500 truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item className="font-outfit">Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout} className="text-red-500 font-outfit">Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <button className="premium-button primary-gradient text-white text-sm">
              Get Started
            </button>
          </Link>
        )}

        <Navbar.Toggle theme={{ base: "inline-flex items-center rounded-lg p-2 text-sm text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 dark:focus:ring-slate-600 lg:hidden" }} />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"} className="font-outfit font-medium">
          <Link to="/" className={`${path === '/' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-400'}`}>Home</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/about"} as={"div"} className="font-outfit font-medium">
          <Link to="/about" className={`${path === '/about' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-400'}`}>About</Link>
        </Navbar.Link>

        <Navbar.Link active={path === "/create-post"} as={"div"} className="font-outfit font-medium">
          <Link to="/create-post" className={`${path === '/create-post' ? 'text-primary-500' : 'text-slate-600 dark:text-slate-400'}`}>Write</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
