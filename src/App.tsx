import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { AdminAuthProvider } from "./auth/AdminAuthContext"
import { AdminGuestRoute, AdminRoute } from "./components/admin/AdminRoute"
import { AdminLoginPage } from "./pages/admin/AdminLoginPage"
import { WishlistAdminPage } from "./pages/admin/WishlistAdminPage"
import { WishlistDetailPage } from "./pages/admin/WishlistDetailPage"
import { LandingPage } from "./pages/LandingPage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { TermsPage } from "./pages/TermsPage"

function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route element={<AdminGuestRoute />}>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path="/admin/wishlist" element={<WishlistAdminPage />} />
            <Route path="/admin/wishlist/:id" element={<WishlistDetailPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  )
}

export default App
