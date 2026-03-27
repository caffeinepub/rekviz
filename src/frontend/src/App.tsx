import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminPanel } from "./components/AdminPanel";
import { PublicPage } from "./components/PublicPage";
import { useIsAdmin } from "./hooks/useQueries";

type View = "public" | "admin";

export default function App() {
  const [view, setView] = useState<View>("public");
  const { data: isAdmin } = useIsAdmin();

  const handleEditClick = () => {
    if (isAdmin) setView("admin");
  };

  return (
    <>
      <Toaster />
      {view === "public" ? (
        <PublicPage onEditClick={handleEditClick} />
      ) : (
        <AdminPanel onBack={() => setView("public")} />
      )}
    </>
  );
}
