'use client'; // Đánh dấu đây là Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Khởi tạo QueryClient với useState để đảm bảo nó được tạo ở client-side
export default function QueryClientProviderWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}