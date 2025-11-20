import Link from "next/link";
import { FiCalendar } from "react-icons/fi";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="mx-auto h-20 w-20 bg-indigo-100 rounded-full flex items-center justify-center">
          <FiCalendar className="h-10 w-10 text-indigo-600" />
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
          TimeWise
        </h1>

        <p className="text-xl text-gray-600">
          Smart event planning for organized people.
          <br />
          Manage your time, tasks, and life effortlessly.
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link
            href="/login"
            className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors shadow-sm hover:shadow-md"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
