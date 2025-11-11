# 테스트 데이터

## 개요

이 문서는 테스트 시 사용할 수 있는 다양한 샘플 데이터를 제공합니다.
개발 및 테스트 환경에서 일관된 데이터로 기능을 검증할 수 있도록 돕습니다.

---

## 1. 리마인더 샘플 데이터

### 1.1 긴급 우선순위

#### 자동차 보험 서류 준비
```json
{
  "title": "자동차 보험 서류 준비",
  "description": "11월 15일 만기 전 서류 촬영",
  "icon": "📸",
  "priority": "urgent",
  "trigger": "time",
  "time": "09:00",
  "checklist": [
    { "id": "c1", "text": "계기판 사진 촬영", "completed": false },
    { "id": "c2", "text": "번호판 사진 촬영", "completed": false },
    { "id": "c3", "text": "등록증 사본 준비", "completed": false }
  ]
}
```

#### 병원 예약
```json
{
  "title": "병원 예약",
  "description": "오후 2시 정형외과 진료",
  "icon": "🏥",
  "priority": "urgent",
  "trigger": "time",
  "time": "13:30",
  "checklist": [
    { "id": "c1", "text": "보험증 챙기기", "completed": false },
    { "id": "c2", "text": "진료비 준비", "completed": false }
  ]
}
```

#### 회의 자료 준비
```json
{
  "title": "프로젝트 킥오프 회의 자료",
  "description": "금요일 오전 회의 발표 자료",
  "icon": "💼",
  "priority": "urgent",
  "trigger": "time",
  "time": "10:00",
  "days": [5],
  "checklist": [
    { "id": "c1", "text": "PPT 최종 검토", "completed": false },
    { "id": "c2", "text": "데모 환경 확인", "completed": false },
    { "id": "c3", "text": "인쇄물 준비", "completed": false }
  ]
}
```

### 1.2 이번 주 우선순위

#### 외출 전 확인
```json
{
  "title": "외출 전 확인",
  "description": "집을 나서기 전 안전 체크",
  "icon": "🏠",
  "priority": "week",
  "groupId": "g1",
  "trigger": "location",
  "location": {
    "name": "우리집",
    "latitude": 37.5665,
    "longitude": 126.9780,
    "radius": 100,
    "triggerType": "leave"
  },
  "checklist": [
    { "id": "c1", "text": "가스밸브 잠금", "completed": false },
    { "id": "c2", "text": "창문 잠금", "completed": false },
    { "id": "c3", "text": "불 끄기", "completed": false },
    { "id": "c4", "text": "에어컨/히터 끄기", "completed": false }
  ]
}
```

#### PC방 퇴실 전 확인
```json
{
  "title": "PC방 방문 시 확인",
  "description": "PC방 퇴실 전 소지품 체크",
  "icon": "🎮",
  "priority": "week",
  "groupId": "g2",
  "trigger": "location",
  "location": {
    "name": "PC방",
    "latitude": 37.5172,
    "longitude": 127.0473,
    "radius": 80,
    "triggerType": "leave"
  },
  "checklist": [
    { "id": "c1", "text": "우산 챙기기", "completed": false },
    { "id": "c2", "text": "지갑 확인", "completed": false },
    { "id": "c3", "text": "휴대폰 확인", "completed": false },
    { "id": "c4", "text": "이어폰 확인", "completed": false }
  ]
}
```

#### 주간 리포트 작성
```json
{
  "title": "주간 리포트 작성",
  "description": "매주 금요일 오후 5시",
  "icon": "📊",
  "priority": "week",
  "trigger": "time",
  "time": "17:00",
  "days": [5],
  "checklist": [
    { "id": "c1", "text": "이번 주 성과 정리", "completed": false },
    { "id": "c2", "text": "다음 주 계획 수립", "completed": false },
    { "id": "c3", "text": "이슈 사항 기록", "completed": false }
  ]
}
```

#### 식료품 쇼핑
```json
{
  "title": "장보기",
  "description": "주간 식료품 구매",
  "icon": "🛒",
  "priority": "week",
  "trigger": "time",
  "time": "19:00",
  "days": [6],
  "checklist": [
    { "id": "c1", "text": "과일/채소", "completed": false },
    { "id": "c2", "text": "유제품", "completed": false },
    { "id": "c3", "text": "간식", "completed": false },
    { "id": "c4", "text": "생활용품", "completed": false }
  ]
}
```

### 1.3 루틴 우선순위

