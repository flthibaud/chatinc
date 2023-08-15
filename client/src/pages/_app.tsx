import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { wrapper } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useStore } from "react-redux";

function App({ Component, pageProps }: AppProps) {
  const store: any = useStore();
  return (
    <PersistGate persistor={store.__persistor}>
      <Component {...pageProps} />
    </PersistGate>
  )
}

export default wrapper.withRedux(App);
