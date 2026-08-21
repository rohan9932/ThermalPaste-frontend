import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunitiesListPage from "./pages/CommunitiesListPage";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegistrationPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/communities",
    Component: CommunitiesListPage,
  },
  {
    path: "/communities/:groupId",
    Component: CommunitiesPage,
  },
]);


function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
