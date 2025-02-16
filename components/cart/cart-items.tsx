"use client";

import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableHeader,
} from "@/components/ui/table";
import { useCartStore } from "@/lib/client-store";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import Lottie from "lottie-react";
import emptyCart from "@/public/emptyCart.json";
import { createId } from "@paralleldrive/cuid2";
import { Button } from "../ui/button";

export default function CartItems() {
    const { cart, addToCart, removeFromCart, setCheckoutProgress } = useCartStore();

    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => {
            return acc + item.price! * item.variant.quantity;
        }, 0);
    }, [cart]);

    const priceInLetters = useMemo(() => {
        return [...totalPrice.toFixed(2).toString()].map((letter) => {
            return { letter, id: createId() };
        });
    }, [totalPrice]);

    return (
        <motion.div className="flex flex-col items-center">
            {cart.length === 0 && (
                <div className="flex-col w-full flex items-center justify-center text-center">
                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl text-muted-foreground">
                            Your cart is empty
                        </h2>
                        <Lottie className="h-64" animationData={emptyCart} />
                    </motion.div>
                </div>
            )}
            {cart.length > 0 && (
                <div className="h-88 w-full overflow-y-auto">
                    <Table className="max-w-2xl mx-auto">
                        <TableHeader>
                            <TableRow>
                                <TableCell>Products</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        {formatPrice(item.price)}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <Image
                                                className="rounded-md"
                                                width={48}
                                                height={48}
                                                src={item.image}
                                                alt={item.name}
                                                priority
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-between">
                                            <MinusCircle
                                                size={14}
                                                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                onClick={() => {
                                                    removeFromCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantId:
                                                                item.variant
                                                                    .variantId,
                                                        },
                                                    });
                                                }}
                                            />
                                            <p className="text-md font-bold">
                                                {item.variant.quantity}
                                            </p>
                                            <PlusCircle
                                                className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                                                size={14}
                                                onClick={() => {
                                                    addToCart({
                                                        ...item,
                                                        variant: {
                                                            quantity: 1,
                                                            variantId:
                                                                item.variant
                                                                    .variantId,
                                                        },
                                                    });
                                                }}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
            <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
                <span className="text-md"> Total: $</span>
                <AnimatePresence mode="popLayout">
                    {priceInLetters.map((letter, i) => (
                        <motion.div key={letter.id}>
                            <motion.span
                                className="text-md inline-block"
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                exit={{ y: -20 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {letter.letter}
                            </motion.span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
			<Button  onClick={() => setCheckoutProgress("payement-page")} className="max-w-md w-full" disabled={cart.length === 0}>
				Checkout
			</Button>
        </motion.div>
    );
}
