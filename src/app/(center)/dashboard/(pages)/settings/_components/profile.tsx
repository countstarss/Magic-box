import React from 'react';
import Avatar from './avatar';
import ProfileForm from '../../../_components/form/profile-form';

const Profile = () => {

  return (
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        <span>Settings</span>
      </h1>

      <div className='flex flex-col md:flex-row  justify-around gap-10 p-6'>
        <div
          className='flex flex-col gap-10 w-full md:w-1/3 min-w-[200px]'
        //MARK: UserProfile
        >
          <h2 className='text-2xl font-bold'>User Profile</h2>
          <div
            className='flex flex-row gap-10 w-full justtify-between mt-4'
          >
            <div className='flex flex-col h-full w-full'>
              {/* 
              TODO: 设置用户头像
              */}
              <Avatar />
              <ProfileForm
                Name={'lukeking'}
                email={'lukeking@gmail.com'}
                profileImage={''}
                // onUpdate={updateUserInfo}
              />
            </div>
          </div>
        </div>

        <div
          className='flex flex-col gap-10 w-full md:w-1/3 min-w-[200px]'
        // MARK: Settings  
        // TODO: 在这里进行账户设置
        >
          <h2 className='text-2xl font-bold'>Settings</h2>

          <div
            className='flex flex-row gap-10 w-full justtify-between mt-4'
          >
            <div className='flex flex-col h-full w-full'>
              <ProfileForm
                Name={'lukeking'}
                email={'lukeking@gmail.com'}
                profileImage={''}
                // onUpdate={updateUserInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;