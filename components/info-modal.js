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
        
        <div className="max-w-3xl mx-auto mt-16">
          <h1 className="text-4xl font-bold mb-8">About Sigil Forge</h1>
          
          <div className="prose dark:prose-invert">
            <p>
              SigilForge is a tool that helps you create and charge magical sigils. Enter your intention, 
              and the app will help you transform it into a unique sigil by removing vowels and repeated letters.
            </p>
            
            <h2>How it works</h2>
            <p>
              1. Enter your intention in plain language<br />
              2. The app will process your text, removing vowels and duplicate letters<br />
              3. Draw your sigil using the remaining letters<br />
              4. The AI will transform your drawing into a mystical, charged version
            </p>

            <h2>Technology</h2>
            <p>This app is powered by:</p>
            <ul>
              <li>Replicate - for running machine learning models</li>
              <li>ControlNet - for generating images from text and scribbles</li>
              <li>Next.js - for the web application framework</li>
              <li>Tailwind CSS - for styling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 