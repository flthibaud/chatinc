import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMessages, addMessage } from '@/store/slice/messageSlice';
import { setSocket } from '@/store/slice/socketSlice';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

import Chatlist from './Chatlist/Chatlist';
import Empty from './Empty';
import Chat from './Chat/Chat';

const Main = () => {
  const dispatch = useAppDispatch();
  const { currentChatUser, userInfo } = useAppSelector(state => state.auth);
  let socketRef = useRef<Socket | null>(null);
  const [socketEvent, setSocketEvent] = useState(false);

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
    if (socketRef.current && !socketEvent) {
      const messageHandler = (data) => {
        console.log(data);
        dispatch(addMessage(data));
      };
  
      socketRef.current.on("msg-received", messageHandler);
  
      // Clean up the event listener when the component is unmounted
      // or when it's necessary to reset the listener.
      return () => {
        socketRef?.current?.off("msg-received", messageHandler);
      };
    }
  }, [dispatch, socketEvent]);
  

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_NEXTJS_SITE_URL}/api/messages/get-messages?from=${userInfo?.id}&to=${currentChatUser?.id}`);
        console.log(data)
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
      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  )
}

export default Main;