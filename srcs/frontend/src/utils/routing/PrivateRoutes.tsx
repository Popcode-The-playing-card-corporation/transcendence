import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../components/hooks/useAuth";
import { useNotif } from "../../components/hooks/useNotif";
import { useEffect } from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const notif = useNotif();
  const location = useLocation();

  useEffect(() => {
    if (auth.logged_in === false) {
      notif?.showNotif("Authentication Error", "Please log in to access this page!", 5000);
    }
  }, [auth.logged_in, notif]);

  if (auth.logged_in === null) {
    return null;
  }

  if (auth.logged_in === false) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}