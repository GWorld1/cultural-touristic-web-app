import Image from "next/image";
import Link from "next/link";
// import { FacebookIcon } from "lucide-react";

export default function InstagramLogin() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white p-4">
      {/* Left side - Photo collage */}
      <div className="hidden md:block md:w-1/2 max-w-md relative">
        <div className="relative w-full h-[500px]">
          <div className="absolute top-0 left-0 z-10 transform -rotate-6">
            <div className="relative w-48 h-80 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/road.jpg?height=320&width=192"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full w-32 h-10"></div>
              <div className="absolute bottom-4 right-4 text-red-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute top-10 left-20 z-20">
            <div className="relative w-56 h-96 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/download.jpg?height=384&width=224"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-cover"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-full w-36 h-10"></div>
              <div className="absolute bottom-4 right-4 text-red-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 z-0 transform rotate-6">
            <div className="relative w-48 h-80 rounded-3xl overflow-hidden border-4 border-white shadow-lg">
              <Image
                src="/images/OIP.jpg?height=320&width=192"
                alt="Instagram post"
                width={192}
                height={320}
                className="object-cover"
              />
            </div>
          </div>

          {/* Emoji bubbles */}
          <div className="absolute top-0 left-24 z-30 bg-white rounded-full px-4 py-2 shadow-md">
            <div className="flex items-center space-x-1">
              <span className="text-lg">🟣</span>
              <span className="text-lg">👀</span>
              <span className="text-lg">🧡</span>
            </div>
          </div>

          <div className="absolute top-40 right-10 z-30 bg-green-400 rounded-md px-3 py-1 shadow-md">
            <div className="flex items-center space-x-1 text-white">
              <span>✓</span>
            </div>
          </div>

          <div className="absolute bottom-20 right-0 z-30 bg-white rounded-full p-2 shadow-md border-2 border-yellow-400">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 to-green-300"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 max-w-md flex flex-col items-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-serif text-5xl">360&deg; Site Tour</h1>
          </div>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Email"
                className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 via-red-500 to-yellow-500 text-white py-1.5 rounded-lg font-medium text-sm"
            >
              Log in
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className="px-4 text-sm text-gray-500 font-medium">OR</div>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* < button className="w-full flex items-center justify-center gap-2 text-blue-900 font-semibold text-sm">
            <FacebookIcon className="w-5 h-5 text-blue-600" />
            Log in with Facebook
          </button> */}

          <div className="mt-4 text-center">
            <Link href="#" className="text-blue-900 text-xs">
              Forgot password?
            </Link>
          </div>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-700">Don&apos;t have an account?</span>{" "}
            <Link href="/sign_up" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
