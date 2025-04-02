import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const auth = useSelector((state: RootState) => state.auth);

  return auth.uid ? <>{children}</> : <Navigate to="/login" replace />;
};
