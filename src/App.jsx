import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import CommunitiesPage from "./pages/CommunitiesPage";
import CommunitiesListPage from "./pages/CommunitiesListPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import SavedPostsPage from "./pages/SavedPostsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicOnlyRoute>
        <RegistrationPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/saved",
    element: (
      <ProtectedRoute>
        <SavedPostsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/communities",
    Component: CommunitiesListPage,
  },
  {
    path: "/communities/:groupId",
    Component: CommunitiesPage,
  },
  {
    path: "/post/:id",
    Component: PostDetailsPage,
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
