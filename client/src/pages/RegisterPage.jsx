import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6)
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: zodResolver(schema) });
  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const onSubmit = async (values) => {
    setFormError('');
    if (values.password !== values.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    try {
      await registerUser({ email: values.email, password: values.password });
      navigate('/', { replace: true });
    } catch (error) {
      setFormError(error.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-page">
      <h2>Create Account</h2>
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
        <label>
          Confirm Password
          <input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        </label>
        {password && confirmPassword && password !== confirmPassword && (
          <p className="error">Passwords must match</p>
        )}
        {formError && <p className="error">{formError}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Register'}
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default RegisterPage;
