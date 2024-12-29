"use server";

import { ProductSchema } from "@/types/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products, reviews } from "../schema";
import { revalidatePath } from "next/cache";
import { reviewsSchema } from "@/types/reviews-schema";
import { auth } from "../auth";
import { and } from "drizzle-orm";

const action = createSafeActionClient();

export const addReview = action(
    reviewsSchema,
    async ({ productID, rating, comment }) => {
        try {
            const session = await auth();
            if (!session) return { error: "Please sign in" };

            const reviewExist = await db.query.reviews.findFirst({
                where: and(
                    eq(reviews.productID, productID),
                    eq(reviews.userID, session.user.id)
                ),
            });

            if (reviewExist)
                return { error: "You have already reviewed this product" };

            const newReview = await db
                .insert(reviews)
                .values({
                    productID,
                    rating,
                    comment,
                    userID: session.user.id,
                })
                .returning();
            revalidatePath(`/product/${productID}`);
            return { success: newReview[0] };
        } catch (err) {
            return { error: JSON.stringify(err) };
        }
    }
);
