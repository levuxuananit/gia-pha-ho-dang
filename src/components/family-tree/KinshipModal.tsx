import React, { useState } from 'react';
import { FamilyMember } from '../../types/family';
import { calculateKinship } from '../../utils/kinship';
import { X, Users, ArrowRightLeft, Sparkles, BookOpen } from 'lucide-react';

interface KinshipModalProps {
  allMembers: FamilyMember[];
  onClose: () => void;
}

export const KinshipModal: React.FC<KinshipModalProps> = ({ allMembers, onClose }) => {
  // Default pick two members across different generations
  const [memberAId, setMemberAId] = useState<string>(allMembers[0]?.id || '');
  const [memberBId, setMemberBId] = useState<string>(allMembers[allMembers.length - 1]?.id || '');

  const memberA = allMembers.find(m => m.id === memberAId);
  const memberB = allMembers.find(m => m.id === memberBId);

  const kinshipResult = memberA && memberB ? calculateKinship(memberA, memberB, allMembers) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-[#D4A359] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-white p-5 border-b-2 border-[#D4A359] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#FFDF9E]" />
            <div>
              <h3 className="font-serif-vi font-bold text-xl text-[#FFDF9E]">
                Tra Cứu Quan Hệ & Xưng Hô Dòng Tộc
              </h3>
              <p className="text-xs text-[#E8D4B0]">
                Quy chuẩn thứ bậc và danh xưng theo truyền thống lễ nghĩa gia phong Họ Đặng
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-sm text-[#4A2E12]">
          {/* Member Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF5EC] p-4 rounded-xl border border-[#E8DCB8]">
            {/* Person A */}
            <div>
              <label className="block text-xs font-bold text-[#A32A22] uppercase tracking-wide mb-1.5">
                Người thứ nhất (A)
              </label>
              <select
                value={memberAId}
                onChange={(e) => setMemberAId(e.target.value)}
                className="w-full bg-white border border-[#D4A359] rounded-lg p-2 text-xs font-medium text-[#3D2510] focus:ring-2 focus:ring-[#A32A22] cursor-pointer"
              >
                {allMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    Đời {m.generation}: {m.fullName} ({m.birthYear || '?'})
                  </option>
                ))}
              </select>
            </div>

            {/* Person B */}
            <div>
              <label className="block text-xs font-bold text-[#A32A22] uppercase tracking-wide mb-1.5">
                Người thứ hai (B)
              </label>
              <select
                value={memberBId}
                onChange={(e) => setMemberBId(e.target.value)}
                className="w-full bg-white border border-[#D4A359] rounded-lg p-2 text-xs font-medium text-[#3D2510] focus:ring-2 focus:ring-[#A32A22] cursor-pointer"
              >
                {allMembers.map(m => (
                  <option key={m.id} value={m.id}>
                    Đời {m.generation}: {m.fullName} ({m.birthYear || '?'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kinship Result Card */}
          {kinshipResult && memberA && memberB && (
            <div className="bg-[#FFFBF3] border-2 border-[#D4A359] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="text-center pb-2 border-b border-[#E8DCB8]">
                <span className="text-xs font-bold text-[#8C6D46] uppercase tracking-widest">
                  KẾT QUẢ DANH XƯNG GIA TỘC
                </span>
              </div>

              {/* Two-way Call Display */}
              <div className="grid grid-cols-2 gap-4">
                {/* A calls B */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E8DCB8] text-center shadow-xs">
                  <div className="text-xs text-[#8C6D46] font-medium mb-1">
                    <span className="font-bold text-[#3A1E08]">{memberA.fullName}</span> gọi là:
                  </div>
                  <div className="font-serif-vi font-extrabold text-lg sm:text-xl text-[#A32A22]">
                    "{kinshipResult.termFromTo}"
                  </div>
                </div>

                {/* B calls A */}
                <div className="bg-white p-3.5 rounded-xl border border-[#E8DCB8] text-center shadow-xs">
                  <div className="text-xs text-[#8C6D46] font-medium mb-1">
                    <span className="font-bold text-[#3A1E08]">{memberB.fullName}</span> gọi là:
                  </div>
                  <div className="font-serif-vi font-extrabold text-lg sm:text-xl text-[#A32A22]">
                    "{kinshipResult.termToFrom}"
                  </div>
                </div>
              </div>

              {/* Cultural Explanation */}
              <div className="p-3 bg-[#FAF5EC] rounded-lg border border-[#EADFCB] text-xs text-stone-700 leading-relaxed">
                <div className="font-bold text-[#4A2E12] mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#A32A22]" />
                  <span>Giải nghĩa chi tiết:</span>
                </div>
                {kinshipResult.relationshipDescription}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8EFE0] border-t border-[#E8DCB8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A32A22] hover:bg-[#851F18] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
