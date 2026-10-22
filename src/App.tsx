/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FamilyMember, Spouse, TreeFilter, ViewMode } from './types/family';
import { INITIAL_FAMILY_MEMBERS } from './data/mockFamilyTreeData';
import { getAncestorIds, getDescendantIds } from './utils/treeLayout';
import { HeaderNav } from './components/family-tree/HeaderNav';
import { MobileHeader } from './components/family-tree/MobileHeader';
import { MobileDrawer } from './components/family-tree/MobileDrawer';
import { ControlPanel } from './components/ControlPanel';
import { FamilyTreeCanvas } from './components/FamilyTreeCanvas';
import { DirectoryView } from './components/family-tree/DirectoryView';
import { MemberDetailModal } from './components/MemberDetailModal';
import { FullProfileModal } from './components/family-tree/FullProfileModal';
import { KinshipModal } from './components/family-tree/KinshipModal';
import { GuideModal } from './components/family-tree/GuideModal';
import { ChronicleModal } from './components/family-tree/ChronicleModal';
import { EventsModal } from './components/family-tree/EventsModal';

export default function App() {
  const [allMembers] = useState<FamilyMember[]>(INITIAL_FAMILY_MEMBERS);

  // App Navigation & View Modes
  const [activeTab, setActiveTab] = useState<string>('pha-do');
  const [viewMode, setViewMode] = useState<ViewMode>('tree');

  // Mobile Drawer & Search State
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<TreeFilter>({
    generationLimit: 0,
    hideSpouses: false,
    showSpouseToChildLine: false,
    searchQuery: '',
    searchGeneration: 0,
    selectedBranch: 'all'
  });

  // Modal & Selection State
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [selectedSpouse, setSelectedSpouse] = useState<Spouse | null>(null);
  const [fullProfileMember, setFullProfileMember] = useState<FamilyMember | null>(null);

  // Highlighted Lineage Paths
  const [highlightedMemberIds, setHighlightedMemberIds] = useState<Set<string>>(new Set());

  // Ancillary Modals
  const [isKinshipOpen, setIsKinshipOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isChronicleOpen, setIsChronicleOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);

  // Map for fast lookups
  const memberMap = useMemo(() => {
    const map = new Map<string, FamilyMember>();
    allMembers.forEach(m => map.set(m.id, m));
    return map;
  }, [allMembers]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<TreeFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSelectMember = (member: FamilyMember) => {
    setSelectedSpouse(null);
    setSelectedMember(member);
  };

  const handleSelectSpouse = (spouse: Spouse) => {
    setSelectedMember(null);
    setSelectedSpouse(spouse);
  };

  // Lineage Highlighting Actions (Dismisses modal immediately and highlights canvas)
  const handleHighlightAncestors = (memberId: string) => {
    const ancestors = getAncestorIds(memberId, memberMap);
    setHighlightedMemberIds(ancestors);
    setSelectedMember(null);
    setSelectedSpouse(null);
  };

  const handleHighlightDescendants = (memberId: string) => {
    const descendants = getDescendantIds(memberId, memberMap);
    setHighlightedMemberIds(descendants);
    setSelectedMember(null);
    setSelectedSpouse(null);
  };

  const handleClearHighlight = () => {
    setHighlightedMemberIds(new Set());
  };

  // Jump from Directory View into Tree View & center member
  const handleLocateOnTree = (member: FamilyMember) => {
    setViewMode('tree');
    setSelectedMember(member);
    handleHighlightAncestors(member.id);
  };

  return (
    <div className="min-h-screen bg-[#FAF4EB] text-[#4A2E12] flex flex-col font-sans">
      {/* 1. Desktop Header (hidden on mobile < 768px) */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenKinship={() => setIsKinshipOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenEvents={() => setIsEventsOpen(true)}
        onOpenChronicle={() => setIsChronicleOpen(true)}
      />

      {/* 2. Mobile Header with Hamburger Menu & Quick Search (< 768px) */}
      <MobileHeader
        onOpenDrawer={() => setIsMobileDrawerOpen(true)}
        onOpenSearch={() => setIsMobileSearchOpen(prev => !prev)}
        isSearchActive={isMobileSearchOpen}
      />

      {/* 3. Mobile Drawer / Sidebar */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        allMembers={allMembers}
        onOpenKinship={() => setIsKinshipOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenEvents={() => setIsEventsOpen(true)}
        onOpenChronicle={() => setIsChronicleOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pt-2 sm:pt-0">
        {/* Desktop Controls Panel (Branch Selector, Depth limit, Real-time Stats) */}
        <ControlPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          allMembers={allMembers}
          onOpenKinship={() => setIsKinshipOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          onResetView={() => {}}
        />

        {/* View Switcher: Interactive Family Tree Canvas vs Directory Table */}
        {viewMode === 'tree' ? (
          <FamilyTreeCanvas
            allMembers={allMembers}
            filters={filters}
            onFilterChange={handleFilterChange}
            selectedMember={selectedMember}
            onSelectMember={handleSelectMember}
            onSelectSpouse={handleSelectSpouse}
            highlightedMemberIds={highlightedMemberIds}
            onClearHighlight={handleClearHighlight}
            isMobileSearchOpen={isMobileSearchOpen}
            onCloseMobileSearch={() => setIsMobileSearchOpen(false)}
          />
        ) : (
          <DirectoryView
            allMembers={allMembers}
            onSelectMember={handleSelectMember}
            onLocateOnTree={handleLocateOnTree}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#F3EADB] border-t border-[#E2D4BC] py-5 sm:py-6 text-center text-xs text-[#705437]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="font-serif-vi font-bold text-[#4A2E12]">
            BAN LIÊN LẠC GIA TỘC HỌ ĐẶNG • ĐÔNG HƯNG - THÁI BÌNH
          </div>
          <div className="text-[11px] sm:text-xs">
            Hệ thống mã phả hệ quy chuẩn D-C-N • Khởi lập từ Cụ Thủy tổ Đặng Đình Lĩnh (1740)
          </div>
          <div className="text-[10px] sm:text-[11px] text-[#8C6D46]">
            569 thành viên • 12 thế hệ nối truyền
          </div>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Member Detail Modal / Bottom Sheet */}
      {(selectedMember || selectedSpouse) && (
        <MemberDetailModal
          member={selectedMember}
          spouse={selectedSpouse}
          allMembers={allMembers}
          onClose={() => {
            setSelectedMember(null);
            setSelectedSpouse(null);
          }}
          onViewFullProfile={(m) => {
            setSelectedMember(null);
            setFullProfileMember(m);
          }}
          onHighlightAncestors={handleHighlightAncestors}
          onHighlightDescendants={handleHighlightDescendants}
          isLineageHighlighted={highlightedMemberIds.size > 0}
        />
      )}

      {/* 2. Expanded Full Biography Modal */}
      {fullProfileMember && (
        <FullProfileModal
          member={fullProfileMember}
          allMembers={allMembers}
          onClose={() => setFullProfileMember(null)}
          onSelectMember={(m) => setFullProfileMember(m)}
        />
      )}

      {/* 3. Kinship Calculator Modal */}
      {isKinshipOpen && (
        <KinshipModal
          allMembers={allMembers}
          onClose={() => setIsKinshipOpen(false)}
        />
      )}

      {/* 4. Guide Modal */}
      {isGuideOpen && (
        <GuideModal onClose={() => setIsGuideOpen(false)} />
      )}

      {/* 5. Chronicle Modal */}
      {isChronicleOpen && (
        <ChronicleModal onClose={() => setIsChronicleOpen(false)} />
      )}

      {/* 6. Events & Anniversaries Modal */}
      {isEventsOpen && (
        <EventsModal onClose={() => setIsEventsOpen(false)} />
      )}
    </div>
  );
}
