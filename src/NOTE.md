# 개발 노트 - 빈번한 실수와 해결 방법

## 개요

이 문서는 프로젝트를 진행하면서 자주 발생하는 실수와 문제들, 그리고 검증된 해결 방법을 기록합니다.
같은 실수를 반복하지 않고, 빠르게 문제를 해결하기 위한 참고 자료입니다.

---

## ⚠️ 절대 하지 말아야 할 것들

### 1. Tailwind 폰트 관련 클래스 사용 금지

**❌ 절대 사용하면 안 되는 클래스:**
```css
/* 폰트 크기 */
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl

/* 폰트 굵기 */
font-thin, font-light, font-normal, font-medium, font-semibold, font-bold

/* 줄 높이 */
leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed
```

**✅ 대신 이것을 사용:**
```tsx
// 제목
<h2 className="text-title">제목</h2>

// 내용
<p className="text-content">내용</p>

// 설명
<p className="text-description">설명</p>

// 버튼
<Button className="text-button">버튼</Button>
```

**이유:**
- `globals.css`에 HTML 요소별 기본 타이포그래피가 설정되어 있음
- Tailwind 폰트 클래스 사용 시 충돌 발생
- 디자인 시스템 일관성 유지를 위해

**발생 빈도:** ⭐⭐⭐⭐⭐ (매우 높음)

---

### 2. Leaflet 지도 라이브러리 사용 금지

**❌ 사용 금지:**
```tsx
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
```

**이유:**
- 브라우저 환경에서 의존성 문제 발생
- CSS 로딩 문제
- 무거운 라이브러리

**✅ 대신 이것을 사용:**
```tsx
// GPS로 현재 위치 가져오기
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude } = position.coords;
    // 사용
  }
);

// 수동 좌표 입력
<Input type="number" placeholder="위도" />
<Input type="number" placeholder="경도" />
```

**발생 빈도:** ⭐⭐⭐ (중간)

---

### 3. 체크리스트 완료 로직에서 중복 통계 업데이트

**❌ 잘못된 로직:**
```tsx
const toggleChecklistItem = (reminderId, itemId) => {
  // ... 체크 토글 ...
  
  if (allCompleted) {
    // 매번 통계 증가 (중복 발생!)
    setStats(prev => ({
      ...prev,
      totalCompletions: prev.totalCompletions + 1
    }));
  }
};
```

**✅ 올바른 로직:**
```tsx
const toggleChecklistItem = (reminderId, itemId) => {
  // ... 체크 토글 ...
  
  const allCompleted = updatedChecklist.every(item => item.completed);
  
  if (allCompleted && updatedChecklist.length > 0) {
    // 이전에 완료되지 않았을 때만 증가
    const wasAlreadyCompleted = reminder.checklist.every(
      item => item.completed
    );
    
    if (!wasAlreadyCompleted) {
      setStats(prev => ({
        ...prev,
        totalCompletions: prev.totalCompletions + 1
      }));
    }
  }
};
```

**발생 빈도:** ⭐⭐⭐⭐ (높음)

---

### 4. selectedReminder 상태 동기화 문제

**❌ 문제 상황:**
```tsx
// reminders가 업데이트되어도 selectedReminder는 이전 값 유지
const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);

// 체크리스트 토글 후 상세 화면에서 업데이트 안 보임
```

**✅ 해결 방법:**
```tsx
const selectedReminderIdRef = useRef<string | null>(null);

// selectedReminder 변경 시 ID 저장
useEffect(() => {
  if (selectedReminder) {
    selectedReminderIdRef.current = selectedReminder.id;
  }
}, [selectedReminder]);

// reminders 변경 시 ID로 찾아서 업데이트
useEffect(() => {
  if (selectedReminderIdRef.current) {
    const updatedReminder = reminders.find(
      r => r.id === selectedReminderIdRef.current
    );
    if (updatedReminder) {
      setSelectedReminder(updatedReminder);
    }
  }
}, [reminders]);
```

**발생 빈도:** ⭐⭐⭐⭐ (높음)

---

### 5. ID 생성 시 일관성 없는 형식

**❌ 잘못된 예:**
```tsx
// 서로 다른 형식 사용
id: `r-${Date.now()}`      // 리마인더 A
id: `r${Date.now()}`       // 리마인더 B
id: `reminder-${uuid()}`   // 리마인더 C
```

