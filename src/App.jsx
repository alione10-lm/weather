import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Weather from "./Weather";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="p-4 w-screen bg-indigo-50 min-h-screen  ">
      <Toaster position="top-center" />
      <QueryClientProvider client={queryClient}>
        <Weather />
      </QueryClientProvider>
    </div>
  );
}

export default App;
