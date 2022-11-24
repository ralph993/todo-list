import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: Infinity,
			retry: false,
		},
	},
});

export default function ReactQueryProvider({ children }) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
