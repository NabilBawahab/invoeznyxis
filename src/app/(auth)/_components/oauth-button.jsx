import { Button } from "@heroui/react";
import React, { useActionState } from "react";
import { FcGoogle } from "react-icons/fc";
import { continueWithGoogleAction } from "../_actions/action";
export default function OauthButton() {
  const [_, formAction, pending] = useActionState(
    continueWithGoogleAction,
    null
  );
  return (
    <form action={formAction}>
      <Button
        type="submit"
        startContent={<FcGoogle />}
        fullWidth
        variant="bordered"
        isLoading={pending}
      >
        Continue with Google
      </Button>
    </form>
  );
}