#### 약 복용
```json
{
  "title": "약 복용",
  "description": "매일 저녁 8시",
  "icon": "💊",
  "priority": "routine",
  "trigger": "time",
  "time": "20:00",
  "checklist": [
    { "id": "c1", "text": "영양제 복용", "completed": false }
  ]
}
```

#### 운동 루틴
```json
{
  "title": "운동 루틴",
  "description": "주 3회 운동",
  "icon": "🏃",
  "priority": "routine",
  "trigger": "time",
  "time": "18:00",
  "days": [1, 3, 5],
  "checklist": [
    { "id": "c1", "text": "스트레칭", "completed": false },
    { "id": "c2", "text": "유산소 30분", "completed": false },
    { "id": "c3", "text": "근력 운동", "completed": false }
  ]
}
```

#### 아침 루틴
```json
{
  "title": "아침 루틴",
  "description": "하루를 시작하는 습관",
  "icon": "☀️",
  "priority": "routine",
  "trigger": "time",
  "time": "07:00",
  "days": [1, 2, 3, 4, 5],
  "checklist": [
    { "id": "c1", "text": "물 한 잔", "completed": false },
    { "id": "c2", "text": "스트레칭 5분", "completed": false },
    { "id": "c3", "text": "오늘 할 일 3가지 정하기", "completed": false }
  ]
}
```

#### 저녁 루틴
```json
{
  "title": "저녁 루틴",
  "description": "하루를 마무리하는 습관",
  "icon": "🌙",
  "priority": "routine",
  "trigger": "time",
  "time": "22:00",
  "checklist": [
    { "id": "c1", "text": "오늘 감사한 일 3가지", "completed": false },
    { "id": "c2", "text": "내일 준비물 확인", "completed": false },
    { "id": "c3", "text": "침실 정리", "completed": false }
  ]
}
```

#### 독서 습관
```json
{
  "title": "독서 시간",
  "description": "매일 30분 독서",
  "icon": "📚",
  "priority": "routine",
  "trigger": "time",
  "time": "21:00",
  "checklist": [
    { "id": "c1", "text": "30분 이상 독서", "completed": false },
    { "id": "c2", "text": "중요 구절 메모", "completed": false }
  ]
}
```

### 1.4 복합 트리거 (시간 + 위치)

#### 업무 시작 전 확인
```json
{
  "title": "업무 시작 전 확인",
  "description": "회사 도착 시 아침 루틴",
  "icon": "💼",
  "priority": "week",
  "groupId": "g3",
  "trigger": "both",
  "time": "08:30",
  "days": [1, 2, 3, 4, 5],
  "location": {
    "name": "회사",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "radius": 150,
    "triggerType": "arrive"
  },
  "checklist": [
    { "id": "c1", "text": "오늘 일정 확인", "completed": false },
    { "id": "c2", "text": "중요 이메일 체크", "completed": false },
    { "id": "c3", "text": "회의 자료 준비", "completed": false }
  ]
}
```

#### 헬스장 도착 시
```json
{
  "title": "헬스장 운동",
  "description": "헬스장 도착 시 운동 시작",
  "icon": "🏋️",
  "priority": "routine",
  "trigger": "both",
  "time": "19:00",
  "days": [1, 3, 5],
  "location": {
    "name": "헬스장",
    "latitude": 37.5233,
    "longitude": 126.9289,
    "radius": 100,
    "triggerType": "arrive"
  },
  "checklist": [
    { "id": "c1", "text": "러닝머신 20분", "completed": false },
    { "id": "c2", "text": "상체 운동", "completed": false },
    { "id": "c3", "text": "하체 운동", "completed": false },
    { "id": "c4", "text": "스트레칭", "completed": false }
  ]
}
```

---

## 2. 저장된 위치 데이터

### 집
```json
{
  "name": "우리 집",
  "icon": "🏠",
  "latitude": 37.5665,
  "longitude": 126.9780,
  "radius": 100,
  "address": "서울시 중구 세종대로"
}
```

### 회사
```json
{
  "name": "회사",
  "icon": "💼",
  "latitude": 37.4979,
  "longitude": 127.0276,
  "radius": 150,
  "address": "서울시 강남구 테헤란로"
}
```

### PC방
```json
{
  "name": "단골 PC방",
  "icon": "🎮",
  "latitude": 37.5172,
  "longitude": 127.0473,
  "radius": 80,
  "address": "서울시 강남구 역삼동"
}
```

