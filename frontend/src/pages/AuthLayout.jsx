import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const authStatus = useSelector((state) => state.user.currentUser);
  return (
    <>
      {authStatus ? (
        <Navigate to="/" />
      ) : (
        <>
          <section>
            <Outlet />
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
