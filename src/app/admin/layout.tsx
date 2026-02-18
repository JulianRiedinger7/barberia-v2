import AdminSidebar from "@/components/admin/AdminSidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-background text-foreground">
                <AdminSidebar />
                <main className="flex-1 md:ml-72 p-4 md:p-8 relative w-full">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}
