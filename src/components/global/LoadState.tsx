import React from 'react';
import { BounceLoader } from 'react-spinners'
interface LoadStateProps {
  // You can define any props needed here
  state?:string
}

const LoadState: React.FC<LoadStateProps> = ({
  state
}) => {
  return (
    <div className='
      w-full
      h-24
      flex
      flex-col
      items-center
      justify-center
    '>
      {
        state === "Loading..." ? (
          <BounceLoader color='#22c55e' size={40}/>
        ) : (
          <h1 className=' text-xl text-white'>{state || "loading"}</h1>
        )
      }
    </div>
  );
};

export default LoadState;