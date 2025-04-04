import './globals.css';

export const metadata = {
  title: 'Multi-Tenant ERP System',
  description: 'A comprehensive ERP system for hemp flower wholesale brokerage businesses',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
