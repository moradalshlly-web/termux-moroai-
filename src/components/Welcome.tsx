/**
 * Welcome Component
 * Glowing orb, hero title, and 4 interactive suggestion cards in 2x2 grid
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { APP_CONFIG, SUGGESTION_CARDS } from '../constants';
import { SuggestionCardItem } from '../types';

interface WelcomeProps {
  onSelectPrompt: (promptText: string) => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onSelectPrompt }) => {
  return (
    <div className="w-full max-w-[820px] mx-auto px-4 pt-10 pb-8 flex flex-col items-center text-center">
      
      {/* 1. Glowing Orb (90px, blue gradient, pulsing animation) */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Core pulsing orb */}
        <div className="w-[90px] h-[90px] rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 animate-pulse-orb flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.7)] relative z-10">
          <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-[#0c1a3d] to-[#050810] flex items-center justify-center border border-sky-400/40">
            <span className="font-mono text-3xl font-extrabold bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">
              M
            </span>
          </div>
        </div>

        {/* Ambient atmospheric backglow */}
        <div className="absolute w-[160px] h-[160px] rounded-full bg-blue-600/20 blur-3xl -z-10 pointer-events-none" />
      </div>

      {/* 2. Hero Title & Taglines */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
        <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-600 bg-clip-text text-transparent">
          {APP_CONFIG.name}
        </span>
      </h1>

      <p className="text-base sm:text-lg font-semibold text-blue-200/90 tracking-wide mb-2">
        {APP_CONFIG.tagline}
      </p>

      <p className="text-xs sm:text-sm text-[#A0B0CB] max-w-lg mb-10 leading-relaxed font-normal">
        {APP_CONFIG.subtitle}
      </p>

      {/* 3. 4 Suggestion Cards in a 2x2 Grid (mobile-first: 1 col on mobile, 2 col on sm+) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-right">
        {SUGGESTION_CARDS.map((card: SuggestionCardItem) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectPrompt(card.prompt)}
            className="group relative p-4 sm:p-5 rounded-[14px] glass-panel text-right flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-900/15 hover:shadow-[0_8px_32px_rgba(37,99,235,0.22)] active:scale-[0.99] cursor-pointer"
          >
            <div>
              {/* Header with Emoji and Subtle Arrow */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl select-none group-hover:scale-110 transition-transform duration-300">
                  {card.emoji}
                </span>
                <span className="w-7 h-7 rounded-full bg-blue-950/60 border border-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400 transition-all duration-300">
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 rotate-180" />
                </span>
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-[#E8EEF5] group-hover:text-sky-300 transition-colors mb-1.5 leading-snug">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#9BB1D0] leading-relaxed line-clamp-2">
                {card.description}
              </p>
            </div>

            {/* Bottom glow highlight */}
            <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/0 to-transparent group-hover:via-blue-400/60 transition-all duration-500" />
          </button>
        ))}
      </div>

    </div>
  );
};
