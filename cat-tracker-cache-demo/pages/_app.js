import { SWRConfig } from "swr";
import { fetcher } from "../../api-wrapper.mjs";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
