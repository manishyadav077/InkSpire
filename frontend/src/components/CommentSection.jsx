import { Alert, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { MessageSquare, User, AlertCircle, Send, LogIn } from "lucide-react";
import API_BASE_URL from "../../config";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/comment/likeComment/${commentId}`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: data.likes, numberOfLikes: data.likes.length }
            : comment
        ));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(comments.map((c) =>
      c._id === comment._id ? { ...c, content: editedContent } : c
    ));
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-100 dark:bg-primary-900/30 text-primary-500 rounded-2xl">
          <MessageSquare size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-outfit font-extrabold">Discussion</h2>
          <p className="text-slate-500 text-sm font-medium">{comments.length} thoughts shared</p>
        </div>
      </div>

      {currentUser ? (
        <div className="glass-card rounded-2xl p-6 mb-12">
          <div className="flex items-center gap-3 mb-4">
            <img className="h-10 w-10 object-cover rounded-full ring-2 ring-primary-100 dark:ring-primary-900/40" src={currentUser.profilePicture} alt={currentUser.username} />
            <div className="flex flex-col">
              <span className="text-sm font-bold font-outfit">@{currentUser.username}</span>
              <span className="text-xs text-slate-500 font-medium">Posting publicly</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="What are your thoughts on this?"
              rows="3"
              maxLength="200"
              className="w-full bg-slate-50/50 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary-400 placeholder:text-slate-400 font-medium p-4 transition-all resize-none"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30 p-2 rounded-xl">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${comment.length > 180 ? 'bg-red-100 text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {200 - comment.length} left
              </span>
              <button
                type="submit"
                disabled={!comment.trim()}
                className="premium-button primary-gradient text-white flex items-center gap-2 py-2 px-6 text-sm disabled:opacity-50"
              >
                Share Comment <Send size={14} />
              </button>
            </div>
            {commentError && (
              <Alert color="failure" icon={AlertCircle} className="mt-4 rounded-xl">
                {commentError}
              </Alert>
            )}
          </form>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-8 mb-12 flex flex-col items-center text-center gap-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
            <User size={32} />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-lg text-slate-900 dark:text-white">Join the conversation</h3>
            <p className="text-slate-500 text-sm max-w-[280px]">Sign in to share your thoughts and interact with other readers.</p>
          </div>
          <Link to="/sign-in" className="premium-button primary-gradient text-white flex items-center gap-2 py-2.5 px-8">
            <LogIn size={18} /> Sign In to Reply
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={(commentId) => {
              setShowModal(true);
              setCommentToDelete(commentId);
            }}
          />
        ))}
        {comments.length === 0 && (
          <div className="text-center py-12 opacity-50">
            <p className="font-outfit font-medium text-slate-500 italic">No comments yet. Be the first to start the discussion!</p>
          </div>
        )}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" theme={{ content: { base: "relative w-full p-4 h-full md:h-auto", inner: "relative rounded-3xl bg-white shadow dark:bg-dark-card" } }}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 w-fit mx-auto rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="mb-4 text-xl font-outfit font-bold text-slate-900 dark:text-white">Confirm Removal</h3>
            <p className="text-slate-500 mb-8 text-sm">Are you sure you want to delete this comment? This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all"
                onClick={() => handleDelete(commentToDelete)}
              >
                Delete
              </button>
              <button
                className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-8 rounded-xl transition-all"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
