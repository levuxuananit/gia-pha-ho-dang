import React from 'react';
import { TreeFilter, ViewMode, FamilyMember } from '../../types/family';
import { BRANCHES_LIST } from '../../data/mockFamilyTreeData';
import { X, GitFork, ListFilter, Users, BookOpen, Calendar, HelpCircle, EyeOff, Layers, Check } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TreeFilter;
  onFilterChange: (newFilters: Partial<TreeFilter>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  allMembers: FamilyMember[];
  onOpenKinship: () => void;
  onOpenGuide: () => void;
  onOpenEvents: () => void;
  onOpenChronicle: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  allMembers,
  onOpenKinship,
  onOpenGuide,
  onOpenEvents,
  onOpenChronicle
}) => {
  if (!isOpen) return null;

  // Real-time statistics
  const totalCount = allMembers.length;
  const maleCount = allMembers.filter(m => m.gender === 'Nam').length;
  const femaleCount = allMembers.filter(m => m.gender === 'Nữ').length;
  const maxGen = Math.max(...allMembers.map(m => m.generation), 1);

  return (
    <div className="fixed inset-0 z-50 md:hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      />

      {/* Drawer Container sliding from right */}
      <div className="relative w-full max-w-[320px] bg-[#FAF5EC] h-full shadow-2xl border-l-2 border-[#D4A359] flex flex-col z-10 animate-slideLeft overflow-hidden">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-white p-4 border-b-2 border-[#D4A359] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif-vi font-bold text-base text-[#FFDF9E]">
              Bảng Điều Khiển
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm text-[#4A2E12]">
          {/* Section 1: View Mode Switcher */}
          <div>
            <div className="text-[11px] font-bold text-[#A32A22] uppercase tracking-wider mb-2">
              Chế độ hiển thị
            </div>
            <div className="grid grid-cols-2 gap-2 bg-[#F0E4D0] p-1 rounded-xl border border-[#D4A359]/60">
              <button
                onClick={() => {
                  onViewModeChange('tree');
                  onClose();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'tree'
                    ? 'bg-[#A32A22] text-white shadow-sm'
                    : 'text-[#59391A] hover:text-[#A32A22]'
                }`}
              >
                <GitFork className="w-3.5 h-3.5 rotate-180" />
                <span>Sơ đồ</span>
              </button>

              <button
                onClick={() => {
                  onViewModeChange('directory');
                  onClose();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'directory'
                    ? 'bg-[#A32A22] text-white shadow-sm'
                    : 'text-[#59391A] hover:text-[#A32A22]'
                }`}
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span>Thư mục</span>
              </button>
            </div>
          </div>

          {/* Section 2: Real-time Statistics Card */}
          <div className="bg-[#FFFDF9] rounded-xl p-3.5 border border-[#D4A359]/70 shadow-xs">
            <div className="text-[11px] font-bold text-[#A32A22] uppercase tracking-wider mb-2.5">
              Thống kê gia tộc
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[#FAF5EC] p-2 rounded-lg border border-[#E8DCB8]">
                <div className="text-[#8C6D46] text-[10px]">Tổng thành viên</div>
                <div className="text-base font-bold text-[#2A1808]">{totalCount}</div>
              </div>
              <div className="bg-[#FAF5EC] p-2 rounded-lg border border-[#E8DCB8]">
                <div className="text-[#8C6D46] text-[10px]">Số thế hệ</div>
                <div className="text-base font-bold text-[#A32A22]">{maxGen} đời</div>
              </div>
              <div className="bg-[#FAF5EC] p-2 rounded-lg border border-[#E8DCB8]">
                <div className="text-[#8C6D46] text-[10px]">Số nam</div>
                <div className="text-sm font-bold text-blue-700">♂ {maleCount}</div>
              </div>
              <div className="bg-[#FAF5EC] p-2 rounded-lg border border-[#E8DCB8]">
                <div className="text-[#8C6D46] text-[10px]">Số nữ</div>
                <div className="text-sm font-bold text-pink-700">♀ {femaleCount}</div>
              </div>
            </div>
          </div>

          {/* Section 3: Branch & Depth Filters */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-[#A32A22] uppercase tracking-wider">
              Bộ lọc & Nhánh phả hệ
            </div>

            {/* Select Branch */}
            <div>
              <label className="block text-xs font-semibold text-[#5C4530] mb-1">
                Chọn phả đồ nhánh:
              </label>
              <select
                value={filters.selectedBranch}
                onChange={(e) => onFilterChange({ selectedBranch: e.target.value })}
                className="w-full bg-[#FFFDF9] border border-[#D4A359] text-[#3D2510] text-xs font-medium rounded-lg p-2 cursor-pointer shadow-xs"
              >
                {BRANCHES_LIST.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Generation Depth Limit */}
            <div>
              <label className="block text-xs font-semibold text-[#5C4530] mb-1">
                Giới hạn thế hệ hiển thị:
              </label>
              <select
                value={filters.generationLimit}
                onChange={(e) => onFilterChange({ generationLimit: Number(e.target.value) })}
                className="w-full bg-[#FFFDF9] border border-[#D4A359] text-[#3D2510] text-xs font-medium rounded-lg p-2 cursor-pointer shadow-xs"
              >
                <option value={0}>Tất cả các đời</option>
                <option value={3}>Chỉ xem đến Đời 3</option>
                <option value={4}>Chỉ xem đến Đời 4</option>
                <option value={5}>Chỉ xem đến Đời 5</option>
                <option value={7}>Chỉ xem đến Đời 7</option>
                <option value={12}>Tối đa 12 đời</option>
              </select>
            </div>

            {/* Checkbox: Ẩn hôn phối */}
            <label className="flex items-center gap-2 p-2 bg-[#FFFDF9] rounded-lg border border-[#E8DCB8] text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hideSpouses}
                onChange={(e) => onFilterChange({ hideSpouses: e.target.checked })}
                className="w-4 h-4 text-[#A32A22] rounded accent-[#A32A22] cursor-pointer"
              />
              <span>Ẩn hôn phối trên cây</span>
            </label>

            {/* Checkbox: Nối hôn phối đến con */}
            <label className="flex items-center gap-2 p-2 bg-[#FFFDF9] rounded-lg border border-[#E8DCB8] text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showSpouseToChildLine}
                onChange={(e) => onFilterChange({ showSpouseToChildLine: e.target.checked })}
                className="w-4 h-4 text-[#A32A22] rounded accent-[#A32A22] cursor-pointer"
              />
              <span>Nối đường hôn phối đến con</span>
            </label>
          </div>

          {/* Section 4: Traditional Clan Modals */}
          <div className="space-y-2 pt-2 border-t border-[#E8DCB8]">
            <div className="text-[11px] font-bold text-[#A32A22] uppercase tracking-wider mb-2">
              Tiện ích dòng họ
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenKinship();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F3EADB] border border-[#D4A359] text-xs font-bold text-[#59391A] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#A32A22]" />
                <span>Tra cứu xưng hô gia tộc</span>
              </div>
              <span className="text-[#A32A22]">→</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenChronicle();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F3EADB] border border-[#D4A359] text-xs font-bold text-[#59391A] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#A32A22]" />
                <span>Phả ký & Bài thơ thế thứ</span>
              </div>
              <span className="text-[#A32A22]">→</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenEvents();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F3EADB] border border-[#D4A359] text-xs font-bold text-[#59391A] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#A32A22]" />
                <span>Sự kiện & Ngày giỗ</span>
              </div>
              <span className="text-[#A32A22]">→</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenGuide();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] hover:bg-[#F3EADB] border border-[#D4A359] text-xs font-bold text-[#59391A] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#A32A22]" />
                <span>Hướng dẫn thao tác</span>
              </div>
              <span className="text-[#A32A22]">→</span>
            </button>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 bg-[#F0E4D0] border-t border-[#E8DCB8] text-center text-[10px] text-[#785E42]">
          Gia phả số Họ Đặng • Phiên bản di động
        </div>
      </div>
    </div>
  );
};
