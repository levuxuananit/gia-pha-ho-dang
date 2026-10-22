import React from 'react';
import { ANNIVERSARY_EVENTS } from '../../data/mockFamilyTreeData';
import { X, Calendar, MapPin, Users, Clock, Bell } from 'lucide-react';

interface EventsModalProps {
  onClose: () => void;
}

export const EventsModal: React.FC<EventsModalProps> = ({ onClose }) => {
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
            <Calendar className="w-6 h-6 text-[#FFDF9E]" />
            <div>
              <h3 className="font-serif-vi font-bold text-xl text-[#FFDF9E]">
                Lịch Ngày Giỗ & Sự Kiện Dòng Tộc
              </h3>
              <p className="text-xs text-[#E8D4B0]">
                Tập hợp các ngày tế tự, kỵ nhật và họp mặt toàn thể gia tộc Họ Đặng
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {ANNIVERSARY_EVENTS.map(ev => (
            <div
              key={ev.id}
              className="bg-[#FAF5EC] rounded-xl p-4 border border-[#E8DCB8] hover:border-[#D4A359] transition-all shadow-xs"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-serif-vi font-bold text-base text-[#2B1B0F]">
                  {ev.title}
                </h4>
                <span className="bg-[#A32A22] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
                  {ev.lunarDate}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#A32A22]" />
                  <span>Dương lịch dự kiến: <strong>{ev.solarDate}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#A32A22]" />
                  <span>Thành phần: {ev.attendees}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-stone-600 mb-2">
                <MapPin className="w-3.5 h-3.5 text-[#A32A22] shrink-0 mt-0.5" />
                <span>Địa điểm: {ev.location}</span>
              </div>

              <p className="text-xs text-stone-700 italic bg-white p-2.5 rounded-lg border border-[#E8DCB8]">
                {ev.note}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8EFE0] border-t border-[#E8DCB8] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#A32A22] hover:bg-[#851F18] text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
