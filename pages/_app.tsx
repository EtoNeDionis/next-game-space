import '../styles/globals.css'

import { AppProps } from "next/app";

export default function App({ pageProps, Component }: AppProps) {
    return <Component {...pageProps} />;
}