**✅ 일관된 형식:**
```tsx
// 리마인더
id: `r-${Date.now()}`      // "r-1730123456789"

// 그룹
id: `g${number}`           // "g1", "g2", ...

// 위치
id: `loc-${Date.now()}`    // "loc-1730123456789"

// 체크리스트 항목
id: `c${number}`           // "c1", "c2", ...
```

**발생 빈도:** ⭐⭐ (낮음)

---

## 🐛 자주 발생하는 버그와 해결법

### 버그 1: 위치 추적이 자동으로 멈추지 않음

**증상:**
- 위치 기반 리마인더를 모두 삭제해도 GPS 계속 작동
- 배터리 소모 증가

**원인:**
- `watchPosition`의 `watchId`를 제대로 정리하지 않음

**해결:**
```tsx
// useLocationTracking.ts
useEffect(() => {
  const locationReminders = reminders.filter(
    r => (r.trigger === 'location' || r.trigger === 'both') &&
         r.location?.latitude
  );

  if (locationReminders.length === 0) {
    // 위치 기반 리마인더가 없으면 추적 중지
    if (watchIdRef.current !== null) {
      clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    return;
  }

  // cleanup
  return () => {
    if (watchIdRef.current !== null) {
      clearWatch(watchIdRef.current);
    }
  };
}, [reminders]);
```

---

### 버그 2: 그룹 수정 시 리마인더 할당이 제대로 안 됨

**증상:**
- 그룹에서 리마인더를 추가/제거했는데 반영 안 됨
- 리마인더 카드에 그룹 배지가 잘못 표시됨

**원인:**
- 그룹의 `reminderIds`만 업데이트하고 리마인더의 `groupId`는 업데이트 안 함

**해결:**
```tsx
const handleSaveGroup = (groupId, updates) => {
  // 1. 그룹 업데이트
  setGroups(prev => 
    prev.map(g => g.id === groupId ? { ...g, ...updates } : g)
  );

  // 2. 리마인더 양방향 동기화
  setReminders(prev =>
    prev.map(r => {
      // 그룹에서 제거
      if (r.groupId === groupId && !updates.reminderIds.includes(r.id)) {
        return { ...r, groupId: undefined };
      }
      // 그룹에 추가
      if (updates.reminderIds.includes(r.id)) {
        return { ...r, groupId: groupId };
      }
      return r;
    })
  );
};
```

---

### 버그 3: 토스트 알림이 import 안 됨

**증상:**
```
Error: Cannot find module 'sonner'
```

**원인:**
- `sonner` import 시 버전을 명시하지 않음

**해결:**
```tsx
// ❌ 잘못된 import
import { toast } from 'sonner';

// ✅ 올바른 import
import { toast } from 'sonner@2.0.3';
```

---

### 버그 4: 프리셋 그룹이 삭제됨

**증상:**
- 사용자가 "외출 전", "PC방 방문" 등 프리셋 그룹을 삭제함
- 앱 초기화 시 복원되지 않음

**해결:**
```tsx
const handleDeleteGroup = (groupId) => {
  const group = groups.find(g => g.id === groupId);
  
  // 프리셋 그룹은 삭제 불가
  if (group?.isPreset) {
    toast.error("❌ 삭제 불가", {
      description: "프리셋 그룹은 삭제할 수 없습니다."
    });
    return;
  }
  
  // 커스텀 그룹만 삭제
  setGroups(prev => prev.filter(g => g.id !== groupId));
};
```

---

### 버그 5: JSON 가져오기 시 Date 타입 오류

**증상:**
```
TypeError: Cannot read property 'toISOString' of undefined
```

**원인:**
- JSON.parse 후 Date 문자열이 Date 객체로 자동 변환 안 됨

**해결:**
```tsx
const handleImportReminder = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    
    // 새 ID와 날짜 생성
    const newReminder: Reminder = {
      ...parsed,
      id: `r-${Date.now()}`,
      createdAt: new Date(),           // 새로 생성
      completionCount: 0,
      totalShown: 0,
      lastCompleted: undefined,        // 초기화
    };
    
    setReminders(prev => [...prev, newReminder]);
  } catch (error) {
    toast.error("❌ 잘못된 형식입니다");
  }
};
```

