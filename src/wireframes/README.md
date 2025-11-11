# UI Wireframes

이 폴더에는 상황 기반 지능형 리마인더 앱의 모든 화면에 대한 UI wireframe이 XML 형식으로 저장되어 있습니다.

## 개요

각 wireframe은 화면의 레이아웃, 컴포넌트 구조, 인터랙션을 명확하게 정의합니다.
실제 구현 시 이 wireframe을 참고하여 일관된 UI/UX를 유지할 수 있습니다.

## 파일 목록

| 파일명 | 화면 | 타입 | 설명 |
|--------|------|------|------|
| `01-home-screen.xml` | 홈 화면 | Main | 리마인더 목록 메인 화면 |
| `02-add-reminder-dialog.xml` | 리마인더 추가/수정 | Dialog | 리마인더 생성 및 수정 다이얼로그 |
| `03-reminder-detail-sheet.xml` | 리마인더 상세 | Sheet | 리마인더 상세 정보 및 체크리스트 |
| `04-stats-view.xml` | 통계 | Tab | 사용자 통계 및 배지 화면 |
| `05-groups-view.xml` | 그룹 목록 | Tab | 리마인더 그룹 관리 화면 |
| `06-location-settings-view.xml` | 위치 관리 | Sheet | 저장된 위치 관리 화면 |
| `07-settings-view.xml` | 설정 | Sheet | 앱 설정 및 데이터 관리 |

## XML 구조 설명

### 기본 구조

```xml
<?xml version="1.0" encoding="UTF-8"?>
<screen name="화면이름" type="타입">
  <metadata>
    <title>제목</title>
    <description>설명</description>
    <trigger>진입 방법</trigger>
  </metadata>

  <content>
    <!-- 화면 내용 -->
  </content>
</screen>
```

### 화면 타입

- **main**: 메인 화면 (홈)
- **tab**: 탭 화면 (통계, 그룹)
- **dialog**: 다이얼로그 (리마인더 추가/수정)
- **sheet**: 사이드 패널 (상세, 설정)

### 주요 컴포넌트

#### 레이아웃

```xml
<container padding="px-6 py-8">
  <!-- 콘텐츠 -->
</container>

<row align="between center" gap="3">
  <!-- 가로 배치 -->
</row>

<column space="y-4">
  <!-- 세로 배치 -->
</column>

<grid columns="2" gap="4">
  <!-- 그리드 배치 -->
</grid>
```

#### 기본 컴포넌트

```xml
<!-- 버튼 -->
<button variant="default" size="lg" action="액션명">
  <icon name="plus" size="20" />
  <text>버튼 텍스트</text>
</button>

<!-- 텍스트 -->
<text typography="title" color="gray-900">제목</text>
<text typography="content">내용</text>
<text typography="description" color="gray-600">설명</text>

<!-- 아이콘 -->
<icon name="check" size="20" color="primary" />

<!-- 이모지 -->
<emoji size="3xl">🔥</emoji>

<!-- 카드 -->
<card padding="p-4" border="gray-200" clickable="true">
  <!-- 카드 내용 -->
</card>
```

#### 폼 컴포넌트

```xml
<!-- 입력 필드 -->
<form-group>
  <label required="true">제목</label>
  <input type="text" placeholder="입력하세요" height="h-12" />
</form-group>

<!-- 선택 -->
<select height="h-12">
  <option value="">선택하세요</option>
  <option value="1">옵션 1</option>
</select>

<!-- 체크박스 -->
<checkbox checked="true" />

<!-- 스위치 -->
<switch checked="false" />

<!-- 라디오 -->
<radio-button value="time" selected="true">
  <text>시간 기반</text>
</radio-button>

<!-- 슬라이더 -->
<slider min="50" max="500" step="10" value="100" />
```

#### 특수 컴포넌트

```xml
<!-- 프로그레스 바 -->
<progressbar value="50" max="100" />

<!-- 배지 -->
<badge variant="secondary" background="blue-100">
  <text>배지</text>
</badge>

<!-- 구분선 -->
<separator />

<!-- 원형 컨테이너 -->
<circle background="blue-100" size="48" align="center">
  <emoji>🏠</emoji>
</circle>
```

### 조건부 표시

```xml
<!-- 조건이 참일 때만 표시 -->
<section condition="reminders.length > 0">
  <!-- 콘텐츠 -->
</section>

<section condition="isEditing">
  <!-- 수정 모드 -->
</section>
```

### 스타일 속성

#### 간격 (Spacing)

```xml
padding="p-4"          <!-- 전체 패딩 -->
padding="px-6 py-8"    <!-- 좌우/상하 패딩 -->
margin="mb-4"          <!-- 하단 마진 -->
margin="mx-auto"       <!-- 좌우 중앙 -->
gap="3"                <!-- 자식 요소 간격 -->
space="y-4"            <!-- 세로 간격 -->
```

#### 크기 (Sizing)

```xml
width="w-full"         <!-- 전체 너비 -->
width="w-24"           <!-- 고정 너비 -->
height="h-12"          <!-- 고정 높이 -->
size="48"              <!-- 정사각형 크기 -->
max-width="md"         <!-- 최대 너비 -->
flex="1"               <!-- Flexbox flex-1 -->
```

#### 색상 (Colors)

```xml
background="white"
background="gray-50"
background="gradient blue-600 to blue-500"
color="gray-900"
color="primary"
border="gray-200"
border="2 primary"     <!-- 두께 2px, 파란색 -->
```

#### 모서리 (Borders)

```xml
rounded="lg"           <!-- 8px -->
rounded="xl"           <!-- 12px -->
rounded="2xl"          <!-- 16px -->
rounded="top"          <!-- 상단만 둥글게 -->
```

