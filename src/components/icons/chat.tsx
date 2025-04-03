import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const Chat = ({ selected }: Props) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 主体聊天框 */}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 8.5C2 6.01472 4.01472 4 6.5 4H17.5C19.9853 4 22 6.01472 22 8.5V15.5C22 17.9853 19.9853 20 17.5 20H14.5L12 22.5L9.5 20H6.5C4.01472 20 2 17.9853 2 15.5V8.5Z'
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
        )}
      />

      {/* 聊天气泡点 */}
      <path
        d='M8 12H8.01M12 12H12.01M16 12H16.01'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        className={clsx(
          'dark:group-hover:stroke-[#9F54FF] transition-all dark:stroke-[#C0BFC4] stroke-[#5B5966] group-hover:stroke-[#BD8AFF]',
          { 'dark:!stroke-[#9F54FF] stroke-[#BD8AFF]': selected }
        )}
      />
    </svg>
  )
}

export default Chat
