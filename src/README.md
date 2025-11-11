# 상황 기반 지능형 리마인더 앱

## 프로젝트 개요

위치, 상황, 행동 패턴에 기반한 스마트 알림을 제공하는 모바일 친화적 리마인더 애플리케이션입니다. 
각 리마인더에는 체크리스트가 통합되어 있으며, 완료율에 따른 적응형 알림 빈도 조정 기능을 제공합니다.

## 핵심 기능

### 1. 스마트 알림 시스템
- **시간 기반 알림**: 특정 시간, 요일별 반복 설정 지원
- **위치 기반 알림**: GPS를 활용한 장소 도착/떠남 감지
- **복합 알림**: 시간과 위치를 동시에 활용하는 하이브리드 알림

### 2. 체크리스트 통합
- 각 리마인더에 체크리스트 항목 추가
- 실시간 완료율 추적
- 전체 완료 시 자동 통계 업데이트

### 3. 우선순위 시스템
- 🔴 **긴급**: 즉시 처리가 필요한 리마인더
- 🟡 **이번 주**: 일주일 내 완료가 필요한 항목
- 🟢 **루틴**: 반복적으로 수행하는 습관 관리

### 4. 상황별 그룹 관리
- **프리셋 그룹**: 외출 전, PC방, 업무, 여행 등
- **커스텀 그룹**: 사용자 정의 그룹 생성/수정/삭제
- 그룹별 리마인더 일괄 관리

### 5. 게임화 요소
- **스트릭 시스템**: 연속 완료 일수 추적
- **배지 시스템**: 성취 기반 보상 (첫 완료, 7일 연속, 완벽주의자 등)
- **통계 대시보드**: 주간 완료율, 총 완료 횟수, 최장 스트릭

### 6. 위치 관리
- 저장된 위치 목록 관리
- GPS 현재 위치 가져오기
- 수동 좌표 입력 (위도/경도)
- 반경 설정 (미터 단위)

### 7. 데이터 관리
- **공유 기능**: JSON 형식으로 리마인더 공유
- **가져오기**: 공유받은 리마인더 불러오기
- **백업**: 전체 데이터 JSON 파일로 내보내기
- **초기화**: 모든 데이터 삭제 및 기본값 복원

## 기술 스택

### 프론트엔드
- **React 18**: 컴포넌트 기반 UI 프레임워크
- **TypeScript**: 타입 안정성 제공
- **Tailwind CSS v4.0**: 유틸리티 기반 스타일링
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트 라이브러리

### 주요 라이브러리
- **lucide-react**: 아이콘 라이브러리
- **sonner**: 토스트 알림 시스템
- **recharts**: 통계 차트 시각화
- **Geolocation API**: 위치 추적 기능

