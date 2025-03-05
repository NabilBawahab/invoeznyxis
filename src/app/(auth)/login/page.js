"use client";
import { addToast, Button, Form, Input } from "@heroui/react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { loginAction } from "./action";
import { redirect } from "next/navigation";

export default function Page() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!!state?.fieldsError?.emailValue)
      setEmail(state.fieldsError.emailValue);

    if (!!state?.fieldsError?.error) {
      setError(state.fieldsError.error);
    }

    if (!!state?.message) {
      if (state.success === true) {
        addToast({
          title: "Logins Success!",
          description: state.message,
          variant: "bordered",
          color: "success",
          radius: "sm",
        });
        setTimeout(() => {
          redirect("/dashboard");
        }, 1000);
      }
    }
  }, [state]);
  return (
    <main className="space-y-4">
      <section className="text-center">
        <h3 className="font-bold text-lg">Login</h3>
        <p>Sign in to continue</p>
      </section>
      <section>
        <Form className="space-y-2" action={formAction}>
          <Input
            isRequired
            label="Email"
            name="email"
            type="email"
            value={email}
            isInvalid={!!error || undefined}
            errorMessage={error}
            onValueChange={(e) => {
              if (error) setError("");
              setEmail(e);
            }}
            variant="underlined"
          />
          <Input
            isRequired
            label="Password"
            name="password"
            type="password"
            isInvalid={!!error || undefined}
            errorMessage={error}
            onValueChange={(e) => {
              if (error) setError("");
            }}
            variant="underlined"
          />
          <Button isLoading={pending} type="submit" color="primary" fullWidth>
            Login
          </Button>
        </Form>
      </section>
      <section className="text-center">
        <p>
          Don&apos;t have an account?{" "}
          <Link href={"/register"} className="text-primary-500">
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
