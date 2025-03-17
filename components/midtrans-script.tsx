"use client";

import { useEffect } from 'react';

const MidtransScript = () => {
  useEffect(() => {
    const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const scriptId = 'midtrans-script';

    // Check if script already exists
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = midtransScriptUrl;
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.onerror = () => {
      console.error('Failed to load Midtrans script');
    };

    document.body.appendChild(script);
  }, []);

  return null;
}

export default MidtransScript