import './global.css';
import '@myapp/styles';
import { AuthStateProvider } from '@myapp/stores';
import { ModalProvider, ToastProvider } from '@myapp/ui';

export const metadata = {
  title: 'My App',
  description: 'My App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthStateProvider />
        {children}
        <ToastProvider />
        <ModalProvider />
      </body>
    </html>
  );
}
