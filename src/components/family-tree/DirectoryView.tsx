import React, { useState, useMemo } from 'react';
import { FamilyMember } from '../../types/family';
import { Search, GitFork, User, Calendar, Award } from 'lucide-react';

interface DirectoryViewProps {
  allMembers: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
  onLocateOnTree: (member: FamilyMember) => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  allMembers,
  onSelectMember,
  onLocateOnTree
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genFilter, setGenFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');

  const filteredMembers = useMemo(() => {
    return allMembers.filter(m => {
      const matchSearch = !searchTerm ||
        m.fullName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (m.alias && m.alias.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase().trim()));

      const matchGen = genFilter === 0 || m.generation === genFilter;
      const matchStatus = statusFilter === 'all' || m.status === statusFilter;
      const matchGender = genderFilter === 'all' || m.gender === genderFilter;

      return matchSearch && matchGen && matchStatus && matchGender;
    });
  }, [allMembers, searchTerm, genFilter, statusFilter, genderFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-[#FFFDF9] rounded-2xl shadow-xl border-2 border-[#D4A359] overflow-hidden">
        {/* Table Header Filter Bar */}
        <div className="bg-[#F8EFE0] p-4 sm:p-5 border-b border-[#E8DCB8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm họ tên, tên tự, chức danh..."
                className="w-full bg-white border border-[#D4A359] rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm text-[#3D2510] focus:outline-none focus:ring-2 focus:ring-[#A32A22]"
              />
              <Search className="w-4 h-4 text-[#8C6D46] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Generation Filter */}
            <select
              value={genFilter}
              onChange={(e) => setGenFilter(Number(e.target.value))}
              className="bg-white border border-[#D4A359] text-xs sm:text-sm rounded-lg px-3 py-2 text-[#3D2510] cursor-pointer"
            >
              <option value={0}>Tất cả thế hệ (1 - 12 đời)</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
                <option key={g} value={g}>
                  Đời {g} {g === 1 ? '- Thủy tổ' : ''}
                </option>
              ))}
            </select>

            {/* Gender Filter */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-white border border-[#D4A359] text-xs sm:text-sm rounded-lg px-3 py-2 text-[#3D2510] cursor-pointer"
            >
              <option value="all">Mọi giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#D4A359] text-xs sm:text-sm rounded-lg px-3 py-2 text-[#3D2510] cursor-pointer"
            >
              <option value="all">Mọi hiện trạng</option>
              <option value="Còn sống">Còn sống</option>
              <option value="Đã mất">Đã mất</option>
            </select>
          </div>

          <div className="text-xs font-bold text-[#A32A22]">
            Hiển thị {filteredMembers.length} / {allMembers.length} thành viên
          </div>
        </div>

        {/* Members Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#7B1D14] text-[#FFDF9E] font-serif-vi font-bold border-b border-[#D4A359]">
                <th className="py-3 px-4">Mã TV</th>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4 text-center">Đời</th>
                <th className="py-3 px-4">Giới tính</th>
                <th className="py-3 px-4">Năm sinh - mất</th>
                <th className="py-3 px-4">Chức danh / Vai trò</th>
                <th className="py-3 px-4">Hôn phối</th>
                <th className="py-3 px-4">Hiện trạng</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADFCB] text-[#3D2510]">
              {filteredMembers.map((member, index) => {
                const isLiving = member.status === 'Còn sống';
                const birthStr = member.birthYear ? String(member.birthYear) : '?';
                const deathStr = isLiving ? 'Nay' : (member.deathYear ? String(member.deathYear) : '?');
                const spouseNames = member.spouseName || member.spouses?.map(s => s.fullName).join(', ') || '—';

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-[#FAF4EB] transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#FFFDF9]'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono text-xs text-[#8C6D46] font-semibold">
                      {member.code || `D${member.generation}-${index + 1}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="font-serif-vi font-bold text-[#2B1B0F]">
                          {member.fullName}
                        </div>
                        {member.isRoot && (
                          <span className="bg-[#D4A359] text-[#4A2E12] text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Thủy tổ
                          </span>
                        )}
                        {member.alias && (
                          <span className="text-[11px] text-[#8C6D46]">
                            ({member.alias})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-[#A32A22]">
                      {member.generation}
                    </td>
                    <td className="py-3 px-4">
                      {member.gender === 'Nam' ? (
                        <span className="text-blue-700 font-medium">Nam</span>
                      ) : (
                        <span className="text-pink-700 font-medium">Nữ</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-600">
                      {birthStr} – {deathStr}
                    </td>
                    <td className="py-3 px-4 text-[#66492F]">
                      {member.title || '—'}
                    </td>
                    <td className="py-3 px-4 text-[#523820]">
                      {spouseNames}
                    </td>
                    <td className="py-3 px-4">
                      {isLiving ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                          Còn sống
                        </span>
                      ) : (
                        <span className="bg-stone-200 text-stone-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
                          Đã mất
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onSelectMember(member)}
                          className="px-2.5 py-1 bg-[#A32A22] hover:bg-[#851F18] text-white rounded text-xs font-medium transition-colors cursor-pointer"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => onLocateOnTree(member)}
                          title="Xem trên sơ đồ cây"
                          className="p-1 border border-[#D4A359] hover:bg-[#F3EADB] text-[#7A4B1A] rounded transition-colors cursor-pointer"
                        >
                          <GitFork className="w-3.5 h-3.5 rotate-180" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
