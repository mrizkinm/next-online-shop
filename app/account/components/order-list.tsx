'use client';

import { 
  Card, 
  CardContent,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import React, { useState } from "react";
import { Order } from "@/app/types";
import toast from "react-hot-toast";

interface OrderListProps {
  orders: Order[];
}

const Orders: React.FC<OrderListProps> = ({orders}) => {
  const [loading, setLoading] = useState(false);

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'Pending': return 'secondary';
      case 'Processed': return 'default';
      case 'Canceled': return 'destructive';
      default: return 'outline';
    }
  };

  async function handlePayNow(id: number) {
    setLoading(true);
    try {
      const existingTransaction = await checkTransactionStatus(id)
      if (existingTransaction.snapToken) {
        toast.success('Transaction is pending. Redirecting to payment...');
        return snapPay(existingTransaction.snapToken);
      }

      const paymentResponse = await fetch(`/api/order/snap`, {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      
      const paymentData = await paymentResponse.json();

      if (!paymentData.snapToken) {
        throw new Error('Failed to create Snap token');
      }

      snapPay(paymentData.snapToken);
      
    } catch (error) {
      console.error('Error handling payment:', error);
    } finally {
      setLoading(false);
    }
  };

  function snapPay(snapToken: string) {
    if (typeof window !== 'undefined' && window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          toast.success('Payment success!');
          console.log(result);
        },
        onPending: function (result: any) {
          toast.success('Waiting for payment confirmation.');
          console.log(result);
        },
        onError: function (result: any) {
          toast.error('Payment failed.');
          console.log(result);
        },
        onClose: function () {
          console.log('Customer closed the popup without finishing the payment');
        },
      });
    } else {
      throw new Error('Midtrans snap not loaded');
    }
  }

  async function checkTransactionStatus(id: number) {
    const response = await fetch('/api/order/status', {
      method: 'POST',
      body: JSON.stringify({ id })
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch transaction status');
    }
  
    return response.json();
  }

  return (
    <div className="space-y-4">
      {
        orders.length === 0
        ?
          <div className="flex flex-col items-center justify-center h-52 gap-y-4">
            <span className="text-sm text-slate-400">No data available</span>
          </div>
        :
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Order #{order.orderTrxId}</CardTitle>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                  <p className="font-bold text-lg">
                    Total: {formatCurrency(order.totalAmount)}
                  </p>
                </div>
                <div className="flex justify-between gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div 
                            key={item.id} 
                            className="flex justify-between border-b pb-2 last:border-b-0"
                          >
                            <span>{item.product.name}</span>
                            <div className="flex space-x-4">
                              <span>Qty: {item.quantity}</span>
                              <span>{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  {order.status === 'Pending' && (
                    <Button variant="default" size="sm" onClick={() => handlePayNow(order.id)} disabled={loading}>
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export default Orders