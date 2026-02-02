import { Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Shield, User, ShieldAlert, Trash2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import API_BASE_URL from "../../config";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/getusers`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) setShowMore(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/getusers?startIndex=${startIndex}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Community</h1>
        <p className="text-slate-500 mt-1">Manage users and access permissions</p>
      </div>

      {currentUser.isAdmin && users.length > 0 ? (
        <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="overflow-x-auto">
            <Table hoverable theme={{ root: { base: "w-full text-left text-sm text-slate-500 dark:text-slate-400", shadow: "none" }, head: { base: "bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 uppercase font-bold text-xs" } }}>
              <Table.Head>
                <Table.HeadCell className="py-5 px-6">Joined</Table.HeadCell>
                <Table.HeadCell>Member</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
                <Table.HeadCell>Email Address</Table.HeadCell>
                <Table.HeadCell className="text-center">Role</Table.HeadCell>
                <Table.HeadCell className="text-center">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((user) => (
                  <Table.Row key={user._id} className="bg-white dark:bg-dark-card hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <Table.Cell className="py-5 px-6 font-medium whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </Table.Cell>
                    <Table.Cell>
                      <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover rounded-full ring-2 ring-slate-100 dark:ring-slate-800" />
                    </Table.Cell>
                    <Table.Cell className="font-bold text-slate-900 dark:text-white">{user.username}</Table.Cell>
                    <Table.Cell className="font-medium">{user.email}</Table.Cell>
                    <Table.Cell className="text-center">
                      {user.isAdmin ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Admin
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                          <User size={12} /> User
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell className="text-center">
                      <button
                        onClick={() => { setShowModal(true); setUserIdToDelete(user._id); }}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        disabled={user._id === currentUser._id}
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
              Show More Members
            </button>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-[2rem] p-12 text-center">
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-fit mx-auto mb-4 text-slate-400">
            <User size={32} />
          </div>
          <h3 className="text-xl font-outfit font-bold text-slate-900 dark:text-white mb-2">No members yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">Your community is just getting started.</p>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" theme={{ content: { inner: "rounded-3xl bg-white dark:bg-dark-card" } }}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 w-fit mx-auto rounded-full mb-4">
              <ShieldAlert size={32} />
            </div>
            <h3 className="mb-4 text-xl font-outfit font-bold text-slate-900 dark:text-white">Remove Member?</h3>
            <p className="text-slate-500 mb-8 text-sm">This will permanently delete the user account and all associated content. This action is irreversible.</p>
            <div className="flex justify-center gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all" onClick={handleDeleteUser}>Confirm Removal</button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-8 rounded-xl transition-all" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashUsers;
