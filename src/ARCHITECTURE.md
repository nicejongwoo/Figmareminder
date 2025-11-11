# 시스템 아키텍처

## 개요

상황 기반 지능형 리마인더 앱은 React 기반의 SPA(Single Page Application)로 구현되었습니다.
현재는 프론트엔드 전용 구조이며, 향후 Supabase를 통한 백엔드 확장이 가능하도록 설계되었습니다.

## 전체 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                   사용자 인터페이스                    │
│              (React + Tailwind CSS)                 │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│                상태 관리 계층                          │
│         (React Hooks + Local State)                │
│  - reminders                                        │
│  - groups                                           │
│  - stats                                            │
│  - savedLocations                                   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│              비즈니스 로직 계층                        │
│  - useLocationTracking (위치 추적)                   │
│  - geolocation utils (거리 계산)                     │
│  - 체크리스트 완료 처리                               │
│  - 통계 업데이트                                      │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│                  외부 API                            │
│  - Geolocation API (브라우저 내장)                   │
│  - Unsplash API (이미지, 선택사항)                   │
└─────────────────────────────────────────────────────┘
```

## 컴포넌트 계층 구조

```
App.tsx
├── Header
│   ├── Menu (Sheet)
│   │   ├── ImportDialog
│   │   ├── LocationSettingsView
│   │   └── SettingsView
│   └── Location Button
│
├── Tabs
│   ├── Home Tab
│   │   ├── Stats Banner
│   │   ├── Location Tracking Status
│   │   └── Reminder Sections
│   │       ├── Urgent Section (🔴)
│   │       │   └── ReminderCard[]
│   │       ├── Week Section (🟡)
│   │       │   └── ReminderCard[]
│   │       └── Routine Section (🟢)
│   │           └── ReminderCard[]
│   │
│   ├── Stats Tab
│   │   └── StatsView
│   │       ├── Streak Display
│   │       ├── Completion Charts
│   │       └── Badges
│   │
│   └── Groups Tab
│       └── GroupsView
│           └── GroupCard[]
│
├── Bottom Navigation
│   ├── Home Button
│   ├── Stats Button
│   ├── Add Button (중앙)
│   ├── Groups Button
│   └── Settings Button
│
├── Dialogs & Sheets
│   ├── AddReminderDialog
│   │   ├── Basic Info Section
│   │   ├── Trigger Type Selector
│   │   ├── Time Settings
│   │   ├── Location Settings
│   │   │   └── LocationPicker
│   │   └── Checklist Manager
│   │
│   ├── ReminderDetailView (Sheet)
│   │   ├── Header with Actions
│   │   ├── Metadata Display
│   │   ├── Checklist Items
│   │   └── Statistics
│   │
│   ├── GroupDetailView (Sheet)
│   │   ├── Group Header
│   │   └── Reminder List
│   │
│   ├── EditGroupView (Sheet)
│   │   ├── Group Info
│   │   └── Reminder Assignment
│   │
│   ├── ShareDialog
│   │   └── JSON Export
│   │
│   └── ImportDialog
│       └── JSON Import
│
└── LocationSettingsView (Sheet)
    ├── Saved Locations List
    ├── Add Location Form
    │   ├── GPS Button
    │   └── Manual Input
    └── Location Management
```

## 데이터 스키마

### 1. Reminder (리마인더)

```typescript
interface Reminder {
  // 식별자
  id: string;                    // 고유 ID (예: "r-1730123456789")
  
  // 기본 정보
  title: string;                 // 제목
  description?: string;          // 설명
  icon: string;                  // 이모지 아이콘
  priority: ReminderPriority;    // 'urgent' | 'week' | 'routine'
  groupId?: string;              // 소속 그룹 ID
  
  // 트리거 설정
  trigger: ReminderTrigger;      // 'time' | 'location' | 'both'
  
  // 시간 기반 설정
  time?: string;                 // "HH:MM" 형식 (예: "09:00")
  days?: number[];               // 요일 배열 [0-6], 0=일요일
  
