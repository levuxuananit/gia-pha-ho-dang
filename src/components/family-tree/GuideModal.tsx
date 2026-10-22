import React from 'react';
import { X, MousePointer, ZoomIn, Search, GitFork, Star, CircleAlert } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FFFDF9] rounded-2xl shadow-2xl border-2 border-[#D4A359] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-white p-5 border-b-2 border-[#D4A359] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="font-serif-vi font-bold text-xl text-[#FFDF9E]">
            Hướng Dẫn Tra Cứu Cây Phả Hệ
          </h3>
          <p className="text-xs text-[#E8D4B0] mt-0.5">
            Các thao tác tương tác trực quan trên phả đồ Họ Đặng
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs sm:text-sm text-[#4A2E12] max-h-[75vh] overflow-y-auto">
          <div className="flex items-start gap-3 bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DCB8]">
            <MousePointer className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2B1B0F]">Di chuyển & Điều hướng (Pan)</div>
              <div className="text-stone-600 text-xs mt-0.5">
                Nhấp chuột trái và kéo (drag) bất kỳ đâu trên mặt phẳng để di chuyển bản đồ cây phả hệ.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DCB8]">
            <ZoomIn className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2B1B0F]">Phóng to & Thu nhỏ (Zoom)</div>
              <div className="text-stone-600 text-xs mt-0.5">
                Cuộn con lăn chuột (wheel) hoặc dùng hai nút <span className="font-bold">+</span> và <span className="font-bold">-</span> ở góc dưới bên phải để phóng to / thu nhỏ.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DCB8]">
            <GitFork className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5 rotate-180" />
            <div>
              <div className="font-bold text-[#2B1B0F]">Đóng / Mở nhánh con (Collapse / Expand)</div>
              <div className="text-stone-600 text-xs mt-0.5">
                Bấm vào nút tròn nhỏ <span className="font-bold text-[#A32A22]">+</span> hoặc <span className="font-bold text-[#A32A22]">-</span> dưới đáy mỗi thẻ thành viên để thu gọn hoặc mở rộng toàn bộ nhánh hậu duệ của người đó.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DCB8]">
            <Search className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2B1B0F]">Tìm nhanh & Định vị thành viên</div>
              <div className="text-stone-600 text-xs mt-0.5">
                Nhập tên thành viên vào ô <strong>TÌM NHANH</strong> ở góc trên bên phải. Bản đồ sẽ tự động cuộn và làm nổi bật thành viên tương ứng.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DCB8]">
            <Star className="w-5 h-5 text-[#A32A22] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-[#2B1B0F]">Nổi bật nguồn gốc & Xem đời sau</div>
              <div className="text-stone-600 text-xs mt-0.5">
                Bấm vào bất kỳ thẻ thành viên nào, chọn <em>"Nổi bật nguồn gốc"</em> hoặc <em>"Xem đời sau"</em> trong bảng chi tiết để rọi sáng toàn bộ đường truyền phả hệ của nhánh đó.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8EFE0] border-t border-[#E8DCB8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A32A22] hover:bg-[#851F18] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
