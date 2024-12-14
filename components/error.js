export default function Error({ error, onReset }) {
  if (!error) return null;

  return (
    <div className="mx-auto w-full text-center">
      <p className="bold text-red-500 pb-5">{error}</p>
      <button 
        onClick={onReset}
        className="text-primary-light dark:text-primary-dark underline"
      >
        Try Again
      </button>
    </div>
  );
}
