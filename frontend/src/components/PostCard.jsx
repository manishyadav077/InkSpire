import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import moment from "moment";

export default function PostCard({ post }) {
  return (
    <div className="group flex flex-col glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <Link to={`/post/${post.slug}`} className="relative h-60 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-outfit font-bold tracking-wider uppercase bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full text-primary-600 shadow-sm border border-white/20">
            {post.category}
          </span>
        </div>
      </Link>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-2 text-slate-400 text-xs mb-3 font-medium">
          <Calendar size={14} />
          {moment(post.createdAt).format("MMM DD, YYYY")}
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold mb-3 tracking-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-300">
            {post.title}
          </h3>
        </Link>

        <div className="flex-1" />

        <Link
          to={`/post/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-bold text-primary-500 group-hover:gap-3 transition-all duration-300"
        >
          Read Article <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
