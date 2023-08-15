import React from 'react';
import Avatar from '../common/Avatar';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setAllContactsPage } from '@/store/slice/authSlice';
import {BsFillChatLeftTextFill, BsThreeDotsVertical} from 'react-icons/bs';

const ChatlistHeader = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((state) => state.auth);

  const handleAllContactsPage = () => {
    dispatch(setAllContactsPage());
  };

  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>
      <div className='cursor-pointer'>
        <Avatar type="sm" image={userInfo.avatar} />
      </div>
      <div className='flex gap-6'>
        <BsFillChatLeftTextFill
          className='text-panel-header-icon cursor-pointer text-xl'
          title='New Chat'
          onClick={handleAllContactsPage}
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