"use client";

import PrimaryButton from "./primary-button";
export default function IntentionForm({ intention, setIntention, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div className="text-center text-xl mb-6">Write your intention</div>
        <input
          type="text"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Enter your intention"
          className="w-full px-4 py-2 text-lg rounded-md focus:outline-none focus:ring-2"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <PrimaryButton type="submit">Prepare</PrimaryButton>
      </form>
    </div>
  );
}
