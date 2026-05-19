import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { logNavigation } from "@/lib/logger";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Logs from "@/pages/Logs";
import NotFound from "@/pages/NotFound";
import Stage1 from "@/pages/stages/Stage1";
import Stage2 from "@/pages/stages/Stage2";
import Stage3 from "@/pages/stages/Stage3";
import Stage4 from "@/pages/stages/Stage4";
import Stage5 from "@/pages/stages/Stage5";
import Stage6 from "@/pages/stages/Stage6";
import Stage7 from "@/pages/stages/Stage7";
import Stage8 from "@/pages/stages/Stage8";
import Stage9 from "@/pages/stages/Stage9";
import Stage10 from "@/pages/stages/Stage10";
import Stage11 from "@/pages/stages/Stage11";

const queryClient = new QueryClient();

function NavigationLogger() {
  const location = useLocation();
  useEffect(() => {
    logNavigation(location.pathname);
  }, [location.pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <NavigationLogger />
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/stage/1-user-agent" element={<Stage1 />} />
            <Route path="/stage/2-white-text" element={<Stage2 />} />
            <Route path="/stage/3-html-comment" element={<Stage3 />} />
            <Route path="/stage/4-js-dom" element={<Stage4 />} />
            <Route path="/stage/5-metadata" element={<Stage5 />} />
            <Route path="/stage/6-jsonld" element={<Stage6 />} />
            <Route path="/stage/7-css-content" element={<Stage7 />} />
            <Route path="/stage/8-comments-section" element={<Stage8 />} />
            <Route path="/stage/9-reasoning-trap" element={<Stage9 />} />
            <Route path="/stage/10-tool-hijack" element={<Stage10 />} />
            <Route path="/stage/11-persistence" element={<Stage11 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
