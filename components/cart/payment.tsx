"use client";

import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import getStripe from "@/lib/get-stripe";
import { useCartStore } from "@/lib/client-store";
import PaymentForm from "./payment-form";
import { useEffect, useState } from "react";

export default function Payment() {
    const { cart } = useCartStore();
    const [stripe, setStripe] = useState<any | null>(null); // Stocke directement l'instance Stripe

    useEffect(() => {
        getStripe().then((stripeInstance) => setStripe(stripeInstance)); // Résout la Promise
    }, []);

    const totalPrice = cart.reduce((acc, item) => {
        return acc + item.price * item.variant.quantity;
    }, 0);

    console.log("total price", totalPrice);
    // console.log("Stripe Instance:", stripe);

    if (!stripe) {
        return <p>Loading payment...</p>; // Show loading state until Stripe initializes
    }

    return (
        <motion.div>
            <Elements
                stripe={stripe}
                options={{
                    mode: "payment",
                    currency: "usd",
                    amount: totalPrice * 100,
                }}
            >
                <PaymentForm totalPrice={totalPrice} />
            </Elements>
        </motion.div>
    );
}
