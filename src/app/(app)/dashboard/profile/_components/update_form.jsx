"use client";

import { useActionState } from "react";
import { Button, Form, Input, Avatar } from "@heroui/react";
import { updateProfileAction } from "../action";

export const UpdateForm = ({
  userId,
  username,
  userEmail,
  userOrganization,
  avatarUrl,
}) => {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    null
  );

  return (
    <>
      <div className="flex justify-center space-x-4 m-4 h-max">
        <div className="flex flex-col justify-center">
          <Avatar src={avatarUrl} className="size-40" />
        </div>
        <Form action={formAction} className="w-1/2">
          <input name="id" defaultValue={userId} hidden />
          <div className="w-full grid grid-cols-2 grid-rows-2 gap-2">
            <Input
              label="Username"
              name="username"
              defaultValue={username}
              placeholder={username}
            />
            <Input label="Email" defaultValue={userEmail} isDisabled />
            <Input
              label="Organization"
              name="organization"
              defaultValue={userOrganization}
              placeholder={userOrganization}
            />
            <Input name="avatar" label="Avatar" type="file" />
          </div>
          <Button
            type="submit"
            isLoading={pending}
            className="w-full bg-blue-500 text-white"
          >
            Update profile
          </Button>
        </Form>
      </div>
    </>
  );
};
