# 디지털플랫폼 통합인증 서버 연동 가이드

K-Water 인증 시스템에서 1차 인증을 거친 후, **디지털플랫폼 통합인증 서버(IdP)** 를 매개로 **클라우드 관리 포털 (CMP)** 과 하위 포털(데이터허브 · 생성형 AI · SaaS)이 단일 로그인 세션을 공유하는 OIDC 기반 SSO 연동 규격을 시각적으로 설명하는 인터랙티브 가이드입니다.

🔗 **라이브 페이지**: https://raccooncoon.github.io/auth_kwater/

> ⚠️ 가이드 내의 모든 URL · 도메인 · client_id · 토큰 값 · 사용자 정보는 설명을 위한 **임의의 예시 데이터**입니다. 실제 운영 환경의 값과 다릅니다.

## 가이드 구성

| 탭 | 내용 |
|---|---|
| 1. 연동 개요 | Hero · 4개 핵심 지표 · 표준 준수 · 3계층 토폴로지 미리보기 · 구성 요소 룩업 |
| 2. 통합 & 하위 포털 SSO | 3계층 아키텍처 다이어그램 · Silent SSO 5단계 + 에러 코드 + 보안 체크리스트 |
| 3. 데이터 흐름 애니메이션 | 4페이즈 · 12단계 시퀀스 다이어그램 (메인 로그인 / Silent SSO / RTR / SLO) |
| 4. 상세 연동 시뮬레이터 | 단계별 페이로드·브라우저 상태·서버 상태 + 사용자 시점·왜 필요한가·자주 빠지는 함정 |
| 5. 토큰 발급 & 갱신 (RTR) | 호텔 키 비유 · JWT 분해 · 저장 위치 비교 · RTR 도난 감지 · 보안 위협 매핑 |
| 6. 통합 로그아웃 (SLO) | 백채널 SLO · 상위 K-Water 로그아웃 수신 (Back-Channel / Front-Channel / SAML) |
| Endpoints Spec | OIDC 표준 11개 엔드포인트 명세 (Discovery · /authorize · /token · /userinfo · /logout · /introspect · /revoke 등) |
| 구현 예제 코드 | React 4 + Spring Boot 3 · 8개 스니펫 (로그인 / 콜백 / 갱신 / 로그아웃 / Security Config / 복호화 필터 / BFF 콜백 / 백채널 로그아웃) |

## 준수 표준

- **OpenID Connect Core 1.0**
- **OAuth 2.1** (최신 보안 BCP 반영)
- **RFC 8417** Back-Channel Logout
- **JWT · JWS · JWE** (RFC 7519 / 7515 / 7516)
- **RFC 7662** Token Introspection
- **RFC 7009** Token Revocation

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 http://localhost:5173 접속.

## 빌드 & 배포

```bash
npm run build       # dist/ 생성
npm run deploy      # gh-pages 브랜치로 배포
```

`vite.config.js`의 `base: '/auth_kwater/'` 설정이 GitHub Pages 경로 기준입니다.

## 기술 스택

- React 19 + Vite 8
- Tailwind CSS 4
- lucide-react (아이콘)
