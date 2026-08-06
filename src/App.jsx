import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { SplashScreen } from './components/layout/SplashScreen';
import { RateLimitScreen } from './components/layout/RateLimitScreen';

// Lazy-loaded pages — each becomes its own JS chunk (code splitting)
const AdminApp     = lazy(() => import('./admin/AdminApp').then(m => ({ default: m.AdminApp })));
const Home         = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About        = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Services     = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Projects     = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const ProjectDetail= lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Team         = lazy(() => import('./pages/Team').then(m => ({ default: m.Team })));
const TeamDetail   = lazy(() => import('./pages/TeamDetail').then(m => ({ default: m.TeamDetail })));
const Careers      = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const JobDetail    = lazy(() => import('./pages/JobDetail').then(m => ({ default: m.JobDetail })));
const Blog         = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const BlogDetail   = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const Contact      = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Consultation = lazy(() => import('./pages/Consultation').then(m => ({ default: m.Consultation })));

// Minimal full-screen spinner shown while a lazy chunk loads
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 border-4 border-brand-green/30 border-t-brand-green rounded-full animate-spin" />
    </div>
  );
}

// Scroll to top helper on page transitions
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top if there is no hash in the URL (which we handle in specific pages)
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RateLimitScreen />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Admin Panel ── completely separate layout, no Navbar/Footer */}
          <Route path="/osi-console/*" element={<AdminApp />} />

          {/* ── Public Marketing Site ── */}
          <Route
            path="/*"
            element={
              <>
                <SplashScreen />
                <ScrollToTop />
                <div className="flex flex-col min-h-screen bg-white">
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/team" element={<Team />} />
                      <Route path="/team/:id" element={<TeamDetail />} />
                      <Route path="/careers" element={<Careers />} />
                      <Route path="/careers/:id" element={<JobDetail />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/consultation" element={<Consultation />} />
                    </Routes>
                  </main>
                  <WhatsAppButton />
                  <Footer />
                </div>
              </>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
