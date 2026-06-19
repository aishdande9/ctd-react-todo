import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import styles from "./LoginPage.module.css";

function LoginPage() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);



  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAuthError('');
    setIsLoggingOn(true);

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  };
    return (
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h2>Log In</h2>
    
        {authError && <p className={styles.errorMessage}>{authError}</p>}
    
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
    
        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
    
        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? 'Logging in...' : 'Log On'}
        </button>
      </form>
    );
  
}

export default LoginPage;