import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { FamilyMember, Spouse, TreeFilter } from '../../types/family';
import { computeTreeLayout, CARD_WIDTH, CARD_HEIGHT, SPOUSE_GAP } from '../../utils/treeLayout';
import { NodeCard } from './NodeCard';
import { SpouseCard } from './SpouseCard';
import { Plus, Minus, Crosshair, RotateCcw, Search, X, Star, ChevronDown } from 'lucide-react';

interface CanvasContainerProps {
  allMembers: FamilyMember[];
  filters: TreeFilter;
  onFilterChange: (newFilters: Partial<TreeFilter>) => void;
  selectedMember: FamilyMember | null;
  onSelectMember: (member: FamilyMember) => void;
  onSelectSpouse: (spouse: Spouse) => void;
  highlightedMemberIds: Set<string>;
  onClearHighlight: () => void;
  isMobileSearchOpen?: boolean;
  onCloseMobileSearch?: () => void;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({
  allMembers,
  filters,
  onFilterChange,
  selectedMember,
  onSelectMember,
  onSelectSpouse,
  highlightedMemberIds,
  onClearHighlight,
  isMobileSearchOpen = false,
  onCloseMobileSearch
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan and Zoom Transform State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(0.8);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Node branch collapse state
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(new Set());

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchGen, setSelectedSearchGen] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<FamilyMember[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Touch tracking ref for mobile pan and pinch-to-zoom
  const touchRef = useRef<{
    touchCount: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
    initialDist: number;
    initialScale: number;
    midX: number;
    midY: number;
  }>({
    touchCount: 0,
    startX: 0,
    startY: 0,
    startPanX: 0,
    startPanY: 0,
    initialDist: 0,
    initialScale: 1,
    midX: 0,
    midY: 0
  });

  // Compute Layout
  const layout = useMemo(() => {
    return computeTreeLayout(allMembers, filters, collapsedNodeIds, highlightedMemberIds);
  }, [allMembers, filters, collapsedNodeIds, highlightedMemberIds]);

  // Center tree on initial load or reset
  const handleResetView = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const rootNode = layout.nodes.find(n => n.member.isRoot) || layout.nodes[0];

    if (rootNode) {
      const initialScale = clientWidth < 768 ? 0.55 : 0.85;
      const targetX = clientWidth / 2 - (rootNode.x + rootNode.totalCardWidth / 2) * initialScale;
      const targetY = clientWidth < 768 ? 50 : 80;
      setScale(initialScale);
      setPan({ x: targetX, y: targetY });
    } else {
      setScale(0.85);
      setPan({ x: 50, y: 50 });
    }
  }, [layout]);

  // Fit to screen view
  const handleFitView = useCallback(() => {
    if (!containerRef.current || layout.nodes.length === 0) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = clientWidth < 768 ? 40 : 80;

    const availableWidth = clientWidth - padding * 2;
    const availableHeight = clientHeight - padding * 2;

    const scaleX = availableWidth / layout.bounds.width;
    const scaleY = availableHeight / layout.bounds.height;
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.25), 1.2);

    const centerX = clientWidth / 2 - ((layout.bounds.minX + layout.bounds.maxX) / 2) * fitScale;
    const centerY = clientHeight / 2 - ((layout.bounds.minY + layout.bounds.maxY) / 2) * fitScale;

