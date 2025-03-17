import { NextResponse } from 'next/server';
import db from '@/lib/db';
import midtransClient from 'midtrans-client';
import { OrderItem } from '@prisma/client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, info, items, totalAmount } = body;

    // Validate order data
    if (!items || items.length === 0) {
      return NextResponse.json({ errors: 'Items are required' }, { status: 400 });
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ errors: 'Invalid total amount' }, { status: 400 });
    }

    if (!info || !info.name || !info.phone) {
      return NextResponse.json({ errors: 'Customer info is incomplete' }, { status: 400 });
    }

    // Create order with transaction to ensure atomic operation
    const order = await db.$transaction(async (prisma) => {
      // update stock
      await Promise.all(
        items.map(async (item: OrderItem) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
          });

          if (!product || product.quantity < item.quantity) {
            throw new Error(JSON.stringify({
              errors: `Insufficient stock for product ID: ${item.productId}`
            }));
          }

          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.quantity },
            },
          });
        })
      );

      // Create new order
      const newOrder = await prisma.order.create({
        data: {
          orderTrxId: `TRX-${Date.now()}`,
          customerId: customerId || null,
          info: info,
          totalAmount,
          status: 'Pending',
          items: {
            create: items.map((item: OrderItem) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        },
      });

      // Prepare Midtrans Snap data
      const snapData = {
        transaction_details: {
          order_id: newOrder.orderTrxId,
          gross_amount: newOrder.totalAmount,
        },
        customer_details: {
          customer_id: customerId,
          first_name: info.name,
          phone: info.phone
        },
        item_details: newOrder.items.map((item) => ({
          id: item.productId,
          price: item.price,
          quantity: item.quantity,
          name: item.product.name
        })),
      };

      // Generate Snap Token
      const snapResponse = await snap.createTransaction(snapData);

      // Save the snap token in the order record
      await prisma.order.update({
        where: { id: newOrder.id },
        data: {
          snapToken: snapResponse.token, // Save snapToken to the order
        },
      });

      return { 
        order: newOrder, 
        snapToken: snapResponse.token 
      };
    });

    return NextResponse.json(order);
  } catch (error: any) {
   // Parse detailed error if available
   let errorMessage = 'Failed to process order';
   if (error.message) {
     try {
       const parsedError = JSON.parse(error.message);
       if (parsedError.errors) {
         errorMessage = parsedError.errors;
       }
     } catch {
       errorMessage = error.message;
     }
   }

   console.error('Error creating order and payment token:', error);
   return NextResponse.json({ errors: errorMessage }, { status: 500 });
  }
}