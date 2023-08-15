import React from 'react';
import Avatar from '../common/Avatar';
import { useAppSelector } from '@/store/hooks';
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs';

const ChatlistHeader = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>
      <div className='cursor-pointer'>
        <Avatar type="sm" image={userInfo.avatar} />
      </div>
      <div className='flex gap-6'>
        <BsFillChatLeftTextFill
          className='text-panel-header-icon cursor-pointer text-xl'
          title='New Chat'
        />
        <>
          <BsThreeDotsVertical
            className='text-panel-header-icon cursor-pointer text-xl'
            title='Menu'
          />
        </>
      </div>
    </div>
  )
}

export default ChatlistHeader;