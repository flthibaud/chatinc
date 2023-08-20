import React, {useState} from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { BsEmojiSmile } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa";
import { ImAttachment } from "react-icons/im";
import { MdSend } from "react-icons/md";
import axios from "axios";

const MessageBar = () => {
  const dispatch = useAppDispatch();
  const { userInfo, currentChatUser } = useAppSelector((state) => state.auth);
  const { socket } = useAppSelector((state) => state.socket);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_NEXTJS_SITE_URL}/api/messages/sent-messages`, {
        from: userInfo?.id,
        to: currentChatUser?.id,
        message,
      });
      console.log("send-msg", data);
      socket.current?.emit("send-msg", data);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-panel-header-background h-20 px-4 flex items-center gap-6 relative">
      <>
        <div className="flex gap-6">
          <BsEmojiSmile
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Emoji"
          />
          <ImAttachment
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Attach file"
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
            <MdSend
              className="text-panel-header-icon cursor-pointer text-xl"
              title="Send message"
              onClick={sendMessage}
            />
            {/*<FaMicrophone className="text-panel-header-icon cursor-pointer text-xl" title="Record" />*/}
          </button>
        </div>
      </>
    </div>
  );
};

export default MessageBar;