### 디자인 시스템
- **폰트**: Pretendard (모든 폰트 웨이트 지원)
- **컬러**: 
  - 배경: 흰색 (#ffffff)
  - 포인트: 파란색 (#2563eb)
  - 텍스트: 검은색/회색 계열
- **타이포그래피**:
  - 제목: 22px / 600 weight
  - 내용: 16px / 500 weight
  - 설명글: 14px / 500 weight
  - 버튼: 18px / 600 weight

## 프로젝트 구조

```
/
├── App.tsx                           # 메인 애플리케이션
├── components/
│   ├── ui/                           # shadcn/ui 컴포넌트
│   ├── AddReminderDialog.tsx        # 리마인더 추가/수정 다이얼로그
│   ├── ReminderCard.tsx             # 리마인더 카드 컴포넌트
│   ├── ReminderDetailView.tsx       # 리마인더 상세 보기
│   ├── GroupsView.tsx               # 그룹 목록 뷰
│   ├── GroupDetailView.tsx          # 그룹 상세 뷰
│   ├── EditGroupView.tsx            # 그룹 수정 뷰
│   ├── StatsView.tsx                # 통계 뷰
│   ├── LocationSettingsView.tsx     # 위치 설정 뷰
│   ├── LocationPicker.tsx           # 위치 선택 컴포넌트
│   ├── ShareDialog.tsx              # 리마인더 공유 다이얼로그
│   ├── ImportDialog.tsx             # 리마인더 가져오기 다이얼로그
│   └── SettingsView.tsx             # 설정 뷰
├── data/
│   ├── mockData.ts                  # 목업 데이터
│   ├── exampleReminder.json         # 예제 리마인더 (시간 기반)
│   ├── exampleTimeReminder.json     # 예제 시간 리마인더
│   └── exampleBothReminder.json     # 예제 복합 리마인더
├── hooks/
│   └── useLocationTracking.ts       # 위치 추적 훅
├── types/
│   └── index.ts                     # TypeScript 타입 정의
├── utils/
│   └── geolocation.ts               # 위치 관련 유틸리티
└── styles/
    └── globals.css                  # 글로벌 스타일
```

## 핵심 컴포넌트 설명

### App.tsx
- 메인 애플리케이션 컨테이너
- 상태 관리 (리마인더, 그룹, 통계, 위치)
- 탭 네비게이션 (홈, 통계, 그룹)
- 하단 네비게이션 바

### ReminderCard.tsx
- 리마인더 요약 정보 표시
- 체크리스트 미리보기
- 우선순위별 스타일링

### AddReminderDialog.tsx
- 리마인더 생성/수정 폼
- 트리거 타입 선택 (시간/위치/복합)
- 체크리스트 관리
- 그룹 할당

### LocationSettingsView.tsx
- 저장된 위치 목록 관리
- GPS 현재 위치 가져오기
- 수동 좌표 입력
- 위치 추가/수정/삭제

### useLocationTracking.ts
- Geolocation API를 통한 실시간 위치 추적
- 리마인더 위치와 현재 위치 비교
- 도착/떠남 이벤트 감지
- 알림 트리거

## 데이터 타입

### Reminder
```typescript
interface Reminder {
  id: string;
  title: string;
  description?: string;
  icon: string;
  priority: 'urgent' | 'week' | 'routine';
  groupId?: string;
  trigger: 'time' | 'location' | 'both';
  
  // 시간 기반
  time?: string;
  days?: number[]; // 0-6 (일-토)
  
  // 위치 기반
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
    radius?: number; // 미터
    triggerType: 'arrive' | 'leave';
  };
  
  // 체크리스트
  checklist: ChecklistItem[];
  
  // 통계
  completionCount: number;
  totalShown: number;
  lastCompleted?: Date;
  createdAt: Date;
}
```

### ReminderGroup
```typescript
interface ReminderGroup {
  id: string;
  name: string;
  icon: string;
  isPreset: boolean;
  reminderIds: string[];
}
```

### SavedLocation
```typescript
interface SavedLocation {
  id: string;
  name: string;
  icon: string;
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
  createdAt: Date;
}
```

## 주요 기능 구현

### 1. 위치 기반 알림
- Geolocation API의 `watchPosition` 사용
- Haversine 공식으로 거리 계산
- 진입/이탈 상태 변화 감지
- 백그라운드 추적 (리마인더가 있을 때만)

### 2. 적응형 알림 빈도
- 완료율 기반 알림 빈도 조정 준비
- `completionCount`와 `totalShown` 추적
- 미래 확장 가능한 구조

### 3. 스트릭 시스템
- 연속 완료 일수 추적
- 최장 스트릭 기록
- 체크리스트 완료 시 자동 업데이트

### 4. 데이터 영속성
- 현재: 메모리 기반 (새로고침 시 리셋)
- 미래: LocalStorage 또는 Supabase 연동 가능

## 사용 방법

### 리마인더 생성
1. 하단 중앙의 파란색 '+' 버튼 클릭
2. 제목, 아이콘, 우선순위 선택
3. 트리거 타입 선택:
   - **시간**: 시간과 요일 설정
   - **위치**: 장소와 반경, 트리거 타입 설정
   - **복합**: 시간과 위치 모두 설정
4. 체크리스트 항목 추가
5. 저장

### 위치 설정
1. 메뉴 > 위치 관리
2. '새 위치 추가' 버튼 클릭
3. 방법 선택:
   - **GPS 위치**: 현재 위치 자동 가져오기
   - **수동 입력**: 위도/경도 직접 입력
4. 이름, 아이콘, 반경 설정
5. 저장

### 리마인더 공유
1. 리마인더 클릭
2. 공유 버튼 클릭
3. JSON 코드 복사
4. 다른 사용자에게 전달

### 리마인더 가져오기
1. 메뉴 > 리마인더 가져오기
2. JSON 코드 붙여넣기
3. '가져오기' 버튼 클릭

## 향후 개발 계획

### 단기 계획
- [ ] LocalStorage를 통한 데이터 영속성
- [ ] 완료율 기반 알림 빈도 조정 로직 구현
- [ ] 더 많은 배지 추가
- [ ] 주간/월간 통계 차트 개선

### 중기 계획
- [ ] Supabase 백엔드 연동
- [ ] 사용자 인증 시스템
- [ ] 실시간 동기화
- [ ] PWA 지원 (오프라인 모드)

### 장기 계획
- [ ] AI 기반 리마인더 추천
- [ ] 소셜 기능 (친구와 그룹 공유)
- [ ] 웨어러블 디바이스 연동
- [ ] 음성 명령 지원

## 라이선스

MIT License

## 기여

이슈와 PR을 환영합니다!

## 연락처

프로젝트 관련 문의: [이메일 주소]
