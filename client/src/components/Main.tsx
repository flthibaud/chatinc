import React, { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMessages, addMessage } from '@/store/slice/messageSlice';
import { setSocket } from '@/store/slice/socketSlice';
import { Message } from '@/types';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import Chatlist from './Chatlist/Chatlist';
import Empty from './Empty';
import Chat from './Chat/Chat';
import SearchMessages from './Chat/SearchMessages';

const Main = () => {
  const dispatch = useAppDispatch();
  const { currentChatUser, userInfo } = useAppSelector(state => state.auth);
  const { messageSearch } = useAppSelector((state) => state.message);
  let socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);
    }

    if (userInfo) {
      socketRef?.current?.emit('add-user', userInfo.id);

      dispatch(setSocket(socketRef));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (socketRef.current) {
      const messageHandler = (data: Message) => {
        dispatch(addMessage(data));
      };
  
      socketRef.current.on("msg-received", messageHandler);
  
      // Clean up the event listener when the component is unmounted
      // or when it's necessary to reset the listener.
      return () => {
        socketRef?.current?.off("msg-received", messageHandler);
      };
    }
  }, [dispatch]);
  

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXTJS_SITE_URL}/api/messages/get-messages?from=${userInfo?.id}&to=${currentChatUser?.id}`);
        dispatch(setMessages(data));
      } catch (error) {
        console.log(error);
      }
    };

    if (currentChatUser?.id) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <div className='grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden'>
      <Chatlist />
      {currentChatUser ? (
        <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
          <Chat />
          {messageSearch && <SearchMessages />}
        </div>
      ) : <Empty />}
    </div>
  )
}

export default Main;