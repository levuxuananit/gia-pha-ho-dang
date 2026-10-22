import React from 'react';
import { FamilyMember } from '../../types/family';
import { Crown, User, Plus, Minus } from 'lucide-react';

interface NodeCardProps {
  member: FamilyMember;
  isCollapsed: boolean;
  hasChildren: boolean;
  childrenCount: number;
  isSelected: boolean;
  isHighlighted: boolean;
  isSearchMatch: boolean;
  isFaded: boolean;
  onSelect: (member: FamilyMember) => void;
  onToggleCollapse: (memberId: string, e: React.MouseEvent) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  member,
  isCollapsed,
  hasChildren,
  childrenCount,
  isSelected,
  isHighlighted,
  isSearchMatch,
  isFaded,
  onSelect,
  onToggleCollapse
}) => {
  const isLiving = member.status === 'Còn sống';
  const isDeceased = member.status === 'Đã mất';

  const birthText = member.birthYear ? String(member.birthYear) : '?';
  const deathText = isLiving ? 'Nay' : (member.deathYear ? String(member.deathYear) : '?');
  const lifespan = `${birthText} - ${deathText}`;

  return (
    <div
      onClick={() => onSelect(member)}
      className={`relative w-[110px] h-[126px] rounded-lg transition-all duration-300 cursor-pointer select-none group
        ${isFaded ? 'opacity-25 grayscale-[30%] scale-95' : 'opacity-100'}
        ${isHighlighted ? 'scale-105 z-20 ring-3 ring-[#F59E0B] ring-offset-2 ring-offset-[#FAF5EC]' : isSelected ? 'scale-105 z-20' : 'hover:scale-[1.03] z-10'}
      `}
      style={{
        background: 'linear-gradient(180deg, #A82D20 0%, #871D12 100%)',
        boxShadow: isSearchMatch
          ? '0 0 0 3px #F59E0B, 0 8px 20px rgba(245, 158, 11, 0.5)'
          : isHighlighted
          ? '0 0 0 2.5px #FFD700, 0 10px 24px rgba(245, 158, 11, 0.65)'
          : isSelected
          ? '0 0 0 2.5px #FFD700, 0 8px 18px rgba(163, 42, 34, 0.45)'
          : '0 3px 8px rgba(74, 46, 18, 0.25)'
      }}
    >
      {/* Ornate Gold Border Frame */}
      <div className="absolute inset-[2px] rounded-md border border-[#D4A359]/70 pointer-events-none" />
      <div className="absolute inset-[4px] rounded-[5px] border border-[#D4A359]/30 pointer-events-none" />

      {/* Root / Thủy Tổ Badge */}
      {member.isRoot && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4A359] via-[#FFD700] to-[#B3833B] text-[#4A2E12] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md border border-[#FFF8E7] z-20 whitespace-nowrap">
          <Crown className="w-2.5 h-2.5 fill-[#4A2E12]" />
          <span>Thuỷ tổ</span>
        </div>
      )}

      {/* Generation Tag top-right */}
      <div className="absolute top-1 right-1.5 text-[8.5px] font-bold text-[#E6C687] opacity-80">
        Đ{member.generation}
      </div>

      {/* Main Content */}
      <div className="pt-2 px-1.5 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mt-1 mb-1">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden border-2 transition-all ${
              isLiving
                ? 'border-[#38A169] bg-[#FAF5ED] ring-1 ring-[#38A169]/50'
                : 'border-[#D4A359]/80 bg-[#E2D8C3]'
            }`}
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.fullName}
                className={`w-full h-full object-cover ${isDeceased ? 'grayscale contrast-125' : ''}`}
              />
            ) : (
              <User
                className={`w-6 h-6 ${
                  isLiving
                    ? member.gender === 'Nữ' ? 'text-[#D53F8C]' : 'text-[#2B6CB0]'
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

        {/* Member Full Name */}
        <h4 className="font-serif-vi font-bold text-[11px] leading-tight text-[#FFF8EB] line-clamp-2 px-0.5 min-h-[26px] flex items-center justify-center">
          {member.fullName}
        </h4>

        {/* Lifespan */}
        <div className="text-[9.5px] font-medium text-[#E8D4B0] tracking-tight mt-0.5">
          {lifespan}
        </div>
      </div>

      {/* Expand / Collapse Sub-branch Toggle Button */}
      {hasChildren && (
        <button
          onClick={(e) => onToggleCollapse(member.id, e)}
          title={isCollapsed ? `Mở rộng ${childrenCount} nhánh con` : 'Thu gọn nhánh con'}
          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FAF5ED] hover:bg-[#FFF] text-[#8C1E14] border border-[#D4A359] shadow-sm flex items-center justify-center z-20 cursor-pointer transition-transform hover:scale-115 active:scale-95"
        >
          {isCollapsed ? (
            <Plus className="w-3 h-3 stroke-[3]" />
          ) : (
            <Minus className="w-3 h-3 stroke-[3]" />
          )}
        </button>
      )}
    </div>
  );
};
