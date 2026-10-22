import React from 'react';
import { TreeFilter, ViewMode, FamilyMember } from '../../types/family';
import { BRANCHES_LIST } from '../../data/mockFamilyTreeData';
import { GitFork, ListFilter, Users, HelpCircle, Layers, EyeOff, Network, Sparkles, Download } from 'lucide-react';

interface TreeControlsProps {
  filters: TreeFilter;
  onFilterChange: (newFilters: Partial<TreeFilter>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  allMembers: FamilyMember[];
  onOpenKinship: () => void;
  onOpenGuide: () => void;
  onResetView: () => void;
}

export const TreeControls: React.FC<TreeControlsProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  allMembers,
  onOpenKinship,
  onOpenGuide,
  onResetView
}) => {
  // Compute real-time stats
  const totalCount = allMembers.length;
  const maleCount = allMembers.filter(m => m.gender === 'Nam').length;
  const femaleCount = allMembers.filter(m => m.gender === 'Nữ').length;
  const maxGen = Math.max(...allMembers.map(m => m.generation), 1);

  return (
    <div className="hidden md:block w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
      {/* Visual Title and Instruction matching Screenshot 2 */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A32A22]">
          <span>•</span>
          <span className="h-[1px] w-6 bg-[#A32A22]/50 inline-block" />
          <span>SƠ ĐỒ TRỰC QUAN</span>
          <span className="h-[1px] w-6 bg-[#A32A22]/50 inline-block" />
          <span>•</span>
        </div>

        <h2 className="font-serif-vi font-bold text-2xl sm:text-3xl lg:text-4xl text-[#3A1E08] mt-1.5 tracking-tight">
          Cây Phả Hệ Tương Tác
        </h2>

        <div className="flex items-center justify-center gap-2 my-2">
          <span className="h-[1px] w-12 bg-[#D4A359]" />
          <span className="w-2 h-2 rounded-full bg-[#D4A359]" />
          <span className="h-[1px] w-12 bg-[#D4A359]" />
        </div>

        <p className="text-xs sm:text-sm text-[#6E5339] leading-relaxed max-w-2xl mx-auto">
          Kéo để di chuyển, cuộn / chụm để phóng to – thu nhỏ, bấm vào nút tròn dưới mỗi ô để thu gọn hoặc
          mở rộng nhánh con. Dùng ô tìm kiếm ở góc phải để tra cứu nhanh theo tên hoặc đời.
        </p>
      </div>

      {/* Primary Toolbar Bar */}
      <div className="space-y-3">
        {/* Row 1: Branch Selector & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
          {/* Branch Picker */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#A32A22] uppercase tracking-wide text-xs sm:text-sm shrink-0">
              CHỌN PHẢ ĐỒ:
            </span>
            <div className="relative">
              <select
                value={filters.selectedBranch}
                onChange={(e) => onFilterChange({ selectedBranch: e.target.value })}
                className="bg-[#FFFDF9] border border-[#D4A359] text-[#3D2510] font-medium text-xs sm:text-sm rounded-lg px-3.5 py-1.5 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-[#A32A22] cursor-pointer shadow-sm min-w-[240px]"
              >
                {BRANCHES_LIST.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8C6D46]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Real-time Statistics Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-[#523820] bg-[#F7EFE1]/80 px-4 py-1.5 rounded-full border border-[#E4D5BC]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[#A32A22]">Tổng:</span>
              <span className="font-bold text-[#2A1808]">{totalCount} thành viên</span>
            </div>
            <span className="text-[#D4A359]">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#1D4ED8] font-bold">♂</span>
              <span>{maleCount} nam</span>
            </div>
            <span className="text-[#D4A359]">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#BE185D] font-bold">♀</span>
              <span>{femaleCount} nữ</span>
            </div>
            <span className="text-[#D4A359]">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#96632A] font-bold">🏛️</span>
              <span>{maxGen} đời</span>
            </div>
          </div>
        </div>

        {/* Row 2: View Switcher, Filters, and Action Modals */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Left: View Mode & Depth Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex rounded-lg border border-[#D4A359] p-0.5 bg-[#F5EEDB]">
              <button
                onClick={() => onViewModeChange('tree')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-[#A32A22] text-white shadow-sm'
                    : 'text-[#5C4530] hover:text-[#A32A22]'
                }`}
              >
                <GitFork className="w-3.5 h-3.5 rotate-180" />
                <span>Sơ đồ</span>
              </button>

              <button
                onClick={() => onViewModeChange('directory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  viewMode === 'directory'
                    ? 'bg-[#A32A22] text-white shadow-sm'
                    : 'text-[#5C4530] hover:text-[#A32A22]'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Thư mục</span>
              </button>
            </div>

            {/* Depth filter: Giới hạn hiển thị */}
            <div className="relative">
              <select
                value={filters.generationLimit}
                onChange={(e) => onFilterChange({ generationLimit: Number(e.target.value) })}
                className="bg-[#FFFDF9] border border-[#D4A359] text-[#3D2510] text-xs font-medium rounded-lg px-3 py-1.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-[#A32A22] cursor-pointer shadow-sm"
              >
                <option value={0}>Giới hạn hiển thị: Tất cả</option>
                <option value={3}>Chỉ xem đến Đời 3</option>
                <option value={4}>Chỉ xem đến Đời 4</option>
                <option value={5}>Chỉ xem đến Đời 5</option>
                <option value={7}>Chỉ xem đến Đời 7</option>
                <option value={12}>Hiển thị tối đa 12 đời</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#8C6D46]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Checkbox: Ẩn hôn phối */}
            <label className="flex items-center gap-1.5 text-xs font-medium text-[#4A2E12] cursor-pointer select-none bg-[#FAF4EB] hover:bg-[#F3EADB] px-2.5 py-1.5 rounded-md border border-[#E0D1B5] transition-colors">
              <input
                type="checkbox"
                checked={filters.hideSpouses}
                onChange={(e) => onFilterChange({ hideSpouses: e.target.checked })}
                className="w-3.5 h-3.5 text-[#A32A22] rounded focus:ring-0 accent-[#A32A22] cursor-pointer"
              />
              <span>Ẩn hôn phối</span>
            </label>

            {/* Checkbox: Hiển thị đường nối hôn phối đến con */}
            <label className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#4A2E12] cursor-pointer select-none bg-[#FAF4EB] hover:bg-[#F3EADB] px-2.5 py-1.5 rounded-md border border-[#E0D1B5] transition-colors">
              <input
                type="checkbox"
                checked={filters.showSpouseToChildLine}
                onChange={(e) => onFilterChange({ showSpouseToChildLine: e.target.checked })}
                className="w-3.5 h-3.5 text-[#A32A22] rounded focus:ring-0 accent-[#A32A22] cursor-pointer"
              />
              <span>Hiển thị đường nối hôn phối đến con</span>
            </label>
          </div>

          {/* Right: Modals and Quick Help */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenKinship}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4A359] bg-[#FFFBF3] hover:bg-[#F4E9D5] text-[#59391A] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#A32A22]" />
              <span>Quan hệ xưng hô</span>
            </button>

            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4A359] bg-[#FFFBF3] hover:bg-[#F4E9D5] text-[#59391A] text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#A32A22]" />
              <span>Hướng dẫn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
