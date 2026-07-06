import './global.css';
import '@myapp/styles';
import { ModalProvider, ToastProvider } from '@myapp/ui';

export const metadata = {
  title: 'My App',
  description: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
        <ModalProvider />
      </body>
    </html>
  );
}
