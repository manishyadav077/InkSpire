import { Sidebar } from "flowbite-react";
import {
  User,
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import API_BASE_URL from "../../config";

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
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

  return (
    <Sidebar className="w-full md:w-64 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-dark-background">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                active={tab === "dash" || !tab}
                icon={LayoutDashboard}
                as="div"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-outfit font-medium ${tab === "dash" || !tab
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
              >
                Overview
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={User}
              as="div"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-outfit font-medium ${tab === "profile"
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              Profile
              {currentUser.isAdmin && (
                <span className="ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/20 rounded-full">Admin</span>
              )}
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={FileText}
                  as="div"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-outfit font-medium ${tab === "posts"
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  My Posts
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={Users}
                  as="div"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-outfit font-medium ${tab === "users"
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  active={tab === "comments"}
                  icon={MessageSquare}
                  as="div"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-outfit font-medium ${tab === "comments"
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <Sidebar.Item
              icon={LogOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 font-outfit font-semibold"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
