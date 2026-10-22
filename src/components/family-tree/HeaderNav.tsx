import React from "react";
import {
  BookOpen,
  Calendar,
  Award,
  Compass,
  FileText,
  Image as ImageIcon,
  Users,
} from "lucide-react";

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenKinship: () => void;
  onOpenGuide: () => void;
  onOpenEvents: () => void;
  onOpenChronicle: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenKinship,
  onOpenGuide,
  onOpenEvents,
  onOpenChronicle,
}) => {
  return (
    <header className="hidden md:block w-full bg-[#FAF5ED] border-b border-[#E8DCB8] sticky top-0 z-40 select-none shadow-sm">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Family Crest and Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A32A22] to-[#731912] flex items-center justify-center text-[#D4A359] shadow-md border-2 border-[#D4A359]/60">
            <span className="font-serif-vi font-bold text-lg leading-none">
              Đ
            </span>
          </div>
          <div>
            <h1 className="font-serif-vi font-extrabold text-xl sm:text-2xl tracking-wider text-[#4A2E12] uppercase flex items-center gap-2">
              Gia Phả Họ Đặng - Đông Á - Đông Hưng - Thái Bình
            </h1>
            <p className="text-xs text-[#8C6D46] font-medium tracking-wide hidden sm:block">
              Nguồn cội lưu truyền • Phúc ấm muôn đời • Vạn thế trường tồn
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 md:space-x-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab("pha-do")}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "pha-do"
                ? "text-[#A32A22] font-bold border-b-2 border-[#A32A22]"
                : "text-[#6B4F32] hover:text-[#A32A22] hover:bg-[#F3E8D3]"
            }`}
          >
            Phả đồ
          </button>

          <button
            onClick={onOpenChronicle}
            className="px-3 py-1.5 rounded-md text-[#6B4F32] hover:text-[#A32A22] hover:bg-[#F3E8D3] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#A32A22]" />
            <span>Phả ký</span>
          </button>

          <button
            onClick={onOpenEvents}
            className="px-3 py-1.5 rounded-md text-[#6B4F32] hover:text-[#A32A22] hover:bg-[#F3E8D3] transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-[#A32A22]" />
            <span>Sự kiện & Ngày giỗ</span>
          </button>

          <button
            onClick={onOpenKinship}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#6B4F32] hover:text-[#A32A22] hover:bg-[#F3E8D3] transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#A32A22]" />
            <span>Xưng hô dòng tộc</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#6B4F32] hover:text-[#A32A22] hover:bg-[#F3E8D3] transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#A32A22]" />
            <span>Hướng dẫn</span>
          </button>
        </nav>
      </div>

      {/* Traditional Vietnamese Lacquer/Brocade Decorative Ribbon */}
      <div className="w-full h-2.5 bg-gradient-to-r from-[#8C1E14] via-[#B83226] to-[#761810] relative overflow-hidden border-t border-[#D4A359]/40 border-b border-[#52100A]">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
      </div>
    </header>
  );
};
