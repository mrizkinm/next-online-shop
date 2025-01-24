declare module 'midtrans-client' {
  export class Snap {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });
    createTransaction(param: Record<string, any>): Promise<any>;
    createTransactionToken(param: Record<string, any>): Promise<string>;
    transaction: {
      status(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      refund(orderId: string, param?: Record<string, any>): Promise<any>;
    };
  }

  export class CoreApi {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey?: string;
    });
    charge(param: Record<string, any>): Promise<any>;
    transaction: {
      status(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      refund(orderId: string, param?: Record<string, any>): Promise<any>;
    };
  }
}