---

## 💡 유용한 팁

### 팁 1: 위치 테스트는 개발자 도구 활용

**문제:**
- 실제로 장소를 이동하면서 테스트하기 어려움

**해결:**
```
Chrome DevTools > ... > More tools > Sensors
→ Location을 "Custom location"으로 설정
→ 원하는 위도/경도 입력
```

---

### 팁 2: 목업 데이터 활용

**문제:**
- 매번 리마인더를 수동으로 추가하기 번거로움

**해결:**
```tsx
// data/mockData.ts 수정
export const mockReminders: Reminder[] = [
  // 테스트용 리마인더 추가
];

// App.tsx
const [reminders, setReminders] = useState(mockReminders);
```

---

### 팁 3: 콘솔 로그로 위치 추적 디버깅

```tsx
// useLocationTracking.ts
useEffect(() => {
  console.log('📍 Location updated:', {
    latitude,
    longitude,
    accuracy,
    activeReminders: locationReminders.length
  });
  
  locationReminders.forEach(reminder => {
    const distance = calculateDistance(
      latitude,
      longitude,
      reminder.location.latitude,
      reminder.location.longitude
    );
    console.log(`📏 Distance to ${reminder.title}: ${distance}m`);
  });
}, [latitude, longitude]);
```

---

### 팁 4: 체크리스트 완료율 계산

```tsx
const completionRate = reminder.checklist.length > 0
  ? (reminder.checklist.filter(item => item.completed).length / 
     reminder.checklist.length) * 100
  : 0;

// 프로그레스 바
<Progress value={completionRate} />
```

---

### 팁 5: TypeScript 타입 에러 해결

**문제:**
```
Property 'location' does not exist on type 'Reminder'
```

**해결:**
```tsx
// Optional 필드는 ? 사용
if (reminder.location?.latitude) {
  // 안전하게 접근
}

// 또는 타입 가드
if (reminder.trigger === 'location' && reminder.location) {
  // 이제 location이 존재함이 보장됨
}
```

---

## 📋 체크리스트

### 새 기능 추가 전 확인사항

- [ ] 타입 정의가 `/types/index.ts`에 있는가?
- [ ] Tailwind 폰트 클래스를 사용하지 않았는가?
- [ ] 버튼에 피드백 애니메이션이 있는가? (`active:scale-95`)
- [ ] 토스트 알림으로 사용자 피드백을 제공하는가?
- [ ] 에러 케이스를 처리했는가?
- [ ] 모바일 화면에서 잘 보이는가? (`max-w-md`)
- [ ] 접근성을 고려했는가? (ARIA 레이블)

### 커밋 전 확인사항

- [ ] 콘솔 에러가 없는가?
- [ ] 콘솔 경고가 없는가?
- [ ] TypeScript 에러가 없는가?
- [ ] 불필요한 console.log를 제거했는가?
- [ ] import 순서가 정리되어 있는가?
- [ ] 코드 포매팅이 일관적인가?

### 테스트 시 확인사항

- [ ] 모든 버튼이 동작하는가?
- [ ] 토스트 알림이 표시되는가?
- [ ] 상태가 올바르게 업데이트되는가?
- [ ] 새로고침 후에도 동작하는가? (향후 LocalStorage 적용 시)
- [ ] 빈 상태가 올바르게 표시되는가?
- [ ] 긴 텍스트가 잘 처리되는가?

---

## 🔍 디버깅 가이드

### 문제: 리마인더가 생성되지 않음

**확인 순서:**
1. `handleAddReminder` 함수가 호출되는가? (console.log)
2. `newReminder` 객체가 올바른가?
3. `setReminders`가 실행되는가?
4. React DevTools에서 state 확인
5. 필수 필드가 모두 있는가?

---

### 문제: 위치 추적이 작동하지 않음

**확인 순서:**
1. 브라우저가 Geolocation API를 지원하는가?
   ```tsx
   if (!navigator.geolocation) {
     console.error('Geolocation not supported');
   }
   ```
2. 위치 권한을 허용했는가?
3. HTTPS 연결인가? (localhost 제외)
4. 위치 기반 리마인더가 있는가?
5. `latitude`, `longitude`가 제대로 설정되어 있는가?

