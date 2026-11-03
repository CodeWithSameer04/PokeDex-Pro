import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { PokedexPage } from './pages/PokedexPage';
import { PokemonDetailPage } from './pages/PokemonDetailPage';
import { TypesPage } from './pages/TypesPage';
import { TypeDetailPage } from './pages/TypeDetailPage';
import { MovesPage } from './pages/MovesPage';
import { MoveDetailPage } from './pages/MoveDetailPage';
import { AbilitiesPage } from './pages/AbilitiesPage';
import { AbilityDetailPage } from './pages/AbilityDetailPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { MoveCheckerPage } from './pages/MoveCheckerPage';
import { BattleGuidePage } from './pages/BattleGuidePage';
import { LearnPage } from './pages/LearnPage';
import { QuizPage } from './pages/QuizPage';
import { AboutPage } from './pages/AboutPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-darkbg-900 text-slate-100 transition-colors">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1 pt-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pokedex" element={<PokedexPage />} />
          <Route path="/pokemon/:idOrName" element={<PokemonDetailPage />} />
          <Route path="/types" element={<TypesPage />} />
          <Route path="/types/:typeName" element={<TypeDetailPage />} />
          <Route path="/moves" element={<MovesPage />} />
          <Route path="/moves/:idOrName" element={<MoveDetailPage />} />
          <Route path="/abilities" element={<AbilitiesPage />} />
          <Route path="/abilities/:idOrName" element={<AbilityDetailPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/move-checker" element={<MoveCheckerPage />} />
          <Route path="/battle-guide" element={<BattleGuidePage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};