#### 그림자 (Shadows)

```xml
shadow="sm"            <!-- 작은 그림자 -->
shadow="md"            <!-- 중간 그림자 -->
shadow="lg"            <!-- 큰 그림자 -->
shadow="xl"            <!-- 매우 큰 그림자 -->
```

#### 정렬 (Alignment)

```xml
align="center"         <!-- 중앙 정렬 -->
align="between"        <!-- 양 끝 정렬 -->
align="start"          <!-- 시작 정렬 -->
align="end"            <!-- 끝 정렬 -->
justify="between"      <!-- justify-content: space-between -->
```

#### 기타

```xml
opacity="50"           <!-- 투명도 50% -->
clickable="true"       <!-- 클릭 가능 -->
hover="shadow-md"      <!-- 호버 시 그림자 -->
transition="shadow"    <!-- 그림자 전환 효과 -->
animation="pulse"      <!-- 맥박 애니메이션 -->
disabled="true"        <!-- 비활성화 -->
selected="true"        <!-- 선택됨 -->
position="sticky top-0" <!-- 상단 고정 -->
overflow="scroll"      <!-- 스크롤 가능 -->
```

### 액션 (Actions)

각 인터랙티브 요소는 `action` 속성으로 동작을 정의합니다:

```xml
action="openAddDialog"
action="save"
action="cancel"
action="close"
action="edit"
action="delete"
action="share"
action="toggleChecklistItem"
action="getCurrentLocation"
action="exportAllData"
```

## 사용 방법

### 1. 화면 구조 참고

새로운 화면을 구현할 때 해당 wireframe을 열어서 구조를 확인합니다.

```bash
# 예: 홈 화면 구현 시
cat wireframes/01-home-screen.xml
```

### 2. 컴포넌트 식별

wireframe에서 사용된 컴포넌트를 확인하고 실제 React 컴포넌트로 매핑합니다.

| Wireframe | React 컴포넌트 |
|-----------|---------------|
| `<button>` | `<Button>` (shadcn/ui) |
| `<card>` | `<Card>` (shadcn/ui) |
| `<input>` | `<Input>` (shadcn/ui) |
| `<checkbox>` | `<Checkbox>` (shadcn/ui) |
| `<dialog>` | `<Dialog>` (shadcn/ui) |
| `<sheet>` | `<Sheet>` (shadcn/ui) |

### 3. 스타일 적용

wireframe의 스타일 속성을 Tailwind CSS 클래스로 변환합니다.

```xml
<!-- Wireframe -->
<card padding="p-4" rounded="xl" shadow="sm" border="gray-200">
```

```tsx
// React
<Card className="p-4 rounded-xl shadow-sm border border-gray-200">
```

### 4. 조건부 렌더링

```xml
<!-- Wireframe -->
<section condition="reminders.length > 0">
```

```tsx
// React
{reminders.length > 0 && (
  <section>
    {/* 콘텐츠 */}
  </section>
)}
```

## 주의사항

### 타이포그래피

wireframe에서 `typography` 속성은 커스텀 클래스를 의미합니다:

```xml
typography="title"        → className="text-title"
typography="content"      → className="text-content"
typography="description"  → className="text-description"
```

❌ Tailwind 폰트 클래스 사용 금지:
- `text-xl`, `text-2xl`, `font-bold` 등

### 컬러

wireframe의 color는 실제 구현 시:

```xml
color="primary"    → className="text-primary"
color="gray-900"   → className="text-gray-900"
background="blue-600" → className="bg-blue-600"
```

### 반응형

wireframe은 모바일 우선 레이아웃입니다. 필요 시 `sm:`, `md:` 등 브레이크포인트를 추가하세요.

## 업데이트 가이드

새로운 화면을 추가하거나 기존 화면을 수정할 때:

1. 해당 wireframe XML 파일을 수정
2. 이 README의 파일 목록 업데이트
3. 변경 사항을 PROGRESS.md에 기록

## 예제

### 버튼 구현 예시

```xml
<!-- Wireframe -->
<button variant="default" size="lg" height="h-14" action="save">
  <icon name="save" size="20" />
  <text>저장</text>
</button>
```

```tsx
// React 구현
<Button 
  variant="default" 
  size="lg" 
  className="h-14"
  onClick={handleSave}
>
  <Save className="h-5 w-5" />
  <span>저장</span>
</Button>
```

### 카드 구현 예시

```xml
<!-- Wireframe -->
<card padding="p-4" rounded="xl" border="gray-200" clickable="true">
  <row gap="3" align="center">
    <emoji size="3xl">📸</emoji>
    <column flex="1">
      <text typography="content">자동차 보험 서류 준비</text>
      <text typography="description" color="gray-600">11월 15일 만기 전</text>
    </column>
  </row>
</card>
```

```tsx
// React 구현
<Card 
  className="p-4 rounded-xl border border-gray-200 cursor-pointer hover:shadow-md"
  onClick={() => handleClick()}
>
  <div className="flex items-center gap-3">
    <span className="text-3xl">📸</span>
    <div className="flex-1">
      <p className="text-content">자동차 보험 서류 준비</p>
      <p className="text-description text-gray-600">11월 15일 만기 전</p>
    </div>
  </div>
</Card>
```

## 참고 자료

- [DESIGN.md](/DESIGN.md) - UI/UX 디자인 가이드
- [globals.css](/styles/globals.css) - 타이포그래피 시스템
- [shadcn/ui 문서](https://ui.shadcn.com/) - 컴포넌트 라이브러리
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링

---

**버전**: 1.0  
**마지막 업데이트**: 2025년 11월 11일  
**총 화면 수**: 7개
