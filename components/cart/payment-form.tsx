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
			console.log("4");
            setErrorMessage(submitError.message!);
            setIsLoading(false);
            return;
        }
        const { data } = await createPaymentIntent({
            amount: totalPrice * 100,
            currency: "usd",
            cart: cart.map((item) => ({
                quantity: item.variant.quantity,
                productID: item.id,
                title: item.name,
                price: item.price,
                image: item.image,
            })),
        });
        console.log("data", data);
        if (data?.error) {
            setErrorMessage(data.error);
            setIsLoading(false);
            return;
        }
        if (data?.success) {
            console.log("1");
            const { error } = await stripe.confirmPayment({
                elements,
                clientSecret: data.success.clientSecretID!,
                redirect: "if_required",
                confirmParams: {
                    return_url: "https://localhost:3000/success",
                    receipt_email: data.success.user as string,
                },
            });
            if (error) {
				console.log("2");
                setErrorMessage(error.message!);
                setIsLoading(false);
                return;
            } else {
				console.log("3");
                setIsLoading(false);
                console.log("**** SAVE ORDER ****");
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <AddressElement options={{ mode: "shipping" }} />
            <Button disabled={isLoading}>
                {isLoading ? "Processing..." : "Pay now"}{" "}
            </Button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
    );
}
