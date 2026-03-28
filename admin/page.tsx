"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Package, Clock, User, Phone, MapPin, ShoppingCart, CheckCircle, AlertCircle, RotateCcw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

function OrderItemsList({ orderId }: { orderId: string }) {
  const firestore = useFirestore();
  
  const itemsQuery = useMemoFirebase(() => {
    if (!firestore || !orderId) return null;
    return collection(firestore, 'orders', orderId, 'orderItems');
  }, [firestore, orderId]);

  const { data: items, isLoading } = useCollection(itemsQuery);

  if (isLoading) {
    return <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> جاري تحميل المنتجات...</div>;
  }

  if (!items || items.length === 0) {
    return <p className="text-xs text-muted-foreground italic">لا توجد تفاصيل للمنتجات</p>;
  }

  return (
    <div className="space-y-2 mt-2">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center bg-white/60 p-2 rounded-md border border-border/40 text-sm">
          <span className="font-medium text-primary">{item.productName || 'منتج'}</span>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs">{item.quantity} كغ</span>
            <span className="font-bold text-accent">{item.unitPrice?.toFixed(2)} د.ت</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch((err) => {
        console.error("Auth error:", err);
      });
    }
  }, [user, isUserLoading, auth]);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'), limit(50));
  }, [firestore, user]);

  const { data: orders, isLoading: isCollectionLoading } = useCollection(ordersQuery);

  const handleUpdateStatus = (orderId: string, newStatus: 'confirmed' | 'pending') => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    
    updateDocumentNonBlocking(orderRef, { status: newStatus });
    
    toast({
      title: newStatus === 'confirmed' ? "تم تأكيد الطلب" : "تم إلغاء التأكيد",
      description: `تم تحديث حالة الطلب بنجاح.`,
    });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    
    deleteDocumentNonBlocking(orderRef);
    
    toast({
      variant: "destructive",
      title: "تم حذف الطلب",
      description: "لقد تمت إزالة الطلب نهائياً من قاعدة البيانات.",
    });
  };

  const isLoading = isUserLoading || isCollectionLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 text-right" dir="rtl">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline text-primary mb-2">إدارة الطلبات</h1>
          <p className="text-muted-foreground text-lg">عرض ومتابعة طلبات الزبائن الواردة من الموقع.</p>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
          <CardTitle className="text-2xl text-muted-foreground">لا يوجد طلبات حالياً</CardTitle>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className={`overflow-hidden border-r-4 transition-all ${order.status === 'confirmed' ? 'border-r-green-500 shadow-md' : 'border-r-accent'}`}>
              <CardHeader className="bg-secondary/10 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className={order.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-accent/10 text-accent border-accent/20'}>
                      {order.status === 'pending' ? 'قيد الانتظار' : order.status === 'confirmed' ? 'مؤكد' : order.status}
                    </Badge>
                    <CardTitle className="text-xl font-headline">طلب #{order.id.slice(-6).toUpperCase()}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1 justify-end">
                    {order.orderDate ? format(new Date(order.orderDate), 'PPP p', { locale: ar }) : 'تاريخ غير معروف'}
                    <Clock className="h-3 w-3" />
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-left ml-4">
                    <span className="text-2xl font-bold text-primary">{order.totalAmount?.toFixed(2) || '0.00'} د.ت</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 h-9"
                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                      >
                        <CheckCircle className="h-4 w-4 ml-1" /> تأكيد
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 h-9"
                        onClick={() => handleUpdateStatus(order.id, 'pending')}
                      >
                        <RotateCcw className="h-4 w-4 ml-1" /> إلغاء
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-destructive hover:bg-destructive/10 h-9"
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-1" /> حذف
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
                <div className="space-y-4 border-l pl-4 border-border/50">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2 justify-end">
                    معلومات العميل <User className="h-4 w-4" />
                  </h4>
                  <div className="space-y-3">
                    <p className="font-medium text-lg">{order.customerName || 'عميل زائر'}</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2 bg-muted/50 p-2 rounded justify-end">
                        <span className="font-mono">{order.customerPhone || 'لا يوجد رقم'}</span>
                        <Phone className="h-4 w-4 text-accent" /> 
                      </p>
                      <p className="flex items-start gap-2 bg-muted/50 p-2 rounded min-h-[60px] justify-end text-right">
                        <span>{order.shippingAddress || 'لا يوجد عنوان'}</span>
                        <MapPin className="h-4 w-4 text-accent mt-1 shrink-0" /> 
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 col-span-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2 justify-end">
                    المنتجات المطلوبة <ShoppingCart className="h-4 w-4" />
                  </h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <OrderItemsList orderId={order.id} />
                    <div className="mt-4 pt-2 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        ID: <span className="font-mono">{order.id}</span>
                      </div>
                      <div>
                        {order.status === 'confirmed' ? (
                          <span className="text-green-600 font-bold">جاهز للتسليم</span>
                        ) : (
                          <span className="text-orange-500 italic">بانتظار المراجعة</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
