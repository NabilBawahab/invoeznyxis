"use client";

import { logoutAction } from "@/actions/logout-action";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  User,
} from "@heroui/react";
import { createAvatar } from "@dicebear/core";
import { glass } from "@dicebear/collection";
import Link from "next/link";
import { useActionState } from "react";

export const UserPopover = ({ session }) => {
  const [state, formAction, pending] = useActionState(logoutAction, null);

  // avatar dicebear
  const avatar = createAvatar(glass, {
    seed: session?.user.username,
  });

  const svg = avatar.toDataUri();

  return (
    <Popover showArrow offset={10} placement="bottom">
      <PopoverTrigger>
        <User
          avatarProps={{
            src: session.user.avatarURL || svg,
          }}
          description={session.user.organization}
          name={session.user.username}
          className="rounded-full hover:opacity-75 transition-opacity duration-300 cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="space-y-2 p-2 rounded-md">
        <Link
          href={"/dashboard/profile"}
          className="font-semibold border px-3 py-1 rounded-md "
        >
          Profile
        </Link>
        <form action={formAction}>
          <Button
            size="sm"
            type="submit"
            isLoading={pending}
            color="danger"
            radius="md"
            variant="bordered"
            className="font-bold"
          >
            Logout
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
};
