
"use client";

import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Clock, User, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useEffect } from 'react';
import { signInAnonymously } from 'firebase/auth';

export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // لضمان وجود مستخدم (حتى لو مجهول) لتخطي قواعد الحماية أثناء التطوير
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      signInAnonymously(auth).catch(console.error);
    }
  }, [user, isUserLoading, auth]);

  const ordersQuery = useMemoFirebase(() => {
    // نمنع إرسال الاستعلام إذا لم يتوفر مستخدم أو قاعدة بيانات بعد
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), orderBy('orderDate', 'desc'), limit(50));
  }, [firestore, user]);

  const { data: orders, isLoading: isCollectionLoading } = useCollection(ordersQuery);

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
      <div className="mb-10">
        <h1 className="text-4xl font-headline text-primary mb-2">إدارة الطلبات</h1>
        <p className="text-muted-foreground text-lg">عرض ومتابعة طلبات الزبائن الواردة من الموقع.</p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
          <CardTitle className="text-2xl text-muted-foreground">لا يوجد طلبات حالياً</CardTitle>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-r-4 border-r-accent">
              <CardHeader className="bg-secondary/10 flex flex-row items-center justify-between space-y-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-headline">طلب #{order.id.slice(-6).toUpperCase()}</CardTitle>
                    <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="bg-accent/10 text-accent border-accent/20">
                      {order.status === 'pending' ? 'قيد الانتظار' : order.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {order.orderDate ? format(new Date(order.orderDate), 'PPP p', { locale: ar }) : 'تاريخ غير معروف'}
                  </CardDescription>
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-primary">{order.totalAmount?.toFixed(2) || '0.00'} د.ت</span>
                </div>
              </CardHeader>
              <CardContent className="pt-6 grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" /> معلومات العميل
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">{order.customerName || 'عميل زائر'}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {order.customerEmail || 'لا يوجد بريد'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 col-span-2">
                  <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Package className="h-4 w-4" /> تفاصيل المنتجات
                  </h4>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <ul className="divide-y divide-border/50">
                      <li className="py-2 text-sm">
                        عدد المنتجات الفريدة: <span className="font-bold">{order.orderItemIds?.length || 0}</span>
                      </li>
                      <li className="py-2 text-sm text-muted-foreground">
                        رقم العميل التسلسلي: <span className="font-mono text-xs">{order.customerId}</span>
                      </li>
                    </ul>
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
