import { HomePage, Login, SignUp, UserPage } from "../pages";
import { AuthGuard } from "../components";

export const routesConfig = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <HomePage />
      </AuthGuard>
    ),
  },
  {
    path: "/:username",
    element: <UserPage />,
  },
];
