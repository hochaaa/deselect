# DE:SELECT

WE SELECT, YOU EXPERIENCE.  
오직 제품에만 집중하는 큐레이션 플랫폼 DE:SELECT입니다.

## 프로젝트 소개

DE:SELECT는 브랜드와 카테고리별 패션 제품을 큐레이션하고, 사용자가 제품 및 브랜드를 저장하며 스타일링 Q&A를 남길 수 있는 웹 서비스입니다. 복잡한 쇼핑 정보보다 제품 자체와 취향 탐색 경험 제공에 초점을 두었습니다.

## 배포 링크

https://deselect.vercel.app/

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
