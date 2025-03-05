export default function Layout({ children }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border p-6 shadow-md rounded-xl w-[350px]">
        {children}
      </div>
    </div>
  );
}
