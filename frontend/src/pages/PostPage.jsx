import { Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/toast/toastSlice";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import API_BASE_URL from "../../config";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Clock,
  Calendar,
  ChevronRight,
  Share2,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  MessageCircle
} from "lucide-react";
import moment from "moment";

export default function PostPage() {
  const { postSlug } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/post/getposts?slug=${postSlug}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    dispatch(showToast({ message: "Link copied to clipboard!", type: "success" }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-white dark:bg-dark-background">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="min-h-screen bg-white dark:bg-dark-background relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      {/* Floating Share Bar */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 z-40">
        <button onClick={copyToClipboard} className="p-3 bg-white dark:bg-dark-card shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-primary-500 hover:-translate-y-1 transition-all duration-300" title="Copy Link">
          <LinkIcon size={20} />
        </button>
        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-card shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-sky-400 hover:-translate-y-1 transition-all duration-300" title="Share on Twitter">
          <Twitter size={20} />
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`} target="_blank" rel="noreferrer" className="p-3 bg-white dark:bg-dark-card shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:-translate-y-1 transition-all duration-300" title="Share on LinkedIn">
          <Linkedin size={20} />
        </a>
        <button onClick={() => document.getElementById('comments').scrollIntoView({ behavior: 'smooth' })} className="p-3 bg-white dark:bg-dark-card shadow-xl border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-emerald-500 hover:-translate-y-1 transition-all duration-300" title="Go to Comments">
          <MessageCircle size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="flex items-center gap-2 text-sm font-bold text-primary-500 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:underline transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/search?category=${post?.category}`} className="hover:underline">
            {post?.category}
          </Link>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-6xl font-outfit font-extrabold tracking-tight mb-8 leading-[1.1] text-slate-900 dark:text-white"
        >
          {post?.title}
        </motion.h1>

        <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-100 dark:border-slate-800 py-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
              <Calendar size={18} className="text-primary-500" />
              {moment(post?.createdAt).format("MMMM DD, YYYY")}
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-bold">
              <Clock size={18} className="text-primary-500" />
              {(post?.content.length / 1000).toFixed(0)} min read
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={copyToClipboard} className="flex items-center gap-2 py-2 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-primary-500 hover:text-white transition-all xl:hidden">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mb-16">
        <motion.img
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          src={post?.image}
          alt={post?.title}
          className="w-full aspect-[21/9] object-cover rounded-[2.5rem] shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div
          className="post-content mb-16 prose prose-lg dark:prose-invert max-w-none font-inter leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        />

        <div id="comments" className="border-t border-slate-100 dark:border-slate-800 pt-16 pb-24">
          <CommentSection postId={post?._id} />
        </div>
      </div>

      {recentPosts && recentPosts.length > 0 && (
        <section className="bg-slate-50/50 dark:bg-slate-900/30 py-24 border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-outfit font-extrabold tracking-tight">Keep Reading</h2>
              <Link to="/search" className="text-sm font-bold text-primary-500 hover:underline">View All Stories</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