    setScale(fitScale);
    setPan({ x: centerX, y: centerY });
  }, [layout]);

  // Run initial center once
  useEffect(() => {
    handleResetView();
  }, []);

  // Zoom helpers
  const handleZoom = (delta: number) => {
    setScale(prev => Math.min(Math.max(prev + delta, 0.25), 2.2));
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom handler with smooth zoom centered on mouse
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(scale * zoomFactor, 0.25), 2.2);

    const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
    const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

    setScale(newScale);
    setPan({ x: newPanX, y: newPanY });
  };

  // Touch Handlers for Mobile (1-finger pan & 2-finger pinch-to-zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchRef.current = {
        touchCount: 1,
        startX: t.clientX,
        startY: t.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        initialDist: 0,
        initialScale: scale,
        midX: 0,
        midY: 0
      };
    } else if (e.touches.length >= 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const rect = containerRef.current.getBoundingClientRect();
      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

      touchRef.current = {
        touchCount: 2,
        startX: 0,
        startY: 0,
        startPanX: pan.x,
        startPanY: pan.y,
        initialDist: dist,
        initialScale: scale,
        midX,
        midY
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    if (e.touches.length === 1 && touchRef.current.touchCount === 1) {
      const t = e.touches[0];
      const dx = t.clientX - touchRef.current.startX;
      const dy = t.clientY - touchRef.current.startY;
      setPan({
        x: touchRef.current.startPanX + dx,
        y: touchRef.current.startPanY + dy
      });
    } else if (e.touches.length >= 2 && touchRef.current.touchCount === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

      if (touchRef.current.initialDist > 0) {
        const scaleMultiplier = currentDist / touchRef.current.initialDist;
        const targetScale = Math.min(Math.max(touchRef.current.initialScale * scaleMultiplier, 0.25), 2.2);

        const midX = touchRef.current.midX;
        const midY = touchRef.current.midY;

        const newPanX = midX - (midX - touchRef.current.startPanX) * (targetScale / touchRef.current.initialScale);
        const newPanY = midY - (midY - touchRef.current.startPanY) * (targetScale / touchRef.current.initialScale);

        setScale(targetScale);
        setPan({ x: newPanX, y: newPanY });
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      touchRef.current.touchCount = 0;
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      touchRef.current = {
        touchCount: 1,
        startX: t.clientX,
        startY: t.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
        initialDist: 0,
        initialScale: scale,
        midX: 0,
        midY: 0
      };
    }
  };

  // Toggle Collapse/Expand
  const handleToggleCollapse = (memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedNodeIds(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim() && selectedSearchGen === 0) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const results = allMembers.filter(m => {
      const matchName = !q || m.fullName.toLowerCase().includes(q) || (m.alias && m.alias.toLowerCase().includes(q));
      const matchGen = selectedSearchGen === 0 || m.generation === selectedSearchGen;
      return matchName && matchGen;
    });

    setSearchResults(results.slice(0, 8));
  }, [searchQuery, selectedSearchGen, allMembers]);

  // Jump and center on a search target member
  const handleJumpToMember = (target: FamilyMember) => {
    const uncollapseChain = (m: FamilyMember) => {
      if (m.parentId) {
        setCollapsedNodeIds(prev => {
          const next = new Set(prev);
          next.delete(m.parentId!);
          return next;
        });
        const parent = allMembers.find(p => p.id === m.parentId);
        if (parent) uncollapseChain(parent);
      }
    };
    uncollapseChain(target);

    onSelectMember(target);
    setIsSearchOpen(false);
    if (onCloseMobileSearch) onCloseMobileSearch();

    setTimeout(() => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const targetNode = layout.nodes.find(n => n.member.id === target.id);
      if (targetNode) {
        const targetScale = Math.max(scale, 0.85);
        const targetX = clientWidth / 2 - (targetNode.x + targetNode.width / 2) * targetScale;
        const targetY = clientHeight / 2 - (targetNode.y + targetNode.height / 2) * targetScale;
        setScale(targetScale);
        setPan({ x: targetX, y: targetY });
      }
    }, 60);
  };

  const isAnyHighlightActive = highlightedMemberIds.size > 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-8 sm:pb-10">
      {/* Outer Traditional Lacquer Frame */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#7D2318] bg-[#FAF5EC] flex flex-col">
        {/* Frame Title Bar with Ribbon Header (visible on all screens) */}
        <div className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-[#7B1D14] via-[#9E2A1F] to-[#7B1D14] text-center border-b-2 border-[#D4A359] relative select-none">
          <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-serif-vi font-bold uppercase tracking-widest text-[#FFDF9E]">
            <span>•</span>
            <span>PHẢ ĐỒ HỌ ĐẶNG</span>
            <span>•</span>
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#E8D4B0] font-sans hidden sm:block">
            Tỉ lệ: {Math.round(scale * 100)}%
          </div>
        </div>

        {/* Viewport Container */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: 'none' }}
          className={`relative w-full h-[520px] sm:h-[700px] lg:h-[750px] overflow-hidden bg-lattice cursor-${
            isDragging ? 'grabbing' : 'grab'
          } select-none`}
        >
          {/* Synchronized Generation Tier Lines & Labels Background */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
              transformOrigin: '0 0'
            }}
          >
            {layout.generationLevels.map(({ level, y }) => {
              const lineStart = layout.bounds.minX - 300;
              const lineEnd = layout.bounds.maxX + 300;
              const lineWidth = lineEnd - lineStart;

              return (
                <div
                  key={`gen_tier_${level}`}
                  className="absolute"
                  style={{
                    top: `${y}px`,
                    left: `${lineStart}px`,
                    width: `${lineWidth}px`,
                    height: '1px'
                  }}
                >
                  <div className="w-full h-0 border-b border-dashed border-[#C9A265]/50 relative">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 flex justify-between px-16 text-[#A07840] font-serif-vi font-bold text-xs sm:text-sm tracking-widest"
                      style={{ width: `${lineWidth}px` }}
                    >
                      <span>{level}</span>
                      <span>{level}</span>
                      <span>{level}</span>
                      <span>{level}</span>
                      <span>{level}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Connectors Layer */}
          <svg
            className="absolute top-0 left-0 pointer-events-none overflow-visible"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
              transformOrigin: '0 0',
              width: `${layout.bounds.width}px`,
              height: `${layout.bounds.height}px`
            }}
          >
            <defs>
              <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.8" />
              </filter>
            </defs>

            {layout.connectors.map(conn => {
              const midY = conn.fromY + (conn.toY - conn.fromY) / 2;
              const pathData = `M ${conn.fromX} ${conn.fromY} V ${midY} H ${conn.toX} V ${conn.toY}`;

              const isHighlighted = conn.isHighlighted;
              const strokeColor = isHighlighted ? '#DC2626' : '#9E2A1F';
              const strokeWidth = isHighlighted ? 3.5 : 1.75;

              return (
                <path
                  key={conn.id}
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={isHighlighted ? 'url(#glow-gold)' : undefined}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Horizontal connectors between Member and Spouse */}
            {!filters.hideSpouses && layout.nodes.map(node => {
              if (!node.hasSpouse) return null;
              const memberCenterRightX = node.x + CARD_WIDTH;
              const spouseCenterLeftX = node.x + CARD_WIDTH + SPOUSE_GAP;
              const linkY = node.y + CARD_HEIGHT / 2;

              return (
                <line
                  key={`spouse_link_${node.member.id}`}
                  x1={memberCenterRightX}
                  y1={linkY}
                  x2={spouseCenterLeftX}
                  y2={linkY}
                  stroke="#D4A359"
                  strokeWidth="2.5"
                  strokeDasharray="2 2"
                />
              );
            })}
          </svg>

          {/* Member & Spouse DOM Cards Layer */}
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
              transformOrigin: '0 0'
            }}
          >
            {layout.nodes.map(node => {
              const member = node.member;
              const isSelected = selectedMember?.id === member.id;
              const isHighlighted = highlightedMemberIds.has(member.id);
              const isSearchMatch = Boolean(
                searchQuery.trim().length > 0 &&
                (member.fullName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
                 (member.alias && member.alias.toLowerCase().includes(searchQuery.toLowerCase().trim())))
              );

              const isFaded = isAnyHighlightActive && !isHighlighted;

              return (
                <div
                  key={member.id}
                  className="absolute pointer-events-auto flex items-center"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    gap: `${SPOUSE_GAP}px`
                  }}
                >
                  <NodeCard
                    member={member}
                    isCollapsed={node.isCollapsed}
                    hasChildren={node.hasChildren}
                    childrenCount={member.childrenIds?.length || 0}
                    isSelected={isSelected}
                    isHighlighted={isHighlighted}
                    isSearchMatch={isSearchMatch}
                    isFaded={isFaded}
                    onSelect={onSelectMember}
                    onToggleCollapse={handleToggleCollapse}
                  />

                  {!filters.hideSpouses && member.spouses?.map(spouse => (
                    <SpouseCard
                      key={spouse.id}
                      spouse={spouse}
                      isFaded={isFaded}
                      onSelect={(sp) => onSelectSpouse(sp)}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Floating Widget 1: Quick Search Box (Desktop: Always top-right; Mobile: Appears when search is triggered) */}
          <div
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-[calc(100%-24px)] sm:w-72 bg-[#FFFDF9] rounded-2xl p-3 sm:p-3.5 shadow-xl border-2 border-[#D4A359]/80 backdrop-blur-sm transition-all duration-200 ${
              isMobileSearchOpen ? 'block' : 'hidden md:block'
            }`}
          >
            <div className="text-[10px] font-bold tracking-widest text-[#A32A22] uppercase mb-1.5 flex items-center justify-between">
              <span>TÌM NHANH THÀNH VIÊN</span>
              <div className="flex items-center gap-2">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
                  >
                    Xoá
                  </button>
                )}
                {onCloseMobileSearch && (
                  <button
                    onClick={onCloseMobileSearch}
                    className="md:hidden text-stone-500 hover:text-stone-800 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="relative mb-1.5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Nhập tên thành viên..."
                className="w-full bg-[#FAF5EC] border border-[#D4A359]/70 rounded-lg px-3 py-1.5 text-xs text-[#3D2510] placeholder-[#8C6D46] focus:outline-none focus:ring-2 focus:ring-[#A32A22]"
              />
              <Search className="w-3.5 h-3.5 text-[#8C6D46] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedSearchGen}
                onChange={(e) => setSelectedSearchGen(Number(e.target.value))}
                className="w-full bg-[#FAF5EC] border border-[#D4A359]/70 rounded-lg px-3 py-1.5 text-xs text-[#3D2510] appearance-none focus:outline-none focus:ring-1 focus:ring-[#A32A22] cursor-pointer"
              >
                <option value={0}>Tất cả các đời</option>
                <option value={1}>Đời 1 - Thủy tổ</option>
                <option value={2}>Đời 2</option>
                <option value={3}>Đời 3</option>
                <option value={4}>Đời 4</option>
                <option value={5}>Đời 5</option>
                <option value={6}>Đời 6</option>
                <option value={7}>Đời 7</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8C6D46] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Suggestions Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF9] rounded-xl shadow-2xl border border-[#D4A359] max-h-56 overflow-y-auto z-40 p-1">
                <div className="text-[10px] text-[#8C6D46] px-2 py-1 font-semibold border-b border-[#EADFCB]">
                  Tìm thấy {searchResults.length} người:
                </div>
                {searchResults.map(result => (
                  <button
                    key={result.id}
                    onClick={() => handleJumpToMember(result)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F3EADB] text-xs flex items-center justify-between text-[#3A1E08] transition-colors cursor-pointer group"
                  >
                    <div>
                      <span className="font-bold">{result.fullName}</span>
                      {result.title && <span className="text-[10px] text-[#8C6D46] ml-1">({result.title})</span>}
                    </div>
                    <span className="text-[10px] font-bold text-[#A32A22] bg-[#A32A22]/10 px-1.5 py-0.5 rounded">
                      Đời {result.generation}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Floating Widget 2: Touch-friendly Zoom & Pan Controls (Bottom-Right, optimized for thumbs on mobile) */}
          <div className="absolute bottom-4 right-3 sm:bottom-6 sm:right-6 z-30 flex flex-col gap-2">
            <button
              onClick={() => handleZoom(0.18)}
              title="Phóng to"
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-white text-[#523820] hover:text-[#A32A22] shadow-xl border border-[#D4A359] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <Plus className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => handleZoom(-0.18)}
              title="Thu nhỏ"
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-white text-[#523820] hover:text-[#A32A22] shadow-xl border border-[#D4A359] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <Minus className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={handleFitView}
              title="Căn vừa màn hình"
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-white text-[#523820] hover:text-[#A32A22] shadow-xl border border-[#D4A359] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <Crosshair className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2]" />
            </button>

            <button
              onClick={handleResetView}
              title="Về cụ Thủy tổ"
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-[#FFFDF9] hover:bg-white text-[#523820] hover:text-[#A32A22] shadow-xl border border-[#D4A359] flex items-center justify-center transition-all cursor-pointer active:scale-90"
            >
              <RotateCcw className="w-5 h-5 sm:w-4 sm:h-4 stroke-[2]" />
            </button>
          </div>

          {/* Floating Widget 3: Sleek Floating Banner for 'Tắt nổi bật nguồn gốc' (Bottom-Left matching Screenshot 1) */}
          {isAnyHighlightActive && (
            <div className="absolute bottom-4 left-3 sm:bottom-6 sm:left-6 z-30 animate-fadeIn">
              <button
                onClick={onClearHighlight}
                title="Xóa làm nổi bật và đưa cây về trạng thái mặc định"
                className="flex items-center gap-2 bg-gradient-to-r from-[#E64A19] to-[#D83226] hover:from-[#D84315] hover:to-[#B7271C] active:scale-95 text-white font-serif-vi font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl border-2 border-white/80 transition-all cursor-pointer group"
              >
                <span>Tắt nổi bật nguồn gốc</span>
                <span className="bg-black/20 text-white text-[10px] font-sans px-1.5 py-0.5 rounded-full">
                  {highlightedMemberIds.size}
                </span>
                <X className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Legend Bar (compact and wrapped cleanly on mobile) */}
        <div className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-[#FAF5EC] border-t border-[#E8DCB8] flex flex-wrap items-center justify-center gap-2.5 sm:gap-7 text-[11px] sm:text-xs text-[#523820] font-medium select-none">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#A32A22] inline-block" />
            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span>Thuỷ tổ</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white inline-block shadow-xs" />
            <span>Còn sống</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400 border border-white inline-block shadow-xs" />
            <span>Đã mất</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FAF5ED] text-[#8C1E14] border border-[#D4A359] inline-flex items-center justify-center font-bold text-[9px]">
              +
            </span>
            <span>Mở nhánh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
