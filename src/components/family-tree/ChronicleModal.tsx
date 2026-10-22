import React from 'react';
import { X, BookOpen, Scroll, Flame, Landmark } from 'lucide-react';

interface ChronicleModalProps {
  onClose: () => void;
}

export const ChronicleModal: React.FC<ChronicleModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-[#D4A359] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-white p-5 border-b-2 border-[#D4A359] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Scroll className="w-6 h-6 text-[#FFDF9E]" />
            <div>
              <h3 className="font-serif-vi font-bold text-xl text-[#FFDF9E]">
                Phả Ký Dòng Tộc Họ Đặng
              </h3>
              <p className="text-xs text-[#E8D4B0]">
                Khởi nguồn phát tích • Lời tựa tiền nhân • Gia quy truyền gia
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs sm:text-sm text-[#4A2E12] overflow-y-auto leading-relaxed">
          {/* Lời tựa */}
          <div className="bg-[#FAF5EC] p-4 rounded-xl border border-[#E8DCB8]">
            <h4 className="font-serif-vi font-bold text-sm text-[#A32A22] mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#A32A22]" />
              <span>Lời Tựa Gia Phả (Tổ Huấn)</span>
            </h4>
            <p className="italic text-stone-700 leading-relaxed font-serif-vi">
              "Cây có gốc mới nở cành xanh ngọn, nước có nguồn mới chảy rộng sông sâu. Người sinh ra có tổ có tông, như chim có tổ như sông có nguồn. Dòng tộc Họ Đặng ta trải qua bao thăng trầm thế sự, lấy chữ Nhân làm gốc, chữ Hiếu làm đầu, chữ Trí mở mang cơ nghiệp."
            </p>
          </div>

          {/* Lịch sử nguồn cội */}
          <div>
            <h4 className="font-serif-vi font-bold text-base text-[#2B1B0F] mb-2 border-b border-[#E8DCB8] pb-1.5 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#A32A22]" />
              <span>Nguồn Gốc Khởi Phát Dòng Tộc</span>
            </h4>
            <p className="text-stone-700 mb-2">
              Khởi tổ từ Cụ Thủy tổ <strong>ĐẶNG ĐÌNH LĨNH (D1C0N0)</strong> (khoảng năm 1740 – 1810) cùng Cụ bà Nhâm Thị Hiệu, đặt nền móng dựng ấp, lập nghiệp tại vùng đất địa linh nhân kiệt Đông Hưng, Thái Bình.
            </p>
            <p className="text-stone-700 mb-2">
              Kế nghiệp qua các đời tiền bối: <strong>Cụ Đặng Đình Hoa (Đời 2)</strong>, <strong>Cụ Đặng Đình Thuận (Đời 3)</strong>, và <strong>Cụ Đặng Trung Trinh (Đời 4)</strong>. Đến thế hệ thứ 5, ba người con trai đã phân lập thành 3 Chi tộc lớn lưu truyền thịnh vượng đến nay:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-stone-700 pl-2">
              <li><strong>Chi 1:</strong> Khởi từ Cụ Đặng Đình Đủng (D5C1N0)</li>
              <li><strong>Chi 2:</strong> Khởi từ Cụ Đặng Đình Truyền (D5C2N0)</li>
              <li><strong>Chi 3:</strong> Khởi từ Cụ Đặng Đình Trực (D5C3N0)</li>
            </ul>
            <p className="text-stone-700 mt-2">
              Đến nay dòng họ đã phát triển vượt bậc qua <strong>12 thế hệ</strong> với hơn 569 đinh phái, lưu giữ truyền thống hiếu học, yêu nước và phụng sự xã hội.
            </p>
          </div>

          {/* Bài thơ thế thứ (Chữ lót các đời) */}
          <div className="bg-[#FFFBF3] p-4 rounded-xl border-2 border-[#D4A359] text-center">
            <h4 className="text-xs font-bold text-[#A32A22] uppercase tracking-widest mb-2">
              BÀI THƠ THẾ THỨ (CHỮ ĐỆM CÁC THẾ HỆ)
            </h4>
            <div className="font-serif-vi font-bold text-sm text-[#5C2B10] space-y-1.5 py-1">
              <p>Phúc - An - Khiêm - Thế - Minh</p>
              <p>Dũng - Huy - Đức - Thịnh - Vinh</p>
              <p>Gia - Phong - Vạn - Đại - Thịnh</p>
              <p>Bản - Thảo - Hiếu - Nghĩa - Sinh</p>
            </div>
            <p className="text-[11px] text-stone-500 mt-2">
              (Bài thơ gồm 20 chữ truyền đời để các thế hệ con cháu đặt tên đệm, nhận biết thứ bậc anh em trong tộc)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8EFE0] border-t border-[#E8DCB8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A32A22] hover:bg-[#851F18] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Đóng phả ký
          </button>
        </div>
      </div>
    </div>
  );
};