### 헬스장
```json
{
  "name": "헬스장",
  "icon": "🏋️",
  "latitude": 37.5233,
  "longitude": 126.9289,
  "radius": 100,
  "address": "서울시 영등포구"
}
```

### 카페
```json
{
  "name": "단골 카페",
  "icon": "☕",
  "latitude": 37.5172,
  "longitude": 127.0286,
  "radius": 50,
  "address": "서울시 강남구 논현동"
}
```

### 병원
```json
{
  "name": "○○병원",
  "icon": "🏥",
  "latitude": 37.4969,
  "longitude": 127.0283,
  "radius": 120,
  "address": "서울시 강남구 역삼동"
}
```

### 슈퍼마켓
```json
{
  "name": "대형마트",
  "icon": "🛒",
  "latitude": 37.5085,
  "longitude": 127.0633,
  "radius": 200,
  "address": "서울시 강남구 삼성동"
}
```

---

## 3. 그룹 데이터

### 프리셋 그룹

#### 외출 전
```json
{
  "id": "g1",
  "name": "외출 전",
  "icon": "🚪",
  "isPreset": true,
  "reminderIds": []
}
```

#### PC방 방문
```json
{
  "id": "g2",
  "name": "PC방 방문",
  "icon": "🎮",
  "isPreset": true,
  "reminderIds": []
}
```

#### 업무 시작
```json
{
  "id": "g3",
  "name": "업무 시작",
  "icon": "💼",
  "isPreset": true,
  "reminderIds": []
}
```

#### 여행 준비
```json
{
  "id": "g4",
  "name": "여행 준비",
  "icon": "✈️",
  "isPreset": true,
  "reminderIds": []
}
```

### 커스텀 그룹 예시

#### 건강 관리
```json
{
  "name": "건강 관리",
  "icon": "💪",
  "isPreset": false,
  "reminderIds": []
}
```

#### 공부
```json
{
  "name": "공부",
  "icon": "📖",
  "isPreset": false,
  "reminderIds": []
}
```

#### 집안일
```json
{
  "name": "집안일",
  "icon": "🧹",
  "isPreset": false,
  "reminderIds": []
}
```

---

## 4. 사용자 통계 데이터

### 초보 사용자 (첫 주)
```json
{
  "currentStreak": 3,
  "longestStreak": 3,
  "totalCompletions": 8,
  "weeklyCompletionRate": 60,
  "badges": [
    {
      "id": "b1",
      "name": "첫 완료",
      "description": "첫 리마인더 완료",
      "icon": "🎯",
      "unlockedAt": "2025-11-09T10:30:00Z"
    }
  ]
}
```

### 중급 사용자 (한 달)
```json
{
  "currentStreak": 7,
  "longestStreak": 12,
  "totalCompletions": 45,
  "weeklyCompletionRate": 85,
  "badges": [
    {
      "id": "b1",
      "name": "첫 완료",
      "description": "첫 리마인더 완료",
      "icon": "🎯",
      "unlockedAt": "2025-10-15T09:00:00Z"
    },
    {
      "id": "b2",
      "name": "7일 연속",
      "description": "7일 연속 완료",
      "icon": "🔥",
      "unlockedAt": "2025-11-01T20:00:00Z"
    }
  ]
}
```

### 고급 사용자 (3개월+)
```json
{
  "currentStreak": 45,
  "longestStreak": 60,
  "totalCompletions": 234,
  "weeklyCompletionRate": 95,
  "badges": [
    {
      "id": "b1",
      "name": "첫 완료",
      "description": "첫 리마인더 완료",
      "icon": "🎯",
      "unlockedAt": "2025-08-10T10:00:00Z"
    },
    {
      "id": "b2",
      "name": "7일 연속",
      "description": "7일 연속 완료",
      "icon": "🔥",
      "unlockedAt": "2025-08-17T21:00:00Z"
    },
    {
      "id": "b3",
      "name": "완벽주의자",
      "description": "주간 완료율 100%",
      "icon": "⭐",
      "unlockedAt": "2025-09-01T23:59:00Z"
    },
    {
      "id": "b4",
      "name": "장소의 달인",
      "description": "위치 기반 알림 10회 완료",
      "icon": "📍",
      "unlockedAt": "2025-10-05T14:30:00Z"
    }
  ]
}
```

---

## 5. 배지 전체 목록