---

### 문제: Sheet/Dialog가 열리지 않음

**확인 순서:**
1. `open` prop이 true인가?
2. `onOpenChange` 함수가 제대로 연결되어 있는가?
3. shadcn/ui 컴포넌트가 올바르게 import되었는가?
4. z-index 충돌이 없는가?

---

### 문제: 스타일이 적용되지 않음

**확인 순서:**
1. Tailwind 클래스 이름이 올바른가?
2. 커스텀 클래스가 `globals.css`에 정의되어 있는가?
3. 클래스명에 오타가 없는가?
4. 조건부 클래스가 올바르게 적용되는가?
   ```tsx
   className={`base-class ${condition ? 'conditional-class' : ''}`}
   ```

---

## 📚 자주 찾는 코드 스니펫

### 1. 새 리마인더 추가

```tsx
const newReminder: Reminder = {
  id: `r-${Date.now()}`,
  title: "제목",
  icon: "📝",
  priority: "routine",
  trigger: "time",
  time: "09:00",
  checklist: [],
  completionCount: 0,
  totalShown: 0,
  createdAt: new Date(),
};

setReminders(prev => [...prev, newReminder]);
```

### 2. 토스트 알림

```tsx
// 성공
toast.success("✅ 성공", {
  description: "작업이 완료되었습니다."
});

// 에러
toast.error("❌ 오류", {
  description: "문제가 발생했습니다."
});

// 정보
toast.info("📍 알림", {
  description: "위치에 도착했습니다.",
  action: {
    label: "보기",
    onClick: () => { /* 액션 */ }
  }
});
```

### 3. 현재 위치 가져오기

```tsx
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log('현재 위치:', { latitude, longitude, accuracy });
  },
  (error) => {
    console.error('위치 오류:', error.message);
  },
  {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  }
);
```

### 4. 배열 상태 업데이트

```tsx
// 추가
setReminders(prev => [...prev, newReminder]);

// 수정
setReminders(prev => 
  prev.map(r => r.id === id ? { ...r, ...updates } : r)
);

// 삭제
setReminders(prev => prev.filter(r => r.id !== id));
```

### 5. 조건부 렌더링

```tsx
{/* 조건부 표시 */}
{reminders.length === 0 && (
  <div>리마인더가 없습니다</div>
)}

{/* 배열 렌더링 */}
{reminders.map(reminder => (
  <ReminderCard key={reminder.id} reminder={reminder} />
))}

{/* 옵셔널 체이닝 */}
<p>{reminder.location?.name || "위치 없음"}</p>
```

---

## 🚨 긴급 상황 대응

### 앱이 완전히 작동하지 않을 때

1. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 빨간색 에러 메시지 확인

2. **캐시 삭제**
   - Ctrl + Shift + R (하드 리프레시)

3. **의존성 재설치**
   - npm install

4. **타입 에러 확인**
   - TypeScript 컴파일 오류 확인

5. **최근 변경사항 되돌리기**
   - Git으로 이전 커밋으로 복원

---

### 데이터가 모두 사라졌을 때

**예방:**
```tsx
// 설정에서 정기적으로 백업
const handleExportAllData = () => {
  const data = {
    reminders,
    groups,
    savedLocations,
    stats,
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
  
  // JSON 파일로 다운로드
};
```

**복구:**
1. 백업 파일이 있다면 import
2. 없다면 mockData로 초기화
3. 향후 LocalStorage 구현 후 자동 복구

---

## 📝 마지막 조언

### 실수를 두려워하지 마세요
- 모든 실수는 학습 기회입니다
- 이 문서를 계속 업데이트하세요
- 같은 실수를 반복하지 않는 것이 중요합니다

### 문서화의 중요성
- 해결 방법을 찾았다면 여기에 기록하세요
- 미래의 당신이 감사할 것입니다
- 팀원들과 공유하세요

### 코드 리뷰
- 커밋 전에 자신의 코드를 다시 읽어보세요
- 이 문서의 체크리스트를 활용하세요
- 의심스러운 부분은 테스트하세요

---

**개발 노트 버전**: 1.0
**마지막 업데이트**: 2025년 11월 11일
**다음 리뷰 예정**: 2025년 12월 1일
