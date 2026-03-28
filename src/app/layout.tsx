
import type { Metadata} from 'next';
import './globals.css';
import {CartProvider} from '@/components/cart-context';
import {Toaster} from '@/components/ui/toaster';
import {Navbar} from '@/components/navbar';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'dhawa9ni.tn | حلويات تونسية تقليدية',
  description: 'حلويات تونسية تقليدية فاخرة من dhawa9ni.tn: كعك ورقة، بقلاوة، والمزيد. مصنوعة يدوياً بكل حب وإتقان.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-arabic antialiased flex flex-col min-h-screen">
        <FirebaseClientProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster />
            <footer className="bg-primary text-primary-foreground py-12">
              <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-3xl font-headline mb-4 tracking-tight">
                    <span className="text-white">dhawa9ni</span>
                    <span className="text-accent italic">.tn</span>
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    نقدم لكم المذاق الأصيل للتقاليد التونسية. صناعة يدوية بأجود المكونات وبراعة الأجداد.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 border-b border-primary-foreground/20 pb-2 inline-block">روابط سريعة</h4>
                  <ul className="space-y-2 opacity-80">
                    <li><a href="/" className="hover:text-accent transition-colors">الرئيسية</a></li>
                    <li><a href="/commander" className="hover:text-accent transition-colors">اطلب الآن</a></li>
                    <li><a href="/panier" className="hover:text-accent transition-colors">سلة التسوق</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 border-b border-primary-foreground/20 pb-2 inline-block">اتصل بنا</h4>
                  <div className="space-y-2 opacity-80 text-sm">
                    <p>تونس، تونس العاصمة</p>
                    <p>contact@dhawa9ni.tn</p>
                    <p dir="ltr" className="text-right">+216 97 527 009</p>
                  </div>
                </div>
              </div>
              <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/20 text-center text-xs opacity-60">
                © {new Date().getFullYear()} dhawa9ni.tn. جميع الحقوق محفوظة. تم التطوير بكل حب للتقاليد.
              </div>
            </footer>
          </CartProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
