import { useAuth } from '../contexts/AuthContext.jsx';
import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && <Logoff />}
      <Navigation />
      
    </header>
  );
}

export default Header;