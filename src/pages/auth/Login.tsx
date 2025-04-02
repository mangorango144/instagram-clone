import { useState } from "react";
import { useAuth } from "../../hooks";
import { FaGoogle } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setAuthUser } from "../../store";

export function Login() {
  // State for handling form fields and validation
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // State and hooks for navigation and dispatch
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  // Auth functions
  const { signIn, signInWithGoogle } = useAuth();

  // Form validity
  const isValid = form.identifier.length > 0 && form.password.length > 5;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const userCredential = await signIn(form.identifier, form.password);

    if (userCredential) {
      dispatch(setAuthUser({ uid: userCredential.user.uid }));
      navigate("/");
      console.log("Login successful");
    } else {
      setError("Sorry, your password was incorrect.");
    }
  };

  if (auth.uid) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return (
    <main role="main">
      <div className="flex flex-col items-center m-auto mt-3 px-10 pb-6 border-1 border-stone-700 w-[350px]">
        <h1 className="mt-12 font-vibes font-extrabold text-white text-5xl">
          InstaClone
        </h1>

        <form className="flex flex-col gap-y-2 mt-10 w-full">
          <div className="relative w-full">
            <input
              type="text"
              name="email"
              placeholder="Username or email"
              aria-label="Email"
              aria-required="true"
              onChange={(e) => {
                setForm({ ...form, identifier: e.target.value });
                setError(null);
              }}
              className="bg-stone-900 p-2 pr-8 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
          </div>

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              aria-label="Password"
              aria-required="true"
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setError(null);
              }}
              className="bg-stone-900 p-2 pr-12 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="top-1/2 right-3 absolute h-full font-medium text-white hover:text-stone-500 text-sm -translate-y-1/2 hover:cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            disabled={!isValid}
            onClick={handleSignIn}
            className="flex justify-center items-center bg-sky-500 hover:bg-sky-600 disabled:opacity-60 mt-2 py-1 rounded-lg w-full font-medium text-white hover:cursor-pointer"
          >
            Log in
          </button>
        </form>

        <div className="flex justify-center items-center mt-4 w-full">
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
          <div className="mx-3 font-medium text-stone-400 text-sm">OR</div>
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex justify-center items-center bg-sky-500 hover:bg-sky-600 mt-4 py-1 rounded-lg w-full font-medium text-white hover:cursor-pointer"
        >
          <FaGoogle className="mr-1" /> Log in with Google
        </button>

        {error && (
          <p className="mt-6 text-red-500 text-sm text-center">{error}</p>
        )}

        <h4 className="mt-6 text-white text-xs text-center">
          Forgot password?
        </h4>

        <h4 className="mt-8 text-stone-400 text-xs text-center">
          You can also report content you believe is unlawful in your country
          without logging in.
        </h4>
      </div>

      <div className="flex flex-col justify-center items-center m-auto mt-3 border-1 border-stone-700 w-[350px] h-[81px]">
        <p className="block text-white">Don't have an account?</p>
        <a href="" className="text-sky-400">
          Sign up
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
