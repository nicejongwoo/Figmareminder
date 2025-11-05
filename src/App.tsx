import { useState, useEffect } from "react";
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
import { EditGroupDialog } from "./components/EditGroupDialog";
import {
  mockReminders,
  mockGroups,
  mockUserStats,
} from "./data/mockData";
import { Reminder, ChecklistItem, ReminderGroup } from "./types";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [reminders, setReminders] =
    useState<Reminder[]>(mockReminders);
  const [groups, setGroups] = useState(mockGroups);
  const [stats, setStats] = useState(mockUserStats);
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
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);

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
  useEffect(() => {
    if (selectedReminder) {
      const updatedReminder = reminders.find(
        (r) => r.id === selectedReminder.id,
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

    toast.info("📤 공유", {
      description: "리마인더 공유 기능 (구현 예정)",
    });
  };

  const handleEditGroup = (group: ReminderGroup) => {
    setEditingGroup(group);
    setEditGroupDialogOpen(true);
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
    setSelectedGroupId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>메뉴</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Settings className="h-5 w-5" />
                설정
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <Users className="h-5 w-5" />
                프로필
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
              >
                <MapPin className="h-5 w-5" />
                위치 관리
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <h1 className="tracking-wider">REMINDER</h1>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() =>
              toast.info("📍 위치 기반 알림", {
                description: "위치 설정 (구현 예정)",
              })
            }
          >
            <MapPin className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() =>
              toast.info("📤 공유", {
                description: "리마인더 공유 (구현 예정)",
              })
            }
          >
            <Share2 className="h-5 w-5" />
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
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-xs opacity-80">
                    연속 완료
                  </p>
                  <p className="text-xl">
                    {stats.currentStreak}일
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">
                  주간 완료율
                </p>
                <p className="text-xl">
                  {stats.weeklyCompletionRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">총 완료</p>
                <p className="text-xl">
                  {stats.totalCompletions}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="px-4 py-6 space-y-6">
            {/* URGENT Section */}
            {urgentReminders.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🔴</span>
                  <h2 className="text-gray-600">
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🟡</span>
                  <h2 className="text-gray-600">
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
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🟢</span>
                  <h2 className="text-gray-600">
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
              <div className="text-center py-12">
                <p className="text-4xl mb-4">📝</p>
                <p className="text-xl mb-2">
                  리마인더가 없습니다
                </p>
                <p className="text-gray-500 mb-6">
                  아래 버튼을 눌러 첫 리마인더를 만들어보세요!
                </p>
                <Button
                  onClick={() => setAddDialogOpen(true)}
                  size="lg"
                  className="gap-2"
                >
                  <Plus className="h-5 w-5" />
                  리마인더 만들기
                </Button>
              </div>
            )}
          </main>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="mt-0 px-4 py-6">
          <StatsView stats={stats} />
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="mt-0 px-4 py-6">
          <GroupsView
            groups={groups}
            reminders={reminders}
            onGroupClick={handleGroupClick}
            onEditGroup={handleEditGroup}
          />
        </TabsContent>
      </Tabs>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto relative">
          <div className="flex items-center justify-around px-4 pb-4 pt-2">
            {/* Home */}
            <button
              onClick={() => setActiveTab("home")}
              className="flex flex-col items-center gap-1 py-2 px-4 min-w-[60px]"
            >
              <Home
                className={`h-6 w-6 ${
                  activeTab === "home"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  activeTab === "home"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                홈
              </span>
            </button>

            {/* Stats */}
            <button
              onClick={() => setActiveTab("stats")}
              className="flex flex-col items-center gap-1 py-2 px-4 min-w-[60px]"
            >
              <BarChart3
                className={`h-6 w-6 ${
                  activeTab === "stats"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  activeTab === "stats"
                    ? "text-blue-600"
                    : "text-gray-500"
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
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="h-8 w-8 text-white" />
              </div>
            </button>

            {/* Groups */}
            <button
              onClick={() => setActiveTab("groups")}
              className="flex flex-col items-center gap-1 py-2 px-4 min-w-[60px]"
            >
              <Layers
                className={`h-6 w-6 ${
                  activeTab === "groups"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              />
              <span
                className={`text-xs ${
                  activeTab === "groups"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                그룹
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() =>
                toast.info("⚙️ 설정", {
                  description: "설정 화면 (구현 예정)",
                })
              }
              className="flex flex-col items-center gap-1 py-2 px-4 min-w-[60px]"
            >
              <Settings className="h-6 w-6 text-gray-500" />
              <span className="text-xs text-gray-500">설정</span>
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

      {/* Edit Group Dialog */}
      <EditGroupDialog
        open={editGroupDialogOpen}
        onOpenChange={setEditGroupDialogOpen}
        group={editingGroup}
        reminders={reminders}
        onSave={handleSaveGroup}
      />
    </div>
  );
}
