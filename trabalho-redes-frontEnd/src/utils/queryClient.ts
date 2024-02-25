import { QueryClient } from "@tanstack/react-query";

// Exporto e seto configurações padrões para o QueryClient
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        }
    }
});