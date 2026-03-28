import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, Clock, Heart } from 'lucide-react';
import { PRODUCTS } from '@/lib/products';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-kaak-warka');
  // اختيار منتجات متنوعة للعرض في الصفحة الرئيسية لضمان مظهر متناسق
  const featuredProducts = [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4]];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[85vh] flex items-center justify-center overflow-hidden">
        <Image
          src={heroImage?.imageUrl || ''}
          alt="حلويات تونسية تقليدية"
          fill
          className="object-cover brightness-[0.6] md:brightness-[0.7]"
          priority
          data-ai-hint="Tunisian pastry"
        />
        <div className="container relative z-10 px-4 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline mb-4 md:mb-6 drop-shadow-lg leading-tight">
            فن الحلويات <br /> التونسية التقليدية
          </h1>
          <p className="text-lg md:text-2xl mb-8 md:mb-10 max-w-2xl mx-auto drop-shadow-md opacity-90 leading-relaxed px-4">
            اكتشف أصالة حلوياتنا الحرفية المتوارثة عبر الأجيال بمذاق لا ينسى.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-6">
            <Link href="tel:+21697527009" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white px-8 h-14 md:h-16 text-lg rounded-full shadow-xl">
                اتصل بنا
              </Button>
            </Link>
            <Link href="/commander" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary px-8 h-14 md:h-16 text-lg rounded-full shadow-xl">
                اطلب الآن
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 md:p-5 bg-primary/10 rounded-full text-primary">
                <Heart className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-headline font-bold">صنع منزلي</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">يتم تشكيل كل قطعة يدوياً بشغف ودقة تامة لضمان الجودة.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 md:p-5 bg-primary/10 rounded-full text-primary">
                <Star className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-headline font-bold">مكونات فاخرة</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">نستخدم فقط أفضل أنواع اللوز والفستق والمياه الزهرية النقية.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 md:p-5 bg-primary/10 rounded-full text-primary">
                <Clock className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-xl md:text-2xl font-headline font-bold">نضارة مضمونة</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">يتم التحضير عند الطلب لضمان تجربة تذوق مثالية وطازجة دائماً.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14 gap-6">
          <div className="max-w-xl text-right">
            <h2 className="text-3xl md:text-5xl font-headline text-primary mb-3 md:mb-4">منتجاتنا المختارة</h2>
            <p className="text-muted-foreground text-base md:text-lg">
              تشكيلة من أفضل إبداعاتنا المفضلة لدى زبائننا الذواقة.
            </p>
          </div>
          <Link href="/commander" className="text-accent font-bold flex items-center hover:underline group text-lg">
            عرض الكل <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {featuredProducts.map((product) => (
            <Link key={product.id} href="/commander" className="group">
              <Card className="border-none shadow-none bg-transparent overflow-hidden">
                <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden mb-5">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-0 text-right">
                  <h3 className="text-2xl md:text-3xl font-headline text-primary group-hover:text-accent transition-colors">{product.name}</h3>
                  <p className="text-muted-foreground text-sm md:text-base line-clamp-2 mt-2 leading-relaxed">{product.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 text-center container mx-auto px-6 bg-primary/5 rounded-[2rem] md:rounded-[4rem] my-12 md:my-20">
        <h2 className="text-3xl md:text-5xl font-headline text-primary mb-6 leading-tight">جاهز للانغماس في عالم النكهات؟</h2>
        <p className="text-muted-foreground text-lg md:text-2xl mb-10 md:mb-14 max-w-2xl mx-auto leading-relaxed">
          دلل نفسك أو قدم صندوق هدايا لا ينسى لأحبائك. خدمة التوصيل متوفرة في كل أنحاء تونس.
        </p>
        <Link href="/commander">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-white px-12 h-16 md:h-20 text-xl md:text-2xl rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95">
            اطلب عبر الإنترنت الآن
          </Button>
        </Link>
      </section>
    </div>
  );
}
