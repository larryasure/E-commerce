"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="p-8">
      <button
        className="btn btn-link btn-secondary "
        onClick={() => router.back()}
      >
        Go back
      </button>

      <div className="min-h-[75vh] flex items-center justify-center px-4 bg-linear-to-br from-white via-blue-50 to-blue-200 rounded-xl shadow-sm  my-8">
        <div className="text-center max-w-md">
          <div className="text-6xl font-black text-[#155daf] mb-4">OOPSIE!</div>

          <h1 className="text-3xl font-bold text-[#13315c] mb-2">
            Page Not Found
          </h1>

          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            The page you&apos;re looking for is a ghost or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-[#155daf] text-white px-5 py-2 rounded-lg font-bold hover:bg-[#13315c] transition-all duration-300 text-center"
            >
              Go Home
            </Link>
            <Link
              href="/products"
              className="border-2 border-[#155daf] text-[#155daf] px-5 py-2 rounded-lg font-bold hover:bg-[#155daf] hover:text-white transition-all duration-300 text-center"
            >
              Shop Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
