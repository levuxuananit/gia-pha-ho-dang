import { FamilyMember, Spouse, Gender, LifeStatus } from '../types/family';

/**
 * Robust CSV Line Parser supporting quoted fields and embedded commas
 */
export function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Extracts generation number from 'D' prefix (e.g. 'D8' -> 8, '8' -> 8)
 */
export function extractGeneration(dStr: string): number {
  const match = dStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
}

/**
 * Extracts Chi number from 'C' prefix (e.g. 'C1' -> 1, 'C0' -> 0)
 */
export function extractChi(cStr: string): number {
  const match = cStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Extracts branch string from 'N' prefix (e.g. 'N112' -> '112', 'N0' -> '0')
 */
export function extractBranch(nStr: string, gen: number): string {
  const clean = (nStr || '').trim().replace(/^N/i, '');
  if (clean.length > 0) return clean;
  // Fallbacks if blank in CSV
  if (gen <= 5) return '0';
  return '1';
}

/**
 * Computes parent code according to the D-C-N prefix algorithm
 */
export function computeParentCode(gen: number, chi: number, branchCode: string): string | null {
  if (gen <= 1) {
    return null;
  }
  if (gen >= 2 && gen <= 4) {
    return `D${gen - 1}C0N0`;
  }
  if (gen === 5) {
    // Generations 5 (Chi 1, Chi 2, Chi 3) are children of D4C0N0 (Cụ Đặng Trung Trinh)
    return 'D4C0N0';
  }
  if (gen === 6) {
    // Generation 6 branches are children of their respective Chi leader at Generation 5
    return `D5C${chi}N0`;
  }
  // For Gen >= 7: Parent code is (Gen - 1), same Chi, and Branch Code with last character removed
  const parentBranch = branchCode.length > 1 ? branchCode.slice(0, -1) : '1';
  return `D${gen - 1}C${chi}N${parentBranch}`;
}

/**
 * Parses full genealogy CSV data into structured FamilyMember objects
 */
export function parseGenealogyCSV(csvContent: string): FamilyMember[] {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const rawMembers: FamilyMember[] = [];
  const codeTracker = new Map<string, number>();

  // Process rows (skip header row 0)
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (!cols || cols.length < 5 || !cols[0].trim().toUpperCase().startsWith('D')) {
      continue;
    }

    const dCol = cols[0];
    const cCol = cols[1] || 'C0';
    const nCol = cols[2] || '';
    const genderCol = cols[3] || 'Nam';
    const nameCol = cols[4] || '';
    const spouseCol = cols[5] || '';
    const statusCol = cols[6] || '';
    const birthCol = cols[7] || '';
    const deathCol = cols[8] || '';
    const phoneCol = cols[9] || '';
    const notesCol = cols[10] || '';

    const gen = extractGeneration(dCol);
    const chi = extractChi(cCol);
    const branch = extractBranch(nCol, gen);

    let baseCode = `D${gen}C${chi}N${branch}`;
    let code = baseCode;

    // Disambiguate duplicate codes if any
    const existingCount = codeTracker.get(baseCode) || 0;
    if (existingCount > 0) {
      code = `${baseCode}_${existingCount + 1}`;
    }
    codeTracker.set(baseCode, existingCount + 1);

    const parentId = computeParentCode(gen, chi, branch);
    const gender: Gender = genderCol.toLowerCase().includes('nữ') ? 'Nữ' : 'Nam';

    // Status deduction
    let status: LifeStatus = 'Còn sống';
    const lowerStatus = statusCol.toLowerCase();
    const parsedBirthYear = parseInt(birthCol.replace(/\D/g, '').slice(0, 4), 10);

    if (
      lowerStatus.includes('đã mất') ||
      lowerStatus.includes('mất') ||
      deathCol.trim().length > 0 ||
      notesCol.toLowerCase().includes('liệt sỹ') ||
      (parsedBirthYear && parsedBirthYear < 1935) ||
      gen <= 8
    ) {
      status = 'Đã mất';
    }

    // Process spouses
    const spouses: Spouse[] = [];
    if (spouseCol && spouseCol.trim().length > 0) {
      const spouseNames = spouseCol
        .split(/[,;\/]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      spouseNames.forEach((spName, sIdx) => {
        spouses.push({
          id: `${code}_sp_${sIdx + 1}`,
          fullName: spName,
          gender: gender === 'Nam' ? 'Nữ' : 'Nam',
          status: status,
          birthYear: birthCol || undefined,
          deathYear: deathCol || undefined
        });
      });
    }

    // Title assignment
    let title: string | undefined;
    if (gen === 1) title = 'Thủy tổ khai sáng';
    else if (gen === 2) title = 'Tiền tổ Đời 2';
    else if (gen === 3) title = 'Tiền tổ Đời 3';
    else if (gen === 4) title = 'Tiền bối Đời 4';
    else if (gen === 5) title = `Thủy tổ Chi ${chi}`;

    rawMembers.push({
      id: code,
      code: baseCode,
      generation: gen,
      chi,
      branchCode: branch,
      parentId,
      fullName: nameCol,
      gender,
      birthYear: birthCol || undefined,
      deathYear: deathCol || undefined,
      spouseName: spouseCol || undefined,
      status,
      title,
      notes: notesCol || undefined,
      phone: phoneCol || undefined,
      isRoot: gen === 1,
      childrenIds: [],
      spouses: spouses.length > 0 ? spouses : undefined
    });
  }

  // Populate childrenIds and link parent-child relationships
  const memberMap = new Map<string, FamilyMember>();
  rawMembers.forEach(m => memberMap.set(m.id, m));

  rawMembers.forEach(member => {
    if (member.parentId) {
      // Find parent by exact id or by base code
      let parent = memberMap.get(member.parentId);
      if (!parent) {
        // Fallback search by base code
        parent = rawMembers.find(m => m.code === member.parentId);
      }
      if (parent) {
        if (!parent.childrenIds) parent.childrenIds = [];
        if (!parent.childrenIds.includes(member.id)) {
          parent.childrenIds.push(member.id);
        }
      }
    }
  });

  return rawMembers;
}

/**
 * Determine Siblings: Members sharing the exact same Generation, Chi, and parent N-prefix (or parentId)
 */
export function getSiblings(member: FamilyMember, allMembers: FamilyMember[]): FamilyMember[] {
  if (!member.parentId) return [];
  return allMembers.filter(m => m.id !== member.id && m.parentId === member.parentId);
}

/**
 * Computes lineage statistics
 */
export function getGenealogyStats(members: FamilyMember[]) {
  const total = members.length;
  const males = members.filter(m => m.gender === 'Nam').length;
  const females = members.filter(m => m.gender === 'Nữ').length;
  const maxGen = Math.max(...members.map(m => m.generation), 1);

  const chi1Count = members.filter(m => m.chi === 1).length;
  const chi2Count = members.filter(m => m.chi === 2).length;
  const chi3Count = members.filter(m => m.chi === 3).length;

  return {
    total,
    males,
    females,
    maxGen,
    chi1Count,
    chi2Count,
    chi3Count
  };
}
