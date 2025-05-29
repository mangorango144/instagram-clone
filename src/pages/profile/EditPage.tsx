import { useEffect, useRef, useState } from "react";
import { RootState, setAuthUser } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const EditPage = () => {
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const initialFullName = useRef(auth.fullName || "");
  const initialBio = useRef(auth.bio || "");

  const maxLength = 150;
  const isLimitReached = bio.length >= maxLength;
  const isChanged =
    fullName.trim() !== initialFullName.current.trim() ||
    bio.trim() !== initialBio.current.trim();
  const isDisabled = isSubmitting || isLimitReached || !isChanged;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setShowModal(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.uid) return;

    try {
      setIsPhotoProcessing(true);

      const imageUrl = URL.createObjectURL(file);
      const croppedBlob = await cropImageToSquare(imageUrl);
      if (!croppedBlob) throw new Error("Cropping failed");

      const storageRef = ref(storage, `profile_photos/${auth.uid}.jpg`);
      await uploadBytes(storageRef, croppedBlob);
      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", auth.uid), {
        pfpUrl: downloadURL,
      });

      dispatch(setAuthUser({ ...auth, pfpUrl: downloadURL }));
      setShowModal(false);

      await new Promise((res) => setTimeout(res, 2000));
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  const cropImageToSquare = (imageUrl: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(null);

        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, size, size);
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
      img.src = imageUrl;
    });
  };

  const handleSubmit = async () => {
    if (!auth.uid) return;

    try {
      setIsSubmitting(true);

      const userRef = doc(db, "users", auth.uid);
      await updateDoc(userRef, {
        fullName: fullName.trim(),
        bio: bio.trim(),
      });

      initialFullName.current = fullName.trim();
      initialBio.current = bio.trim();

      dispatch(
        setAuthUser({
          ...auth,
          fullName: fullName.trim(),
          bio: bio.trim(),
        })
      );

      await new Promise((res) => setTimeout(res, 2000));
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!auth.uid) return;

    try {
      setIsPhotoProcessing(true);
      await updateDoc(doc(db, "users", auth.uid), {
        pfpUrl: "",
      });

      dispatch(setAuthUser({ ...auth, pfpUrl: "" }));
      setShowModal(false);

      await new Promise((res) => setTimeout(res, 2000));
    } catch (error) {
      console.error("Failed to remove photo:", error);
    } finally {
      setIsPhotoProcessing(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  useEffect(() => {
    if (auth.fullName) {
      setFullName(auth.fullName);
      initialFullName.current = auth.fullName;
    }

    if (auth.bio) {
      setBio(auth.bio);
      initialBio.current = auth.bio;
    }
  }, [auth.fullName, auth.bio]);

  return (
    <div className="flex justify-center items-center bg-black mt-12 p-4 text-white">
      <div className="space-y-8 w-full max-w-xl">
        <h1 className="font-semibold text-2xl">Edit profile</h1>

        <div className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl">
          <div className="relative flex items-center space-x-4">
            <div className="relative rounded-full size-13 sm:size-16 overflow-hidden">
              <img
                src={auth.pfpUrl || "/assets/blank_pfp.png"}
                alt="Profile"
                className="rounded-full size-13 sm:size-16 object-cover"
              />
              {isPhotoProcessing && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full">
                  <div className="border-2 border-white border-t-transparent rounded-full w-6 h-6 animate-spin" />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">
                {auth.username}
              </p>
              <p className="text-neutral-400 text-xs sm:text-sm">
                {auth.fullName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 hover:bg-blue-600 px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm cursor-pointer"
          >
            Change photo
          </button>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block mb-1 font-semibold">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            maxLength={30}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-neutral-800 p-3 px-4 rounded-xl outline-none w-full text-white text-sm placeholder-neutral-500"
          />
          <p className="mt-1 text-neutral-500 text-sm text-right">
            {fullName.length} / 30
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block mb-1 font-semibold">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`bg-neutral-900 p-3 border rounded-xl w-full text-sm resize-none placeholder-neutral-500 transition-colors custom-scrollbar ${
              isLimitReached
                ? "border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                : "border-neutral-700"
            }`}
            rows={2}
          />
          <p
            className={`mt-1 text-sm text-right transition-colors ${
              isLimitReached ? "text-red-500" : "text-neutral-500"
            }`}
          >
            {bio.length} / {maxLength}
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            className={`px-16 py-3 rounded-lg font-medium text-sm transition-colors ${
              isDisabled
                ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <div className="border-2 border-white border-t-transparent rounded-full size-5 animate-spin" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal */}
      {showModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/70">
          <div
            ref={modalRef}
            className="bg-stone-800 rounded-xl w-80 overflow-hidden text-center"
          >
            <div className="p-6 border-neutral-700 border-b text-lg">
              Change Profile Photo
            </div>
            <div className="flex flex-col divide-y divide-neutral-700">
              <button
                className="hover:bg-stone-700 py-3 font-semibold text-blue-400 cursor-pointer"
                onClick={handleUploadClick}
                disabled={isPhotoProcessing}
              >
                Upload Photo
              </button>
              <button
                className="hover:bg-stone-700 py-3 font-semibold text-red-400 cursor-pointer"
                onClick={handleRemovePhoto}
                disabled={isPhotoProcessing}
              >
                Remove Current Photo
              </button>
              <button
                className="hover:bg-stone-700 py-3 text-white cursor-pointer"
                onClick={() => setShowModal(false)}
                disabled={isPhotoProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
