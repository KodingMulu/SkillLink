import midtransClient from 'midtrans-client';

const serverKey = process.env.MIDTRANS_SERVER_KEY || 'placeholder_server_key';
const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'placeholder_client_key';

export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey,
  clientKey,
});