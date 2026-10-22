import React from 'react';
import { FamilyMember } from '../../types/family';
import { X, User, Award, MapPin, BookOpen, Heart, Users, Calendar, Sparkles } from 'lucide-react';

interface FullProfileModalProps {
  member: FamilyMember | null;
  allMembers: FamilyMember[];
  onClose: () => void;
  onSelectMember: (m: FamilyMember) => void;
}

export const FullProfileModal: React.FC<FullProfileModalProps> = ({
  member,
  allMembers,
  onClose,
  onSelectMember
}) => {
  if (!member) return null;

  const memberMap = new Map<string, FamilyMember>();
  allMembers.forEach(m => memberMap.set(m.id, m));

  // Build ancestor lineage path back to Thủy tổ
  const lineagePath: FamilyMember[] = [];
  let curr: FamilyMember | undefined = member;
  while (curr) {
    lineagePath.unshift(curr);
    if (!curr.parentId) break;
    curr = memberMap.get(curr.parentId);
  }

  // Children list
  const children = (member.childrenIds || [])
    .map(cid => memberMap.get(cid))
    .filter((c): c is FamilyMember => !!c);

  const isLiving = member.status === 'Còn sống';
  const birthStr = member.birthDate || (member.birthYear ? String(member.birthYear) : 'Chưa rõ');
  const deathStr = isLiving ? 'Còn sống' : (member.deathDate || (member.deathYear ? String(member.deathYear) : 'Chưa rõ'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-[#D4A359] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-white p-5 border-b-2 border-[#D4A359] relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF5ED] border-2 border-[#D4A359] flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.fullName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-9 h-9 text-[#82715F]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-vi font-bold text-2xl text-[#FFDF9E]">
                  {member.fullName}
                </h2>
                {member.isRoot && (
                  <span className="bg-[#D4A359] text-[#4A2E12] text-xs font-bold px-2 py-0.5 rounded-full">
                    Thủy tổ
                  </span>
                )}
              </div>
              <p className="text-sm text-[#E8D4B0] font-medium mt-0.5">
                Đời thứ {member.generation} • {member.title || (member.gender === 'Nam' ? 'Cụ ông' : 'Cụ bà')}
              </p>
              <p className="text-xs text-[#E8D4B0]/80">
                {birthStr} – {deathStr}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#4A2E12]">
          {/* Lineage Path */}
          <div className="bg-[#FAF5EC] p-4 rounded-xl border border-[#E8DCB8]">
            <h4 className="text-xs font-bold text-[#A32A22] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dòng phả hệ trực tiếp (Từ Thủy tổ đến nay)</span>
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {lineagePath.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id !== member.id) {
                        onSelectMember(item);
                      }
                    }}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      item.id === member.id
                        ? 'bg-[#A32A22] text-white font-bold'
                        : 'bg-[#FFF] hover:bg-[#F0E4D0] text-[#59391A] border border-[#D4A359]/60 cursor-pointer'
                    }`}
                  >
                    Đ{item.generation}: {item.fullName}
                  </button>
                  {idx < lineagePath.length - 1 && (
                    <span className="text-[#A32A22] font-bold">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Biography & Deeds */}
          <div>
            <h4 className="font-serif-vi font-bold text-base text-[#2B1B0F] mb-2 flex items-center gap-2 border-b border-[#E8DCB8] pb-1.5">
              <BookOpen className="w-4 h-4 text-[#A32A22]" />
              <span>Tiểu sử & Sự nghiệp</span>
            </h4>
            <p className="text-stone-700 leading-relaxed italic bg-[#FFFBF3] p-3.5 rounded-lg border border-[#EFE5D2]">
              {member.biography || `${member.fullName} là bậc tiền nhân đức độ thuộc Đời thứ ${member.generation} dòng họ Đặng. Ngài một đời trọn nghĩa vẹn tình, giữ gìn gia phong nề nếp, một lòng phụng dưỡng tổ tiên và dạy bảo con cháu phương trưởng.`}
            </p>

            {member.achievements && member.achievements.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-bold text-[#8C6D46] uppercase mb-1.5">Công đức & Đóng góp nổi bật:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-stone-700">
                  {member.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Spouse and Children */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Spouses */}
            <div className="bg-[#FAF5EC] p-4 rounded-xl border border-[#E8DCB8]">
              <h4 className="font-serif-vi font-bold text-sm text-[#2B1B0F] mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#A32A22]" />
                <span>Hôn phối (Vợ / Chồng)</span>
              </h4>
              {member.spouses && member.spouses.length > 0 ? (
                <div className="space-y-2">
                  {member.spouses.map(sp => (
                    <div key={sp.id} className="bg-white p-2.5 rounded-lg border border-[#E0D3BC] text-xs">
                      <div className="font-bold text-[#3A1E08]">{sp.fullName}</div>
                      <div className="text-stone-500 mt-0.5">
                        {sp.birthYear || '?'} – {sp.deathYear || (sp.status === 'Còn sống' ? 'Nay' : '?')}
                      </div>
                      {sp.hometown && <div className="text-stone-500 text-[11px]">Quê quán: {sp.hometown}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">Chưa có thông tin hôn phối</p>
              )}
            </div>

            {/* Children */}
            <div className="bg-[#FAF5EC] p-4 rounded-xl border border-[#E8DCB8]">
              <h4 className="font-serif-vi font-bold text-sm text-[#2B1B0F] mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#A32A22]" />
                <span>Hậu duệ (Các con: {children.length})</span>
              </h4>
              {children.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onSelectMember(child)}
                      className="w-full text-left bg-white hover:bg-[#F5EBDB] p-2 rounded-lg border border-[#E0D3BC] text-xs flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="font-bold text-[#3A1E08]">{child.fullName}</span>
                      <span className="text-[10px] text-[#A32A22] font-semibold">Đời {child.generation}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic">Chưa ghi nhận hoặc chưa có nhánh con</p>
              )}
            </div>
          </div>

          {/* Burial place */}
          {member.burialPlace && (
            <div className="bg-[#FFF8EC] p-3.5 rounded-xl border border-[#D4A359]/70 flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-xs text-[#A32A22] uppercase tracking-wide">
                  Phần mộ & Nơi an táng gia tộc:
                </div>
                <div className="text-xs font-semibold text-[#3D2510] mt-0.5">
                  {member.burialPlace}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8EFE0] border-t border-[#E8DCB8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A32A22] hover:bg-[#851F18] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
