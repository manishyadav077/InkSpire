import moment from "moment";
import { useEffect, useState } from "react";
import { Heart, Edit3, Trash2, Check, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Textarea } from "flowbite-react";
import API_BASE_URL from "../../config";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${comment.userId}`);
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/editComment/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
        credentials: "include",
      });
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const isLiked = currentUser && comment.likes.includes(currentUser._id);

  return (
    <div className="flex gap-4 p-4 rounded-2xl transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group">
      <div className="flex-shrink-0">
        <img
          className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-outfit font-bold text-sm text-slate-900 dark:text-white truncate">
              {user ? user.username : "Anonymous"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && !isEditing && (
              <>
                <button onClick={handleEdit} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                  <Edit3 size={14} />
                </button>
                <button onClick={() => onDelete(comment._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              className="w-full bg-white dark:bg-slate-900 border-primary-100 dark:border-primary-900/40 rounded-xl focus:ring-2 focus:ring-primary-400 p-3 text-sm transition-all"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-600 transition-all">
                <Check size={12} /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all">
                <X size={12} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onLike(comment._id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${isLiked
                    ? "bg-red-50 dark:bg-red-950/30 text-red-500"
                    : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 hover:text-red-500"
                  }`}
              >
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
                <span>{comment.numberOfLikes > 0 ? comment.numberOfLikes : "Like"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
