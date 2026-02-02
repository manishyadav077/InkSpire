import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API_BASE_URL from "../../config";
import { Sparkles, Wand2, Image as ImageIcon, Save, Type, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`${API_BASE_URL}/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleAiAction = async (action) => {
    if (!formData.title && !formData.content) return;
    setIsAiLoading(true);
    try {
      const endpoint = action === 'title' ? '/api/ai/generate-title' : '/api/ai/refine-content';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: formData.content || formData.title }),
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        if (action === 'title') {
          setFormData({ ...formData, title: data.title });
        } else {
          setFormData({ ...formData, content: data.content });
        }
      }
    } catch (error) {
      console.error("AI Action failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['blockquote', 'code-block'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'video',
    'blockquote', 'code-block',
    'color', 'background',
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-primary-500 hover:shadow-lg transition-all">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Refine Your Story</h1>
            <p className="text-slate-500 mt-1">Make your content even more engaging</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleAiAction("refine")}
            disabled={isAiLoading || !formData.content}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-dark-card border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:shadow-xl hover:text-primary-500 transition-all disabled:opacity-50"
          >
            {isAiLoading ? <Wand2 size={16} className="animate-spin" /> : <Sparkles size={16} className="text-primary-500" />}
            AI Refine
          </button>
        </div>
      </div>

      <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6 sm:flex-row items-start">
          <div className="flex-1 w-full relative group">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              value={formData.title || ""}
              className="w-full"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              theme={{ field: { input: { base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-white dark:!bg-dark-card border-transparent !rounded-[1.5rem] focus:!ring-2 focus:!ring-primary-400 py-6 pl-6 pr-14 text-2xl font-outfit font-bold transition-all shadow-sm" } } }}
            />
            <button
              type="button"
              onClick={() => handleAiAction("title")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              title="AI Suggest Title"
            >
              <Type size={20} />
            </button>
          </div>
          <Select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full sm:w-64"
            theme={{ field: { select: { base: "block w-full border disabled:cursor-not-allowed disabled:opacity-50 !bg-white dark:!bg-dark-card border-transparent !rounded-[1.5rem] focus:!ring-2 focus:!ring-primary-400 py-6 px-6 font-bold text-lg transition-all shadow-sm h-[76px]" } } }}
          >
            <option value="uncategorized">Select Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
            <option value="productivity">Productivity</option>
            <option value="tech">Technology</option>
            <option value="creativity">Creativity</option>
          </Select>
        </div>

        <div className="glass-card rounded-[2rem] p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary-400 transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500">
                <ImageIcon size={24} />
              </div>
              <div>
                <p className="text-lg font-bold font-outfit">Cover Image</p>
                <p className="text-xs text-slate-500">Update your story's visual identity</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="max-w-[200px]"
              />
              <button
                type="button"
                onClick={handleUpdloadImage}
                disabled={!file || imageUploadProgress}
                className="px-6 py-3 rounded-xl primary-gradient text-white font-bold text-sm shadow-lg shadow-primary-500/20 disabled:opacity-50 h-[50px]"
              >
                {imageUploadProgress ? (
                  <div className="w-8">
                    <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress}%`} styles={{ path: { stroke: 'white' }, text: { fill: 'white', fontSize: '24px' } }} />
                  </div>
                ) : "Update Image"}
              </button>
            </div>
          </div>
          {imageUploadError && <Alert color="failure" className="mt-4 rounded-xl">{imageUploadError}</Alert>}
          {formData.image && <img src={formData.image} alt="upload" className="w-full h-80 object-cover rounded-2xl mt-6 shadow-xl" />}
        </div>

        <div className="editor-container glass-card rounded-[2rem] p-8 pt-4 min-h-[500px]">
          <ReactQuill
            theme="snow"
            placeholder="Tell your story..."
            className="h-auto min-h-[400px] mb-12 text-lg"
            required
            modules={modules}
            formats={formats}
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
        </div>

        <div className="sticky bottom-8 z-40 flex justify-end">
          <button type="submit" className="premium-button primary-gradient text-white flex items-center gap-3 shadow-2xl shadow-primary-500/40 px-10 py-5 text-xl font-bold rounded-[1.5rem] hover:-translate-y-1 transition-all active:scale-[0.98]">
            Save Changes <Save size={24} />
          </button>
        </div>

        {publishError && <Alert className="mt-5 rounded-xl font-bold" color="failure">{publishError}</Alert>}
      </form>

      <AnimatePresence>
        {isAiLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white/80 dark:bg-dark-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary-100 dark:border-primary-900 animate-pulse" />
                <Wand2 className="absolute inset-0 m-auto text-primary-500 animate-spin" size={32} />
              </div>
              <p className="font-outfit font-bold text-lg animate-pulse">InkSpire AI is thinking...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