  // 위치 기반 설정
  location?: Location;           // 위치 정보
  
  // 체크리스트
  checklist: ChecklistItem[];    // 체크리스트 항목들
  
  // 통계 및 메타데이터
  completionCount: number;       // 완료 횟수
  totalShown: number;            // 표시된 횟수
  lastCompleted?: Date;          // 마지막 완료 일시
  createdAt: Date;               // 생성 일시
}
```

### 2. Location (위치)

```typescript
interface Location {
  name: string;                  // 위치 이름
  latitude?: number;             // 위도 (예: 37.5665)
  longitude?: number;            // 경도 (예: 126.9780)
  radius?: number;               // 반경 (미터)
  triggerType: 'arrive' | 'leave'; // 트리거 타입
}
```

### 3. ChecklistItem (체크리스트 항목)

```typescript
interface ChecklistItem {
  id: string;                    // 고유 ID
  text: string;                  // 항목 내용
  completed: boolean;            // 완료 여부
}
```

### 4. ReminderGroup (리마인더 그룹)

```typescript
interface ReminderGroup {
  id: string;                    // 고유 ID
  name: string;                  // 그룹 이름
  icon: string;                  // 이모지 아이콘
  isPreset: boolean;             // 프리셋 여부 (삭제 불가)
  reminderIds: string[];         // 포함된 리마인더 ID 배열
}
```

### 5. SavedLocation (저장된 위치)

```typescript
interface SavedLocation {
  id: string;                    // 고유 ID (예: "loc-1730123456789")
  name: string;                  // 위치 이름
  icon: string;                  // 이모지 아이콘
  latitude: number;              // 위도
  longitude: number;             // 경도
  radius: number;                // 반경 (미터)
  address?: string;              // 주소 (선택사항)
  createdAt: Date;               // 생성 일시
}
```

### 6. UserStats (사용자 통계)

```typescript
interface UserStats {
  currentStreak: number;         // 현재 연속 완료 일수
  longestStreak: number;         // 최장 연속 완료 일수
  totalCompletions: number;      // 총 완료 횟수
  weeklyCompletionRate: number;  // 주간 완료율 (%)
  badges: Badge[];               // 획득한 배지 목록
}
```

### 7. Badge (배지)

```typescript
interface Badge {
  id: string;                    // 고유 ID
  name: string;                  // 배지 이름
  description: string;           // 배지 설명
  icon: string;                  // 이모지 아이콘
  unlockedAt?: Date;             // 획득 일시 (미획득 시 undefined)
}
```

## 상태 관리

### 전역 상태 (App.tsx)

```typescript
const [reminders, setReminders] = useState<Reminder[]>([]);
const [groups, setGroups] = useState<ReminderGroup[]>([]);
const [stats, setStats] = useState<UserStats>(mockUserStats);
const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
```

### UI 상태

```typescript
const [activeTab, setActiveTab] = useState("home");
const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
const [editingGroup, setEditingGroup] = useState<ReminderGroup | null>(null);

