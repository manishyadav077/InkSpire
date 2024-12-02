import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle the redirect result when the page loads
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          console.log("Google sign-in successful:", user);

          // Make an API call to your server to authenticate the user
          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.displayName,
              email: user.email,
              googlePhotoUrl: user.photoURL,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate("/"); // Navigate to the home page after successful sign-in
          } else {
            console.error("Error from server:", res.status, await res.text());
          }
        }
      } catch (error) {
        console.error("Error during redirect result handling:", error);
      }
    };

    handleRedirectResult();
  }, [auth, dispatch, navigate]);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Trigger the sign-in redirect
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during sign-in with redirect:", error);
    }
  };

  return (
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
