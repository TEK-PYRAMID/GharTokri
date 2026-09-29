// Razorpay Payment Gateway Integration Service (Test Mode)

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

// Default public Razorpay test key for development/testing
export const DEFAULT_RAZORPAY_TEST_KEY = "rzp_test_1DP5mmOlF5G5ag";

/**
 * Get current configured Razorpay Key ID
 */
export const getRazorpayKey = () => {
  const envKey =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_RAZORPAY_KEY_ID
      : undefined;
  const storedKey =
    typeof window !== "undefined" && window.localStorage
      ? localStorage.getItem("quickbasket_rzp_key")
      : null;
  return storedKey || envKey || DEFAULT_RAZORPAY_TEST_KEY;
};

/**
 * Save custom Razorpay Test Key to localStorage
 */
export const saveRazorpayKey = (key) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  if (key && key.trim()) {
    localStorage.setItem("quickbasket_rzp_key", key.trim());
  } else {
    localStorage.removeItem("quickbasket_rzp_key");
  }
};

/**
 * Dynamically loads Razorpay checkout script if not already present on window
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates Razorpay Checkout in Test Mode
 * @param {Object} params
 * @param {number} params.amount - Order amount in INR
 * @param {string} params.paymentMethod - 'upi' | 'card'
 * @param {Object} params.customer - Customer details { fullName, phone, email, address, city, state, pincode }
 * @param {string} params.orderId - Internal Order ID (e.g. QB-12345)
 * @param {Function} params.onSuccess - Callback on payment success ({ razorpay_payment_id })
 * @param {Function} params.onError - Callback on payment failure or error
 * @param {Function} params.onDismiss - Callback when checkout modal is dismissed
 */
export const initiateRazorpayPayment = async ({
  amount,
  paymentMethod, // 'upi' | 'card'
  customer,
  orderId,
  onSuccess,
  onError,
  onDismiss,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    if (onError) {
      onError(new Error("Unable to load Razorpay SDK. Please check your internet connection."));
    }
    return;
  }

  const key = getRazorpayKey();
  const amountInPaise = Math.round(Number(amount) * 100);

  const isUPI = paymentMethod === "upi";
  const methodName = isUPI ? "UPI" : "Credit / Debit Card";

  const options = {
    key: key,
    amount: amountInPaise,
    currency: "INR",
    name: "QuickBasket",
    description: `Grocery Order (${orderId}) via ${methodName} - Test Mode`,
    image: "https://cdn-icons-png.flaticon.com/512/3737/3737372.png",
    prefill: {
      name: customer?.fullName || "Valued Customer",
      email: customer?.email || "customer@quickbasket.com",
      contact: customer?.phone || "9876543210",
      method: isUPI ? "upi" : "card",
    },
    config: {
      display: {
        blocks: {
          preferred: {
            name: isUPI ? "Pay with UPI" : "Pay with Card",
            instruments: [
              {
                method: isUPI ? "upi" : "card",
              },
            ],
          },
        },
        sequence: ["block.preferred"],
        preferences: {
          show_default_blocks: true,
        },
      },
    },
    notes: {
      order_id: orderId,
      delivery_address: `${customer?.address || ""}, ${customer?.city || ""}, ${customer?.state || ""} - ${customer?.pincode || ""}`,
      payment_type: methodName,
      environment: "Test Mode",
    },
    theme: {
      color: "#16a34a", // QuickBasket emerald theme
      backdrop_color: "rgba(15, 23, 42, 0.75)",
    },
    handler: function (response) {
      if (response && response.razorpay_payment_id) {
        if (onSuccess) {
          onSuccess({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || null,
            razorpay_signature: response.razorpay_signature || null,
          });
        }
      } else {
        if (onError) {
          onError(new Error("Payment completed but no payment ID was received."));
        }
      }
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) {
          onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
  };

  try {
    const razorpayInstance = new window.Razorpay(options);

    razorpayInstance.on("payment.failed", function (response) {
      console.warn("Razorpay Payment Failed:", response.error);
      if (onError) {
        onError({
          message: response.error?.description || "Payment failed or was cancelled.",
          code: response.error?.code,
          reason: response.error?.reason,
        });
      }
    });

    razorpayInstance.open();
  } catch (err) {
    console.error("Razorpay instance initialization error:", err);
    if (onError) {
      onError(err);
    }
  }
};
