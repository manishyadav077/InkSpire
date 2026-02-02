import { Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MessageSquare, Heart, Trash2, AlertCircle, Quote } from "lucide-react";
import API_BASE_URL from "../../config";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/comment/getcomments`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/getcomments?startIndex=${startIndex}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/comment/deleteComment/${commentIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Recent Feedback</h1>
        <p className="text-slate-500 mt-1">Moderate and interact with community discussions</p>
      </div>

      {currentUser.isAdmin && comments.length > 0 ? (
        <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <Table hoverable theme={{ root: { base: "w-full text-left text-sm text-slate-500 dark:text-slate-400", shadow: "none" }, head: { base: "bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 uppercase font-bold text-xs" } }}>
              <Table.Head>
                <Table.HeadCell className="py-5 px-6">Posted On</Table.HeadCell>
                <Table.HeadCell>Comment</Table.HeadCell>
                <Table.HeadCell className="text-center">Engagement</Table.HeadCell>
                <Table.HeadCell>Context (Post ID)</Table.HeadCell>
                <Table.HeadCell className="text-center">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
                {comments.map((comment) => (
                  <Table.Row key={comment._id} className="bg-white dark:bg-dark-card hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <Table.Cell className="py-5 px-6 font-medium whitespace-nowrap">
                      {new Date(comment.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </Table.Cell>
                    <Table.Cell className="max-w-[400px]">
                      <div className="flex gap-3">
                        <Quote size={16} className="text-primary-400 shrink-0" />
                        <p className="text-slate-600 dark:text-slate-300 italic line-clamp-2">{comment.content}</p>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 font-bold text-[10px] uppercase tracking-wider">
                        <Heart size={12} fill="currentColor" /> {comment.numberOfLikes}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="font-mono text-[10px] text-slate-400">{comment.postId}</Table.Cell>
                    <Table.Cell className="text-center">
                      <button
                        onClick={() => { setShowModal(true); setCommentIdToDelete(comment._id); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          {showMore && (
            <button onClick={handleShowMore} className="w-full py-6 text-sm font-bold text-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors border-t border-slate-100 dark:border-slate-800">
              Show More Comments
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] p-12 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4 text-slate-400">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white mb-2">Silence is golden</h3>
          <p className="text-slate-500 max-w-sm mx-auto">No comments have been posted yet. They'll show up here once readers start sharing.</p>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" theme={{ content: { inner: "rounded-3xl bg-white dark:bg-dark-card" } }}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 w-fit mx-auto rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="mb-4 text-xl font-outfit font-bold text-slate-900 dark:text-white">Remove Comment?</h3>
            <p className="text-slate-500 mb-8 text-sm">Deleting this comment will remove it from the post permanently. This action is irreversible.</p>
            <div className="flex justify-center gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all" onClick={handleDeleteComment}>Confirm Deletion</button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-8 rounded-xl transition-all" onClick={() => setShowModal(false)}>Keep it</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
