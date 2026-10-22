export type Gender = 'Nam' | 'Nữ';
export type LifeStatus = 'Còn sống' | 'Đã mất';

export interface Spouse {
  id: string;
  fullName: string;
  gender: Gender;
  birthYear?: string;
  deathYear?: string;
  birthDate?: string;
  deathDate?: string;
  status: LifeStatus;
  avatarUrl?: string;
  title?: string;
  alias?: string;
  education?: string;
  notes?: string;
  hometown?: string;
  burialPlace?: string;
}

export interface FamilyMember {
  id: string; // The full code, e.g., 'D8C1N112'
  code: string; // 'D8C1N112'
  generation: number; // e.g. 8 (Đời thứ 8)
  chi: number; // e.g. 1 (Chi 1)
  branchCode: string; // e.g. '112'
  parentId: string | null; // e.g. 'D7C1N11'
  fullName: string;
  gender: Gender;
  birthYear?: string;
  deathYear?: string;
  spouseName?: string;
  status: LifeStatus;
  title?: string;
  notes?: string;
  phone?: string;
  deathDate?: string;
  birthDate?: string;
  childrenIds?: string[];
  isRoot?: boolean;
  spouses?: Spouse[];
  avatarUrl?: string;
  
  alias?: string;
  education?: string;
  occupation?: string;
  burialPlace?: string;
  hometown?: string;
  biography?: string;
  achievements?: string[];
}

export interface LayoutNode {
  member: FamilyMember;
  x: number;
  y: number;
  width: number;
  height: number;
  hasSpouse: boolean;
  spouseWidth: number;
  totalCardWidth: number;
  hasChildren: boolean;
  isCollapsed: boolean;
}

export interface ConnectorLine {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  parentId: string;
  childId: string;
  isHighlighted?: boolean;
}

export interface TreeFilter {
  generationLimit: number; // 0 for all, or 3, 5, 7, 12
  hideSpouses: boolean;
  showSpouseToChildLine: boolean;
  searchQuery: string;
  searchGeneration: number; // 0 for all
  selectedBranch: string; // 'all' | 'chi_1' | 'chi_2' | 'chi_3'
}

export type ViewMode = 'tree' | 'directory';
