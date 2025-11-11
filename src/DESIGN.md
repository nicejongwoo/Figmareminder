# UI/UX 디자인 가이드

## 디자인 철학

상황 기반 지능형 리마인더 앱은 **최소한의 디자인(Minimalism)** 원칙을 따릅니다.
불필요한 장식을 제거하고 핵심 기능에 집중하여, 사용자가 빠르고 직관적으로 리마인더를 관리할 수 있도록 합니다.

### 핵심 원칙

1. **명확성(Clarity)**: 모든 요소는 명확한 목적을 가짐
2. **일관성(Consistency)**: 전체 앱에서 동일한 패턴 사용
3. **접근성(Accessibility)**: 모든 사용자가 쉽게 사용 가능
4. **반응성(Responsiveness)**: 즉각적인 피드백 제공
5. **효율성(Efficiency)**: 최소 클릭으로 목표 달성

---

## 컬러 시스템

### 주요 색상

```css
:root {
  /* 기본 색상 */
  --background: #ffffff;           /* 순백 배경 */
  --foreground: #1a1a1a;          /* 거의 검은색 텍스트 */
  
  /* 포인트 색상 */
  --primary: #2563eb;             /* 파란색 (Blue-600) */
  --primary-foreground: #ffffff;  /* 흰색 */
  
  /* 보조 색상 */
  --secondary: #f3f4f6;           /* 회색-100 */
  --muted: #f9fafb;               /* 회색-50 */
  --muted-foreground: #6b7280;    /* 회색-500 */
  
  /* 상태 색상 */
  --destructive: #ef4444;         /* 빨간색 (Red-500) */
  --accent: #2563eb;              /* 파란색 (Primary와 동일) */
  
  /* 테두리 */
  --border: #e5e7eb;              /* 회색-200 */
}
```

### 색상 사용 가이드

