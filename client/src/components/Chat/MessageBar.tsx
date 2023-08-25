import React, {useState, useRef, useEffect} from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import { addMessage } from "@/store/slice/messageSlice";
import EmojiPicker, {EmojiClickData, Theme} from "emoji-picker-react";
import axios from "axios";

import PhotoPicker from "../common/PhotoPicker";
import CaptureAudio from "../common/CaptureAudio";

interface PhotoPickerRef {
  triggerFileSelection: () => void;
}

const MessageBar = () => {
  const dispatch = useAppDispatch();
  const { userInfo, currentChatUser } = useAppSelector((state) => state.auth);
  const { socket } = useAppSelector((state) => state.socket);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const photoPickerRef = useRef<PhotoPickerRef | null>(null);

  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);

  useEffect(() => {
    // Fonction qui sera appelée lorsqu'un clic est détecté en dehors de l'emoji picker
    const handleClickOutside = (e: MouseEvent) => {
      // Vérifie si l'emoji picker existe et si l'événement de clic ne se produit pas à l'intérieur de celui-ci
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        // Si les deux conditions sont vraies, définissez l'état showEmojiPicker sur false pour fermer l'emoji picker
        setShowEmojiPicker(false);
      }
    };

    // Ajoute un écouteur d'événements à l'objet document pour détecter les clics
    document.addEventListener("mousedown", handleClickOutside);

    // Retire l'écouteur d'événements lorsque le composant est démonté
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_NEXTJS_SITE_URL}/api/messages/sent-messages`, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message,
      });
      socket.current?.emit("send-msg", data);
      dispatch(addMessage(data));
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const photoPickerOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }

    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(`/api/messages/sent-image-message`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo?.id,
          to: currentChatUser?.id,
        },
      });

      if (response.status === 200) {
        socket.current?.emit("send-msg", response.data);
        dispatch(addMessage(response.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAttachmentClick = () => {
    photoPickerRef.current?.triggerFileSelection();
  };

  const handleEmojiModal = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setMessage((prev) => prev += emoji.emoji);
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      {!showAudioRecorder && (
        <>
          <div className="flex gap-6">
            <BsEmojiSmile
              id="emoji-open"
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Emoji"
              onClick={handleEmojiModal}
            />
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-24 left-16 z-40"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme={Theme.DARK} />
              </div>
            )}
            <ImAttachment
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Attach file"
              onClick={handleAttachmentClick}
            />
          </div>
          <div className="w-full rounded-lg h-10 flex items-center">
            <input
              type="text"
              className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
              placeholder="Type a message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
          </div>
          <div className="flex w-10 items-center justify-center">
            <button>
              {message.length > 0 ? (
                <MdSend
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Send message"
                  onClick={sendMessage}
                />
              ) : (
                <FaMicrophone
                  className="text-panel-header-icon cursor-pointer text-xl"
                  title="Record"
                  onClick={() => setShowAudioRecorder(true)}
                />
              )}
            </button>
          </div>
        </>
      )}
      <PhotoPicker ref={photoPickerRef} onChange={photoPickerOnChange} />
      {showAudioRecorder && <CaptureAudio hide={setShowAudioRecorder} />}
    </div>
  );
};

export default MessageBar;