// Dialog/Sheet 상태
const [addDialogOpen, setAddDialogOpen] = useState(false);
const [detailSheetOpen, setDetailSheetOpen] = useState(false);
const [groupDetailSheetOpen, setGroupDetailSheetOpen] = useState(false);
const [editGroupSheetOpen, setEditGroupSheetOpen] = useState(false);
const [shareDialogOpen, setShareDialogOpen] = useState(false);
const [importDialogOpen, setImportDialogOpen] = useState(false);
const [locationSettingsOpen, setLocationSettingsOpen] = useState(false);
const [settingsOpen, setSettingsOpen] = useState(false);
```

## 핵심 기능 구현

### 1. 위치 추적 시스템

#### useLocationTracking Hook

```typescript
export function useLocationTracking(
  reminders: Reminder[],
  onLocationTrigger: (reminder: Reminder) => void
): LocationState
```

**동작 원리:**
1. 위치 기반 리마인더가 있는지 확인
2. Geolocation API의 `watchPosition` 시작
3. 위치 업데이트마다:
   - 현재 위치와 리마인더 위치 비교
   - Haversine 공식으로 거리 계산
   - 반경 내/외 상태 변화 감지
   - 트리거 조건 충족 시 콜백 호출
4. 리마인더가 없으면 추적 중지

#### 거리 계산 (Haversine Formula)

```typescript
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터
}
```

### 2. 체크리스트 완료 처리

```typescript
const toggleChecklistItem = (reminderId: string, itemId: string) => {
  setReminders((prev) =>
    prev.map((reminder) => {
      if (reminder.id === reminderId) {
        // 1. 체크리스트 항목 토글
        const updatedChecklist = reminder.checklist.map((item) =>
          item.id === itemId
            ? { ...item, completed: !item.completed }
            : item
        );

        // 2. 전체 완료 확인
        const allCompleted = updatedChecklist.every((item) => item.completed);

        // 3. 완료 시 통계 업데이트
        if (allCompleted && updatedChecklist.length > 0) {
          const wasAlreadyCompleted = reminder.checklist.every(
            (item) => item.completed
          );
          if (!wasAlreadyCompleted) {
            toast.success("🎉 리마인더 완료!");
            setStats((prevStats) => ({
              ...prevStats,
              totalCompletions: prevStats.totalCompletions + 1,
            }));
          }
        }

        // 4. 리마인더 업데이트
        return {
          ...reminder,
          checklist: updatedChecklist,
          lastCompleted: allCompleted ? new Date() : reminder.lastCompleted,
          completionCount: allCompleted ? reminder.completionCount + 1 : reminder.completionCount,
        };
      }
      return reminder;
    })
  );
};
```

### 3. 그룹 관리 시스템

#### 그룹 저장

```typescript
const handleSaveGroup = (
  groupId: string,
  updates: { name: string; icon: string; reminderIds: string[] }
) => {
  // 1. 그룹 정보 업데이트
  setGroups((prev) =>
    prev.map((g) =>
      g.id === groupId
        ? { ...g, name: updates.name, icon: updates.icon, reminderIds: updates.reminderIds }
        : g
    )
  );

  // 2. 리마인더의 그룹 할당 업데이트
  setReminders((prev) =>
    prev.map((r) => {
      // 그룹에서 제거된 리마인더
      if (r.groupId === groupId && !updates.reminderIds.includes(r.id)) {
        return { ...r, groupId: undefined };
      }
      // 그룹에 추가된 리마인더
      if (updates.reminderIds.includes(r.id)) {
        return { ...r, groupId: groupId };
      }
      return r;
    })
  );
};
```

### 4. 데이터 공유/가져오기

#### 공유 (Export)

```typescript
const reminderJson = JSON.stringify(selectedReminder, null, 2);
// 사용자에게 JSON 텍스트 제공
```

#### 가져오기 (Import)

```typescript
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
};
```

#### 전체 데이터 백업

```typescript
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
  
  // 파일 다운로드
  const link = document.createElement('a');
  link.href = url;
  link.download = `smart-reminder-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
```

## API 명세 (향후 Supabase 연동)

### 리마인더 API

#### GET /reminders
- **설명**: 사용자의 모든 리마인더 조회
- **응답**: `Reminder[]`

#### POST /reminders
- **설명**: 새 리마인더 생성
- **요청**: `Omit<Reminder, 'id' | 'createdAt' | 'completionCount' | 'totalShown'>`
- **응답**: `Reminder`

#### PUT /reminders/:id
- **설명**: 리마인더 수정
- **요청**: `Partial<Reminder>`
- **응답**: `Reminder`

#### DELETE /reminders/:id
- **설명**: 리마인더 삭제
- **응답**: `{ success: boolean }`

#### POST /reminders/:id/complete
- **설명**: 리마인더 완료 처리
- **응답**: `Reminder`

