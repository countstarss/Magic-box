import clsx from 'clsx'
import React from 'react'

type Props = { selected: boolean }

const CRM = ({ selected }: Props) => {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 文件夹主体 */}
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2 6.5C2 5.09554 3.12 4 4.5 4H8.5C9.88 4 10.5 4.5 11 5L12 6H19.5C20.88 6 22 7.09554 22 8.5V17.5C22 18.9045 20.88 20 19.5 20H4.5C3.12 20 2 18.9045 2 17.5V6.5Z'
        className={clsx(
          'dark:group-hover:fill-[#C8C7FF] transition-all dark:fill-[#353346] fill-[#C0BFC4] group-hover:fill-[#7540A9]',
          { 'dark:!fill-[#C8C7FF] !fill-[#7540A9]': selected }
        )}
      />

      {/* 用户图标组 */}
      <path
        d='M8 11C8 10.2 8.7 9.5 9.5 9.5C10.3 9.5 11 10.2 11 11C11 11.8 10.3 12.5 9.5 12.5C8.7 12.5 8 11.8 8 11ZM13 11C13 10.2 13.7 9.5 14.5 9.5C15.3 9.5 16 10.2 16 11C16 11.8 15.3 12.5 14.5 12.5C13.7 12.5 13 11.8 13 11ZM7 14.5C7 13.4 8.62 13 9.5 13C10.38 13 12 13.4 12 14.5V15.5H7V14.5ZM12 15.5V14.5C12 13.4 13.62 13 14.5 13C15.38 13 17 13.4 17 14.5V15.5H12Z'
        className={clsx(
          'dark:group-hover:fill-[#9F54FF] transition-all dark:fill-[#C0BFC4] fill-[#5B5966] group-hover:fill-[#BD8AFF]',
          { 'dark:!fill-[#9F54FF] fill-[#BD8AFF]': selected }
        )}
      />
    </svg>
  )
}

export default CRM 