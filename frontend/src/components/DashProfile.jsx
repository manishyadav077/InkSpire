import { Alert, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { showToast } from "../redux/toast/toastSlice";
import API_BASE_URL from "../../config";
import { User, Mail, Lock, Trash2, LogOut, Camera, Save, AlertCircle } from "lucide-react";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 5MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) return;
    if (imageFileUploading) return;
    try {
      dispatch(updateStart());
      const res = await fetch(`${API_BASE_URL}/api/user/update/${currentUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        dispatch(showToast({ message: "Update failed. Please try again.", type: "error" }));
      } else {
        dispatch(updateSuccess(data));
        dispatch(showToast({ message: "Profile updated successfully!", type: "success" }));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${API_BASE_URL}/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/signout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 w-full min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your public profile and privacy</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <input type="file" accept="image/*" onChange={handleImageChange} ref={filePickerRef} hidden />

        <div className="flex flex-col items-center group">
          <div
            className="relative w-32 h-32 cursor-pointer transition-transform hover:scale-105"
            onClick={() => filePickerRef.current.click()}
          >
            <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
            {imageFileUploadProgress && (
              <div className="absolute inset-0 z-10">
                <CircularProgressbar
                  value={imageFileUploadProgress || 0}
                  strokeWidth={4}
                  styles={{
                    path: { stroke: '#3b82f6', strokeLinecap: 'round' },
                    trail: { stroke: 'transparent' }
                  }}
                />
              </div>
            )}
            <img
              src={imageFileUrl || currentUser.profilePicture}
              alt="user"
              className={`rounded-full w-full h-full object-cover p-1 ${imageFileUploadProgress && imageFileUploadProgress < 100 && "opacity-60"}`}
            />
            <div className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </div>
          </div>
          {imageFileUploadError && <Alert color="failure" className="mt-4 rounded-xl">{imageFileUploadError}</Alert>}
        </div>

        <div className="glass-card rounded-3xl p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User size={20} />
              </div>
              <TextInput
                type="text"
                id="username"
                placeholder="Username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                theme={{ field: { input: { base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-slate-50 dark:!bg-slate-900 border-transparent !rounded-2xl focus:!ring-2 focus:!ring-primary-400 py-4 pl-12 pr-6 font-semibold transition-all" } } }}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={20} />
              </div>
              <TextInput
                type="email"
                id="email"
                placeholder="Email Address"
                defaultValue={currentUser.email}
                onChange={handleChange}
                theme={{ field: { input: { base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-slate-50 dark:!bg-slate-900 border-transparent !rounded-2xl focus:!ring-2 focus:!ring-primary-400 py-4 pl-12 pr-6 font-semibold transition-all" } } }}
              />
            </div>

            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={20} />
              </div>
              <TextInput
                type="password"
                id="password"
                placeholder="New Password"
                onChange={handleChange}
                theme={{ field: { input: { base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-slate-50 dark:!bg-slate-900 border-transparent !rounded-2xl focus:!ring-2 focus:!ring-primary-400 py-4 pl-12 pr-6 font-semibold transition-all" } } }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || imageFileUploading}
            className="premium-button primary-gradient text-white w-full flex items-center justify-center gap-2 py-4 text-lg shadow-xl shadow-primary-500/30 disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : <><Save size={20} /> Save Profile</>}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={18} /> Delete Account
        </button>
        <button
          onClick={handleSignout}
          className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md" theme={{ content: { inner: "rounded-3xl bg-white dark:bg-dark-card" } }}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-500 w-fit mx-auto rounded-full mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="mb-4 text-xl font-outfit font-bold text-slate-900 dark:text-white">Close Account?</h3>
            <p className="text-slate-500 mb-8 text-sm">Deleting your account is permanent and cannot be reversed. All your data will be cleared.</p>
            <div className="flex justify-center gap-3">
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all" onClick={handleDeleteUser}>Delete Account</button>
              <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold py-2.5 px-8 rounded-xl transition-all" onClick={() => setShowModal(false)}>Keep it</button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
