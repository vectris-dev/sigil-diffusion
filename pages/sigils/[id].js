import Output from "components/output";
import Head from "next/head";
import pkg from "../../package.json";
import { extractIntention } from "lib/intention";
import { useRouter } from "next/router";

export default function Sigil({ prediction, baseUrl }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Head>
        <title>
          {prediction && `${extractIntention(prediction.input.prompt)} - `}
          {pkg.appName}
        </title>
        <meta name="description" content={extractIntention(prediction.input.prompt)} />
        <meta property="og:title" content={pkg.appName} />
        <meta property="og:description" content={extractIntention(prediction.input.prompt)} />
        <meta
          property="og:image"
          content={`${baseUrl}/api/og?id=${prediction.id}`}
        />
      </Head>
      <main className="container max-w-[1024px] mx-auto p-5 flex justify-center items-center min-h-screen">
        <Output prediction={prediction} onReset={() => router.push("/")} />
      </main>
    </div>
  );
}

// Use getServerSideProps to force Next.js to render the page on the server,
// so the OpenGraph meta tags will have the proper URL at render time.
export async function getServerSideProps({ req }) {
  // Hack to get the protocol and host from headers:
  // https://github.com/vercel/next.js/discussions/44527
  const protocol = req.headers.referer?.split("://")[0] || "http";
  const predictionId = req.url.split("/")[2];
  const baseUrl = `${protocol}://${req.headers.host}`;
  const response = await fetch(`${baseUrl}/api/predictions/${predictionId}`);
  const prediction = await response.json();
  return { props: { baseUrl, prediction } };
}