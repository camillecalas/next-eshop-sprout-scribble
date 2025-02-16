import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    console.log(
        "process.env.NEXT_PUBLIC_PUBLISHABLE_KEY",
        process.env.NEXT_PUBLIC_PUBLISH_KEY
    );
    if (!stripePromise) {
        console.log("Loading Stripe...");
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISH_KEY!);
    }
    stripePromise.then((stripe) => console.log("Stripe loaded:", stripe));
    return stripePromise;
};

export default getStripe;
