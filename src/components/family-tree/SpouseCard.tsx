import React from 'react';
import { Spouse } from '../../types/family';
import { User, Heart } from 'lucide-react';

interface SpouseCardProps {
  spouse: Spouse;
  isFaded: boolean;
  onSelect: (spouse: Spouse) => void;
}

export const SpouseCard: React.FC<SpouseCardProps> = ({
  spouse,
  isFaded,
  onSelect
}) => {
  const isLiving = spouse.status === 'Còn sống';
  const isDeceased = spouse.status === 'Đã mất';

  const birthText = spouse.birthYear ? String(spouse.birthYear) : '?';
  const deathText = isLiving ? 'Nay' : (spouse.deathYear ? String(spouse.deathYear) : '?');
  const lifespan = `${birthText} - ${deathText}`;

  return (
    <div
      onClick={() => onSelect(spouse)}
      className={`relative w-[110px] h-[126px] rounded-lg transition-all duration-200 cursor-pointer select-none group
        ${isFaded ? 'opacity-25 grayscale-[30%] scale-95' : 'opacity-100'}
        hover:scale-[1.03] z-10
      `}
      style={{
        background: 'linear-gradient(180deg, #94251B 0%, #6E1810 100%)',
        boxShadow: '0 3px 8px rgba(74, 46, 18, 0.22)'
      }}
    >
      {/* Decorative Ornate Frame */}
      <div className="absolute inset-[2px] rounded-md border border-[#D4A359]/60 pointer-events-none" />
      <div className="absolute inset-[4px] rounded-[5px] border border-[#D4A359]/25 pointer-events-none" />

      {/* Spouse indicator icon */}
      <div
        className="absolute -top-2 right-2 bg-[#EAD4AB] text-[#8C1E14] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-[#D4A359]"
        title="Hôn phối"
      >
        <Heart className="w-2.5 h-2.5 fill-[#8C1E14]" />
      </div>

      {/* Main Content */}
      <div className="pt-2 px-1.5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mt-1 mb-1">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all ${
              isLiving
                ? 'border-[#38A169] bg-[#FAF5ED] ring-1 ring-[#38A169]/50'
                : 'border-[#D4A359]/70 bg-[#E2D8C3]'
            }`}
          >
            {spouse.avatarUrl ? (
              <img
                src={spouse.avatarUrl}
                alt={spouse.fullName}
                className={`w-full h-full object-cover ${isDeceased ? 'grayscale contrast-125' : ''}`}
              />
            ) : (
              <User
                className={`w-6 h-6 ${
                  isLiving
                    ? spouse.gender === 'Nữ' ? 'text-[#D53F8C]' : 'text-[#2B6CB0]'
                    : 'text-[#665544]'
                }`}
              />
            )}
          </div>

          {/* Living/Deceased status dot */}
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${
              isLiving ? 'bg-emerald-500' : 'bg-stone-400'
            }`}
            title={isLiving ? 'Còn sống' : 'Đã mất'}
          />
        </div>

        {/* Spouse Name */}
        <h4 className="font-serif-vi font-bold text-[11px] leading-tight text-[#FFF8EB] line-clamp-2 px-0.5 min-h-[26px] flex items-center justify-center">
          {spouse.fullName}
        </h4>

        {/* Lifespan */}
        <div className="text-[9.5px] font-medium text-[#E8D4B0] tracking-tight mt-0.5">
          {lifespan}
        </div>
      </div>
    </div>
  );
};
