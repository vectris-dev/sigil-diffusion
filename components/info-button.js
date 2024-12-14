import { HelpCircle } from 'lucide-react';

export function InfoButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-16 p-2 rounded-full bg-background-light dark:bg-background-dark text-primary-light dark:text-primary-dark hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors z-50"
    >
      <HelpCircle size={24} />
    </button>
  );
} 