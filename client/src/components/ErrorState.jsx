const ErrorState = ({ message = 'Something went wrong' }) => (
  <div className="error-state">
    <p>{message}</p>
  </div>
);

export default ErrorState;
