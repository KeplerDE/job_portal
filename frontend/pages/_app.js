import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <AuthProvider>
      <JobProvider>
        {isClient ? <Component {...pageProps} /> : null}
      </JobProvider>
    </AuthProvider>
  );
}

export default MyApp;
