import { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu,
  Settings,
  TrendingUp,
  Plus,
  MapPin,
  Users,
  BarChart3,
  Layers,
  Home,
  Share2,
  Upload,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./components/ui/sheet";
import { ReminderCard } from "./components/ReminderCard";
import { AddReminderDialog } from "./components/AddReminderDialog";
import { ReminderDetailView } from "./components/ReminderDetailView";
import { StatsView } from "./components/StatsView";
import { GroupsView } from "./components/GroupsView";
import { GroupDetailView } from "./components/GroupDetailView";
import { EditGroupView } from "./components/EditGroupView";
import { ShareDialog } from "./components/ShareDialog";
import { ImportDialog } from "./components/ImportDialog";
import { LocationSettingsView } from "./components/LocationSettingsView";
import { SettingsView } from "./components/SettingsView";
import {
  mockReminders,
  mockGroups,
  mockUserStats,
  mockSavedLocations,
} from "./data/mockData";
import { Reminder, ChecklistItem, ReminderGroup, SavedLocation } from "./types";
import { Badge } from "./components/ui/badge";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";
import { useLocationTracking } from "./hooks/useLocationTracking";

export default function App() {
  const [reminders, setReminders] =
    useState<Reminder[]>(mockReminders);
  const [groups, setGroups] = useState(mockGroups);
  const [stats, setStats] = useState(mockUserStats);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(mockSavedLocations);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedReminder, setSelectedReminder] =
    useState<Reminder | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState<Reminder | null>(null);
  const [selectedGroupId, setSelectedGroupId] =
    useState<string | null>(null);
  const [groupDetailSheetOpen, setGroupDetailSheetOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<ReminderGroup | null>(null);
  const [editGroupSheetOpen, setEditGroupSheetOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [locationSettingsOpen, setLocationSettingsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Location tracking
  const handleLocationTrigger = useCallback((reminder: Reminder) => {
    const triggerText = reminder.location?.triggerType === 'arrive' 
      ? '도착했습니다' 
      : '떠났습니다';
    
    toast.info(`📍 ${reminder.icon} ${reminder.title}`, {
      description: `${reminder.location?.name}에 ${triggerText}`,
      duration: 5000,
      action: {
        label: '보기',
        onClick: () => {
          setSelectedReminder(reminder);
          setDetailSheetOpen(true);
        },
      },
    });
  }, []);

  const locationState = useLocationTracking(reminders, handleLocationTrigger);

  const urgentReminders = reminders.filter(
    (r) => r.priority === "urgent",
  );
  const weekReminders = reminders.filter(
    (r) => r.priority === "week",
  );
  const routineReminders = reminders.filter(
    (r) => r.priority === "routine",
  );

  // Update selectedReminder when reminders change
  const selectedReminderIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (selectedReminder) {
      selectedReminderIdRef.current = selectedReminder.id;
    }
  }, [selectedReminder]);

  useEffect(() => {
    if (selectedReminderIdRef.current) {
      const updatedReminder = reminders.find(
        (r) => r.id === selectedReminderIdRef.current,
      );
      if (updatedReminder) {
        setSelectedReminder(updatedReminder);
      }
    }
  }, [reminders]);

  const toggleChecklistItem = (
    reminderId: string,
    itemId: string,
  ) => {
    setReminders((prev) =>
      prev.map((reminder) => {
        if (reminder.id === reminderId) {
          const updatedChecklist = reminder.checklist.map(
            (item) =>
              item.id === itemId
                ? { ...item, completed: !item.completed }
                : item,
          );

          const allCompleted = updatedChecklist.every(
            (item) => item.completed,
          );

          // If all items are completed, update stats
          if (allCompleted && updatedChecklist.length > 0) {
            const wasAlreadyCompleted =
              reminder.checklist.every(
                (item) => item.completed,
              );
            if (!wasAlreadyCompleted) {
              toast.success("🎉 리마인더 완료!", {
                description: `"${reminder.title}" 모든 항목을 완료했습니다.`,
              });

              // Update completion stats
              setStats((prevStats) => ({
                ...prevStats,
                totalCompletions:
                  prevStats.totalCompletions + 1,
                currentStreak: prevStats.currentStreak, // Would update based on date logic
              }));
            }
          }

          return {
            ...reminder,
            checklist: updatedChecklist,
            lastCompleted: allCompleted
              ? new Date()
              : reminder.lastCompleted,
            completionCount:
              allCompleted && updatedChecklist.length > 0
                ? reminder.completionCount +
                  (reminder.checklist.every(
                    (item) => item.completed,
                  )
                    ? 0
                    : 1)
                : reminder.completionCount,
          };
        }
        return reminder;
      }),
    );
  };

  const handleAddReminder = (
    newReminder: Omit<
      Reminder,
      "id" | "createdAt" | "completionCount" | "totalShown"
    >,
  ) => {
    if (editingReminder) {
      // Edit existing reminder
      setReminders((prev) =>
        prev.map((r) =>
          r.id === editingReminder.id
            ? { ...r, ...newReminder }
            : r,
        ),
      );
      toast.success("✅ 리마인더 수정됨", {
        description: `"${newReminder.title}" 리마인더가 수정되었습니다.`,
      });
      setEditingReminder(null);
    } else {
      // Add new reminder
      const reminder: Reminder = {
        ...newReminder,
        id: `r-${Date.now()}`,
        createdAt: new Date(),
        completionCount: 0,
        totalShown: 0,
      };

      setReminders((prev) => [...prev, reminder]);
      toast.success("✅ 리마인더 생성됨", {
        description: `"${reminder.title}" 리마인더가 추가되었습니다.`,
      });
    }
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
    setGroupDetailSheetOpen(true);
  };

  const handleReminderClick = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setDetailSheetOpen(true);
  };

  const handleDetailToggleChecklistItem = (itemId: string) => {
    if (!selectedReminder) return;
    toggleChecklistItem(selectedReminder.id, itemId);
  };

  const handleEditReminder = () => {
    if (selectedReminder) {
      setEditingReminder(selectedReminder);
      setDetailSheetOpen(false);
      setAddDialogOpen(true);
    }
  };

  const handleDeleteReminder = () => {
    if (!selectedReminder) return;

    setReminders((prev) =>
      prev.filter((r) => r.id !== selectedReminder.id),
    );
    toast.success("🗑️ 삭제됨", {
      description: `"${selectedReminder.title}" 리마인더가 삭제되었습니다.`,
    });
    setDetailSheetOpen(false);
    setSelectedReminder(null);
  };

  const handleShareReminder = () => {
    if (!selectedReminder) return;
    setShareDialogOpen(true);
  };

  const handleImportReminder = (
    reminder: Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'>
  ) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `r${Date.now()}`,
      completionCount: 0,
      totalShown: 0,
      createdAt: new Date(),
    };

    setReminders((prev) => [...prev, newReminder]);
    toast.success("✅ 리마인더 추가됨", {
      description: `"${newReminder.title}" 리마인더가 추가되었습니다.`,
    });
  };

  const handleEditGroup = (group: ReminderGroup) => {
    setEditingGroup(group);
    setGroupDetailSheetOpen(false);
    setEditGroupSheetOpen(true);
  };

  const handleSaveGroup = (
    groupId: string,
    updates: {
      name: string;
      icon: string;
      reminderIds: string[];
    },
  ) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, name: updates.name, icon: updates.icon, reminderIds: updates.reminderIds }
          : g,
      ),
    );

    // Update reminders to reflect new group assignments
    setReminders((prev) =>
      prev.map((r) => {
        // Remove from this group if not in new reminderIds
        if (r.groupId === groupId && !updates.reminderIds.includes(r.id)) {
          return { ...r, groupId: undefined };
        }
        // Add to this group if in new reminderIds
        if (updates.reminderIds.includes(r.id)) {
          return { ...r, groupId: groupId };
        }
        return r;
      }),
    );

    toast.success("✅ 그룹 수정됨", {
      description: `"${updates.name}" 그룹이 수정되었습니다.`,
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    if (group.isPreset) {
      toast.error("❌ 삭제 불가", {
        description: "프리셋 그룹은 삭제할 수 없습니다.",
      });
      return;
    }

    // Remove group
    setGroups((prev) => prev.filter((g) => g.id !== groupId));

    // Remove groupId from reminders
    setReminders((prev) =>
      prev.map((r) =>
        r.groupId === groupId ? { ...r, groupId: undefined } : r,
      ),
    );

    toast.success("🗑️ 그룹 삭제됨", {
      description: `"${group.name}" 그룹이 삭제되었습니다.`,
    });

    setGroupDetailSheetOpen(false);
  };

  const handleClearAllData = () => {
    setReminders([]);
    setGroups(mockGroups); // Reset to default groups
    setSavedLocations([]);
    setStats({
      totalCompletions: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyCompletionRate: 0,
    });
  };

  const handleExportAllData = () => {
    const data = {
      reminders,
      groups,
      savedLocations,
      stats,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart-reminder-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAddLocation = (
    location: Omit<SavedLocation, 'id' | 'createdAt'>
  ) => {
    const newLocation: SavedLocation = {
      ...location,
      id: `loc-${Date.now()}`,
      createdAt: new Date(),
    };
    setSavedLocations((prev) => [...prev, newLocation]);
  };

  const handleUpdateLocation = (
    id: string,
    location: Omit<SavedLocation, 'id' | 'createdAt'>
  ) => {
    setSavedLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...location } : l))
    );
  };

  const handleDeleteLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 active:scale-95 transition-transform"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-title text-left">메뉴</SheetTitle>
              <SheetDescription className="text-left">
                앱 기능 및 설정 메뉴
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-14 text-content px-4 active:scale-98 transition-transform"
                onClick={() => setImportDialogOpen(true)}
              >
                <Upload className="h-5 w-5" />
                리마인더 가져오기
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-14 text-content px-4 active:scale-98 transition-transform"
                onClick={() => setLocationSettingsOpen(true)}
              >
                <MapPin className="h-5 w-5" />
                위치 관리
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 h-14 text-content px-4 active:scale-98 transition-transform"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
                설정
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="text-title tracking-tight">리마인더</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 active:scale-95 transition-transform"
            onClick={() => setLocationSettingsOpen(true)}
          >
            <MapPin className="h-5 w-5" />
          </Button>

        </div>
      </header>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="max-w-md mx-auto"
      >

        {/* Home Tab */}
        <TabsContent value="home" className="mt-0">
          {/* Status Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-6 shadow-md">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="text-[14px] font-medium text-white">
                    연속 완료
                  </p>
                  <p className="text-[22px] font-semibold mt-0.5 text-white">
                    {stats.currentStreak}일
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium text-white">
                  주간 완료율
                </p>
                <p className="text-[22px] font-semibold mt-0.5 text-white">
                  {stats.weeklyCompletionRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-medium text-white">총 완료</p>
                <p className="text-[22px] font-semibold mt-0.5 text-white">
                  {stats.totalCompletions}
                </p>
              </div>
            </div>
          </div>

          {/* Location Tracking Status */}
          {locationState.isTracking && (
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-blue-600 animate-pulse" />
                <div className="flex-1">
                  <p className="text-content text-gray-900">위치 추적 중</p>
                  {locationState.accuracy && (
                    <p className="text-description text-gray-700 mt-1">
                      정확도: ±{Math.round(locationState.accuracy)}m
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="text-description bg-blue-100 text-blue-900">
                  {reminders.filter(r => 
                    (r.trigger === 'location' || r.trigger === 'both') && 
                    r.location?.latitude
                  ).length}개
                </Badge>
              </div>
            </div>
          )}

          {locationState.error && (
            <div className="mx-6 mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-red-600" />
                <p className="text-content text-red-900">{locationState.error}</p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="px-6 py-8 space-y-10 max-w-md mx-auto">
            {/* URGENT Section */}
            {urgentReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🔴</span>
                  <h2 className="text-title text-gray-900">
                    긴급 ({urgentReminders.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {urgentReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onToggleChecklistItem={
                        toggleChecklistItem
                      }
                      onClick={() =>
                        handleReminderClick(reminder)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* DUE THIS WEEK Section */}
            {weekReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🟡</span>
                  <h2 className="text-title text-gray-900">
                    이번 주 ({weekReminders.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {weekReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onToggleChecklistItem={
                        toggleChecklistItem
                      }
                      onClick={() =>
                        handleReminderClick(reminder)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ROUTINE Section */}
            {routineReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🟢</span>
                  <h2 className="text-title text-gray-900">
                    루틴 ({routineReminders.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {routineReminders.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      onToggleChecklistItem={
                        toggleChecklistItem
                      }
                      onClick={() =>
                        handleReminderClick(reminder)
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {reminders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-6">📝</p>
                <p className="text-title mb-3">
                  리마인더가 없습니다
                </p>
                <p className="text-description text-gray-600 mb-8">
                  아래 버튼을 눌러 첫 리마인더를 만들어보세요!
                </p>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  size="lg"
                  className="gap-2 h-14 px-8 active:scale-95 transition-transform"
                >
                  <Plus className="h-5 w-5" />
                  리마인더 만들기
                </Button>
              </div>
            )}
          </main>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="mt-0 px-6 py-8 max-w-md mx-auto">
          <StatsView stats={stats} />
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="mt-0 px-6 py-8 max-w-md mx-auto">
          <GroupsView
            groups={groups}
            reminders={reminders}
            onGroupClick={handleGroupClick}
            onEditGroup={handleEditGroup}
          />
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto relative">
          <div className="flex items-center justify-around px-4 pb-safe pt-3">
            {/* Home */}
            <button
              onClick={() => setActiveTab("home")}
              className="flex flex-col items-center gap-1.5 py-2 px-4 min-w-[70px] active:scale-95 transition-transform"
            >
              <Home
                className={`h-5 w-5 ${
                  activeTab === "home"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-description ${
                  activeTab === "home"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                홈
              </span>
            </button>

            {/* Stats */}
            <button
              onClick={() => setActiveTab("stats")}
              className="flex flex-col items-center gap-1.5 py-2 px-4 min-w-[70px] active:scale-95 transition-transform"
            >
              <BarChart3
                className={`h-5 w-5 ${
                  activeTab === "stats"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-description ${
                  activeTab === "stats"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                통계
              </span>
            </button>

            {/* Add Button - Large Circle */}
            <button
              onClick={() => setAddDialogOpen(true)}
              className="flex flex-col items-center -mt-8"
            >
              <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-full p-4 shadow-lg hover:shadow-xl transition-all active:scale-95">
                <Plus className="h-8 w-8 text-white" />
              </div>
            </button>

            {/* Groups */}
            <button
              onClick={() => setActiveTab("groups")}
              className="flex flex-col items-center gap-1.5 py-2 px-4 min-w-[70px] active:scale-95 transition-transform"
            >
              <Layers
                className={`h-5 w-5 ${
                  activeTab === "groups"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-description ${
                  activeTab === "groups"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                그룹
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex flex-col items-center gap-1.5 py-2 px-4 min-w-[70px] active:scale-95 transition-transform"
            >
              <Settings className="h-5 w-5 text-gray-400" />
              <span className="text-description text-gray-400">설정</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Add Reminder Dialog */}
      <AddReminderDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) {
            setEditingReminder(null);
          }
        }}
        onSave={handleAddReminder}
        editingReminder={editingReminder}
        groups={groups}
        savedLocations={savedLocations}
      />

      {/* Reminder Detail Sheet */}
      <Sheet
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selectedReminder?.title || "리마인더 상세"}
            </SheetTitle>
            <SheetDescription>
              리마인더 상세 정보 및 체크리스트
            </SheetDescription>
          </SheetHeader>
          {selectedReminder && (
            <ReminderDetailView
              reminder={selectedReminder}
              onBack={() => setDetailSheetOpen(false)}
              onToggleChecklistItem={
                handleDetailToggleChecklistItem
              }
              onEdit={handleEditReminder}
              onDelete={handleDeleteReminder}
              onShare={handleShareReminder}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Group Detail Sheet */}
      <Sheet
        open={groupDetailSheetOpen}
        onOpenChange={setGroupDetailSheetOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>
              {selectedGroupId
                ? groups.find((g) => g.id === selectedGroupId)
                    ?.name || "그룹 상세"
                : "그룹 상세"}
            </SheetTitle>
            <SheetDescription>
              그룹 상세 정보 및 리마인더 목록
            </SheetDescription>
          </SheetHeader>
          {selectedGroupId && (
            <GroupDetailView
              group={
                groups.find((g) => g.id === selectedGroupId)!
              }
              reminders={reminders}
              onBack={() => setGroupDetailSheetOpen(false)}
              onReminderClick={(reminder) => {
                setSelectedReminder(reminder);
                setGroupDetailSheetOpen(false);
                setDetailSheetOpen(true);
              }}
              onToggleChecklistItem={toggleChecklistItem}
              onEditGroup={() => {
                const group = groups.find((g) => g.id === selectedGroupId);
                if (group) {
                  handleEditGroup(group);
                }
              }}
              onDeleteGroup={() => {
                if (selectedGroupId) {
                  handleDeleteGroup(selectedGroupId);
                }
              }}
              onAddReminder={() => {
                setGroupDetailSheetOpen(false);
                setAddDialogOpen(true);
              }}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Edit Group Sheet */}
      <Sheet
        open={editGroupSheetOpen}
        onOpenChange={setEditGroupSheetOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>그룹 편집</SheetTitle>
            <SheetDescription>
              그��� 정보 수정 및 리마인더 관리
            </SheetDescription>
          </SheetHeader>
          {editingGroup && (
            <EditGroupView
              group={editingGroup}
              reminders={reminders}
              onBack={() => setEditGroupSheetOpen(false)}
              onSave={handleSaveGroup}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        reminder={selectedReminder}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportReminder}
      />

      {/* Location Settings Sheet */}
      <Sheet
        open={locationSettingsOpen}
        onOpenChange={setLocationSettingsOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>위치 관리</SheetTitle>
            <SheetDescription>
              자주 사용하는 위치를 저장하고 관리합니다
            </SheetDescription>
          </SheetHeader>
          <LocationSettingsView
            savedLocations={savedLocations}
            onAddLocation={handleAddLocation}
            onUpdateLocation={handleUpdateLocation}
            onDeleteLocation={handleDeleteLocation}
            onBack={() => setLocationSettingsOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Settings Sheet */}
      <Sheet
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>설정</SheetTitle>
            <SheetDescription>
              앱 설정 및 환경 설정
            </SheetDescription>
          </SheetHeader>
          <SettingsView
            onBack={() => setSettingsOpen(false)}
            onClearAllData={handleClearAllData}
            onExportData={handleExportAllData}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
