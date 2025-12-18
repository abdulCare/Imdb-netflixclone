import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setFormError('');
    try {
      await login(values);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error) {
      setFormError(error.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </label>
        <label>
          Password
          <input type="password" {...register('password')} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </label>
        {formError && <p className="error">{formError}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
};

export default LoginPage;
