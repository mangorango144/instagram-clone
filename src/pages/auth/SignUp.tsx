import { useState } from "react";
import { FaGoogle, FaRegCheckCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { useAuth } from "../../hooks";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setAuthUser } from "../../store";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { generateSearchKeywords, getUserByUid } from "../../utils";

interface FormState {
  email: string;
  password: string;
  fullName: string;
  username: string;
}

interface ValidationState {
  email: string;
  password: string;
  username: string;
}

const initializeFormState = () => ({
  email: "",
  password: "",
  fullName: "",
  username: "",
});

const initializeValidationState = () => ({
  email: "",
  password: "",
  username: "",
});

export function SignUp() {
  const { signUp, signInWithGoogle, signIn } = useAuth();
  const auth = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // prettier-ignore
  const [errors, setErrors] = useState<ValidationState>(initializeValidationState());
  const [form, setForm] = useState<FormState>(initializeFormState());

  const validateField = async (fieldName: keyof ValidationState) => {
    const newErrors: ValidationState = { ...errors };

    if (fieldName === "email") {
      if (!form.email) {
        newErrors.email = "This field is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter a valid email address.";
      } else {
        newErrors.email = "valid";
      }
    }

    if (fieldName === "password") {
      if (!form.password) {
        newErrors.password = "This field is required.";
      } else if (form.password.length < 6) {
        newErrors.password = "Create a password at least 6 characters long.";
      } else {
        newErrors.password = "valid";
      }
    }

    if (fieldName === "username") {
      if (!form.username) {
        newErrors.username = "This field is required.";
      } else if (/^\d+$/.test(form.username)) {
        newErrors.username = "Your username cannot contain only numbers.";
      } else if (!/^[a-zA-Z0-9._]+$/.test(form.username)) {
        newErrors.username =
          "Usernames can only use letters, numbers, underscores, and periods.";
      } else {
        newErrors.username = "valid";
      }
    }

    setErrors(newErrors);
    setIsFormValid(
      !Object.values(newErrors).some(
        (error) => error !== "valid" && error !== ""
      )
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const fieldName = event.target.name as keyof ValidationState;
    validateField(fieldName);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signUp(form.email, form.password);
      const user = userCredential.user;

      if (user) {
        const searchKeywords = generateSearchKeywords(
          form.fullName,
          form.username
        );

        await setDoc(doc(db, "users", user.uid), {
          fullName: form.fullName,
          username: form.username,
          email: user.email,
          createdAt: new Date(),
          searchKeywords,
          bio: "",
          pfpUrl: "",
        });
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Another account is using the same email.",
        }));
      } else {
        console.log("Error signing up:", err.message);
      }
    }
  };

  const handleGuestLogin = async () => {
    const userCredential = await signIn("adminexample", "123456q");
    if (userCredential) {
      const uid = userCredential.user.uid;
      const user = await getUserByUid(uid);
      dispatch(
        setAuthUser({
          uid,
          username: user?.username,
          pfpUrl: user?.pfpUrl,
        })
      );
      navigate("/");
      console.log("Guest login successful");
    } else {
      console.log("Guest login failed.");
    }
  };

  const handleSignInWithGoogle = async () => {
    const user = await signInWithGoogle();

    if (user) {
      dispatch(
        setAuthUser({
          uid: user.uid,
          username: user.username,
          pfpUrl: user.pfpUrl,
        })
      );
      navigate("/");
      console.log("Google login successful");
    } else {
      console.log("Google login failed.");
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

        <p className="mt-4 font-medium text-stone-400 text-xs text-center leading-relaxed">
          Sign up to see photos and videos from your friends.
        </p>

        <button
          onClick={handleSignInWithGoogle}
          className="flex justify-center items-center bg-sky-500 hover:bg-sky-600 mt-4 py-1 rounded-lg w-full font-medium text-white hover:cursor-pointer"
        >
          <FaGoogle className="mr-1" /> Sign in with Google
        </button>

        <button
          onClick={handleGuestLogin}
          className="flex justify-center items-center bg-green-600 hover:bg-green-700 mt-2 py-1 rounded-lg w-full font-medium text-white hover:cursor-pointer"
        >
          Continue as Guest
        </button>

        <div className="flex justify-center items-center mt-4 w-full">
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
          <div className="mx-3 font-medium text-stone-400 text-sm">OR</div>
          <div className="flex-grow bg-stone-800 h-[1px]"></div>
        </div>

        <form className="flex flex-col mt-4 w-full">
          <div className="relative w-full">
            <input
              type="text"
              name="email"
              placeholder="Email"
              aria-label="Email"
              aria-required="true"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-stone-900 p-2 border rounded-md focus:outline-none w-full text-white text-sm ${
                errors.email && errors.email !== "valid"
                  ? "border-red-500"
                  : "border-stone-700"
              }`}
            />
            {errors.email === "valid" ? (
              <FaRegCheckCircle className="top-1/2 right-3 absolute text-emerald-600 text-xl -translate-y-1/2" />
            ) : errors.email ? (
              <RxCrossCircled className="top-1/2 right-3 absolute text-red-600 text-xl -translate-y-1/2" />
            ) : null}
          </div>
          {errors.email && errors.email !== "valid" && (
            <p className="my-1 text-red-500 text-xs">{errors.email}</p>
          )}

          <div className="relative mt-2 w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              aria-label="Password"
              aria-required="true"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-stone-900 p-2 pr-19 border rounded-md focus:outline-none w-full text-white text-sm ${
                errors.password && errors.password !== "valid"
                  ? "border-red-500"
                  : "border-stone-700"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="top-1/2 right-3 absolute h-full font-medium text-white hover:text-stone-500 text-sm -translate-y-1/2 hover:cursor-pointer"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password === "valid" ? (
              <FaRegCheckCircle className="top-1/2 right-13 absolute text-emerald-600 text-xl -translate-y-1/2" />
            ) : errors.password !== "" ? (
              <RxCrossCircled className="top-1/2 right-13 absolute text-red-600 text-xl -translate-y-1/2" />
            ) : null}
          </div>
          {errors.password && errors.password !== "valid" && (
            <p className="my-1 text-red-500 text-xs">{errors.password}</p>
          )}

          <div className="relative mt-2 w-full">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              aria-label="Full Name"
              aria-required="false"
              value={form.fullName}
              onChange={handleChange}
              className="bg-stone-900 p-2 pr-8 border border-stone-700 rounded-md focus:outline-none w-full text-white text-sm"
            />
          </div>

          <div className="relative mt-2 w-full">
            <input
              type="text"
              name="username"
              placeholder="Username"
              aria-label="Username"
              aria-required="true"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`bg-stone-900 p-2 pr-12 border rounded-md focus:outline-none w-full text-white text-sm ${
                errors.username && errors.username != "valid"
                  ? "border-red-500"
                  : "border-stone-700"
              }`}
            />
            {errors.username === "valid" ? (
              <FaRegCheckCircle className="top-1/2 right-3 absolute text-emerald-600 text-xl -translate-y-1/2" />
            ) : errors.username ? (
              <RxCrossCircled className="top-1/2 right-3 absolute text-red-600 text-xl -translate-y-1/2" />
            ) : null}
          </div>
          {errors.username && errors.username != "valid" && (
            <p className="my-1 text-red-500 text-xs">{errors.username}</p>
          )}
        </form>

        <p className="mt-4 font-medium text-stone-400 text-xs text-center">
          People who use our service may have uploaded your contact information
          to Instagram. Learn More
        </p>

        <h4 className="mt-4 font-medium text-stone-400 text-xs text-center">
          By signing up, you agree to our Terms. Learn how we collect, use and
          share your data in our Privacy Policy and how we use cookies and
          similar technology in our Cookies Policy.
        </h4>

        <button
          disabled={!isFormValid}
          onClick={handleSignUp}
          className="flex justify-center items-center bg-sky-500 hover:bg-sky-600 disabled:bg-gray-500 disabled:opacity-60 mt-4 py-1 rounded-lg w-full font-medium text-white hover:cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </button>

        <p className="mt-8 font-medium text-stone-400 text-xs text-center">
          You can also report content you believe is unlawful in your country
          without logging in.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center m-auto mt-3 border-1 border-stone-700 w-[350px] h-[81px]">
        <p className="block text-white">Have an account?</p>
        <Link to="/login" className="text-sky-400">
          Log in
        </Link>
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
