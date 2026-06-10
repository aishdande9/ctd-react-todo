import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Log Off
    </button>
  );
}

export default Logoff;