import Link from "next/link";
// import { FacebookIcon } from "lucide-react";

export default function InstagramSignup() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 border border-gray-300">
        <div className="text-center mb-6">
          <h1 className="font-serif text-5xl">Site Tour</h1>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-500 font-medium text-sm">
            Interested in touristic attractions, sign up.
          </p>
        </div>

        {/* <button className="w-full bg-blue-500 text-white py-2 rounded flex items-center justify-center gap-2 font-semibold mb-4">
          <FacebookIcon className="w-5 h-5" />
          Log in with Facebook
        </button> */}

        {/* <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="px-4 text-sm text-gray-500 font-medium">OR</div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div> */}

        <form className="space-y-2">
          <div>
            <input
              type="text"
              placeholder="Email"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
            />
          </div>
          {/* <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
            />
          </div> */}
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-2 py-2 border border-gray-300 rounded-sm text-sm bg-gray-50"
            />
          </div>

          {/* <div className="text-center text-xs text-gray-500 my-4">
            <p>
              People who use our service may have uploaded your contact
              information to Instagram.{" "}
              <Link href="#" className="text-blue-900 font-semibold">
                Learn More
              </Link>
            </p>
          </div> */}

          {/* <div className="text-center text-xs text-gray-500 mb-4">
            <p>
              By signing up, you agree to our{" "}
              <Link href="#" className="text-blue-900 font-semibold">
                Terms
              </Link>
              {", "}
              <Link href="#" className="text-blue-900 font-semibold">
                Privacy Policy
              </Link>
              {" and "}
              <Link href="#" className="text-blue-900 font-semibold">
                Cookies Policy
              </Link>
              {" ."}
            </p>
          </div> */}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-1.5 rounded font-medium"
          >
            Sign up
          </button>
          <div className="mt-8 text-center text-sm">
                      <span className="text-gray-700">Already have an account?</span>{" "}
                      <Link href="/sign_In" className="text-blue-500 font-semibold">
                        Sign In
                      </Link>
                    </div>
        </form>
      </div>
    </div>
  );
}
