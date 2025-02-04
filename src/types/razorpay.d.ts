declare global {
    interface Window {
      Razorpay: any;
    }
  }
  
  export interface RazorpayOptions {
    key: string;
    amount: number; // Amount in paisa (e.g., 50000 for ₹500)
    currency: string;
    name: string;
    description?: string;
    image?: string;
    order_id?: string; // Generated by backend
    handler: (response: RazorpayResponse) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, any>;
    theme?: {
      color?: string;
    };
  }
  
  export interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }
  