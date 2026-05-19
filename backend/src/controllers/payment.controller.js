import Stripe from "stripe";
// import { PayOS } from "@payos/node";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);
// const payos = new PayOS(
//   ENV.PAYOS_CLIENT_ID,
//   ENV.PAYOS_API_KEY,
//   ENV.PAYOS_CHECKSUM_KEY,
// );

export async function createPaymentIntent(req, res) {
  try {
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total from server-side (don't trust client - ever.)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.product.name} not found` });
      }

      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name}` });
      }

      subtotal += product.price * item.quantity;
      validatedItems.push({
        product: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = 10.0; // $10
    const tax = subtotal * 0.08; // 8%
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res.status(400).json({ error: "Invalid order total" });
    }

    let customer;
    if (user.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total),
      currency: "vnd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

export async function handleWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("Payment succeeded:", paymentIntent.id);

    try {
      const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
        paymentIntent.metadata;

      // Check if order already exists (prevent duplicates)
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      });
      if (existingOrder) {
        console.log("Order already exists for payment:", paymentIntent.id);
        return res.json({ received: true });
      }

      // create order
      const order = await Order.create({
        user: userId,
        clerkId,
        orderItems: JSON.parse(orderItems),
        shippingAddress: JSON.parse(shippingAddress),
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        totalPrice: parseFloat(totalPrice),
      });

      // update product stock
      const items = JSON.parse(orderItems);
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      console.log("Order created successfully:", order._id);
    } catch (error) {
      console.error("Error creating order from webhook:", error);
    }
  }

  res.json({ received: true });
}
// export async function createPayOSLink(req, res) {
//   try {
//     const { cartItems, shippingAddress } = req.body;
//     const user = req.user; // Thừa hưởng middleware xác thực của bạn

//     if (!cartItems || cartItems.length === 0) {
//       return res.status(400).json({ error: "Cart is empty" });
//     }

//     // Bảo mật nâng cao: Tính toán lại tổng số tiền từ Server giống hệt Stripe
//     let subtotal = 0;
//     const validatedItems = [];

//     for (const item of cartItems) {
//       const product = await Product.findById(item.product._id);
//       if (!product) {
//         return res
//           .status(404)
//           .json({ error: `Product ${item.product.name} not found` });
//       }

//       if (product.stock < item.quantity) {
//         return res
//           .status(400)
//           .json({ error: `Insufficient stock for ${product.name}` });
//       }

//       subtotal += product.price * item.quantity;
//       validatedItems.push({
//         name: product.name.slice(0, 20), // Tên sản phẩm rút gọn theo luật của PayOS
//         quantity: item.quantity,
//         price: Math.round(product.price),
//       });
//     }

//     const shipping = 10.0;
//     const tax = subtotal * 0.08;
//     const total = subtotal + shipping + tax;

//     if (total <= 0) {
//       return res.status(400).json({ error: "Invalid order total" });
//     }

//     // Luật PayOS: Mã đơn hàng phải là kiểu số (Number)
//     const orderCode = Math.floor(Math.random() * 1000000);
//     const description = `Thanh toan don ${orderCode}`.slice(0, 25);

//     const paymentBody = {
//       orderCode: orderCode,
//       amount: Math.round(total),
//       description: description,
//       items: validatedItems,
//       returnUrl: "https://yourdomain.com/payment-success", // Điền link web/deeplink của bạn
//       cancelUrl: "https://yourdomain.com/payment-cancel",
//     };

//     const paymentLinkResponse = await payos.createPaymentLink(paymentBody);

//     return res.status(200).json({
//       success: true,
//       checkoutUrl: paymentLinkResponse.checkoutUrl,
//       orderCode: orderCode,
//     });
//   } catch (error) {
//     console.error("PayOS Error Backend:", error);
//     return res.status(500).json({
//       error: "Không thể tạo link thanh toán PayOS",
//       details: error.message,
//     });
//   }
// }
