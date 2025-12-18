import AppRoutes from './routes/AppRoutes';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
