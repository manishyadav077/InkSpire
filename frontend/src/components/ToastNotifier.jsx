import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { hideToast } from "../redux/toast/toastSlice";

const ToastNotifier = () => {
  const { message, type, show } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      toast[type](message, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(hideToast());
    }
  }, [show, message, type, dispatch]);

  return <ToastContainer />;
};

export default ToastNotifier;
