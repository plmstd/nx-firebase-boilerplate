import './global.css';
import '@myapp/styles';
import { ModalProvider } from '@myapp/ui';

export const metadata = {
  title: 'My App',
  description: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ModalProvider />
      </body>
    </html>
  );
}