#### 배경색
- **흰색 (#ffffff)**: 앱 전체 배경
- **회색-50 (#f9fafb)**: 카드 호버 상태
- **회색-100 (#f3f4f6)**: 비활성 영역

#### 텍스트
- **검은색 (#1a1a1a)**: 주요 텍스트 (제목, 내용)
- **회색-500 (#6b7280)**: 보조 텍스트 (설명, 힌트)
- **회색-400 (#9ca3af)**: 비활성 텍스트

#### 포인트 컬러
- **파란색 (#2563eb)**: 
  - 주요 액션 버튼
  - 활성 상태 표시
  - 링크
  - 선택된 항목
  - 아이콘 강조

#### 상태 표시
- **빨간색 (#ef4444)**: 삭제, 오류, 경고
- **초록색 (#10b981)**: 성공, 완료
- **주황색 (#f59e0b)**: 주의, 대기
- **보라색 (#8b5cf6)**: 특수 기능

#### 우선순위 색상
- **🔴 긴급**: 빨간색 계열 (텍스트만)
- **🟡 이번주**: 노란색 계열 (텍스트만)
- **🟢 루틴**: 초록색 계열 (텍스트만)

---

## 타이포그래피

### 폰트 패밀리

```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
```

**Pretendard**는 한글과 영문 모두 아름답게 표시되는 오픈소스 폰트입니다.

### 폰트 크기 및 굵기

| 용도 | 크기 | 굵기 | 줄간격 | CSS 클래스 | 사용 예시 |
|------|------|------|--------|-----------|----------|
| **제목** | 22px | 600 (SemiBold) | 1.4 | `.text-title` | 섹션 제목, 카드 헤더 |
| **내용** | 16px | 500 (Medium) | 1.6 | `.text-content` | 본문, 리마인더 내용 |
| **설명글** | 14px | 500 (Medium) | 1.5 | `.text-description` | 부가 설명, 힌트 |
| **버튼** | 18px | 600 (SemiBold) | 1.4 | `.text-button` | 버튼 텍스트 |

### 타이포그래피 규칙

#### ⚠️ 중요: Tailwind 폰트 클래스 금지

```css
/* ❌ 사용 금지 */
text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl
font-normal, font-medium, font-semibold, font-bold
leading-none, leading-tight, leading-normal

/* ✅ 대신 이것 사용 */
text-title, text-content, text-description, text-button
```

**이유**: `globals.css`에 HTML 요소별 기본 스타일이 설정되어 있어, Tailwind 폰트 클래스 사용 시 충돌 발생

#### 적용 예시

```tsx
{/* 제목 */}
<h2 className="text-title text-gray-900">긴급 리마인더</h2>

{/* 내용 */}
<p className="text-content">외출 전 확인사항을 체크하세요</p>

{/* 설명 */}
<p className="text-description text-gray-600">마지막 완료: 1시간 전</p>

{/* 버튼 */}
<Button className="text-button">리마인더 추가</Button>
```

### Letter Spacing (자간)

- **제목**: -0.01em (약간 좁게)
- **본문**: 기본값
- **버튼**: 기본값

---

## 레이아웃 시스템

### 그리드 & 간격

```css
/* 표준 간격 */
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 0.75rem;  /* 12px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 2.5rem;  /* 40px */

/* 표준 패딩 */
px-6 py-5   /* 헤더 */
px-6 py-8   /* 메인 콘텐츠 */
p-4         /* 카드 */
p-3         /* 작은 카드 */
```

### 모바일 최적화

- **최대 너비**: `max-w-md` (448px)
- **중앙 정렬**: `mx-auto`
- **안전 영역**: `pb-safe` (하단 네비게이션 고려)
- **최소 터치 영역**: 44x44px (iOS 권장)

### 반응형 브레이크포인트

```css
/* Tailwind 기본값 */
sm: 640px   /* 태블릿 세로 */
md: 768px   /* 태블릿 가로 */
lg: 1024px  /* 데스크톱 */
xl: 1280px  /* 대형 데스크톱 */
```

**주의**: 이 앱은 주로 모바일 환경을 타겟으로 하므로, 대부분의 레이아웃은 모바일 우선으로 설계됩니다.

---

## 컴포넌트 스타일 가이드

### 1. 버튼 (Button)

#### 기본 버튼

```tsx
<Button variant="default">기본 버튼</Button>
```

- **배경**: 파란색 그라디언트 (`bg-gradient-to-br from-blue-600 to-blue-500`)
- **텍스트**: 흰색
- **높이**: `h-14` (56px)
- **라운드**: `rounded-xl`
- **피드백**: `active:scale-95` (눌렀을 때 약간 작아짐)

#### 고스트 버튼

```tsx
<Button variant="ghost">고스트 버튼</Button>
```

- **배경**: 투명 (호버 시 회색)
- **텍스트**: 검은색
- **용도**: 보조 액션, 메뉴 항목

#### 아이콘 버튼

```tsx
<Button variant="ghost" size="icon">
  <Settings className="h-5 w-5" />
</Button>
```

- **크기**: `h-11 w-11` (44x44px)
- **아이콘**: `h-5 w-5` (20x20px)

#### Destructive 버튼

```tsx
<Button variant="destructive">삭제</Button>
```

- **배경**: 빨간색
- **텍스트**: 흰색
- **용도**: 삭제, 취소 등 위험한 액션

### 2. 카드 (Card)

#### 리마인더 카드

```tsx
<div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
  {/* 카드 내용 */}
</div>
```

- **배경**: 흰색
- **테두리**: 회색-200 (1px)
- **라운드**: `rounded-xl` (12px)
- **패딩**: `p-4` (16px)
- **그림자**: `shadow-sm` (기본), `shadow-md` (호버)
- **전환**: `transition-shadow`

#### 강조 카드 (통계 배너 등)

```tsx
<div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-6 shadow-md">
  {/* 카드 내용 */}
</div>
```

- **배경**: 파란색 그라디언트
- **텍스트**: 흰색
- **그림자**: `shadow-md`

### 3. 입력 필드 (Input)

```tsx
<Input 
  type="text" 
  placeholder="제목을 입력하세요"
  className="h-12 text-content"
/>
```

- **높이**: `h-12` (48px)
- **테두리**: 회색-200
- **라운드**: `rounded-lg` (8px)
- **폰트**: `text-content` (16px, 500)
- **포커스**: 파란색 링 (`ring-2 ring-blue-600`)

### 4. 체크박스 (Checkbox)

```tsx
<Checkbox 
  checked={item.completed}
  onCheckedChange={() => handleToggle(item.id)}
/>
```

- **크기**: 20x20px
- **체크 색상**: 파란색
- **라운드**: `rounded-sm` (약간 둥글게)

### 5. 배지 (Badge)

```tsx
<Badge variant="secondary">3/5</Badge>
```

- **배경**: 회색-100
- **텍스트**: 검은색
- **폰트**: `text-description` (14px)
- **패딩**: `px-2 py-1`
- **라운드**: `rounded-md`

### 6. 다이얼로그 (Dialog)

```tsx
<Dialog>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="text-title">제목</DialogTitle>
    </DialogHeader>
    {/* 내용 */}
  </DialogContent>
</Dialog>
```

- **최대 너비**: `max-w-md` (448px)
- **배경**: 흰색
- **라운드**: `rounded-2xl` (16px)
- **그림자**: `shadow-xl`
- **오버레이**: 반투명 검은색

### 7. Sheet (사이드 패널)

```tsx
<Sheet>
  <SheetContent side="right" className="w-full sm:max-w-md">
    {/* 내용 */}
  </SheetContent>
</Sheet>
```

- **너비**: 모바일 100%, 데스크톱 max-w-md
- **위치**: 오른쪽에서 슬라이드
- **배경**: 흰색
- **애니메이션**: `transition-transform`

---

## 아이콘 시스템

### 아이콘 라이브러리

**lucide-react** 사용

```tsx
import { Plus, Settings, MapPin } from "lucide-react";

<Plus className="h-5 w-5" />
```

### 아이콘 크기

| 용도 | 크기 | 클래스 |
|------|------|--------|
| 버튼 내부 | 20x20px | `h-5 w-5` |
| 큰 버튼 | 32x32px | `h-8 w-8` |
| 작은 아이콘 | 16x16px | `h-4 w-4` |
| 제목 옆 | 24x24px | `h-6 w-6` |

### 이모지 아이콘

리마인더와 그룹에는 이모지 아이콘 사용:

```tsx
<span className="text-2xl">🔴</span>  {/* 우선순위 */}
<span className="text-3xl">🔥</span>  {/* 스트릭 */}
<span className="text-4xl">📝</span>  {/* 빈 상태 */}
```

---

## 애니메이션 & 피드백

### 버튼 피드백

```tsx
<Button className="active:scale-95 transition-transform">
  클릭하기
</Button>
```

- **액티브 상태**: `active:scale-95` (5% 축소)
- **전환**: `transition-transform` (75ms)

### 호버 효과

```tsx
<div className="hover:shadow-md transition-shadow">
  카드
</div>
```

- **카드**: 그림자 강화 (`shadow-sm` → `shadow-md`)
- **버튼**: 약간 어둡게 (`hover:brightness-95`)

### 로딩 애니메이션

```tsx
<MapPin className="h-5 w-5 animate-pulse" />
```

- **위치 추적**: `animate-pulse` (맥박 효과)
- **로딩**: `animate-spin` (회전)

### 페이드 인/아웃

```tsx
<div className="opacity-0 animate-fade-in">
  내용
</div>
```

---

## 반응형 디자인

### 모바일 (기본)

- **최대 너비**: 100%
- **패딩**: `px-6` (24px)
- **폰트**: 기본 크기

### 태블릿 (640px+)

```tsx
<div className="sm:max-w-md sm:px-8">
  내용
</div>
```

- **최대 너비**: 448px
- **중앙 정렬**: `mx-auto`
- **패딩 증가**: `px-8`

### 데스크톱 (768px+)

```tsx
<Sheet>
  <SheetContent className="w-full sm:max-w-md">
    내용
  </SheetContent>
</Sheet>
```

- **Sheet 너비**: 448px (모바일에서는 100%)
- **다이얼로그**: 중앙 배치

---

## 접근성 (Accessibility)

### 포커스 스타일

```css
/* 자동 적용 (globals.css) */
.focus-visible:outline-ring/50
```

- **아웃라인**: 파란색 링 (50% 투명도)
- **두께**: 2px

### 키보드 네비게이션

- 모든 인터랙티브 요소는 `Tab` 키로 접근 가능
- `Enter` / `Space`로 활성화
- `Esc`로 다이얼로그/시트 닫기

### ARIA 레이블

```tsx
{/* 스크린 리더 전용 설명 */}
<SheetHeader className="sr-only">
  <SheetTitle>리마인더 상세</SheetTitle>
</SheetHeader>

{/* 버튼 설명 */}
<Button aria-label="리마인더 추가">
  <Plus />
</Button>
```

### 색상 대비

- **일반 텍스트**: 최소 4.5:1 (WCAG AA)
- **큰 텍스트**: 최소 3:1
- **현재 대비율**:
  - 검은색/흰색: 21:1 ✅
  - 파란색/흰색: 4.8:1 ✅
  - 회색-500/흰색: 4.6:1 ✅

---

## 레이아웃 예시

### 홈 화면

```
┌─────────────────────────────┐
│ [Menu]  리마인더      [📍]  │ ← 헤더 (sticky)
├─────────────────────────────┤
│ 🔥 7일   |  85%   |  45개  │ ← 통계 배너 (파란색)
├─────────────────────────────┤
│ 📍 위치 추적 중              │ ← 위치 상태 (조건부)
├─────────────────────────────┤
│                             │
│ 🔴 긴급 (2)                 │ ← 섹션 제목
│ ┌─────────────────────┐     │
│ │ 📸 자동차 보험      │     │ ← 리마인더 카드
│ │ ☐ 계기판 사진       │     │
│ │ ☐ 번호판 사진       │     │
│ │ [0/3] ▓░░░░         │     │
│ └─────────────────────┘     │
│                             │
│ 🟡 이번 주 (1)              │
│ ┌─────────────────────┐     │
│ │ 💼 업무 시작 전     │     │
│ │ ☑ 일정 확인         │     │
│ │ ☑ 이메일 체크       │     │
│ │ [2/3] ▓▓▓░░         │     │
│ └─────────────────────┘     │
│                             │
│ 🟢 루틴 (3)                 │
│ ...                         │
│                             │
├─────────────────────────────┤
│ [홈] [통계] (➕) [그룹] [⚙] │ ← 하단 네비게이션
└─────────────────────────────┘
```

### 리마인더 상세

```
┌─────────────────────────────┐
│ [←]         [✏️] [🗑️] [📤] │ ← 액션 버튼들
├─────────────────────────────┤
│                             │
│     📸                      │ ← 큰 아이콘
│ 자동차 보험 서류 준비       │ ← 제목
│ 11월 15일 만기 전...        │ ← 설명
│                             │
├─────────────────────────────┤
│ 우선순위: 🔴 긴급           │
│ 트리거: ⏰ 시간 기반        │
│ 시간: 오전 9:00             │
│                             │
├─────────────────────────────┤
│ 체크리스트 (0/3)            │
│                             │
│ ☐ 계기판 사진 촬영          │
│ ☐ 번호판 사진 촬영          │
│ ☐ 등록증 사본 준비          │
│                             │
├─────────────────────────────┤
│ 통계                        │
│ 완료 횟수: 0회              │
│ 마지막 완료: -              │
│ 생성일: 2025.10.20          │
└─────────────────────────────┘
```

---

## 다크 모드 (미구현, 준비됨)

`globals.css`에 다크 모드 변수가 이미 정의되어 있습니다:

```css
.dark {
  --background: #0f0f0f;
  --foreground: #fafafa;
  --primary: #3b82f6;
  /* ... */
}
```

향후 다크 모드 토글 추가 시 자동으로 적용됩니다.

---

## 브랜딩

### 앱 아이콘
- 이모지: 📝 또는 🔔
- 컬러: 파란색 (#2563eb)

### 앱 이름
- **한글**: 스마트 리마인더
- **영문**: Smart Reminder

### 슬로건
- "상황에 맞는 똑똑한 알림"
- "잊지 말아야 할 순간들"

---

## 디자인 체크리스트

설계/개발 시 반드시 확인:

- [ ] Tailwind 폰트 클래스 사용하지 않음
- [ ] 커스텀 타이포그래피 클래스 사용 (text-title, text-content 등)
- [ ] 모든 버튼에 피드백 애니메이션 (active:scale-95)
- [ ] 최소 터치 영역 44x44px
- [ ] 파란색 포인트 컬러 일관성 유지
- [ ] 카드 라운드 `rounded-xl` 사용
- [ ] 적절한 그림자 (shadow-sm, shadow-md)
- [ ] 접근성: ARIA 레이블, 포커스 스타일
- [ ] 반응형: `max-w-md mx-auto`
- [ ] 일관된 간격 (px-6, py-8 등)

---

**디자인 시스템 버전**: 1.0
**마지막 업데이트**: 2025년 11월 11일
