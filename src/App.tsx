import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Feed = lazy(() => import("./pages/Feed"));
const ProviderDetails = lazy(() => import("./pages/ProviderDetails"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Favorites = lazy(() => import("./pages/Favorites"));
const EditProfileUser = lazy(() => import("./pages/EditProfileUser"));
const OnboardingProvider = lazy(() => import("./pages/OnboardingProvider"));
const DashboardProvider = lazy(() => import("./pages/DashboardProvider"));
const EditProfileProvider = lazy(() => import("./pages/EditProfileProvider"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <PrivateRoute>
            <Favorites />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <EditProfileUser />
          </PrivateRoute>
        }
      />

      <Route
        path="/provider/onboarding"
        element={
          <PrivateRoute allowedRoles={["provider"]}>
            <OnboardingProvider />
          </PrivateRoute>
        }
      />
      <Route
        path="/provider/dashboard"
        element={
          <PrivateRoute allowedRoles={["provider"]}>
            <DashboardProvider />
          </PrivateRoute>
        }
      />
      <Route
        path="/provider/profile"
        element={
          <PrivateRoute allowedRoles={["provider"]}>
            <EditProfileProvider />
          </PrivateRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminCategories />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminStats />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default App;