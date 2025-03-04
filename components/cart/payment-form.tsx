"use client";

import { useCartStore } from "@/lib/client-store";
import {
    AddressElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useState } from "react";
import { createPaymentIntent } from "@/server/actions/create-payment-intent";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const { cart } = useCartStore();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setErrorMessage(submitError.message!);
            setIsLoading(false);
            return;
        }
        const { data } = await createPaymentIntent({
            amount: totalPrice,
            currency: "usd",
            cart: cart.map((item) => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image,
            })),
        });
        if (data?.error) {
            setErrorMessage(data.error);
            setIsLoading(false);
            return;
        }
        if (data?.success) {
            console.log("data");
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: data.success.clientSecretID!,
                redirect: "if_required",
                confirmParams: {
                    // return_url:
                    //     "https://4a86-2001-861-5b80-1c20-b5bf-f9ba-5568-e4d7.ngrok.io/success",

                    return_url: "https://localhost:3000/success",
                    receipt_email: data.success.user as string,
                },
            });
            if (error) {
                setErrorMessage(error.message!);
                setIsLoading(false);
                return;
            } else {
                setIsLoading(false);
                console.log("save orddr");
            }
        }
    };
    console.log("cliet secret");
    console.log("Stripe:", stripe);
    console.log("Elements:", elements);
    return (
        <form onSubmit={handleSubmit}>
            {/* <PaymentElement /> */}
            <PaymentElement options={{ layout: "auto" }} />

            <AddressElement options={{ mode: "shipping" }} />
            <Button disabled={isLoading}>
                {isLoading ? "Traitement..." : "Payer maintenant"}
            </Button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
}
