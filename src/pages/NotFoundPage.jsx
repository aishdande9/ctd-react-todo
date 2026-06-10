import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <section>
      <h2>404 - Page Not Found</h2>

      <p>
        Sorry, the page you are looking for does not exist.
      </p>

      <nav>
        <ul>
          <li>
            <Link to="/todos">Todos</Link>
          </li>

          <li>
            <Link to="/profile">Profile</Link>
          </li>

          <li>
            <Link to="/">Home</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default NotFoundPage;