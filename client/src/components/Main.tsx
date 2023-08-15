import React from 'react';
import { useAppSelector } from '@/store/hooks';

import Chatlist from './Chatlist/Chatlist';
import Empty from './Empty';
import Chat from './Chat/Chat';

const Main = () => {
  const { currentChatUser } = useAppSelector(state => state.auth);
  return (
    <div className='grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden'>
      <Chatlist />
      {currentChatUser ? <Chat /> : <Empty />}
    </div>
  )
}

export default Main;