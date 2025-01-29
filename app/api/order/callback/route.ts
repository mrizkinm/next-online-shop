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

    // Pastikan data dari Midtrans valid
    const transactionStatus = await apiClient.transaction.status(order_id);
    if (transactionStatus.order_id !== order_id) {
      return NextResponse.json({ errors: 'Order not found' }, { status: 404 });
    }

    // Perbarui status pembayaran di database
    let status = '';
    if (transaction_status === 'capture') {
      // Capture hanya untuk kartu kredit
      status = fraud_status === 'accept' ? 'Completed' : 'Fraud';
    } else if (transaction_status === 'settlement') {
      status = 'Completed';
    } else if (transaction_status === 'pending') {
      status = 'Pending';
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
      status = 'Canceled';
    } else if (transaction_status === 'deny') {
      status = 'Denied';
    }

    // Update status di tabel `Order`
    await db.order.update({
      where: { orderTrxId: order_id },
      data: { status },
    });

    return NextResponse.json({ message: 'Callback processed successfully' });
  } catch (error) {
    console.error('Error processing callback:', error);
    return NextResponse.json({ errors: 'Failed to process callback' }, { status: 500 });
  }
}