import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import API_BASE_URL from "../../config";
import { motion } from "framer-motion";
import { MoveRight, Sparkles } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${API_BASE_URL}/api/post/getPosts`);
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="relative pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary-50/50 dark:bg-primary-900/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-8"
          >
            <Sparkles size={16} className="text-primary-500" />
            <span className="text-sm font-medium">Modernizing the way you write</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-outfit font-extrabold tracking-tight mb-6"
          >
            Where Ideas <span className="text-gradient">Take Flight</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed"
          >
            Explore a world of stories, tutorials, and deep dives into technology.
            InkSpire is your canvas for modern storytelling and technical expertise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/search">
              <button className="premium-button primary-gradient text-white flex items-center gap-2 group">
                Browse Stories
                <MoveRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        {posts && posts.length > 0 && (
          <div className="space-y-12">
            <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-3xl font-outfit font-bold">Featured Stories</h2>
                <p className="text-slate-500 mt-1">Discover the latest highlights from our community</p>
              </div>
              <Link
                to="/search"
                className="hidden sm:flex items-center gap-1 text-primary-500 font-semibold hover:gap-2 transition-all"
              >
                View all <MoveRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>

            <div className="flex sm:hidden justify-center pt-8">
              <Link to="/search">
                <button className="btn-secondary px-8 py-3 rounded-full border border-slate-200 dark:border-slate-800 font-semibold">
                  View all stories
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
