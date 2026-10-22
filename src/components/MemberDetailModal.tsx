import React from 'react';
import { FamilyMember, Spouse } from '../types/family';
import { getSiblings } from '../utils/genealogyParser';
import { X, User, Sparkles, Heart, Users, MapPin, Tag } from 'lucide-react';

interface MemberDetailModalProps {
  member: FamilyMember | null;
  spouse?: Spouse | null;
  allMembers: FamilyMember[];
  onClose: () => void;
  onViewFullProfile: (member: FamilyMember) => void;
  onHighlightDescendants: (memberId: string) => void;
  onHighlightAncestors: (memberId: string) => void;
  isLineageHighlighted: boolean;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  spouse,
  allMembers,
  onClose,
  onViewFullProfile,
  onHighlightDescendants,
  onHighlightAncestors,
  isLineageHighlighted
}) => {
  if (!member && !spouse) return null;

  const isViewingSpouse = !!spouse && !member;
  const currentPerson = isViewingSpouse ? spouse : member!;

  const isLiving = currentPerson.status === 'Còn sống';
  const birthStr = currentPerson.birthDate || currentPerson.birthYear || 'Chưa rõ';
  const deathStr = isLiving ? 'Còn sống' : (currentPerson.deathDate || currentPerson.deathYear || 'Chưa rõ');
  const lifespanStr = `${birthStr} – ${deathStr}`;

  // Find spouse names if member
  const spouseNames = !isViewingSpouse
    ? (member as FamilyMember).spouseName ||
      ((member as FamilyMember).spouses?.map(s => s.fullName).join(', ') || 'Chưa cập nhật')
    : 'Chưa cập nhật';

  // Find children count
  const childrenCount = !isViewingSpouse && (member as FamilyMember).childrenIds?.length
    ? (member as FamilyMember).childrenIds!.length
    : 0;

  // Sibling list
  const siblings = !isViewingSpouse ? getSiblings(member as FamilyMember, allMembers) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-[2px] animate-fadeIn">
      {/* Detail Modal / Bottom Sheet */}
      <div className="relative w-full sm:max-w-[460px] bg-[#FAF6EE] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border-t-2 sm:border-2 border-[#D4A359]/80 max-h-[85vh] flex flex-col animate-slideUp sm:animate-scaleUp overflow-hidden">
        
        {/* Grab Handle Bar for Mobile */}
        <div className="w-12 h-1.5 bg-[#D4A359]/60 rounded-full mx-auto mb-2 shrink-0 sm:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[#96281B] hover:text-[#52100A] bg-[#F0E4D0]/60 sm:bg-transparent hover:bg-[#F0E4D0] transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Top Section: Avatar + Name + Gen + Code */}
        <div className="flex items-start gap-3.5 pr-8 mb-3 sm:mb-4 shrink-0">
          <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-[#E4D7C2] border-2 border-[#D4A359]/60 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            {currentPerson.avatarUrl ? (
              <img
                src={currentPerson.avatarUrl}
                alt={currentPerson.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-[#82715F]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-serif-vi font-bold text-lg sm:text-2xl text-[#2B1B0F] leading-tight break-words">
              {currentPerson.fullName}
            </h3>

            {!isViewingSpouse && (
              <div className="flex items-center gap-2 mt-1">
                <span className="font-serif-vi font-bold text-xs sm:text-sm tracking-wide text-[#96632A] uppercase">
                  ĐỜI {(member as FamilyMember).generation}
                  {(member as FamilyMember).chi > 0 && ` • CHI ${(member as FamilyMember).chi}`}
                </span>
                <span className="bg-[#A32A22]/10 text-[#A32A22] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                  {(member as FamilyMember).code}
                </span>
              </div>
            )}

            <div className="text-xs sm:text-sm font-medium text-[#5C4530] mt-0.5">
              {lifespanStr}
            </div>
          </div>
        </div>

        {/* Scrollable Details Table */}
        <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-2.5 text-xs sm:text-sm py-2 border-t border-b border-[#E8DCB8]/80 pr-1">
          {!isViewingSpouse && (
            <div className="grid grid-cols-12 gap-2 py-0.5">
              <span className="col-span-5 text-[#735A42] font-medium flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#A32A22]" />
                <span>Mã gia phả</span>
              </span>
              <span className="col-span-7 font-mono font-bold text-[#A32A22]">
                {(member as FamilyMember).code}
                {(member as FamilyMember).parentId && (
                  <span className="text-[10px] font-sans font-normal text-stone-500 block">
                    (Con của: {(member as FamilyMember).parentId})
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-2 py-0.5">
            <span className="col-span-5 text-[#735A42] font-medium">Chức danh</span>
            <span className="col-span-7 font-bold text-[#2A1808]">
              {currentPerson.title || (currentPerson.gender === 'Nam' ? 'Cụ ông' : 'Cụ bà')}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-0.5">
            <span className="col-span-5 text-[#735A42] font-medium">Giới tính</span>
            <span className="col-span-7 font-bold text-[#2A1808]">
              {currentPerson.gender}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-0.5">
            <span className="col-span-5 text-[#735A42] font-medium">Năm sinh</span>
            <span className="col-span-7 font-bold text-[#2A1808]">
              {birthStr}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-0.5">
            <span className="col-span-5 text-[#735A42] font-medium">Năm mất / Ngày giỗ</span>
            <span className="col-span-7 font-bold text-[#2A1808]">
              {isLiving ? '—' : deathStr}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2 py-0.5">
            <span className="col-span-5 text-[#735A42] font-medium">Hiện trạng</span>
            <span className="col-span-7 font-bold">
              {isLiving ? (
                <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full text-xs font-semibold">
                  Còn sống
                </span>
              ) : (
                <span className="text-[#6B5A4B]">
                  Đã mất
                </span>
              )}
            </span>
          </div>

          {!isViewingSpouse && (
            <>
              <div className="grid grid-cols-12 gap-2 py-0.5">
                <span className="col-span-5 text-[#735A42] font-medium">Hôn phối</span>
                <span className="col-span-7 font-bold text-[#2A1808]">
                  {spouseNames}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 py-0.5">
                <span className="col-span-5 text-[#735A42] font-medium">Số con</span>
                <span className="col-span-7 font-bold text-[#2A1808]">
                  {childrenCount > 0 ? `${childrenCount} người` : 'Chưa có'}
                </span>
              </div>

              {siblings.length > 0 && (
                <div className="grid grid-cols-12 gap-2 py-0.5">
                  <span className="col-span-5 text-[#735A42] font-medium">Anh chị em ruột</span>
                  <span className="col-span-7 text-xs text-[#2A1808]">
                    {siblings.map(s => s.fullName).join(', ')} ({siblings.length} người)
                  </span>
                </div>
              )}
            </>
          )}

          {currentPerson.notes && (
            <div className="grid grid-cols-12 gap-2 py-0.5">
              <span className="col-span-5 text-[#735A42] font-medium">Ghi chú</span>
              <span className="col-span-7 text-xs font-semibold text-[#A32A22] bg-[#FAF0E6] p-1.5 rounded">
                {currentPerson.notes}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Immediately Dismiss Modal and Apply Highlight on Canvas */}
        <div className="pt-3 pb-1 shrink-0 space-y-2">
          <div className="flex items-center gap-2.5">
            {!isViewingSpouse && (
              <button
                onClick={() => {
                  onViewFullProfile(member as FamilyMember);
                }}
                className="flex-1 bg-[#A32A22] hover:bg-[#851F18] active:bg-[#6D1812] text-white font-serif-vi font-bold py-2.5 px-3 rounded-xl sm:rounded-full shadow-md transition-all cursor-pointer text-center text-xs sm:text-sm"
              >
                Xem chi tiết
              </button>
            )}

            {!isViewingSpouse && (
              <button
                onClick={() => {
                  onHighlightAncestors((member as FamilyMember).id);
                  onClose(); // Automatically dismiss modal immediately!
                }}
                title="Rọi sáng đường truyền gốc tích từ Thủy tổ xuống đến cụ"
                className="flex-1 border-2 border-[#D4A359] hover:bg-[#F3E7D3] active:bg-[#EBDBC2] text-[#6D4219] font-serif-vi font-bold py-2.5 px-3 rounded-xl sm:rounded-full transition-all cursor-pointer text-center text-xs sm:text-sm"
              >
                Nổi bật nguồn gốc
              </button>
            )}
          </div>

          {!isViewingSpouse && (member as FamilyMember).childrenIds && (member as FamilyMember).childrenIds!.length > 0 && (
            <button
              onClick={() => {
                onHighlightDescendants((member as FamilyMember).id);
                onClose(); // Automatically dismiss modal immediately!
              }}
              title="Rọi sáng tất cả các thế hệ con cháu phía dưới"
              className="w-full py-2.5 rounded-xl bg-[#A32A22]/10 hover:bg-[#A32A22]/20 active:bg-[#A32A22]/30 border border-[#B83226] text-[#A32A22] transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Xem đời sau ({childrenCount} nhánh con)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
