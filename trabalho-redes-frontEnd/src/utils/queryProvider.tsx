"use client"

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { queryClient } from "./queryClient";

type props = {
    children: ReactNode;
}

export const QueryProvider = ({ children }: props) => {
    //const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            { children }

            {/* Componente para ajudar no desenvolvimento */}
            <ReactQueryDevtools
                initialIsOpen={false}
                position="bottom"
            />
        </QueryClientProvider>
    );
};