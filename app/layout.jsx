import './globals.css';
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata = {
  title: 'LocalLink - Your Service, Your Link',
  description: 'Create a professional profile page and receive booking requests from customers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  );
}
