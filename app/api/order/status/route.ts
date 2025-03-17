import { NextResponse } from 'next/server';
import db from '@/lib/db';
// import midtransClient from 'midtrans-client';

// const coreApi = new midtransClient.CoreApi({
//   isProduction: false,
//   serverKey: process.env.MIDTRANS_SERVER_KEY!,
//   clientKey: process.env.MIDTRANS_CLIENT_KEY!
// });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    // Validate order data
    if (!id) {
      return NextResponse.json({ errors: 'Order id is required' }, { status: 400 });
    }

    const existingTransaction = await db.order.findFirst({
      where: {
        id: id,
        status: 'Pending',
      },
      select: {
        snapToken: true, // Pastikan token Snap diambil
        orderTrxId: true,
      },
    });

    if (!existingTransaction) {
      return NextResponse.json({ errors: 'Transaction not found' }, { status: 404 });
    }

    // const paymentStatus = await coreApi.transaction.status(existingTransaction.orderTrxId);

    return NextResponse.json({snapToken: existingTransaction.snapToken});
  } catch (error) {
    console.error('Error creating order and payment token:', error);
    return NextResponse.json({ errors: 'Failed to process order' }, { status: 500 });
  }
}