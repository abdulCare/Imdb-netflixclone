import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import DetailsPage from '../pages/DetailsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import FavoritesPage from '../pages/FavoritesPage';
import WatchlistsPage from '../pages/WatchlistsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/search" element={<SearchPage />} />
    <Route path="/details/:type/:id" element={<DetailsPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute />}>
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/watchlists" element={<WatchlistsPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
