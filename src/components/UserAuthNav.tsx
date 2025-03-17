import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function UserAuthNav() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">
            {user.name || user.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </Link>
      )}
    </div>
  );
} 