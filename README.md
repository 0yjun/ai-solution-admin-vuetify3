# 🧩 관리자 챗봇 UI 프로젝트

## 1. 프로젝트 개요

이 프로젝트는 **관리자를 위한 챗봇 UI**를 개발하기 위한 프론트엔드 프로젝트입니다.  
다음과 같은 기술 스택을 기반으로 구성되었습니다:

- **Vue 3**: 최신 컴포지션 API 기반 프레임워크
- **Vuetify 3**: Vue용 고급 UI 프레임워크
- **JWT (JSON Web Token)**: 로그인 및 인증 토큰 처리 방식
- **Pinia**: 전역 상태 관리 라이브러리

---

## 2. 프로젝트 포맷터 설정

> 저장 시 ESLint 기반 자동 코드 수정만 수행하고, Prettier 포맷은 사용하지 않습니다.

`.vscode/settings.json` 파일을 프로젝트 루트에 생성하고 아래와 같이 작성합니다:

```
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.codeActionsOnSave.rules": null
}
```

---

## 3. 프로젝트 구조

Vuetify 3 CLI로 생성된 기본 프로젝트 구조는 다음과 같습니다:

```
📁 my-chatbot-admin/
├── 📁 node_modules/
├── 📁 public/
├── 📁 src/
│   ├── 📁 assets/         # 정적 이미지 및 리소스
│   ├── 📁 components/     # 공통 UI 컴포넌트
│   ├── 📁 layouts/        # 레이아웃 템플릿
│   ├── 📁 pages/          # 각 라우트 페이지 컴포넌트
│   ├── 📁 plugins/        # 외부 플러그인 등록
│   ├── 📁 router/         # Vue Router 설정
│   ├── 📁 stores/         # Pinia 상태 관리 저장소
│   ├── 📁 styles/         # 글로벌 스타일 정의
│   └── App.vue           # 루트 컴포넌트
├── .vscode/
│   └── settings.json
├── .editorconfig
├── .eslintrc.js
├── .prettierrc
├── index.html
├── package.json
└── vite.config.ts
```

---

## 4. 프로젝트 실행 명령어

의존성 설치:

```
npm install
```

개발 서버 실행:

```
npm run dev
```

프로덕션 빌드:

```
npm run build
```

---

## 5. 오류 처리 방법

| 오류 | 해결 방법 |
|------|------------|
| ESLint 관련 에러 | `.eslintrc.js` 및 `settings.json`을 점검하고, `npm run lint`로 확인 |
| 저장 시 코드 들여쓰기가 무너짐 | `.vscode/settings.json`에서 `formatOnSave: false` 확인 |
| Vuetify 컴포넌트 스타일 이상 | Vuetify 설정 또는 `vite.config.ts`의 플러그인 적용 여부 확인 |
| 실행 시 모듈 오류 | `node_modules` 삭제 후 `npm install` 재실행 |