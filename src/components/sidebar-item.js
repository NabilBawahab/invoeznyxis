import Link from "next/link";

export default function SidebarItem({ icon, text, active, href }) {
  return (
    <Link href={href} className="block">
      <div
        className={`flex space-x-2 p-2 rounded-2xl cursor-pointer ${
          active
            ? "bg-blue-500 text-white animate-appearance-in"
            : "hover:bg-gray-100"
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span>{text}</span>
      </div>
    </Link>
  );
}
