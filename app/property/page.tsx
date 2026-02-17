import { PropertyManagementPage } from "@/components/property/property-management-page"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function Page() {
  return (
    <ProtectedRoute>
      <PropertyManagementPage />
    </ProtectedRoute>
  )
}
