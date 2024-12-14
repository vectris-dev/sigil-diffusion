export default function PrimaryButton({ type = "button", disabled, onClick, children }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-md text-small px-5 py-3
        mx-auto block
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-opacity duration-200 mt-6
        bg-primary-light dark:bg-primary-dark text-background-light dark:text-background-dark
      `}
    >
      {children}
    </button>
  );
} 