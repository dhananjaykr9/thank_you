import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ExperienceController from './pages/ExperienceController';
import ParticleBackground from './components/ParticleBackground';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><ExperienceController /></PageWrapper>} />
        <Route path="/friends" element={<PageWrapper><ExperienceController /></PageWrapper>} />
        <Route path="/family" element={<PageWrapper><ExperienceController /></PageWrapper>} />
        <Route path="/relatives" element={<PageWrapper><ExperienceController /></PageWrapper>} />
        <Route path="/special" element={<PageWrapper><ExperienceController /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <ParticleBackground />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
