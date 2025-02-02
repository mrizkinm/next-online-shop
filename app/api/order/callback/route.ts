import midtransClient from 'midtrans-client';
import db from '@/lib/db';
import { NextResponse } from 'next/server';

const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verifikasi data dari Midtrans
    const { order_id, transaction_status, fraud_status } = body;

    // let order_id = 'TRX-1737731786289';
    // let transaction_status = 'cancel';
    // let fraud_status = 'accept';

    // Pastikan data dari Midtrans valid
    const transactionStatus = await apiClient.transaction.status(order_id);
    if (transactionStatus.order_id !== order_id) {
      return NextResponse.json({ errors: 'Order not found' }, { status: 404 });
    }

    const orders = await db.order.findUnique({
      where: { orderTrxId: order_id },
      include: {
        items: true
      }
    });

    if (!orders) {
      return NextResponse.json({ errors: 'Order not found' }, { status: 404 });
    }

    // Perbarui status pembayaran di database
    let status = '';
    if (transaction_status === 'capture') {
      // Capture hanya untuk kartu kredit
      status = fraud_status === 'accept' ? 'Processed' : 'Fraud';
      if (status == 'Processed') {
        await updateSettlementProduct(orders.id, status);
      }
    } else if (transaction_status === 'settlement') {
      status = 'Processed';
      await updateSettlementProduct(orders.id, status);
    } else if (transaction_status === 'pending') {
      status = 'Pending';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
      status = 'Canceled';
      const result = await updateProductStockFromOrder(orders.id, orders.items, status);
      if (!result.success) {
        return NextResponse.json({ errors: result.error }, { status: result.httpStatus });
      }
    } else if (transaction_status === 'deny') {
      status = 'Canceled';
      const result = await updateProductStockFromOrder(orders.id, orders.items, status);
      if (!result.success) {
        return NextResponse.json({ errors: result.error }, { status: result.httpStatus });
      }
    }

    return NextResponse.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('Error processing callback:', error);
    return NextResponse.json({ errors: 'Failed to process callback' }, { status: 500 });
  }
}

async function updateSettlementProduct(id: number, status: string) {
  await db.order.updateMany({
    where: {
      id: id
    },
    data: {
      status: status
    }
  })
}

async function updateProductStockFromOrder(id: number, items: any[], status: string) {
  try {
    const updateProductQuantities = await db.$transaction(async (tx) => {
      // Update status order menjadi Canceled
      await tx.order.updateMany({
        where: {
          id: id
        },
        data: {
          status: status
        }
      });
 
      // Cek stok untuk semua produk
      const products = await Promise.all(items.map(item =>
        tx.product.findUnique({
          where: { id: item.productId }
        })
      ));
 
      // Validasi stok
      items.forEach((item, index) => {
        const product = products[index];
        if (!product) {
          return NextResponse.json({ errors: `Product with id ${item.productId} not found`}, { status: 400 });
        }
        if (product.quantity < item.quantity) {
          return NextResponse.json({ errors: `Insufficient stock for product ${item.productId}`}, { status: 400 });
        }
      });
 
      // Jika semua stok mencukupi, lakukan update
      const updates = await Promise.all(items.map(item =>
        tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        })
      ));
 
      return updates;
    });
 
    return {
      success: true,
      data: updateProductQuantities,
      httpStatus: 200
    };
 
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      httpStatus: 500
    };
  }
 }