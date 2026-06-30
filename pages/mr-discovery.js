import dynamic from "next/dynamic";
import Head from "next/head";

const MRBusinessApp = dynamic(() => import("../components/MRBusinessApp"), { ssr: false });

export default function MRDiscoveryPage() {
  return (
    <>
      <Head>
        <title>MR Business Discovery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <MRBusinessApp />
    </>
  );
}
