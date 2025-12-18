import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <section>
    <h2>Page not found</h2>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Go home</Link>
  </section>
);

export default NotFoundPage;
