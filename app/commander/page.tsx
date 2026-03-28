"use client";

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { PRODUCTS, Product } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Search, ShoppingCart } from 'lucide-react';

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addToCart(product, quantity);
    toast({
      title: "تمت الإضافة!",
      description: `تمت إضافة ${quantity} كغ من ${product.name} إلى السلة.`,
    });
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 border-border/50 text-right overflow-hidden bg-white group min-h-[450px] md:min-h-[480px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2 space-y-1">
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-lg md:text-xl text-primary leading-tight">{product.name}</CardTitle>
          <span className="font-bold text-accent whitespace-nowrap mr-2 text-sm md:text-base">{product.price.toFixed(2)} د.ت</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-0 mt-auto shrink-0">
        <div className="flex items-center justify-between w-full border rounded-md p-1 bg-secondary/5">
          <button 
            className="h-10 w-10 md:h-8 md:w-8 flex items-center justify-center hover:bg-secondary rounded-md transition-colors"
            onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="flex items-center">
            <Input 
              type="number"
              step="0.5"
              min="0.5"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0.5)}
              className="w-14 h-8 border-none text-center focus-visible:ring-0 font-bold bg-transparent p-0 text-base"
            />
            <span className="text-xs font-bold mr-1 text-muted-foreground">كغ</span>
          </div>
          <button 
            className="h-10 w-10 md:h-8 md:w-8 flex items-center justify-center hover:bg-secondary rounded-md transition-colors"
            onClick={() => setQuantity(quantity + 0.5)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button onClick={handleAdd} className="w-full bg-accent hover:bg-accent/90 text-white shadow-sm h-12 md:h-10">
          أضف إلى السلة
        </Button>
      </CardFooter>
    </Card>
  );
}

function CategoryGroupCard({ title, description, products }: { title: string, description: string, products: Product[] }) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<string, number>>(
    products.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  const handleAdd = (product: Product) => {
    const qty = quantities[product.id] || 1;
    addToCart(product, qty);
    toast({
      title: "تمت الإضافة!",
      description: `تمت إضافة ${qty} كغ من ${product.name} إلى السلة.`,
    });
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0.5, (prev[id] || 1) + delta)
    }));
  };

  const handleManualChange = (id: string, value: string) => {
    const val = parseFloat(value) || 0.5;
    setQuantities(prev => ({
      ...prev,
      [id]: val
    }));
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50 text-right bg-white group min-h-[450px] md:min-h-[480px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden shrink-0">
        <Image
          src={products[0].imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="font-headline text-lg md:text-xl text-primary leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pb-4">
        <p className="text-[11px] md:text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="p-3 md:p-2 rounded-lg bg-secondary/10 border border-border/30 transition-colors hover:bg-secondary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs md:text-[11px]">{product.name}</span>
                <span className="text-accent font-bold text-xs md:text-[11px]">{product.price.toFixed(2)} د.ت</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center border rounded-md bg-white/80">
                  <button 
                    className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center hover:bg-secondary rounded-md"
                    onClick={() => updateQty(product.id, -0.5)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="flex items-center px-1">
                    <Input 
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={quantities[product.id]}
                      onChange={(e) => handleManualChange(product.id, e.target.value)}
                      className="w-10 h-6 border-none text-center focus-visible:ring-0 text-xs md:text-[10px] p-0 font-bold bg-transparent"
                    />
                    <span className="text-xs md:text-[10px] font-bold mr-0.5 text-muted-foreground">كغ</span>
                  </div>
                  <button 
                    className="h-8 w-8 md:h-6 md:w-6 flex items-center justify-center hover:bg-secondary rounded-md"
                    onClick={() => updateQty(product.id, 0.5)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <Button onClick={() => handleAdd(product)} size="sm" className="bg-accent hover:bg-accent/90 h-8 md:h-7 text-xs md:text-[10px] px-3 md:px-2">
                  <ShoppingCart className="h-3 w-3 ml-1" />
                  أضف
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function CommanderPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const groupedProducts = useMemo(() => {
    const filtered = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groups: Record<string, Product[]> = {};
    filtered.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [searchQuery]);

  const sortedCategories = useMemo(() => {
    const categories = Object.keys(groupedProducts);
    
    // Sort logic to prioritize categories by size but keep special ones at the end
    return categories.sort((a, b) => {
      if (a === 'بالعسل') return 1;
      if (b === 'بالعسل') return -1;
      if (a === 'بسكويت') {
        if (b === 'بالعسل') return -1;
        return 1;
      }
      if (b === 'بسكويت') {
        if (a === 'بالعسل') return 1;
        return -1;
      }
      return groupedProducts[b].length - groupedProducts[a].length;
    });
  }, [groupedProducts]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div className="max-w-2xl text-right">
          <h1 className="text-3xl md:text-4xl font-headline text-primary mb-3 md:mb-4">اطلب ألذ حلوياتنا</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            اختر حلوياتك المفضلة بالوزن. جميع طلباتنا يتم تحضيرها عند الطلب لضمان نضارة تامة.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن منتج..." 
            className="pr-10 text-right bg-white shadow-sm h-12 md:h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {sortedCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 items-stretch">
          {sortedCategories.map((category) => {
            if (category === 'بالعسل') {
              return (
                <CategoryGroupCard 
                  key={category}
                  title="بقلاوة تقليدية" 
                  description="طبقات رقيقة محشوة بالمكسرات ومسقية بالعسل. اختر وزنك المفضل:"
                  products={groupedProducts[category]} 
                />
              );
            }
            if (category === 'بسكويت') {
              return (
                <CategoryGroupCard 
                  key={category}
                  title="غريبة تونسية" 
                  description="بسكويت تقليدي يذوب في الفم، مصنوع بدقة. اختر وزنك المفضل:"
                  products={groupedProducts[category]} 
                />
              );
            }
            return groupedProducts[category].map((product) => (
              <ProductCard key={product.id} product={product} />
            ));
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">لم يتم العثور على أي منتج لـ "{searchQuery}"</p>
          <Button variant="link" onClick={() => setSearchQuery('')} className="text-accent text-lg">
            عرض كل المنتجات
          </Button>
        </div>
      )}
    </div>
  );
}
