import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaRegCheckCircle } from "react-icons/fa";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main role="main">
      <div className="flex flex-col items-center m-auto mt-3 px-10 border-1 border-stone-700 w-[350px] h-[710px]">
        <h1 className="mt-12 font-vibes font-extrabold text-white text-5xl">
          InstaClone
        </h1>

        <h4 className="mt-4 font-medium text-stone-400 text-xs text-center leading-relaxed">
          Sign up to see photos and videos from your friends.
        </h4>

        <button className="flex justify-center items-center bg-sky-500 mt-4 py-1 rounded-lg w-full font-medium text-white">
          <FaGoogle className="mr-1" /> Sign in with Google
        </button>

        <div className="flex justify-center items-center mt-4 w-full">
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
          <div className="mx-3 font-medium text-stone-400 text-sm">OR</div>
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
        </div>

        <form className="flex flex-col gap-y-2 mt-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              name="email"
              placeholder="Email"
              aria-label="Email"
              aria-required="true"
              className="bg-stone-900 p-2 pr-8 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
            <FaRegCheckCircle className="top-1/2 right-3 absolute text-white text-xl -translate-y-1/2" />
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              aria-label="Password"
              aria-required="true"
              className="bg-stone-900 p-2 pr-12 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="top-1/2 right-3 absolute font-medium text-white text-sm -translate-y-1/2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="bg-stone-900 p-2 pr-8 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
            <FaRegCheckCircle className="top-1/2 right-3 absolute text-white text-xl -translate-y-1/2" />
          </div>
          <div className="relative w-full">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="bg-stone-900 p-2 pr-8 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
            <FaRegCheckCircle className="top-1/2 right-3 absolute text-white text-xl -translate-y-1/2" />
          </div>
        </form>

        <h4 className="mt-4 font-medium text-stone-400 text-xs text-center">
          People who use our service may have uploaded your contact information
          to Instagram. Learn More
        </h4>

        <h4 className="mt-4 font-medium text-stone-400 text-xs text-center">
          By signing up, you agree to our Terms. Learn how we collect, use and
          share your data in our Privacy Policy and how we use cookies and
          similar technology in our Cookies Policy.
        </h4>

        <button
          disabled
          className="flex justify-center items-center bg-sky-500 disabled:opacity-60 mt-4 py-1 rounded-lg w-full font-medium text-white"
        >
          Next
        </button>

        <h4 className="mt-8 font-medium text-stone-400 text-xs text-center">
          You can also report content you believe is unlawful in your country
          without logging in.
        </h4>
      </div>

      <div className="flex flex-col justify-center items-center m-auto mt-3 border-1 border-stone-700 w-[350px] h-[81px]">
        <p className="block text-white">Have an account?</p>
        <a href="" className="text-sky-400">
          Log in
        </a>
      </div>

      <div className="m-auto mt-3 w-[350px] h-[95px]">
        <span className="block text-white text-center">Get the app.</span>
        <div className="flex justify-center space-x-2 mt-3">
          <img
            src="/assets/get-it-on-google-play.png"
            alt="Google Play"
            className="h-[40px]"
          />
          <img
            src="/assets/get-it-from-microsoft.png"
            alt="Microsoft"
            className="h-[40px]"
          />
        </div>
      </div>
    </main>
  );
}
