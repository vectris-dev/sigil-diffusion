import { X } from 'lucide-react';

export function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark bg-opacity-95 dark:bg-opacity-95 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="max-w-3xl mx-auto mt-16 prose">
          <h2 className="text-2xl font-bold mb-6">What is this thing?</h2>
          <p>
            SigilForge is a tool that helps you create and charge magical sigils. Enter your intention, and the app will help you transform it into a unique sigil by removing vowels and repeated letters. Draw your sigil using the remaining letters, and watch as AI transforms it into a mystically charged version.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-6">What&apos;s a Sigil?</h2>
          <p>
            Sigils are symbols created for a specific magical purpose. Their use dates back to medieval grimoires and occult practices, but they were popularized in their modern form by Austin Osman Spare in the early 20th century. Spare developed a method of creating sigils by writing out an intention, removing repeated letters and vowels, and combining the remaining letters into a symbolic design.
          </p>
          <p>
            The process of creating a sigil is believed to help program your subconscious mind with your intention, while the act of charging it (traditionally through meditation, ritual, or other means) is thought to activate its magical properties.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-6">Who made this?</h2>
          <p>
            SigilForge was created by <a href="https://vectr.is/" target="_blank" rel="noopener noreferrer">Vectris</a>
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-6">Why make this?</h2>
          <p>
            This project is an experiment in human-machine collaboration for magical practices. By combining traditional sigil creation methods with artificial intelligence, we're exploring how modern technology can enhance ancient magical techniques.
          </p>
          <p>
            The AI&apos;s interpretation of your sigil draws upon the collective visual language of the internet, infusing your personal intention with the aggregate energy of millions of images and symbols. This creates a unique synthesis of individual will and collective consciousness, potentially amplifying the sigil&apos;s power through technological means.
          </p>
        </div>
      </div>
    </div>
  );
} 