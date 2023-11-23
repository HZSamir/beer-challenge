import "./globals.css";
import "@mantine/core/styles.css";

import { MantineProvider, ColorSchemeScript } from "@mantine/core";

export const metadata = {
  title: "My app",
  description: "Code challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className="py-4">
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
