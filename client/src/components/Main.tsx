import React from 'react';

import Chatlist from './Chatlist/Chatlist';
import Empty from './Empty';
import Chat from './Chat/Chat';

const Main = () => {
  return (
    <div className='grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden'>
      <Chatlist />
      {/*<Empty />*/}
      <Chat />
    </div>
  )
}

export default Main;