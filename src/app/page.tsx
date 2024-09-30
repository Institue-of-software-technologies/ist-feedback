import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h1 className="text-2xl font-semibold text-red-600">No Feedback Available</h1>
        <p className="mt-2 text-gray-500">
          Currently, there are no feedback entries available. Please check back later or contact support for more information.
        </p>
      </div>
    </div>
  );
}
