"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Session } from "next-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
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
import { SettingsSchema } from "@/types/settings-schema";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { settings } from "@/server/actions/settings";
import { UploadButton } from "@/app/api/uploadthing/upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SettingsForm = {
    session: Session;
};

export default function SettingCard(session: SettingsForm) {
    const [error, setError] = useState<string | undefined>(undefined);
    const [success, setSuccess] = useState<string | undefined>(undefined);
    const [avatarUploading, setAvatarUploading] = useState(false);

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            image: session.session.user.image || undefined,
            isTwoFactorEnabled:
                session.session.user?.isTwoFactorEnabled || undefined,
        },
    });

    const { execute, status } = useAction(settings, {
        onSuccess: (data) => {
            if (data?.success) setSuccess(data.success);
            if (data?.error) setError(data.error);
        },
        onError: (error) => {
            setError("Something went wrong");
        },
    });

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        execute(values);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* NAME */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            disabled={status === "executing"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* AVATAR */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar</FormLabel>
                                    <div className="flex items-center gap-4">
                                        {!form.getValues("image") && (
                                            <div className="font-bold">
                                                {session.session.user?.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        {form.getValues("image") && (
                                            <Avatar className="w-12 h-12 overflow-hidden rounded-full">
                                                <AvatarImage
                                                    src={
                                                        form.getValues("image")!
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            </Avatar>
                                        )}
                                        <UploadButton
                                            onUploadBegin={() => {
                                                setAvatarUploading(true);
                                            }}
                                            onUploadError={(error) => {
                                                form.setError("image", {
                                                    type: "validate",
                                                    message: error.message,
                                                });
                                                setAvatarUploading(false);
                                                return;
                                            }}
                                            onClientUploadComplete={(res) => {
                                                form.setValue(
                                                    "image",
                                                    res[0].url!
                                                );
                                                setAvatarUploading(false);
                                                return;
                                            }}
                                            className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                            endpoint="avatarUploader"
                                            content={{
                                                button({ ready }) {
                                                    if (ready)
                                                        return (
                                                            <div>
                                                                Change Avatar
                                                            </div>
                                                        );
                                                    return (
                                                        <div>Uploading...</div>
                                                    );
                                                },
                                            }}
                                        />
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="hidden"
                                            placeholder="User image"
                                            disabled={status === "executing"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* PASSWORD */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*******"
                                            disabled={
                                                status === "executing" ||
                                                session?.session.user.isOAuth
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* NEW PASSWORD */}
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="*******"
                                            disabled={
                                                status === "executing" ||
                                                session?.session.user.isOAuth
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* TWO FACTORS */}
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Two Factor Authentification
                                    </FormLabel>
                                    <FormDescription>
                                        Enable two factor authenntification for
                                        your account
                                    </FormDescription>
                                    <FormControl>
                                        <Switch
                                            disabled={
                                                status === "executing" ||
                                                session?.session.user.isOAuth
                                            }
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormError />
                        <FormSuccess />
                        <Button
                            type="submit"
                            disabled={status === "executing" || avatarUploading}
                        >
                            Update your settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
