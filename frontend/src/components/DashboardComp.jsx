import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  MessageSquare,
  FileText,
  ArrowUp,
  TrendingUp,
} from "lucide-react";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getusers?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comment/getcomments?limit=5`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  const StatCard = ({ title, total, lastMonth, icon: Icon, colorClass }) => (
    <div className="flex flex-col p-6 glass-card gap-4 md:w-80 w-full rounded-2xl transition-all hover:shadow-2xl">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-outfit font-bold uppercase tracking-wider">{title}</h3>
          <p className="text-4xl font-outfit font-extrabold mt-2">{total}</p>
        </div>
        <div className={`p-4 rounded-2xl text-white shadow-lg ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span className="text-emerald-500 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <ArrowUp size={14} className="mr-0.5" />
          {lastMonth}
        </span>
        <div className="text-slate-400">Since last month</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:mx-auto max-w-7xl">
      <div className="flex-wrap flex gap-6 justify-center mb-10">
        <StatCard
          title="Total Users"
          total={totalUsers}
          lastMonth={lastMonthUsers}
          icon={Users}
          colorClass="bg-gradient-to-br from-blue-400 to-blue-600"
        />
        <StatCard
          title="Total Comments"
          total={totalComments}
          lastMonth={lastMonthComments}
          icon={MessageSquare}
          colorClass="bg-gradient-to-br from-purple-400 to-purple-600"
        />
        <StatCard
          title="Total Posts"
          total={totalPosts}
          lastMonth={lastMonthPosts}
          icon={FileText}
          colorClass="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="flex flex-col glass-card rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-outfit font-bold text-lg">Recent Users</h2>
            <Link to="/dashboard?tab=users">
              <button className="text-sm font-bold text-primary-500 border border-primary-500/20 px-4 py-1.5 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable theme={{ root: { base: "w-full text-left text-sm text-slate-500 dark:text-slate-400" }, head: { base: "bg-slate-50/50 dark:bg-slate-800/50 text-xs uppercase text-slate-700 dark:text-slate-200" } }}>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
              {users && users.map((user) => (
                <Table.Row key={user._id} className="bg-white dark:bg-dark-card transition-colors">
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-slate-900 dark:text-white">{user.username}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col glass-card rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-outfit font-bold text-lg">Recent Comments</h2>
            <Link to="/dashboard?tab=comments">
              <button className="text-sm font-bold text-primary-500 border border-primary-500/20 px-4 py-1.5 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
              {comments && comments.map((comment) => (
                <Table.Row key={comment._id} className="bg-white dark:bg-dark-card transition-colors">
                  <Table.Cell className="max-w-[200px]">
                    <p className="line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell className="font-semibold text-slate-900 dark:text-white">{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>

        <div className="flex flex-col glass-card rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-outfit font-bold text-lg">Recent Posts</h2>
            <Link to="/dashboard?tab=posts">
              <button className="text-sm font-bold text-primary-500 border border-primary-500/20 px-4 py-1.5 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Story</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts && posts.map((post) => (
                <Table.Row key={post._id} className="bg-white dark:bg-dark-card transition-colors">
                  <Table.Cell className="flex items-center gap-3 max-w-[250px]">
                    <img src={post.image} alt={post.title} className="w-12 h-12 rounded-lg object-cover" />
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-2">{post.title}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-md">
                      {post.category}
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
}
