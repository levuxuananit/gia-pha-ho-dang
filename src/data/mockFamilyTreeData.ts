import rawGenealogyCsv from './genealogy.csv?raw';
import { parseGenealogyCSV } from '../utils/genealogyParser';
import { FamilyMember } from '../types/family';

// Parsed records directly from the attached genealogy CSV
export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = parseGenealogyCSV(rawGenealogyCsv);

export const BRANCHES_LIST = [
  { id: 'all', name: 'Phả đồ Họ Đặng (Toàn tộc 12 đời)' },
  { id: 'chi_1', name: 'Chi 1: Cụ Đặng Đình Đủng (Đời 5)' },
  { id: 'chi_2', name: 'Chi 2: Cụ Đặng Đình Truyền (Đời 5)' },
  { id: 'chi_3', name: 'Chi 3: Cụ Đặng Đình Trực (Đời 5)' },
];

export const ANNIVERSARY_EVENTS = [
  {
    id: 'ev_1',
    title: 'Lễ Giỗ Thủy Tổ Đặng Đình Lĩnh (D1C0N0)',
    lunarDate: 'Ngày 12 tháng Giêng (12/01 Âm lịch)',
    solarDate: '18/02/2026',
    location: 'Từ Đường Tiền Hiền Đặng Tộc, Đông Hưng, Thái Bình',
    attendees: 'Toàn thể con cháu nội ngoại 3 Chi (12 thế hệ)',
    note: 'Lễ tế tổ truyền thống hàng năm, thắp hương tri ân công đức Cụ Thủy tổ Đặng Đình Lĩnh và Cụ bà Nhâm Thị Hiệu (thời kỳ 1740 - 1810).'
  },
  {
    id: 'ev_2',
    title: 'Lễ Tảo Mộ Tiết Thanh Minh Đặng Tộc',
    lunarDate: 'Tiết Thanh Minh (Tháng 3 Âm lịch)',
    solarDate: '05/04/2026',
    location: 'Khu lăng mộ gia tộc Họ Đặng, Đông Hưng, Thái Bình',
    attendees: 'Hội đồng gia tộc & đại diện các Chi 1, Chi 2, Chi 3',
    note: 'Tu bổ, dọn dẹp các phần mộ tổ tiên từ Đời 1 đến Đời 12.'
  },
  {
    id: 'ev_3',
    title: 'Họp Mặt Khuyến Học & Tuyên Dương Thế Hệ Trẻ Họ Đặng',
    lunarDate: 'Mùng 6 Tết Âm lịch',
    solarDate: '22/02/2026',
    location: 'Nhà Thờ Tổ Họ Đặng',
    attendees: 'Con cháu các thế hệ',
    note: 'Trao thưởng khuyến học cho các cháu học sinh giỏi, thủ khoa và mừng thọ các cụ cao niên.'
  }
];
