import React from 'react';
import { Menu, Search, GitFork } from 'lucide-react';

interface MobileHeaderProps {
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  isSearchActive: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenDrawer,
  onOpenSearch,
  isSearchActive
}) => {
  return (
    <div className="md:hidden w-full bg-[#FAF5ED] border-b border-[#E8DCB8] sticky top-0 z-40 shadow-xs select-none">
      <div className="px-3.5 h-14 flex items-center justify-between">
        {/* Family Brand Badge */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A32A22] to-[#731912] flex items-center justify-center text-[#D4A359] shadow-sm border border-[#D4A359]/70 shrink-0">
            <span className="font-serif-vi font-bold text-sm leading-none">Đ</span>
          </div>
          <div>
            <h1 className="font-serif-vi font-extrabold text-base tracking-wide text-[#4A2E12] uppercase leading-none">
              Gia Phả Họ Đặng
            </h1>
            <p className="text-[10px] text-[#8C6D46] font-medium tracking-tight mt-0.5">
              Đại Tộc • Cây phả hệ số
            </p>
          </div>
        </div>

        {/* Quick Action Buttons: Search & Hamburger Menu */}
        <div className="flex items-center gap-1.5">
          {/* Quick Search Toggle Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Tìm nhanh"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              isSearchActive
                ? 'bg-[#A32A22] text-white shadow-sm'
                : 'bg-[#FFFDF9] hover:bg-[#F3EADB] text-[#59391A] border border-[#D4A359]'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Hamburger Menu Button */}
          <button
            onClick={onOpenDrawer}
            aria-label="Mở bảng điều khiển"
            className="w-9 h-9 rounded-lg bg-[#A32A22] hover:bg-[#851F18] active:bg-[#6D1812] text-[#FFDF9E] flex items-center justify-center shadow-sm cursor-pointer transition-transform active:scale-95 border border-[#D4A359]"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Traditional Vietnamese Decorative Thin Ribbon */}
      <div className="w-full h-1 bg-gradient-to-r from-[#8C1E14] via-[#B83226] to-[#761810]" />
    </div>
  );
};
