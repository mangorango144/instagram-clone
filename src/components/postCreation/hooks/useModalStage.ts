import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../../config";
import { filters, ModalStage } from "../constants";
import { getCroppedImageBlob } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useNavigate } from "react-router-dom";

export function useModalStage({
  discardIntent,
  modalStage,
  selectedFilter,
  caption,
  setModalStage,
  setShowDiscardModal,
}: {
  discardIntent: React.RefObject<"close" | "back">;
  modalStage: ModalStage;
  selectedFilter: keyof typeof filters;
  caption: string;
  setModalStage: React.Dispatch<React.SetStateAction<ModalStage>>;
  setShowDiscardModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handlePrev = () => {
    if (modalStage === ModalStage.Crop) {
      discardIntent.current = "back";
      setShowDiscardModal(true);
    } else {
      setModalStage((prev) => (prev - 1) as ModalStage);
    }
  };

  const handleNext = () => {
    if (modalStage < ModalStage.Final) {
      setModalStage((prev) => (prev + 1) as ModalStage);
    }
  };

  const handleShare = async (
    imageElement: HTMLImageElement,
    crop: { x: number; y: number; width: number; height: number },
    setIsUploadingPost: React.Dispatch<React.SetStateAction<boolean>>,
    onClose: () => void
  ) => {
    if (!imageElement || !crop) return;

    setIsUploadingPost(true);

    try {
      // 1. Get cropped Blob from canvas
      const croppedBlob = await getCroppedImageBlob(
        imageElement,
        crop,
        selectedFilter
      );

      // 2. Upload to Firebase Storage
      const fileName = `${uuidv4()}.jpg`;
      const storageRef = ref(storage, `posts/${auth.uid}/${fileName}`);
      await uploadBytes(storageRef, croppedBlob);

      // 3. Get public URL
      const downloadURL = await getDownloadURL(storageRef);

      // 4. Create a new document reference to get the ID ahead of time
      const postRef = doc(collection(db, "posts"));
      const postId = postRef.id;

      // 5. Store metadata in Firestore (just the cropped version of the image)
      await setDoc(postRef, {
        postId: postId,
        uid: auth.uid,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
        caption: caption,
        likes: [],
        comments: [],
        pfpUrl: auth.pfpUrl,
      });

      console.log("Post uploaded successfully!");
    } catch (error) {
      console.error("Error uploading post:", error);
    } finally {
      setIsUploadingPost(false);
      onClose();
      navigate(`/${auth.username}`);
    }
  };

  return { handlePrev, handleNext, handleShare };
}
