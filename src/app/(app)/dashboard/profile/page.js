// "use client";

import { Card } from "@heroui/react";
import { auth } from "@/libs/auth";
import { UpdateForm } from "./_components/update_form";

export default async function Page() {
  const session = await auth();
  const username = session.user.username;
  const avatarUrl = session.user.avatarUrl;
  const userEmail = session.user.email;
  const userOrganization = session.user.organization;
  const userId = session.user.id;

  return (
    <div className="w-5/6 m-auto">
      <p className="text-3xl mb-5">Profile</p>
      <Card className="w-full shadow-md m-auto p-4">
        <p className="font-bold text-2xl">Update Profile</p>
        <hr className="my-4"></hr>
        <UpdateForm
          username={username}
          avatarUrl={avatarUrl}
          userEmail={userEmail}
          userOrganization={userOrganization}
          userId={userId}
        />
      </Card>
    </div>
  );
}
