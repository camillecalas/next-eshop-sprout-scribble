"use client";

import { useForm } from "react-hook-form";
import { zProductSchema, ProductSchema } from "@/types/product-schema";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";
import Tiptap from "./tiptap";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { getProduct } from "@/server/actions/get-product";
import { useEffect } from "react";
import products from "../products/page";

export default function ProductForm() {
    const form = useForm<zProductSchema>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            title: "",
            description: "",
            price: 0,
        },
        mode: "onChange",
    });

    const router = useRouter();
    const searchParams = useSearchParams();

    const editMode = searchParams.get("id");

    const checkProduct = async (id: number) => {
        if (editMode) {
            const data = await getProduct(id);
            if (data.error) {
                toast.error(data.error);
                router.push("/dashboard/products");
                return;
            }
            if (data.success) {
                const id = parseInt(editMode);
                form.setValue("title", data.success.title);
                form.setValue("description", data.success.description);
                form.setValue("price", data.success.price);
                form.setValue("id", data.success.id);

                return;
            }
        }
    };

    useEffect(() => {
        if (editMode) {
            checkProduct(parseInt(editMode));
        }
    }, []);

    const { execute, status } = useAction(createProduct, {
        onSuccess: (data) => {
            if (data?.error) {
                toast.error(data.error);
            }
            if (data?.success) {
                router.push("/dashboard/products");
                toast.success(data.success);
            } else {
                console.error("Unexpected success response", data);
            }
        },
        onExecute: (data) => {
            if (editMode) {
                toast.loading("Editing product");
            }
            if (!editMode) {
                // toast.loading("Creating product");
            }
        },
    });

    async function onSubmit(values: zProductSchema) {
        execute(values);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {editMode ? "Edit Product" : "Create Product"}
                </CardTitle>
                <CardDescription>
                    {editMode
                        ? "Make changes to existing product"
                        : "Add brand new product"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* TITLE */}
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Saekdong Stripe"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* DESCRIPTION */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Tiptap val={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* PRICE */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Price</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <DollarSign
                                                size={36}
                                                className="p-2 bg-muted rounded-md"
                                            />
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="Your price in AUD"
                                                step="0.1"
                                                min={0}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            disabled={
                                status === "executing" ||
                                !form.formState.isValid ||
                                !form.formState.isDirty
                            }
                            type="submit"
                            className="w-full"
                        >
                            {editMode ? "Save Changes" : "Create Product"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
