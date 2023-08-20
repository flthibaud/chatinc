import React from "react";
import { useAppSelector } from "@/store/hooks";
import { calculateTime } from "@/utils/calculateTime";
import { Message } from "@/types";

import MessageStatus from "../common/MessageStatus";

const ChatContainer = () => {
  const { messages } = useAppSelector((state) => state.message);
  const { currentChatUser, userInfo } = useAppSelector((state) => state.auth);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full overflow-auto gap-1">
            {messages.map((message: Message) => (
              <div key={message.id} className={`flex ${message.sender_id === currentChatUser.id ? "justify-start" : "justify-end"}`}>
                {message.message_type === "text" && (
                  <div className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${message.sender_id === currentChatUser.id ? "bg-incoming-background" : "bg-outgoing-background"}`}>
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.created_at)}
                      </span>
                      <span>
                        {message.sender_id === userInfo?.id && (
                          <MessageStatus messageStatus={message.message_status} />
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
