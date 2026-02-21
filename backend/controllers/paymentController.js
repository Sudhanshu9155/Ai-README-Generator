import Razorpay from 'razorpay';
import crypto from 'crypto';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Razorpay keys not configured" });
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: 50000, // amount in smallest currency unit (500 INR)
            currency: "INR",
            receipt: "receipt_order_" + Date.now(),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update user to Pro
            // req.user is available because of protect middleware
            const user = await User.findById(req.user._id);
            user.isPro = true;

            // Optional: reset free generations usage if needed, or just rely on checks
            // user.freeGenerationsUsed = 0; 

            await user.save();

            res.json({
                message: "Payment verified successfully",
                success: true
            });
        } else {
            res.status(400).json({
                message: "Invalid signature",
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};
