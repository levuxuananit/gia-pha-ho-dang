import { FamilyMember } from '../types/family';

export interface KinshipResult {
  fromMemberName: string;
  toMemberName: string;
  termFromTo: string;
  termToFrom: string;
  generationDiff: number;
  relationshipDescription: string;
  lineagePath: string[];
}

export function calculateKinship(
  memberA: FamilyMember,
  memberB: FamilyMember,
  allMembers: FamilyMember[]
): KinshipResult {
  if (memberA.id === memberB.id) {
    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: 'Chính mình',
      termToFrom: 'Chính mình',
      generationDiff: 0,
      relationshipDescription: 'Cùng một người',
      lineagePath: [memberA.fullName]
    };
  }

  const memberMap = new Map<string, FamilyMember>();
  allMembers.forEach(m => memberMap.set(m.id, m));

  const genA = memberA.generation;
  const genB = memberB.generation;
  const diff = genA - genB;

  // Direct parent/child
  if (memberB.childrenIds?.includes(memberA.id)) {
    const parentRole = memberB.gender === 'Nam' ? 'Cha / Bố' : 'Mẹ';
    const childRole = memberA.gender === 'Nam' ? 'Con trai' : 'Con gái';
    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: parentRole,
      termToFrom: childRole,
      generationDiff: diff,
      relationshipDescription: `${memberB.fullName} là ${parentRole} trực tiếp của ${memberA.fullName}`,
      lineagePath: [memberB.fullName, memberA.fullName]
    };
  }

  if (memberA.childrenIds?.includes(memberB.id)) {
    const parentRole = memberA.gender === 'Nam' ? 'Cha / Bố' : 'Mẹ';
    const childRole = memberB.gender === 'Nam' ? 'Con trai' : 'Con gái';
    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: childRole,
      termToFrom: parentRole,
      generationDiff: diff,
      relationshipDescription: `${memberA.fullName} là ${parentRole} trực tiếp của ${memberB.fullName}`,
      lineagePath: [memberA.fullName, memberB.fullName]
    };
  }

  // Generation difference analysis
  if (diff === 0) {
    const isASeniorByBirth = (Number(memberA.birthYear) || 2000) < (Number(memberB.birthYear) || 2000);
    const termForOlder = memberB.gender === 'Nam' ? 'Anh họ' : 'Chị họ';
    const termForYounger = 'Em họ';

    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: isASeniorByBirth ? termForYounger : termForOlder,
      termToFrom: isASeniorByBirth ? termForOlder : termForYounger,
      generationDiff: 0,
      relationshipDescription: `Cùng thuộc Đời thứ ${genA} trong tộc Họ Đặng (quan hệ anh em cùng thế hệ).`,
      lineagePath: [memberA.fullName, '...', memberB.fullName]
    };
  }

  if (diff === 1) {
    let termB = 'Bác';
    if (memberB.gender === 'Nữ') {
      termB = 'Cô / Bác gái';
    } else {
      termB = 'Bác / Chú';
    }
    const termA = memberA.gender === 'Nam' ? 'Cháu trai' : 'Cháu gái';

    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: termB,
      termToFrom: termA,
      generationDiff: diff,
      relationshipDescription: `${memberB.fullName} thuộc hàng bậc cha chú (Đời ${genB}), ${memberA.fullName} là hàng cháu (Đời ${genA}).`,
      lineagePath: [memberB.fullName, '...', memberA.fullName]
    };
  }

  if (diff === -1) {
    let termA = memberA.gender === 'Nữ' ? 'Cô / Bác gái' : 'Bác / Chú';
    const termB = memberB.gender === 'Nam' ? 'Cháu trai' : 'Cháu gái';

    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: termB,
      termToFrom: termA,
      generationDiff: diff,
      relationshipDescription: `${memberA.fullName} thuộc hàng bậc cha chú (Đời ${genA}), ${memberB.fullName} là hàng cháu (Đời ${genB}).`,
      lineagePath: [memberA.fullName, '...', memberB.fullName]
    };
  }

  if (diff === 2) {
    const termB = memberB.gender === 'Nam' ? 'Ông (Ông bác / Ông chú)' : 'Bà (Bà cô)';
    const termA = 'Cháu nội tộc';
    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: termB,
      termToFrom: termA,
      generationDiff: diff,
      relationshipDescription: `${memberB.fullName} thuộc hàng Ông/Bà (Đời ${genB}), cách ${diff} đời so với ${memberA.fullName} (Đời ${genA}).`,
      lineagePath: [memberB.fullName, '...', memberA.fullName]
    };
  }

  if (diff === -2) {
    const termA = memberA.gender === 'Nam' ? 'Ông' : 'Bà';
    const termB = 'Cháu nội tộc';
    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: termB,
      termToFrom: termA,
      generationDiff: diff,
      relationshipDescription: `${memberA.fullName} thuộc hàng Ông/Bà (Đời ${genA}), cách 2 đời so với ${memberB.fullName} (Đời ${genB}).`,
      lineagePath: [memberA.fullName, '...', memberB.fullName]
    };
  }

  if (diff >= 3) {
    const termB = diff === 3 
      ? (memberB.gender === 'Nam' ? 'Cụ ông' : 'Cụ bà')
      : (memberB.gender === 'Nam' ? 'Kỵ / Tiên tổ' : 'Kỵ bà / Tiên tổ');
    const termA = diff === 3 ? 'Chắt' : 'Chút / Chít';

    return {
      fromMemberName: memberA.fullName,
      toMemberName: memberB.fullName,
      termFromTo: termB,
      termToFrom: termA,
      generationDiff: diff,
      relationshipDescription: `${memberB.fullName} là bậc tiền bối cao niên (Đời ${genB}), cách ${diff} thế hệ so với ${memberA.fullName} (Đời ${genA}).`,
      lineagePath: [memberB.fullName, '...', memberA.fullName]
    };
  }

  const termA = diff === -3 
    ? (memberA.gender === 'Nam' ? 'Cụ ông' : 'Cụ bà')
    : 'Tiên tổ';
  const termB = diff === -3 ? 'Chắt' : 'Chút / Chít';

  return {
    fromMemberName: memberA.fullName,
    toMemberName: memberB.fullName,
    termFromTo: termB,
    termToFrom: termA,
    generationDiff: diff,
    relationshipDescription: `${memberA.fullName} (Đời ${genA}) là bậc tiền bối của ${memberB.fullName} (Đời ${genB}), cách ${Math.abs(diff)} thế hệ.`,
    lineagePath: [memberA.fullName, '...', memberB.fullName]
  };
}
