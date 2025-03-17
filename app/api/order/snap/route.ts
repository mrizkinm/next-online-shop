import { NextResponse } from 'next/server';
import db from '@/lib/db';
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    // Validate order data
    if (!id) {
      return NextResponse.json({ errors: 'Order id is required' }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Validate order data
    if (!order) {
      return NextResponse.json({ errors: 'Orders not found' }, { status: 404 });
    }

    // Prepare Midtrans Snap data
    const snapData = {
      transaction_details: {
        order_id: order.orderTrxId,
        gross_amount: order.totalAmount,
      },
      customer_details: {
        customer_id: order.customerId,
        first_name: (order.info as { name: string; phone: string }).name ?? '',
        phone: (order.info as { name: string; phone: string }).phone ?? '',
      },
      item_details: order.items.map((item) => ({
        id: item.productId,
        price: item.price,
        quantity: item.quantity,
        name: item.product.name
      })),
    };

    // Generate Snap Token
    const snapResponse = await snap.createTransaction(snapData);
    
    // Save the snap token in the order record
    await db.order.update({
      where: { id },
      data: {
        snapToken: snapResponse.token, // Save snapToken to the order
      },
    });
    return NextResponse.json({ snapToken: snapResponse.token });
  } catch (error) {
    console.error('Error creating order and payment token:', error);
    return NextResponse.json({ errors: 'Failed to process order' }, { status: 500 });
  }
}