export default async function uploadFile(sigilDataURI) {
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sigilDataURI }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  
  return data.url;
}