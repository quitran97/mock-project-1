import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import axios from 'axios'

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  })

  return (
  <QueryClientProvider client={queryClient}>
    <Component {...pageProps} />
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProvider>
  )
}

export default MyApp
