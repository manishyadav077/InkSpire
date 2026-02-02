import { Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Edit3, Trash2, ExternalLink, AlertCircle, Plus } from "lucide-react";
import API_BASE_URL from "../../config";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?userId=${currentUser._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`${API_BASE_URL}/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Your Stories</h1>
          <p className="text-slate-500 mt-1">Manage and edit your published content</p>
        </div>
        <Link to="/create-post" className="premium-button primary-gradient text-white flex items-center gap-2 py-3 px-6 shadow-lg shadow-primary-500/30">
          <Plus size={20} /> New Story
        </Link>
      </div>

      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <Table hoverable theme={{ root: { base: "w-full text-left text-sm text-slate-500 dark:text-slate-400", shadow: "none" }, head: { base: "bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 uppercase font-bold text-xs" } }}>
              <Table.Head>
                <Table.HeadCell className="py-5 px-6">Updated</Table.HeadCell>
                <Table.HeadCell>Story Preview</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell className="text-center">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
                {userPosts.map((post) => (
                  <Table.Row key={post._id} className="bg-white dark:bg-dark-card hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <Table.Cell className="py-5 px-6 font-medium whitespace-nowrap">
                      {new Date(post.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/post/${post.slug}`}>
                        <img src={post.image} alt={post.title} className="w-20 h-12 object-cover rounded-xl ring-1 ring-slate-200 dark:ring-slate-700" />
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="max-w-[300px]">
                      <Link className="font-bold font-outfit text-slate-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-1" to={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {post.category}
                      </span>
                    </Table.Cell>
                    <Table.Cell className="py-5 px-6">
                      <div className="flex items-center justify-center gap-3">
                        <Link to={`/update-post/${post._id}`} className="p-2 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => { setShowModal(true); setPostIdToDelete(post._id); }}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          {showMore && (
            <button onClick={handleShowMore} className="w-full py-6 text-sm font-bold text-primary-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors border-t border-slate-100 dark:border-slate-800">
              Load More Stories
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] p-12 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4 text-slate-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white mb-2">No stories found</h3>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">You haven't published any stories yet. Start sharing your thoughts with the world today.</p>
          <Link to="/create-post" className="premium-button primary-gradient text-white flex items-center gap-2 py-3 px-8 mx-auto w-fit">
            <Plus size={20} /> Create Your First Story
          </Link>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" theme={{ content: { inner: "rounded-3xl bg-white dark:bg-dark-card" } }}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 w-fit mx-auto rounded-full mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="mb-4 text-xl font-outfit font-bold text-slate-900 dark:text-white">Delete Story?</h3>
            <p className="text-slate-500 mb-8 text-sm">This action will permanently remove the story and all its comments. This cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all" onClick={handleDeletePost}>Delete Story</button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-8 rounded-xl transition-all" onClick={() => setShowModal(false)}>Keep it</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
