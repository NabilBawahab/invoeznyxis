"use client";
import { addToast, Button, Form, Input } from "@heroui/react";
import Link from "next/link";
import React, { useActionState, useEffect, useState } from "react";
import { registerAction } from "./action";
import { FaLock, FaUserTie } from "react-icons/fa";
import { MdMail } from "react-icons/md";
import { GrOrganization } from "react-icons/gr";
import { redirect } from "next/navigation";
import OauthButton from "../_components/oauth-button";
export default function Page() {
  const [state, formAction, pending] = useActionState(registerAction, null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [confirmedPasswordError, setConfirmedPasswordError] = useState("");

  useEffect(() => {
    if (!!state?.fieldsError?.usernameValue) {
      setUsername(state.fieldsError.usernameValue);
    }

    if (!!state?.fieldsError?.emailValue) {
      setEmail(state.fieldsError.emailValue);
    }

    if (!!state?.fieldsError?.organizationValue) {
      setOrganization(state.fieldsError.organizationValue);
    }

    if (!!state?.fieldsError?.email) {
      setEmailError(state.fieldsError.email);
    }

    if (!!state?.fieldsError?.confirmedPassword) {
      setConfirmedPasswordError(state.fieldsError.confirmedPassword);
    }

    if (!!state?.message) {
      if (state.success === true) {
        addToast({
          title: "Register Success!",
          description: state.message,
          variant: "bordered",
          color: "success",
          radius: "sm",
        });
        redirect("/login");
      }
      if (state.success === false) {
        addToast({
          title: "Register Failed",
          description: state.message,
          variant: "bordered",
          color: "danger",
          radius: "sm",
        });
      }
    }
  }, [state]);

  return (
    <main className="space-y-4">
      <section className="text-center">
        <h3 className="font-bold text-lg">Register</h3>
        <p>Create an account to continue</p>
      </section>
      <section className="space-y-2">
        <Form className="space-y-1" action={formAction}>
          <Input
            isRequired
            endContent={<FaUserTie opacity={0.7} />}
            label="Username"
            name="username"
            value={username}
            type="text"
            variant="underlined"
            minLength={3}
            onValueChange={setUsername}
          />

          <Input
            isRequired
            endContent={<MdMail opacity={0.7} />}
            label="Email"
            name="email"
            value={email}
            type="email"
            variant="underlined"
            onValueChange={(e) => {
              if (!!emailError) setEmailError("");
              setEmail(e);
            }}
            isInvalid={!!emailError || undefined}
            errorMessage={emailError}
          />

          <Input
            endContent={<GrOrganization opacity={0.7} />}
            label="Organization"
            name="organization"
            value={organization}
            type="text"
            variant="underlined"
            minLength={2}
            onValueChange={setOrganization}
          />
          <Input
            isRequired
            endContent={<FaLock opacity={0.7} />}
            label="Password"
            name="password"
            type="password"
            variant="underlined"
            minLength={8}
          />
          <Input
            isRequired
            endContent={<FaLock opacity={0.7} />}
            label="Confirm password"
            name="confirm-password"
            type="password"
            variant="underlined"
            onValueChange={(e) => {
              if (!!confirmedPasswordError) setConfirmedPasswordError("");
              setConfirmedPassword(e);
            }}
            isInvalid={!!confirmedPasswordError || undefined}
            errorMessage={confirmedPasswordError}
          />
          <Button type="submit" color="primary" isLoading={pending} fullWidth>
            Register
          </Button>
        </Form>
        <OauthButton />
      </section>
      <section className="text-center">
        <p>
          Have an account?{" "}
          <Link href={"/login"} className="text-primary-500">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
