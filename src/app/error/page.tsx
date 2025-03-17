import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication Error | WizMail",
  description: "Authentication error occurred",
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams.error;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">WizMail</h1>
          <h2 className="mt-6 text-2xl font-extrabold text-red-600">Authentication Error</h2>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-800">There was an error during authentication:</p>
            <p className="mt-2 font-medium text-red-500">{error || "Unknown error"}</p>
          </div>

          <div className="pt-4">
            <Link
              href="/login"
              className="block w-full rounded-md bg-blue-600 py-2 px-4 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 