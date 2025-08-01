import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface FixedQrCodeProps {
  amount: number;
}

export default function FixedQrCode({ amount }: FixedQrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currency = "INR";
  const recipient = "9509206802@ptsbi";
  const firmName = "VRENTAL";

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;
      const paymentData = `upi://pay?pa=${recipient}&pn=${encodeURIComponent(
        firmName
      )}&am=${amount}&cu=${currency}`;
      await QRCode.toCanvas(canvasRef.current, paymentData, { width: 300 });
    };

    generateQR();
  }, [amount, currency, recipient]);
  return <canvas ref={canvasRef} />;
}
