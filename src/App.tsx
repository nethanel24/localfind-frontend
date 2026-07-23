import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const ProviderDetails = lazy(() => import("./pages/ProviderDetails/ProviderDetails"));
const Reviews = lazy(() => import("./pages/Reviews/Reviews"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites"));
const EditProfileUser = lazy(() => import("./pages/EditProfileUser"));
const OnboardingProvider = lazy(() => import("./pages/OnboardingProvider/OnboardingProvider"));
const DashboardProvider = lazy(() => import("./pages/DashboardProvider/DashboardProvider"));
const EditProfileProvider = lazy(() => import("./pages/EditProfileProvider"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/AdminCategories/AdminCategories"));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Feed = lazy(() => import("./pages/Feed/Feed"));
const App = () => (
  <Suspense fallback={<LoadingSpinner message="טוען עמוד..." />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/providers/:id" element={<ProviderDetails />} />
      <Route path="/providers/:id/reviews" element={<Reviews />} />

      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <EditProfileUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider/onboarding"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <OnboardingProvider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/dashboard"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <DashboardProvider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/provider/profile"
        element={
          <ProtectedRoute allowedRoles={["provider"]}>
            <EditProfileProvider />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminCategories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminStats />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;