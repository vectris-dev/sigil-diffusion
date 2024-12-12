export function extractIntention(prompt) {
  // Use a regular expression to find the text between "symbolizing the intention: \"" and the closing quote
  const match = prompt.match(/symbolizing the intention: "(.*?)"/);
  return match ? match[1] : null; // Return the captured group or null if not found
}
