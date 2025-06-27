import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import moment from 'moment';
import { Toaster } from '@/components/ui/toaster';
import PageLayout from '@/components/PageLayout';
import AuthProvider from '@/components/AuthProvider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'MCC Tools',
  description: 'Music City Canada Tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}
      >
        <AuthProvider>
          <div className="flex flex-1 overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="w-full overflow-auto">
              {/* <PageHeader /> */}
              <PageLayout>{children}</PageLayout>
            </div>
          </div>
          <footer className="bg-black text-white p-4">
            © {moment().format('YYYY')} Music City Canada | Developed and
            maintained by Hector Robles
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
