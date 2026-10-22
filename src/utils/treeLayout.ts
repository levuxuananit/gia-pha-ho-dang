import { FamilyMember, LayoutNode, ConnectorLine, TreeFilter } from '../types/family';

export const CARD_WIDTH = 110;
export const CARD_HEIGHT = 120;
export const SPOUSE_GAP = 8;
export const NODE_SPACING_X = 28;
export const GENERATION_HEIGHT = 170;
export const INITIAL_Y_OFFSET = 100;

export interface TreeLayoutResult {
  nodes: LayoutNode[];
  connectors: ConnectorLine[];
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  generationLevels: { level: number; y: number }[];
}

export function computeTreeLayout(
  allMembers: FamilyMember[],
  filters: TreeFilter,
  collapsedNodeIds: Set<string>,
  highlightedMemberIds: Set<string>
): TreeLayoutResult {
  const memberMap = new Map<string, FamilyMember>();
  allMembers.forEach(m => memberMap.set(m.id, m));

  // Determine root members
  let rootMembers = allMembers.filter(m => m.isRoot || !m.parentId);
  if (filters.selectedBranch === 'chi_1') {
    const chi1 = allMembers.find(m => m.code === 'D5C1N0' || m.id === 'D5C1N0');
    if (chi1) rootMembers = [chi1];
  } else if (filters.selectedBranch === 'chi_2') {
    const chi2 = allMembers.find(m => m.code === 'D5C2N0' || m.id === 'D5C2N0');
    if (chi2) rootMembers = [chi2];
  } else if (filters.selectedBranch === 'chi_3') {
    const chi3 = allMembers.find(m => m.code === 'D5C3N0' || m.id === 'D5C3N0');
    if (chi3) rootMembers = [chi3];
  }

  const nodes: LayoutNode[] = [];
  const connectors: ConnectorLine[] = [];

  // Helper to check if member should be rendered based on generation limit
  const isWithinGenLimit = (member: FamilyMember) => {
    if (filters.generationLimit === 0) return true;
    return member.generation <= filters.generationLimit;
  };

  // Helper to compute node block width
  const getNodeBlockWidth = (member: FamilyMember) => {
    const hasSpouse = !filters.hideSpouses && (member.spouses?.length ?? 0) > 0;
    const spouseCount = hasSpouse ? (member.spouses?.length ?? 0) : 0;
    return CARD_WIDTH + spouseCount * (CARD_WIDTH + SPOUSE_GAP);
  };

  // Calculate subtree sizes (width) recursively
  const subtreeWidths = new Map<string, number>();

  function calculateSubtreeWidth(memberId: string): number {
    const member = memberMap.get(memberId);
    if (!member || !isWithinGenLimit(member)) return 0;

    const blockWidth = getNodeBlockWidth(member);
    const isCollapsed = collapsedNodeIds.has(member.id);

    // Filter children within gen limit
    const validChildren = (member.childrenIds || [])
      .map(cid => memberMap.get(cid))
      .filter((c): c is FamilyMember => !!c && isWithinGenLimit(c));

    if (isCollapsed || validChildren.length === 0) {
      const w = blockWidth + NODE_SPACING_X;
      subtreeWidths.set(memberId, w);
      return w;
    }

    let childrenTotalWidth = 0;
    for (const child of validChildren) {
      childrenTotalWidth += calculateSubtreeWidth(child.id);
    }

    const finalWidth = Math.max(blockWidth + NODE_SPACING_X, childrenTotalWidth);
    subtreeWidths.set(memberId, finalWidth);
    return finalWidth;
  }

  // Pre-calculate for roots
  rootMembers.forEach(r => calculateSubtreeWidth(r.id));

  // Layout positions recursively
  function layoutNode(memberId: string, startX: number, availableWidth: number): number {
    const member = memberMap.get(memberId);
    if (!member || !isWithinGenLimit(member)) return startX;

    const blockWidth = getNodeBlockWidth(member);
    const hasSpouse = !filters.hideSpouses && (member.spouses?.length ?? 0) > 0;
    const isCollapsed = collapsedNodeIds.has(member.id);

    // Center node in its allotted subtree slot
    const nodeX = startX + (availableWidth - blockWidth) / 2;
    const nodeY = INITIAL_Y_OFFSET + (member.generation - 1) * GENERATION_HEIGHT;

    const validChildren = (member.childrenIds || [])
      .map(cid => memberMap.get(cid))
      .filter((c): c is FamilyMember => !!c && isWithinGenLimit(c));

    nodes.push({
      member,
      x: nodeX,
      y: nodeY,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      hasSpouse,
      spouseWidth: hasSpouse ? CARD_WIDTH : 0,
      totalCardWidth: blockWidth,
      hasChildren: validChildren.length > 0,
      isCollapsed
    });

    if (!isCollapsed && validChildren.length > 0) {
      let currentChildX = startX;
      const childCenterPositions: { childId: string; centerX: number }[] = [];

      for (const child of validChildren) {
        const childSlotWidth = subtreeWidths.get(child.id) || (getNodeBlockWidth(child) + NODE_SPACING_X);
        layoutNode(child.id, currentChildX, childSlotWidth);

        const childBlockWidth = getNodeBlockWidth(child);
        const childActualX = currentChildX + (childSlotWidth - childBlockWidth) / 2;
        // Main member center (or couple center if we want to point to primary child)
        const childCenterX = childActualX + CARD_WIDTH / 2;
        childCenterPositions.push({ childId: child.id, centerX: childCenterX });

        currentChildX += childSlotWidth;
      }

      // Create orthogonal connectors from this parent to its children
      // Parent connection anchor point:
      // If couple, parent connection point is in between main card & first spouse card
      const parentCenterX = hasSpouse
        ? (nodeX + CARD_WIDTH + SPOUSE_GAP / 2)
        : (nodeX + CARD_WIDTH / 2);
      const parentBottomY = nodeY + CARD_HEIGHT;

      const firstChildX = childCenterPositions[0].centerX;
      const lastChildX = childCenterPositions[childCenterPositions.length - 1].centerX;
      const branchMidY = parentBottomY + (GENERATION_HEIGHT - CARD_HEIGHT) / 2;

      for (const { childId, centerX } of childCenterPositions) {
        const childTopY = nodeY + GENERATION_HEIGHT;
        const isHighlighted = highlightedMemberIds.has(childId) && highlightedMemberIds.has(member.id);

        connectors.push({
          id: `line_${member.id}_${childId}`,
          fromX: parentCenterX,
          fromY: parentBottomY,
          toX: centerX,
          toY: childTopY,
          parentId: member.id,
          childId,
          isHighlighted
        });
      }
    }

    return startX + availableWidth;
  }

  // Layout all root branches side-by-side
  let currentRootX = 60;
  for (const root of rootMembers) {
    const rootWidth = subtreeWidths.get(root.id) || 300;
    layoutNode(root.id, currentRootX, rootWidth);
    currentRootX += rootWidth + 40;
  }

  // Calculate layout bounds
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach(n => {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x + n.totalCardWidth);
    minY = Math.min(minY, n.y);
    maxY = Math.max(maxY, n.y + n.height);
  });

  if (nodes.length === 0) {
    minX = 0;
    maxX = 800;
    minY = 0;
    maxY = 600;
  }

  // Max generation to display in tier lines (up to 12)
  const maxGenInTree = Math.max(...allMembers.map(m => m.generation), 12);
  const maxGenToRender = filters.generationLimit > 0 ? filters.generationLimit : Math.min(maxGenInTree, 12);

  const generationLevels: { level: number; y: number }[] = [];
  for (let g = 1; g <= maxGenToRender; g++) {
    generationLevels.push({
      level: g,
      y: INITIAL_Y_OFFSET + (g - 1) * GENERATION_HEIGHT + CARD_HEIGHT / 2
    });
  }

  return {
    nodes,
    connectors,
    bounds: {
      minX: minX - 100,
      maxX: maxX + 100,
      minY: minY - 40,
      maxY: maxY + 150,
      width: Math.max(maxX - minX + 300, 1200),
      height: Math.max(maxY - minY + 300, 800)
    },
    generationLevels
  };
}

/**
 * Finds all ancestors of a member up to root
 */
export function getAncestorIds(memberId: string, memberMap: Map<string, FamilyMember>): Set<string> {
  const result = new Set<string>();
  let current: FamilyMember | undefined = memberMap.get(memberId);
  while (current) {
    result.add(current.id);
    if (!current.parentId) break;
    current = memberMap.get(current.parentId);
  }
  return result;
}

/**
 * Finds all descendants of a member down to latest generation
 */
export function getDescendantIds(memberId: string, memberMap: Map<string, FamilyMember>): Set<string> {
  const result = new Set<string>();
  result.add(memberId);

  function collect(id: string) {
    const mem = memberMap.get(id);
    if (!mem || !mem.childrenIds) return;
    for (const childId of mem.childrenIds) {
      result.add(childId);
      collect(childId);
    }
  }

  collect(memberId);
  return result;
}
