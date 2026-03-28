"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, Loader2, User, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser, useAuth } from '@/firebase';
import { collection, doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function PanierPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const auth = useAuth();

  // Form state
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const handleCheckout = async () => {
    if (!firestore || !auth) return;
    
    if (!customerData.name || !customerData.phone || !customerData.address) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة",
        description: "يرجى إدخال الاسم، رقم الهاتف وعنوان التوصيل لإتمام الطلب.",
      });
      return;
    }

    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(customerData.phone)) {
      toast({
        variant: "destructive",
        title: "رقم هاتف غير صحيح",
        description: "يجب أن يتكون رقم الهاتف من 8 أرقام بالضبط.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let currentUser = user;
      if (!currentUser) {
        const userCredential = await signInAnonymously(auth);
        currentUser = userCredential.user;
      }

      const orderRef = doc(collection(firestore, 'orders'));
      const orderId = orderRef.id;

      const orderData = {
        id: orderId,
        orderDate: new Date().toISOString(),
        createdAt: serverTimestamp(),
        totalAmount: totalPrice,
        status: 'pending',
        customerId: currentUser.uid,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        shippingAddress: customerData.address,
        customerEmail: 'guest@dhawa9ni.tn',
        orderItemIds: items.map(item => item.product.id)
      };

      await setDoc(orderRef, orderData).catch(async (e) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: orderRef.path,
          operation: 'create',
          requestResourceData: orderData
        }));
        throw e;
      });

      const batch = writeBatch(firestore);
      items.forEach((item) => {
        const itemRef = doc(collection(firestore, 'orders', orderId, 'orderItems'));
        batch.set(itemRef, {
          id: itemRef.id,
          orderId: orderId,
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          unitPrice: item.product.price,
          customerId: currentUser.uid
        });
      });

      await batch.commit();

      setIsCheckingOut(true);
      toast({
        title: "تم إرسال الطلب بنجاح!",
        description: "لقد تلقينا طلبكم وهو قيد المعالجة.",
      });

      setTimeout(() => {
        clearCart();
      }, 2000);
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "فشل إرسال الطلب",
        description: "حدث خطأ أثناء معالجة طلبك.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center animate-in fade-in duration-500">
        <div className="max-w-md mx-auto space-y-6">
          <div className="bg-accent/10 p-6 rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto text-accent">
            <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <h2 className="text-2xl md:text-3xl font-headline text-primary">شكراً لطلبكم!</h2>
          <p className="text-muted-foreground text-sm md:text-base">
            لقد تلقينا طلبكم وهو قيد التحضير حالياً. ستتلقون مكالمة تأكيد قريباً.
          </p>
          <Link href="/">
            <Button className="bg-primary mt-6">العودة للرئيسية</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-2xl md:text-3xl font-headline text-primary mb-4">سلة التسوق فارغة</h2>
        <p className="text-muted-foreground mb-8">
          لم تقم بإضافة أي حلويات لذيذة إلى سلتك بعد.
        </p>
        <Link href="/commander">
          <Button className="bg-accent hover:bg-accent/90">تصفح المتجر</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 text-right" dir="rtl">
      <h1 className="text-3xl md:text-4xl font-headline text-primary mb-6 md:mb-8">سلة التسوق</h1>

      <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Cart Items */}
          <div className="space-y-6">
            <div className="hidden md:grid grid-cols-12 text-sm font-bold text-muted-foreground pb-4 border-b">
              <div className="col-span-6">المنتج</div>
              <div className="col-span-2 text-center">السعر</div>
              <div className="col-span-2 text-center">الكمية</div>
              <div className="col-span-2 text-left">الإجمالي</div>
            </div>

            {items.map((item) => (
              <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-6 border-b border-border/50">
                <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                  <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-primary text-sm md:text-base">{item.product.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-destructive hover:underline flex items-center mt-2 p-1"
                    >
                      <Trash2 className="h-3 w-3 ml-1" /> حذف
                    </button>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-2 text-right md:text-center text-sm">
                  <span className="md:hidden font-bold ml-2 text-muted-foreground">سعر الكيلو:</span>
                  {item.product.price.toFixed(2)} د.ت
                </div>

                <div className="col-span-12 md:col-span-2 flex justify-start md:justify-center">
                  <div className="flex items-center border rounded-md bg-white">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 0.5)}
                      className="h-10 w-10 md:h-8 md:w-8 flex items-center justify-center hover:bg-muted"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="flex items-center px-1">
                      <Input 
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, parseFloat(e.target.value) || 0.5)}
                        className="w-12 h-8 border-none text-center focus-visible:ring-0 text-sm font-bold p-0"
                      />
                      <span className="text-[10px] font-bold mr-1 text-muted-foreground">كغ</span>
                    </div>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 0.5)}
                      className="h-10 w-10 md:h-8 md:w-8 flex items-center justify-center hover:bg-muted"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-2 text-left font-bold text-primary text-base md:text-lg">
                  <span className="md:hidden ml-2 text-xs text-muted-foreground font-normal">المجموع:</span>
                  {(item.product.price * item.quantity).toFixed(2)} د.ت
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Form */}
          <div className="bg-secondary/10 p-5 md:p-6 rounded-xl border border-border/50 space-y-6">
            <h2 className="text-xl md:text-2xl font-headline text-primary flex items-center gap-2">
              <MapPin className="h-5 w-5 text-accent" /> معلومات التوصيل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">الاسم الكامل <User className="h-3 w-3" /></Label>
                <Input 
                  id="name" 
                  placeholder="الاسم واللقب" 
                  className="h-12 md:h-10"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">رقم الهاتف (8 أرقام) <Phone className="h-3 w-3" /></Label>
                <Input 
                  id="phone" 
                  placeholder="8 أرقام تونسية" 
                  maxLength={8}
                  className="h-12 md:h-10"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({...customerData, phone: e.target.value.replace(/\D/g, '')})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="flex items-center gap-1">عنوان التوصيل <MapPin className="h-3 w-3" /></Label>
                <Textarea 
                  id="address" 
                  placeholder="الشارع، المدينة، الرمز البريدي إن وجد..." 
                  className="min-h-[100px] text-base"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
            <Link href="/commander" className="text-accent hover:underline flex items-center text-sm font-bold">
              العودة للتسوق <ArrowRight className="h-4 w-4 mr-2" />
            </Link>
            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-white hover:bg-destructive text-xs transition-colors h-10">
              تفريغ السلة
            </Button>
          </div>
        </div>

        <div className="bg-secondary/30 p-6 md:p-8 rounded-xl h-fit border border-border sticky top-24">
          <h2 className="text-xl md:text-2xl font-headline text-primary mb-6">ملخص الطلب</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span className="font-bold">{totalPrice.toFixed(2)} د.ت</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">التوصيل</span>
              <span className="text-green-600 font-bold">مجاني</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-primary">
              <span>الإجمالي</span>
              <span>{totalPrice.toFixed(2)} د.ت</span>
            </div>
          </div>

          <Button 
            onClick={handleCheckout} 
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent/90 text-white h-14 text-lg rounded-full shadow-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : 'تأكيد الطلب'}
          </Button>
          
          <p className="text-[10px] text-muted-foreground mt-4 text-center leading-relaxed">
            بالنقر على تأكيد، سيتم إرسال طلبكم وسنتواصل معكم هاتفياً لتأكيد العنوان وموعد التسليم.
          </p>
        </div>
      </div>
    </div>
  );
}
