"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apolloClient";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-(--color-backgroundgrey)`}>
        <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
      </body>
    </html>
  );
}
