import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner
        size="lg"
        variant="wave"
        color="warning"
        className="opacity-55"
      />
    </div>
  );
}
