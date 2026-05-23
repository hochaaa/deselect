# DE:SELECT

WE SELECT, YOU EXPERIENCE.  
오직 제품에만 집중하는 큐레이션 플랫폼 DE:SELECT입니다.

## 프로젝트 소개

DE:SELECT는 브랜드와 카테고리별 패션 제품을 큐레이션하고, 사용자가 제품 및 브랜드를 저장하며 스타일링 Q&A를 남길 수 있는 웹 서비스입니다. 복잡한 쇼핑 정보보다 제품 자체와 취향 탐색 경험에 집중하도록 미니멀한 UI 톤을 유지합니다.

## 배포 링크

추후 추가 예정

## 기술 스택

- Frontend: React, Vite, Tailwind CSS
- UI: Lucide React
- Backend: Supabase Auth, Supabase Database
- Deployment: Vercel

## 주요 기능

- 브랜드별 제품 목록과 브랜드 상세 페이지
- 카테고리 및 서브카테고리 기반 제품 탐색
- 제품명/브랜드명 검색
- 가격순 및 최신순 정렬
- 제품 좋아요 및 관심 브랜드 저장
- Supabase Auth 기반 로그인/회원가입
- 스타일링 Q&A 작성, 조회, 관리자 답변
- `profiles.role` 기반 관리자 권한 분기

## 프로젝트 구조

```text
src/
  components/
    Auth/
    Layout/
    Modal/
    Product/
    Qna/
  pages/
    Home.jsx
    About.jsx
    Brands.jsx
    BrandDetail.jsx
    Category.jsx
    Search.jsx
    MyPage.jsx
    Liked.jsx
    Customer.jsx
    QnaWrite.jsx
    QnaDetail.jsx
  utils/
    admin.js
    constants.js
    sort.js
    validation.js
  App.jsx
  main.jsx
  supabase.js
```

## 실행 방법

```bash
npm install
npm run dev
```

프로덕션 빌드는 아래 명령어로 확인합니다.

```bash
npm run build
```

## 환경변수 설정 방법

`.env.example`을 참고해 로컬에 `.env` 파일을 만들고 Supabase 프로젝트 값을 입력합니다. 실제 `.env` 파일은 커밋하지 않습니다.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Vercel 배포 시에는 Project Settings > Environment Variables에 같은 이름으로 등록합니다.

## Supabase DB 테이블 예시

### products

| column | type | note |
| --- | --- | --- |
| id | uuid 또는 bigint | 제품 식별자 |
| brand | text | 브랜드명 |
| name | text | 제품명 |
| price | text | 화면 표시용 가격 |
| category | text | Outer, Top 등 |
| subcategory | text | Jacket, T-shirt 등 |
| img | text | 제품 이미지 URL |
| link | text | 브랜드 공식 스토어 링크 |
| created_at | timestamptz | 생성일 |

### qna

| column | type | note |
| --- | --- | --- |
| id | uuid 또는 bigint | 문의 식별자 |
| author | text | 작성자명 |
| email | text | 작성자 이메일 |
| product_id | uuid 또는 bigint | products.id 참조 |
| title | text | 문의 제목 |
| content | text | 문의 내용 |
| reply | text | 관리자 답변 |
| created_at | timestamptz | 생성일 |

### user_preferences

| column | type | note |
| --- | --- | --- |
| id | uuid 또는 bigint | 식별자 |
| email | text | 사용자 이메일 |
| liked_products | array/jsonb | 좋아요한 제품 id 목록 |
| favorite_brands | array/jsonb | 관심 브랜드 목록 |
| created_at | timestamptz | 생성일 |

### profiles

| column | type | note |
| --- | --- | --- |
| id | uuid 또는 bigint | 식별자 |
| email | text | 사용자 이메일 |
| role | text | `admin`, `user` 등 |
| created_at | timestamptz | 생성일 |

관리자 권한은 프론트엔드에서 `profiles.role === 'admin'`인지 조회해 사용합니다. 프론트의 조건부 렌더링만으로는 보안이 완성되지 않으므로, Supabase RLS 정책에서도 관리자만 `qna.reply` 수정/삭제를 할 수 있도록 제한해야 합니다.

예시 정책 방향:

- `products`: 모든 사용자가 읽기 가능, 관리자만 쓰기 가능
- `qna`: 모든 사용자가 읽기 가능, 로그인 사용자가 작성 가능
- `qna.reply`: 관리자만 수정 가능
- `user_preferences`: 본인 이메일에 해당하는 row만 읽기/쓰기 가능
- `profiles`: 본인 profile 읽기 가능, role 변경은 service role 또는 관리자만 가능

## 향후 개선 사항

- Supabase Auth user id 기반으로 preferences/profile 관계 정규화
- Q&A 상세 URL 라우팅 도입
- 제품 등록/수정 관리자 페이지 추가
- 이미지 최적화 및 fallback UI 추가
- 테스트 코드와 접근성 점검 보강
