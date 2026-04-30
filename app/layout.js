import "./globals.css";
export const metadata = {
  title: "Orbit",
  description: "Social Media Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
