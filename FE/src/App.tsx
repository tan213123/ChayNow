import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "@/routes/routes";

function App() {
  const routerElements = useRoutes(routes);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      {routerElements}
      <Toaster richColors position="top-right" />
    </Suspense>
  );
}

export default App;