### 그룹 API

#### GET /groups
- **설명**: 사용자의 모든 그룹 조회
- **응답**: `ReminderGroup[]`

#### POST /groups
- **설명**: 새 그룹 생성
- **요청**: `Omit<ReminderGroup, 'id'>`
- **응답**: `ReminderGroup`

#### PUT /groups/:id
- **설명**: 그룹 수정
- **요청**: `Partial<ReminderGroup>`
- **응답**: `ReminderGroup`

#### DELETE /groups/:id
- **설명**: 그룹 삭제 (프리셋 그룹 제외)
- **응답**: `{ success: boolean }`

### 위치 API

#### GET /locations
- **설명**: 저장된 위치 목록 조회
- **응답**: `SavedLocation[]`

#### POST /locations
- **설명**: 새 위치 저장
- **요청**: `Omit<SavedLocation, 'id' | 'createdAt'>`
- **응답**: `SavedLocation`

#### PUT /locations/:id
- **설명**: 위치 정보 수정
- **요청**: `Partial<SavedLocation>`
- **응답**: `SavedLocation`

#### DELETE /locations/:id
- **설명**: 저장된 위치 삭제
- **응답**: `{ success: boolean }`

### 통계 API

#### GET /stats
- **설명**: 사용자 통계 조회
- **응답**: `UserStats`

#### POST /stats/update
- **설명**: 통계 업데이트 (완료, 스트릭 등)
- **요청**: `Partial<UserStats>`
- **응답**: `UserStats`

## 보안 고려사항

### 현재 구현 (프론트엔드 전용)
- 모든 데이터는 메모리에만 저장
- 위치 정보는 브라우저 API 통해서만 접근
- 민감한 데이터 없음

### 향후 백엔드 연동 시
- JWT 기반 인증
- Row Level Security (RLS) 적용
- 위치 데이터 암호화
- HTTPS 통신 필수
- CORS 설정

## 성능 최적화

### 현재 적용된 최적화
1. **React.memo**: 불필요한 리렌더링 방지 (필요 시 적용)
2. **useCallback**: 함수 메모이제이션
3. **조건부 위치 추적**: 리마인더가 있을 때만 GPS 활성화
4. **가상 스크롤**: 대량 리마인더 처리 (필요 시)

### 향후 최적화 계획
1. **React Query**: 서버 상태 관리
2. **Service Worker**: 오프라인 지원
3. **IndexedDB**: 로컬 캐싱
4. **Code Splitting**: 번들 크기 최적화

## 확장성

### 데이터베이스 스키마 (Supabase)

```sql
-- users 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- reminders 테이블
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  priority TEXT CHECK (priority IN ('urgent', 'week', 'routine')),
  group_id UUID REFERENCES reminder_groups(id) ON DELETE SET NULL,
  trigger TEXT CHECK (trigger IN ('time', 'location', 'both')),
  time TEXT,
  days INTEGER[],
  location JSONB,
  checklist JSONB,
  completion_count INTEGER DEFAULT 0,
  total_shown INTEGER DEFAULT 0,
  last_completed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- reminder_groups 테이블
CREATE TABLE reminder_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  is_preset BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- saved_locations 테이블
CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius INTEGER NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_stats 테이블
CREATE TABLE user_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_completions INTEGER DEFAULT 0,
  weekly_completion_rate INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- badges 테이블
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own reminders"
  ON reminders FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own groups"
  ON reminder_groups FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own locations"
  ON saved_locations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own stats"
  ON user_stats FOR ALL
  USING (auth.uid() = user_id);
```

## 모니터링 및 로깅

### 향후 구현 예정
- 위치 추적 오류 로깅
- 알림 트리거 이벤트 기록
- 사용자 행동 분석
- 성능 메트릭 수집

## 배포

### 현재 환경
- Figma Make 플랫폼
- 정적 호스팅

### 향후 배포 옵션
- Vercel / Netlify
- AWS Amplify
- Cloudflare Pages
