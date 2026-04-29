import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import BrowsePage from './pages/BrowsePage';
import MovieDetailPage from './pages/MovieDetailPage';
import TVDetailPage from './pages/TVDetailPage';
import WatchPage from './pages/WatchPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {/* Ambient background orbs */}
        <div className="ambient-orb ambient-orb--purple" />
        <div className="ambient-orb ambient-orb--cyan" />
        <div className="ambient-orb ambient-orb--pink" />

        <Routes>
          {/* Watch page has no navbar — fullscreen experience */}
          <Route path="/watch/:type/:id" element={<WatchPage />} />
          <Route path="/watch/:type/:id/:season/:episode" element={<WatchPage />} />

          {/* All other pages share the navbar */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/browse/:type" element={<BrowsePage />} />
                    <Route path="/movie/:id" element={<MovieDetailPage />} />
                    <Route path="/tv/:id" element={<TVDetailPage />} />
                  </Routes>

                  {/* Footer */}
                  <footer className="footer">
                    <div className="footer__brand">AMMU</div>
                    <p>Your premium streaming experience. Powered by TMDB.</p>
                  </footer>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
