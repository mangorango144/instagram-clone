import { HomePage, Login, SignUp, UserPage } from "../pages";
import { AuthGuard, Layout } from "../components";

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
    path: "/:username",
    element: <Layout />,
    children: [
      { index: true, element: <UserPage /> },
      { path: "tagged", element: <UserPage /> },
    ],
  },
  {
    path: "/",
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [{ index: true, element: <HomePage /> }],
  },
];