```json
[
  {
    "id": "b1",
    "name": "첫 완료",
    "description": "첫 리마인더 완료",
    "icon": "🎯"
  },
  {
    "id": "b2",
    "name": "7일 연속",
    "description": "7일 연속 완료",
    "icon": "🔥"
  },
  {
    "id": "b3",
    "name": "완벽주의자",
    "description": "주간 완료율 100%",
    "icon": "⭐"
  },
  {
    "id": "b4",
    "name": "장소의 달인",
    "description": "위치 기반 알림 10회 완료",
    "icon": "📍"
  },
  {
    "id": "b5",
    "name": "30일 연속",
    "description": "30일 연속 완료",
    "icon": "🏆"
  },
  {
    "id": "b6",
    "name": "100회 달성",
    "description": "총 100회 완료",
    "icon": "💯"
  },
  {
    "id": "b7",
    "name": "아침 사람",
    "description": "아침 루틴 30회 완료",
    "icon": "🌅"
  },
  {
    "id": "b8",
    "name": "운동 마니아",
    "description": "운동 루틴 50회 완료",
    "icon": "💪"
  }
]
```

---

## 6. 공유/가져오기 예제 JSON

### 예제 1: 시간 기반 리마인더

파일: `/data/exampleReminder.json`

```json
{
  "title": "아침 스트레칭",
  "description": "건강한 하루를 위한 아침 루틴",
  "icon": "🧘",
  "priority": "routine",
  "trigger": "time",
  "time": "07:00",
  "checklist": [
    { "id": "c1", "text": "목 스트레칭", "completed": false },
    { "id": "c2", "text": "어깨 스트레칭", "completed": false },
    { "id": "c3", "text": "허리 스트레칭", "completed": false }
  ]
}
```

### 예제 2: 요일 설정 포함

파일: `/data/exampleTimeReminder.json`

```json
{
  "title": "주간 회의",
  "description": "팀 회의 준비 사항 확인",
  "icon": "📅",
  "priority": "week",
  "trigger": "time",
  "time": "10:00",
  "days": [1, 3],
  "checklist": [
    { "id": "c1", "text": "주간 보고서 검토", "completed": false },
    { "id": "c2", "text": "이슈 사항 정리", "completed": false }
  ]
}
```

### 예제 3: 복합 트리거

파일: `/data/exampleBothReminder.json`

```json
{
  "title": "출근 준비",
  "description": "회사 도착 전 확인사항",
  "icon": "💼",
  "priority": "week",
  "trigger": "both",
  "time": "08:30",
  "days": [1, 2, 3, 4, 5],
  "location": {
    "name": "회사 근처",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "radius": 200,
    "triggerType": "arrive"
  },
  "checklist": [
    { "id": "c1", "text": "노트북 확인", "completed": false },
    { "id": "c2", "text": "사원증 확인", "completed": false }
  ]
}
```

---

## 7. 전체 데이터 백업 예제

```json
{
  "version": "1.0.0",
  "exportDate": "2025-11-11T10:30:00.000Z",
  "reminders": [
    {
      "id": "r-1730123456789",
      "title": "약 복용",
      "icon": "💊",
      "priority": "routine",
      "trigger": "time",
      "time": "20:00",
      "checklist": [
        { "id": "c1", "text": "영양제", "completed": false }
      ],
      "completionCount": 20,
      "totalShown": 22,
      "lastCompleted": "2025-11-10T20:05:00.000Z",
      "createdAt": "2025-10-01T00:00:00.000Z"
    }
  ],
  "groups": [
    {
      "id": "g1",
      "name": "외출 전",
      "icon": "🚪",
      "isPreset": true,
      "reminderIds": []
    }
  ],
  "savedLocations": [
    {
      "id": "loc-1730123456789",
      "name": "우리 집",
      "icon": "🏠",
      "latitude": 37.5665,
      "longitude": 126.9780,
      "radius": 100,
      "createdAt": "2025-10-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "currentStreak": 7,
    "longestStreak": 12,
    "totalCompletions": 45,
    "weeklyCompletionRate": 85,
    "badges": []
  }
}
```

---

## 8. 테스트 시나리오별 데이터 세트

### 시나리오 A: 신규 사용자
- **리마인더**: 0개
- **그룹**: 프리셋 4개
- **위치**: 0개
- **통계**: 초기값 (0일, 0%, 0개)

### 시나리오 B: 일반 사용자
- **리마인더**: 6개 (긴급 2, 이번주 2, 루틴 2)
- **그룹**: 프리셋 4개 + 할당된 리마인더
- **위치**: 3개 (집, 회사, PC방)
- **통계**: 중급 (7일, 85%, 45개)

