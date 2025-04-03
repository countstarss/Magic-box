"use client";
import { useState } from "react";

interface Deck {
  id: string;
  title: string;
  smallSummary: string;
  uploadedAt: Date;
  cards: string[];
}

interface CardGroupProps {
  deck: Deck;
  onClick: () => void;
}

const CardGroup = ({ 
  deck,
  onClick
}: CardGroupProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="rounded-lg relative w-72 h-52 flex items-center justify-center group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* 背面卡片 */}
      <div
        className={`rounded-lg absolute w-full h-full bg-gray-900 border border-gray-300 transition-transform duration-300 ${
          hovered ? "rotate-[8deg] translate-x-4 translate-y-2" : "rotate-0"
        }`}
      >
        <img src={deck.cards[0]} alt="" className='w-full h-full object-cover'/>
      </div>
      {/* 中间卡片 */}
      <div
        className={`rounded-lg absolute w-full h-full bg-gray-900 border border-gray-300 transition-transform duration-300 ${
          hovered ? "rotate-[-5deg] translate-x-2 translate-y-1" : "rotate-0"
        }`}
      >
        <img src={deck.cards[1]} alt="" className='w-full h-full object-cover'/>
      </div>
      {/* 顶层卡片 */}
      <div
        className={`rounded-lg absolute w-full h-full bg-gray-900 border border-gray-300 transition-transform duration-300 ${
          hovered ? "rotate-[-10deg]" : "rotate-0"
        }`}
      >
        <img src={deck.cards[2]} alt="" className='w-full h-full object-cover'/>
      </div>
    </div>
  );
};

export default CardGroup;