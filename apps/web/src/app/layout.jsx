import './global.css';
import '@myapp/styles';

export const metadata = {
  title: 'My App',
  description: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