### 시나리오 C: 파워 사용자
- **리마인더**: 20개 (다양한 우선순위와 트리거)
- **그룹**: 프리셋 4개 + 커스텀 2개
- **위치**: 7개
- **통계**: 고급 (45일, 95%, 234개)
- **배지**: 4개 획득

---

## 9. 특수 케이스 테스트 데이터

### 체크리스트 없는 리마인더
```json
{
  "title": "간단한 알림",
  "icon": "🔔",
  "priority": "routine",
  "trigger": "time",
  "time": "12:00",
  "checklist": []
}
```

### 매우 긴 제목과 설명
```json
{
  "title": "이것은 매우 긴 제목으로 UI에서 어떻게 표시되는지 테스트하기 위한 리마인더입니다",
  "description": "이것은 매우 긴 설명 텍스트입니다. 여러 줄에 걸쳐 표시될 수 있으며, 카드 레이아웃에서 적절히 처리되어야 합니다. 추가로 더 많은 텍스트를 넣어서 스크롤이나 말줄임표 처리를 확인합니다.",
  "icon": "📝",
  "priority": "week",
  "trigger": "time",
  "time": "15:00",
  "checklist": []
}
```

### 체크리스트 항목 많은 리마인더
```json
{
  "title": "대청소",
  "icon": "🧹",
  "priority": "week",
  "trigger": "time",
  "time": "10:00",
  "days": [6],
  "checklist": [
    { "id": "c1", "text": "거실 청소", "completed": false },
    { "id": "c2", "text": "침실 청소", "completed": false },
    { "id": "c3", "text": "주방 청소", "completed": false },
    { "id": "c4", "text": "화장실 청소", "completed": false },
    { "id": "c5", "text": "베란다 청소", "completed": false },
    { "id": "c6", "text": "창문 닦기", "completed": false },
    { "id": "c7", "text": "먼지 털기", "completed": false },
    { "id": "c8", "text": "걸레질", "completed": false },
    { "id": "c9", "text": "쓰레기 버리기", "completed": false },
    { "id": "c10", "text": "정리정돈", "completed": false }
  ]
}
```

### 모든 요일 선택
```json
{
  "title": "매일 물 마시기",
  "icon": "💧",
  "priority": "routine",
  "trigger": "time",
  "time": "09:00",
  "days": [0, 1, 2, 3, 4, 5, 6],
  "checklist": [
    { "id": "c1", "text": "물 8잔", "completed": false }
  ]
}
```

### 특수 문자 포함
```json
{
  "title": "SQL 쿼리 작성: SELECT * FROM users WHERE id > 100;",
  "description": "특수문자 테스트: @#$%^&*()_+-=[]{}|;':\",./<>?",
  "icon": "💻",
  "priority": "week",
  "trigger": "time",
  "time": "14:00",
  "checklist": []
}
```

---

## 10. 좌표 데이터 참고

### 서울 주요 지역 좌표

| 장소 | 위도 | 경도 |
|------|------|------|
| 서울시청 | 37.5665 | 126.9780 |
| 강남역 | 37.4979 | 127.0276 |
| 여의도 | 37.5219 | 126.9245 |
| 잠실 | 37.5133 | 127.1028 |
| 홍대입구 | 37.5572 | 126.9240 |
| 신촌 | 37.5559 | 126.9360 |
| 명동 | 37.5636 | 126.9865 |
| 이태원 | 37.5348 | 126.9943 |

### 반경 권장 값

- **주택**: 50-100m
- **아파트 단지**: 100-150m
- **회사 건물**: 80-120m
- **대형 건물/쇼핑몰**: 150-200m
- **공원/광장**: 200-300m

---

## 사용 방법

### 개발 환경에서 사용

1. `/data/mockData.ts`에 원하는 데이터 복사
2. 앱 재시작
3. 테스트 시나리오 진행

### 수동 테스트 시 사용

1. 앱에서 '리마인더 가져오기' 메뉴 선택
2. 위 JSON 데이터 복사하여 붙여넣기
3. '가져오기' 버튼 클릭

### 자동화 테스트 시 사용

```typescript
import { mockReminders } from './TESTDATA';

describe('Reminder Tests', () => {
  it('should create reminder', () => {
    const testData = mockReminders[0];
    // 테스트 로직
  });
});
```

---

**테스트 데이터 버전**: 1.0
**마지막 업데이트**: 2025년 11월 11일
