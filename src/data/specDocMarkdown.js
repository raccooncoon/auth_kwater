// 디지털플랫폼 통합인증 서버 — 구축 요구사항 & 스펙 (다운로드용 마크다운)
// 이 문서만 보고도 개발을 진행할 수 있도록 자체 완결적으로 작성됨

export const SPEC_DOC_MARKDOWN = `# 디지털플랫폼 통합인증 서버 — 구축 요구사항 & 스펙 v1.0

> 본 문서는 SI 사업에서 디지털플랫폼 통합인증 서버(IdP)를 구축하기 위한 요구사항·스펙·개발 가이드를 하나로 통합한 문서입니다. 이 문서만으로 분석·설계·개발이 가능하도록 작성되었습니다.

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [기능 요구사항 (FR)](#3-기능-요구사항-fr)
4. [비기능 요구사항 (NFR)](#4-비기능-요구사항-nfr)
5. [준수 표준](#5-준수-표준)
6. [데이터 모델](#6-데이터-모델)
7. [API 인터페이스](#7-api-인터페이스)
8. [보안 요구사항](#8-보안-요구사항)
9. [개발 마일스톤](#9-개발-마일스톤)
10. [시험 계획](#10-시험-계획)
11. [산출물](#11-산출물)
12. [부록 A: 용어 정의](#부록-a-용어-정의)
13. [부록 B: 참조 표준](#부록-b-참조-표준)
14. [부록 C: K-water Mock 어댑터 명세](#부록-c-k-water-mock-어댑터-명세)

---

## 1. 프로젝트 개요

### 1.1 목표

K-water 인증 시스템에서 1차 인증을 거친 사용자가 디지털플랫폼 생태계의 **클라우드 관리 포털(CMP) 및 3개 하위 포털(데이터허브 · 생성형 AI · SaaS)** 에 단일 로그인 세션을 공유하도록, OIDC(OpenID Connect) 표준을 준수하는 디지털플랫폼 통합인증 서버(IdP)를 구축한다.

### 1.2 기대 효과

- 사용자 계정 관리 단일화 (K-water 사용자 마스터를 단일 신원 근거로 활용)
- 신규 포털 온보딩 시간 단축 (OIDC 표준 클라이언트 등록만으로 통합)
- 통합 감사 로그 확보 (모든 인증 이벤트를 IdP 단일 지점에서 수집)
- 보안 사고 대응 단일 지점 (SSO 세션 폐기로 전사 로그아웃 가능)

### 1.3 사업 범위

#### 1.3.1 In Scope

- OIDC Authorization Code Flow + PKCE
- Silent SSO (\`prompt=none\` 무상호작용 재인증)
- Refresh Token Rotation (RTR)
- Back-Channel Single Logout (RFC 8417)
- K-water 페이로드 수신 → SSO 세션 발급
- 4개 클라이언트(CMP/데이터허브/생성형 AI/SaaS) 등록 및 토큰 발급
- JWKS 공개 + 키 식별자(kid) 기반 키 로테이션
- 감사 로그 및 운영 모니터링

#### 1.3.2 Out of Scope

- 자체 회원가입/비밀번호 관리 (K-water 영역)
- MFA · OTP · WebAuthn 등 추가 인증 수단 (K-water 영역)
- 포털별 권한(Role) 정밀 관리 (각 포털 자체 관리)
- 사용자 프로필 편집 UI
- 이메일/SMS 발송
- 결제/과금

### 1.4 이해관계자

| 역할 | 책임 |
|------|------|
| 발주처 | 요구사항 승인, 검수, 운영 인수 |
| 시공사(SI) | 분석·설계·개발·시험·이관 |
| K-water | Upstream IdP 인터페이스 합의, 페이로드 발급 |
| 포털 사업자 (4개) | RP(Relying Party) 구현, client 등록 절차 협업 |

---

## 2. 시스템 아키텍처

### 2.1 3-Tier 구성

\`\`\`
┌──────────────────────────────────────────────────┐
│  Web Tier                                        │
│  · L4/L7 로드밸런서  · TLS 1.2+ Termination        │
├──────────────────────────────────────────────────┤
│  Application Tier (Stateless)                    │
│  · /authorize · /token                           │
│  · /userinfo · /logout                           │
│  · /.well-known/openid-configuration             │
│  · /.well-known/jwks.json                        │
│  · /backchannel-logout (수신·발송)                 │
├──────────────────────────────────────────────────┤
│  Data Tier                                       │
│  · RDBMS (PostgreSQL/MySQL) — clients, users, RT │
│  · Redis — sessions, authorization_codes         │
│  · 키 저장소 (KMS, HSM, 또는 OS 키 스토어)         │
└──────────────────────────────────────────────────┘
\`\`\`

### 2.2 외부 인터페이스

| 대상 | 방향 | 프로토콜 | 용도 |
|------|------|----------|------|
| K-water 인증 시스템 | 수신 | HTTPS + JWE 페이로드 | 1차 인증 결과 수신 |
| K-water 인증 시스템 | 수신 | HTTPS + logout_token (RFC 8417) | Upstream SLO 수신 (선택) |
| 4개 포털 백엔드 | 수신 | HTTPS + OIDC | 토큰 발급/갱신/UserInfo 요청 |
| 4개 포털 백엔드 | 발송 | HTTPS + logout_token | Back-Channel SLO 푸시 |
| KMS/HSM | 호출 | HTTPS API | 서명 키 보관 및 사용 |

### 2.3 전체 흐름 (17-Step 시퀀스 요약)

**Phase 1 — 메인 포털 로그인 (Step 1~7)**
1. 사용자 → K-water 로그인
2. K-water → 브라우저: 암호화 페이로드 발급
3. 브라우저 → IdP: 페이로드 전달
4. IdP → 브라우저: SSO 쿠키 발급 + CMP 콜백 리다이렉트
5. 브라우저 → CMP 백엔드: 인가 코드 전달
6. CMP 백엔드 → IdP: 토큰 교환 요청
7. IdP → CMP 백엔드: Access/Refresh/ID Token 응답

**Phase 2 — 하위 포털 Silent SSO (Step 8~12)**
8. 브라우저 → IdP: 무상호작용 인가 요청 (prompt=none)
9. IdP → 브라우저: 인가 코드 콜백 리다이렉트
10. 브라우저 → 하위 포털 백엔드: 인가 코드 전달
11. 하위 포털 백엔드 → IdP: 토큰 교환 요청
12. IdP → 하위 포털 백엔드: 토큰 응답

**Phase 3 — 토큰 갱신 RTR (Step 13~15)**
13. 사용자 API 호출 → 백엔드가 Access Token 만료 감지
14. 백엔드 → IdP: Refresh Token으로 갱신 요청
15. IdP → 백엔드: 새 Access + Refresh Token 발급 (기존 RT 폐기)

**Phase 4 — 단일 로그아웃 SLO (Step 16~17)**
16. 사용자 → IdP: /logout 요청
17. IdP → 모든 포털 백엔드: logout_token 백채널 푸시

---

## 3. 기능 요구사항 (FR)

### FR-1: 사용자 인증 (K-water 페이로드 수신)

**입력**
- HTTP GET \`/oauth2/kwater/callback?kwater_enc_payload=<JWE>&state=<random>\`

**처리**
1. JWE 페이로드를 IdP 개인키(RSA-OAEP)로 복호화
2. 내부 페이로드 무결성 검증 (서명 또는 HMAC)
3. \`state\` 값 검증 (CSRF 방지)
4. 사용자 정보 추출: \`kwater_user_id\`, \`department\`, \`role\` 등
5. \`users\` 테이블에 매핑된 사용자 조회 또는 신규 생성
6. SSO 세션 생성 (Redis에 저장, TTL 8시간 sliding)

**출력**
- HTTP 302 리다이렉트 (CMP 콜백 URL + 인가 코드)
- \`Set-Cookie: sso_session=<opaque_id>; Domain=auth.kwater.com; Path=/; Secure; HttpOnly; SameSite=Lax\`

**예외 처리**
- 페이로드 복호화 실패: 400 Bad Request + 로그
- state 불일치: 400 Bad Request + 보안 로그
- 사용자 비활성화 상태: 403 Forbidden + 에러 페이지

---

### FR-2: 인가 코드 발급 (\`/authorize\`)

**엔드포인트**: \`GET /oauth2/v1/authorize\`

**필수 파라미터**
- \`response_type=code\`
- \`client_id\` (등록된 RP)
- \`redirect_uri\` (사전 등록된 화이트리스트와 정확 매칭)
- \`scope\` (\`openid\` 포함, 추가 scope는 client별 허용 목록 검증)
- \`state\` (CSRF 방지)
- \`code_challenge\` (PKCE)
- \`code_challenge_method=S256\` (PKCE)

**선택 파라미터**
- \`prompt=none\` (Silent SSO 시 사용 — UI 표시 없이 SSO 쿠키만으로 처리)
- \`nonce\` (ID Token replay 방지)
- \`max_age\` (재인증 강제)

**처리 흐름**
1. client_id 등록 검증
2. redirect_uri 화이트리스트 매칭 (와일드카드 금지, 정확 매칭만)
3. scope 허용 여부 검증
4. SSO 세션 확인:
   - 유효 → \`authorization_codes\` 테이블에 1회용 code 발급 (TTL 10분)
   - 무효 + prompt=none → \`login_required\` 에러 응답
   - 무효 + prompt 없음 → K-water 로그인 페이지로 리다이렉트
5. code + state를 query string으로 redirect_uri로 302 응답

**응답 예시**
\`\`\`
HTTP/1.1 302 Found
Location: https://cmp.kwater.com/callback?code=abc123&state=xyz
\`\`\`

---

### FR-3: 토큰 발급 (\`/token\`)

**엔드포인트**: \`POST /oauth2/v1/token\`

**Content-Type**: \`application/x-www-form-urlencoded\`

**필수 파라미터** (authorization_code grant)
- \`grant_type=authorization_code\`
- \`code\` (FR-2에서 발급된 1회용 인가 코드)
- \`redirect_uri\` (FR-2와 동일해야 함)
- \`client_id\`
- \`client_secret\` (confidential client) 또는 \`code_verifier\` (PKCE)

**처리 흐름**
1. client_id + client_secret 검증 (\`clients\` 테이블의 bcrypt 해시와 대조)
2. code 조회 (Redis): 존재 + 미사용 + 만료 전
3. code의 client_id, redirect_uri가 요청과 일치하는지 검증
4. PKCE 검증: \`SHA256(code_verifier) == code_challenge\`
5. code를 즉시 사용 처리 (재사용 방지)
6. Access Token, Refresh Token, ID Token 생성:
   - Access Token: JWT, RS256 서명, TTL 15분
   - Refresh Token: 256-bit random, DB의 \`refresh_tokens\`에 저장, TTL 14일
   - ID Token: JWT, RS256 서명, claims = sub, aud, iss, exp, iat, nonce
7. JSON 응답

**응답 예시**
\`\`\`json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Imt3LTAxIn0...",
  "refresh_token": "rft_8a3f9b2c4d5e6f1a2b3c",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 900,
  "scope": "openid profile"
}
\`\`\`

---

### FR-4: 토큰 갱신 (Refresh Token Rotation)

**엔드포인트**: \`POST /oauth2/v1/token\`

**파라미터** (refresh_token grant)
- \`grant_type=refresh_token\`
- \`refresh_token\`
- \`client_id\` + \`client_secret\`

**처리 흐름**
1. client 인증
2. \`refresh_tokens\` 조회: status=active, 만료 전
3. **재사용 탐지**: 이미 status=rotated인 RT가 들어오면 → 해당 chain 전체를 revoked 처리 + 보안 알람
4. 정상 케이스:
   - 기존 RT를 status=rotated로 변경
   - 새 RT 생성 (parent_jti 연결, 같은 chain_id 유지)
   - 새 Access Token 발급
5. 응답: 새 Access + 새 Refresh Token

**핵심 보안 포인트**
- RT는 1회용 — 한 번 사용하면 즉시 폐기
- RTR chain DB 추적으로 도난 RT 탐지 가능
- 재사용 시도 발생 시 chain 전체 즉시 폐기

---

### FR-5: 단일 로그아웃 (SLO)

#### FR-5.1 사용자 로그아웃 시작점

**엔드포인트**: \`GET /oauth2/v1/logout\`

**파라미터**
- \`id_token_hint\` (필수, 발급된 ID Token 첨부)
- \`post_logout_redirect_uri\` (사전 등록된 화이트리스트)
- \`state\`

**처리**
1. id_token_hint의 서명·만료 검증
2. SSO 세션 식별 후 \`sso_sessions\`에서 삭제
3. \`Set-Cookie\` 만료 헤더로 SSO 쿠키 제거
4. 해당 세션이 발급받은 모든 client의 \`backchannel_logout_uri\`로 logout_token 푸시 (비동기)
5. post_logout_redirect_uri로 302 리다이렉트

#### FR-5.2 logout_token 발송 (Back-Channel)

**RFC 8417 (Security Event Token) 준수**

**JWT Claims**
\`\`\`json
{
  "iss": "https://auth.kwater.com",
  "aud": "<client_id>",
  "iat": 1716000000,
  "jti": "logout-evt-abc123",
  "sub": "<user_sub>",
  "sid": "<sso_session_id>",
  "events": {
    "http://schemas.openid.net/event/backchannel-logout": {}
  }
}
\`\`\`

**중요**: \`nonce\` claim은 절대 포함 금지 (RFC 8417 §2.4)

**HTTP 요청**
\`\`\`
POST /oauth2/v1/backchannel-logout HTTP/1.1
Host: cmp.kwater.com
Content-Type: application/x-www-form-urlencoded

logout_token=<JWT>
\`\`\`

**재시도 정책**
- 실패 시 지수 백오프 (1s → 2s → 4s, 최대 3회)
- jti 기반 멱등성 보장 (수신측에서 중복 처리 차단)
- 최종 실패는 운영 알람 + 다음날 배치 재시도

#### FR-5.3 K-water Upstream SLO 수신

**엔드포인트**: \`POST /oauth2/v1/kwater/backchannel-logout\`

**처리**
1. logout_token JWT 서명 검증 (K-water JWKS 사용)
2. **8-Claim 검증**:
   - iss = K-water issuer URL
   - aud = 우리 client_id
   - iat 신선도 (±5분, 클럭 스큐 허용)
   - jti 1회용 (DB 또는 Redis로 중복 차단)
   - events에 backchannel-logout 이벤트 포함
   - nonce 부재 (있으면 거절)
   - sub 또는 sid로 세션 식별 가능
   - exp 미만료 (있는 경우)
3. 일치하는 SSO 세션 + 하위 포털 토큰 chain 전체 폐기
4. 200 OK 응답 (실패 시 400)

---

### FR-6: 표준 OIDC 부가 엔드포인트

#### FR-6.1 UserInfo

**엔드포인트**: \`GET /oauth2/v1/userinfo\`

**인증**: Authorization 헤더에 Access Token 첨부

**처리**: 토큰 검증 → 사용자 정보 반환 (sub, name, email, department 등)

**응답 예시**
\`\`\`json
{
  "sub": "kwater_user_1234",
  "name": "홍길동",
  "email": "hong@kwater.or.kr",
  "department": "수자원관리본부",
  "preferred_username": "kwater_user_1234"
}
\`\`\`

#### FR-6.2 JWKS

**엔드포인트**: \`GET /.well-known/jwks.json\`

**캐시**: \`Cache-Control: public, max-age=3600\`

**응답 예시**
\`\`\`json
{
  "keys": [
    {
      "kid": "kw-2026-01",
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      "n": "...",
      "e": "AQAB"
    },
    {
      "kid": "kw-2026-02",
      "kty": "RSA",
      "alg": "RS256",
      "use": "sig",
      "n": "...",
      "e": "AQAB"
    }
  ]
}
\`\`\`

#### FR-6.3 Discovery (OIDC Provider Metadata)

**엔드포인트**: \`GET /.well-known/openid-configuration\`

**응답 (RFC 8414 준수)**
\`\`\`json
{
  "issuer": "https://auth.kwater.com",
  "authorization_endpoint": "https://auth.kwater.com/oauth2/v1/authorize",
  "token_endpoint": "https://auth.kwater.com/oauth2/v1/token",
  "userinfo_endpoint": "https://auth.kwater.com/oauth2/v1/userinfo",
  "jwks_uri": "https://auth.kwater.com/.well-known/jwks.json",
  "end_session_endpoint": "https://auth.kwater.com/oauth2/v1/logout",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "scopes_supported": ["openid", "profile", "email"],
  "code_challenge_methods_supported": ["S256"]
}
\`\`\`

---

## 4. 비기능 요구사항 (NFR)

| ID | 항목 | 요구 수준 |
|----|------|----------|
| NFR-1 | 가용성 | 월 99.5% 이상 (월 다운타임 ≤ 3.6h) |
| NFR-2 | 응답 성능 | 평균 응답 시간 ≤ 300ms (/token · /authorize 기준) |
| NFR-3 | 처리량 | 동시 1,000 사용자 / 초당 100 토큰 발급 처리 |
| NFR-4 | 보안 | TLS 1.2 이상, JWT RS256 서명, 토큰 키 연 1회 로테이션 |
| NFR-5 | 감사 로그 | 로그인·토큰·로그아웃 이벤트 보관 (사업자 보관 정책 준수, 최소 1년) |

### 추가 비기능 요구사항

| 항목 | 요구 사항 |
|------|----------|
| 확장성 | 수평 확장 가능 (Stateless 설계, 세션은 Redis로 외부화) |
| 호환성 | OIDC 표준 클라이언트와의 상호운용성 보장 |
| 유지보수성 | 모듈화된 구조, 단위 시험 커버리지 70% 이상 |
| 이식성 | 컨테이너 기반 배포 가능 (Docker) |

---

## 5. 준수 표준

| 표준 | 적용 범위 |
|------|----------|
| **OIDC Core 1.0** | Authorization Code Flow, ID Token, Discovery, UserInfo |
| **OAuth 2.1 (draft)** | Confidential Client, redirect_uri 엄격 매칭, Implicit Flow 금지 |
| **RFC 7636 (PKCE)** | 모든 Authorization Code Flow에서 \`code_challenge_method=S256\` 필수 |
| **RFC 7519 (JWT)** | Access Token + ID Token 직렬화 |
| **RFC 7515 (JWS)** | RS256 서명 |
| **RFC 8414** | OAuth 2.0 Authorization Server Metadata (Discovery 응답 스펙) |
| **RFC 8417 (SET)** | logout_token 구조 (Security Event Token) |
| **OIDC Back-Channel Logout 1.0** | logout_token 발송 및 검증 프로토콜 |

### 선택 적용 (확장)

| 표준 | 비고 |
|------|------|
| RFC 7662 (Token Introspection) | Resource Server가 토큰 실시간 검증 필요 시 |
| RFC 7009 (Token Revocation) | 사용자 명시적 폐기 기능 필요 시 |

---

## 6. 데이터 모델

### 6.1 ERD 개요

\`\`\`
clients ─< refresh_tokens >─ users
  │              │
  │              ├──── sso_sessions (Redis)
  │              │
  │           audit_logs
  │
  └─< signing_keys (JWKS)
\`\`\`

### 6.2 테이블 정의 (PostgreSQL 기준)

#### 6.2.1 \`clients\` — RP 등록 정보

\`\`\`sql
CREATE TABLE clients (
  client_id VARCHAR(64) PRIMARY KEY,
  client_secret_hash VARCHAR(255) NOT NULL,
  name VARCHAR(128) NOT NULL,
  redirect_uris TEXT[] NOT NULL,
  backchannel_logout_uri VARCHAR(512),
  allowed_scopes TEXT[] NOT NULL DEFAULT '{"openid"}',
  token_endpoint_auth_method VARCHAR(32) DEFAULT 'client_secret_basic',
  status VARCHAR(16) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

#### 6.2.2 \`users\` — K-water 사용자 매핑

\`\`\`sql
CREATE TABLE users (
  sub VARCHAR(128) PRIMARY KEY,
  kwater_user_id VARCHAR(128) UNIQUE NOT NULL,
  email_encrypted BYTEA,
  display_name_encrypted BYTEA,
  department VARCHAR(128),
  last_login_at TIMESTAMPTZ,
  status VARCHAR(16) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
\`\`\`

- email, display_name은 AES-256-GCM으로 컬럼 암호화

#### 6.2.3 \`refresh_tokens\` — RTR chain 추적

\`\`\`sql
CREATE TABLE refresh_tokens (
  jti VARCHAR(64) PRIMARY KEY,
  chain_id VARCHAR(64) NOT NULL,
  parent_jti VARCHAR(64),
  client_id VARCHAR(64) NOT NULL REFERENCES clients(client_id),
  sub VARCHAR(128) NOT NULL REFERENCES users(sub),
  scope TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(16) DEFAULT 'active',  -- active | rotated | revoked
  used_at TIMESTAMPTZ
);

CREATE INDEX idx_rt_chain ON refresh_tokens(chain_id);
CREATE INDEX idx_rt_sub ON refresh_tokens(sub);
CREATE INDEX idx_rt_client ON refresh_tokens(client_id);
\`\`\`

#### 6.2.4 \`signing_keys\` — JWKS 키 로테이션

\`\`\`sql
CREATE TABLE signing_keys (
  kid VARCHAR(64) PRIMARY KEY,
  algorithm VARCHAR(16) NOT NULL DEFAULT 'RS256',
  public_key_jwk JSONB NOT NULL,
  private_key_ref VARCHAR(256) NOT NULL,  -- KMS ARN 또는 파일 경로
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rotates_at TIMESTAMPTZ,
  retires_at TIMESTAMPTZ,
  status VARCHAR(16) DEFAULT 'active'  -- active | retiring | retired
);
\`\`\`

#### 6.2.5 \`audit_logs\` — 감사 이벤트

\`\`\`sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(32) NOT NULL,  -- login | token_issue | token_refresh | logout | error
  client_id VARCHAR(64),
  sub VARCHAR(128),
  ip INET,
  user_agent VARCHAR(512),
  result VARCHAR(16) NOT NULL,  -- success | failure
  error_code VARCHAR(64),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_sub ON audit_logs(sub);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
\`\`\`

### 6.3 Redis 키 구조

#### 6.3.1 SSO 세션

- Key: \`sso:session:<session_id>\`
- TTL: 8시간 (sliding refresh)
- Value (JSON):
  \`\`\`json
  {
    "sub": "kwater_user_1234",
    "created_at": 1716000000,
    "last_activity": 1716003600,
    "ip_hash": "sha256(...)",
    "associated_clients": ["cmp-portal", "datahub-portal-id"]
  }
  \`\`\`

#### 6.3.2 Authorization Code

- Key: \`auth:code:<code>\`
- TTL: 10분 (1회용)
- Value (JSON):
  \`\`\`json
  {
    "client_id": "cmp-portal",
    "sub": "kwater_user_1234",
    "redirect_uri": "https://cmp.kwater.com/callback",
    "code_challenge": "...",
    "scope": "openid profile",
    "nonce": "...",
    "used": false
  }
  \`\`\`

---

## 7. API 인터페이스

### 7.1 엔드포인트 요약

| Method | Path | 용도 |
|--------|------|------|
| GET | \`/.well-known/openid-configuration\` | Discovery |
| GET | \`/.well-known/jwks.json\` | 공개 키 집합 |
| GET | \`/oauth2/v1/authorize\` | 인가 코드 발급 |
| POST | \`/oauth2/v1/token\` | 토큰 교환·갱신 |
| GET | \`/oauth2/v1/userinfo\` | 사용자 정보 |
| GET | \`/oauth2/v1/logout\` | 단일 로그아웃 |
| POST | \`/oauth2/v1/kwater/backchannel-logout\` | K-water Upstream SLO 수신 |
| GET | \`/oauth2/kwater/callback\` | K-water 페이로드 수신 |

### 7.2 RP가 구현해야 하는 엔드포인트

| Method | Path | 용도 |
|--------|------|------|
| GET | \`{client}/callback\` | 인가 코드 수신 |
| POST | \`{client}/api/auth/exchange\` | 백엔드 토큰 교환 (BFF) |
| POST | \`{client}/oauth2/v1/backchannel-logout\` | SLO 수신 |

### 7.3 에러 응답 표준 (RFC 6749 §5.2)

\`\`\`json
{
  "error": "invalid_grant",
  "error_description": "Authorization code expired or already used",
  "error_uri": "https://auth.kwater.com/errors/invalid_grant"
}
\`\`\`

| error 코드 | HTTP | 설명 |
|-----------|------|------|
| invalid_request | 400 | 필수 파라미터 누락 |
| invalid_client | 401 | client 인증 실패 |
| invalid_grant | 400 | code/RT가 유효하지 않음 |
| unauthorized_client | 400 | client가 이 grant_type 사용 불가 |
| invalid_scope | 400 | 허용되지 않은 scope |
| login_required | 400 | prompt=none인데 세션 없음 |

---

## 8. 보안 요구사항

### 8.1 암호화·서명

| 용도 | 알고리즘 |
|------|---------|
| JWT 서명 | RS256 (RSA-PKCS1-v1_5 + SHA-256, 키 길이 ≥ 2048) |
| K-water 페이로드 복호화 | RSA-OAEP + AES-256-GCM (JWE) |
| DB 개인정보 컬럼 암호화 | AES-256-GCM |
| client_secret 저장 | bcrypt (cost ≥ 12) |
| 통신 | TLS 1.2 이상 (TLS 1.3 권장) |

### 8.2 키 관리

- 서명 개인키는 KMS, HSM, 또는 안전한 키 저장소에 보관
- 앱 메모리에 영구 보유 금지 (요청 시 즉시 메모리 해제)
- **연 1회 자동 키 로테이션**
- **2-key overlap**: 신·구 키 30일간 동시 활성 (RP 캐시 적응 기간)
- kid 기반 키 식별, JWKS 1시간 캐시

### 8.3 공격 방어

| 공격 유형 | 방어책 |
|----------|--------|
| CSRF | \`state\` 파라미터 필수 검증 |
| XSS | HttpOnly 쿠키 + CSP 헤더 (\`frame-ancestors 'none'\`) |
| Token Replay | 짧은 AT TTL (15분) + nonce + jti 추적 |
| Token Theft | RTR + 재사용 탐지 → chain 전체 폐기 |
| Open Redirect | redirect_uri 엄격 화이트리스트 (와일드카드 금지) |
| Brute Force | client_id별 rate limit (예: 100 req/min) |
| Replay (logout_token) | jti 기반 멱등성 (DB 또는 Redis 추적) |

### 8.4 감사 로깅

다음 이벤트를 구조화된 JSON으로 로깅:
- 로그인 시도/성공/실패
- 토큰 발급/갱신/폐기
- SLO 트리거 및 백채널 푸시 결과
- 보안 이상 이벤트 (재사용 탐지 등)
- PII는 자동 마스킹

---

## 9. 개발 마일스톤

### Phase 1 — MVP (W1~W4): CMP 단일 로그인

- [ ] K-water 페이로드 수신 + 복호화 (JWE)
- [ ] SSO 세션 쿠키 발급
- [ ] Authorization Code Flow + PKCE
- [ ] Access Token / ID Token 발급
- [ ] JWKS · Discovery 엔드포인트

### Phase 2 — Silent SSO + 하위 포털 (W5~W6)

- [ ] \`prompt=none\` 지원
- [ ] 3개 하위 포털 client 등록
- [ ] 포털별 scope 분리 검증

### Phase 3 — Refresh Token Rotation (W7~W8)

- [ ] RT 발급 + 갱신 흐름
- [ ] RTR chain DB 모델 + 추적
- [ ] RT 재사용 탐지 → chain 전체 폐기

### Phase 4 — Single Logout (W9~W10)

- [ ] \`/logout\` 엔드포인트
- [ ] logout_token 생성 + RS256 서명
- [ ] 등록된 모든 client의 \`backchannel_logout_uri\`로 푸시
- [ ] 재시도 큐 (지수 백오프) + jti 멱등성

### Phase 5 — 안정화 & 인수 (W11~W12)

- [ ] K-water Upstream SLO 수신 엔드포인트
- [ ] 감사 로그 + 모니터링
- [ ] 부하 테스트 (목표 RPS 달성 확인)
- [ ] 인수 시험 (UAT) 진행

---

## 10. 시험 계획

### 10.1 단위 시험

- 각 모듈별 70% 이상 커버리지 목표
- JWT 서명/검증, PKCE 검증, 토큰 발급 로직 등 핵심 함수

### 10.2 통합 시험

다음 시나리오를 자동화 테스트로 작성:
1. 신규 사용자 로그인 → CMP 토큰 발급 → API 호출
2. CMP 로그인 상태에서 데이터허브 Silent SSO 성공
3. Refresh Token 갱신 → 기존 RT 폐기 확인
4. RT 재사용 시도 → chain 전체 폐기 확인
5. CMP에서 /logout → 모든 포털 백채널 푸시 수신 확인
6. K-water Upstream SLO 수신 → 디지털플랫폼 전체 폐기 확인

### 10.3 부하 시험

> **⚠ 운영 K-water 무영향 원칙**: K-water 운영 시스템은 어떠한 시험 트래픽도 받아서는 안 된다. 부하 테스트는 IdP가 소유한 엔드포인트에 한정하며, K-water 페이로드 수신부는 Mock 어댑터로 대체한다.

#### 10.3.1 Mock K-water 어댑터 (개발·시험 환경 전용)

- K-water와 동일한 JWE 페이로드 발급 (테스트 키 사용)
- 사전 정의된 N명의 가상 사용자 풀 (예: \`kwater_test_user_0001\` ~ \`kwater_test_user_1000\`)
- **운영 K-water와 네트워크 격리** — DNS는 사내 VIP 또는 Hosts 파일로 분리
- K-water Upstream SLO 수신은 시험용 발송기로 시뮬레이션

#### 10.3.2 시나리오

1. **사전 준비 단계** (부하 시작 전)
   - Mock 어댑터로 N개 SSO 세션을 사전 발급 → Redis에 직접 주입
   - 토큰 발급/갱신/로그아웃의 초기 상태 준비
2. **측정 대상 엔드포인트**
   - \`GET /authorize\` (Silent SSO 포함)
   - \`POST /token\` (authorization_code · refresh_token 두 grant 혼합)
   - \`GET /userinfo\`
   - \`GET /logout\` + 백채널 푸시 발송
3. **측정 제외 엔드포인트**
   - \`GET /oauth2/kwater/callback\` (Mock 어댑터로 대체, 외부 의존성 제거)
4. **부하 프로파일**
   - 동시 1,000 사용자
   - 분당 6,000 토큰 발급 + 6,000 토큰 갱신 (혼합)
   - 5분간 정상 부하, 추가 5분간 스파이크 (1.5배) 테스트
5. **도구**: k6 / Apache JMeter / Locust
6. **합격 기준**
   - 평균 응답 시간 ≤ 300ms
   - P95 응답 시간 ≤ 500ms
   - 에러율 ≤ 0.1%
   - CPU/메모리 안정 추세 (메모리 누수 없음)

#### 10.3.3 환경 분리

| 환경 | K-water 연결 | 부하 테스트 가능 여부 |
|------|-------------|---------------------|
| 운영 (Production) | 실 K-water | **❌ 절대 금지** |
| 스테이징 (Staging) | 실 K-water 또는 K-water 시험계 | 합의된 시간/규모에 한해 검토 (K-water와 사전 협의 필수) |
| 시험 (Test) | **Mock K-water 어댑터** | ✅ 자유롭게 수행 |
| 개발 (Dev) | **Mock K-water 어댑터** | ✅ 자유롭게 수행 |

### 10.4 보안 시험

- 표준 침투 테스트 (OWASP Top 10 기반)
- 토큰 위조 시도 → 거부 확인
- 만료된 토큰 사용 시도 → 거부 확인
- redirect_uri 변조 시도 → 거부 확인

### 10.5 인수 시험 (UAT)

발주처 입회 하에 시나리오별 시연:
- 정상 SSO 로그인 (CMP → 데이터허브 → 생성형 AI)
- 단일 로그아웃 (모든 포털 세션 종료)
- 로그인 실패 케이스 (만료 토큰, CSRF 등)

---

## 11. 산출물

| 단계 | 산출물 |
|------|--------|
| **분석** | 요구사항 정의서 · 인터페이스 정의서 (K-water · 포털) |
| **설계** | 시스템 아키텍처 설계서 · DB 설계서 (ERD) · API 설계서 (OpenAPI 3.1) |
| **개발** | 소스코드 · 형상 관리 (Git) · 단위 시험 결과서 |
| **시험** | 통합 시험 계획서 · 통합 시험 결과서 · 부하 시험 결과서 |
| **이관** | 설치/배포 매뉴얼 · 운영 매뉴얼 · 장애 대응 매뉴얼 |
| **인수** | 인수 확인서 · 최종 보고서 |

### 추가 산출물 (발주처 요구 시)

- 보안 검토서
- 개인정보 영향평가서
- 감리 대응 자료

---

## 부록 A: 용어 정의

| 용어 | 정의 |
|------|------|
| **OIDC** | OpenID Connect — OAuth 2.0 위에 신원 계층을 추가한 인증 프로토콜 |
| **OAuth 2.1** | OAuth 2.0의 보안 강화 draft (Implicit Flow 제거, PKCE 필수 등) |
| **IdP** | Identity Provider — 사용자 신원을 검증하고 토큰을 발급하는 서버 |
| **RP** | Relying Party — IdP가 발급한 토큰을 신뢰하고 사용하는 클라이언트 (포털 백엔드) |
| **JWT** | JSON Web Token — 서명된 JSON 형식의 토큰 |
| **JWE** | JSON Web Encryption — 암호화된 JWT |
| **JWS** | JSON Web Signature — 서명된 JWT |
| **JWKS** | JSON Web Key Set — 공개 키 집합 (JWT 검증용) |
| **PKCE** | Proof Key for Code Exchange — 인가 코드 도난 방어 (RFC 7636) |
| **RTR** | Refresh Token Rotation — 토큰 갱신 시 RT 즉시 교체 |
| **SLO** | Single Logout — 통합 로그아웃 |
| **SSO** | Single Sign-On — 단일 로그인 |
| **BFF** | Backend-for-Frontend — 프론트엔드 전용 백엔드 (토큰 보관) |
| **kid** | Key ID — 서명 키 식별자 |
| **sub** | Subject — 사용자 식별자 |
| **aud** | Audience — 토큰 수신 대상 (client_id) |
| **iss** | Issuer — 토큰 발급자 (IdP URL) |
| **jti** | JWT ID — 토큰 고유 식별자 |

---

## 부록 B: 참조 표준

- **OIDC Core 1.0**: https://openid.net/specs/openid-connect-core-1_0.html
- **OIDC Back-Channel Logout 1.0**: https://openid.net/specs/openid-connect-backchannel-1_0.html
- **OAuth 2.1 (draft)**: https://datatracker.ietf.org/doc/draft-ietf-oauth-v2-1/
- **RFC 6749 (OAuth 2.0)**: https://datatracker.ietf.org/doc/html/rfc6749
- **RFC 6750 (Bearer Token)**: https://datatracker.ietf.org/doc/html/rfc6750
- **RFC 7515 (JWS)**: https://datatracker.ietf.org/doc/html/rfc7515
- **RFC 7516 (JWE)**: https://datatracker.ietf.org/doc/html/rfc7516
- **RFC 7517 (JWK)**: https://datatracker.ietf.org/doc/html/rfc7517
- **RFC 7519 (JWT)**: https://datatracker.ietf.org/doc/html/rfc7519
- **RFC 7636 (PKCE)**: https://datatracker.ietf.org/doc/html/rfc7636
- **RFC 8414 (Authorization Server Metadata)**: https://datatracker.ietf.org/doc/html/rfc8414
- **RFC 8417 (SET)**: https://datatracker.ietf.org/doc/html/rfc8417

---

## 부록 C: K-water Mock 어댑터 명세

> **목적**: 운영 K-water 시스템에 영향을 주지 않고 IdP의 \`/oauth2/kwater/callback\` 엔드포인트를 시험하기 위한 시뮬레이터. 개발(Dev)·시험(Test) 환경에서만 사용한다. 운영(Production) 환경에는 절대 배포 금지.

### C.1 목적과 사용 시기

| 사용 시기 | 사용 이유 |
|----------|----------|
| 단위 시험 | 페이로드 복호화 로직 단독 검증 |
| 통합 시험 | 전체 SSO 흐름의 K-water 부분 시뮬레이션 |
| **부하 시험** | 운영 K-water에 트래픽 가지 않도록 보장 |
| 회귀 시험 (CI) | K-water 운영계 가용성과 무관하게 빌드 검증 |
| 데모/UAT 사전 시연 | 가상 사용자로 시나리오 재현 |

### C.2 기능 요구사항 (Mock 어댑터)

#### MK-1: K-water JWE 페이로드 발급 시뮬레이션

- 실 K-water와 **동일한 JWE 구조** 발급 (RSA-OAEP + AES-256-GCM)
- 페이로드 클레임 구조:
  \`\`\`json
  {
    "kwater_user_id": "kwater_test_user_0001",
    "department": "수자원관리본부",
    "role": "ADMIN",
    "issued_at": 1716000000,
    "issuer": "mock-kwater-adapter"
  }
  \`\`\`
- 서명·암호화 키는 **테스트 전용** 키페어 사용 (운영 K-water 키와 별개)

#### MK-2: 가상 사용자 풀 관리

- 사전 정의된 N명의 가상 사용자 (예: 1,000명 기본 풀)
- 명명 규칙: \`kwater_test_user_0001\` ~ \`kwater_test_user_NNNN\`
- 부서·권한 분포는 운영 통계와 유사하게 구성
- 풀 확장 API 제공 (테스트 시나리오별 N명 추가/삭제)

#### MK-3: 실 K-water 호환 인터페이스

- Mock 어댑터는 IdP 입장에서 실 K-water와 구별되지 않아야 함
- DNS는 사내 VIP 또는 Hosts 파일로 분기 (예: \`auth.kwater.local\` → Mock)
- IdP 측 변경 없이 환경 변수만으로 Mock ↔ 실 K-water 전환 가능

#### MK-4: K-water Upstream SLO 시뮬레이션

- 실 K-water와 동일한 \`logout_token\` JWT 발송 (RFC 8417)
- 임의의 가상 사용자에 대한 로그아웃 이벤트 트리거 API:
  \`\`\`
  POST /mock/kwater/trigger-logout
  Content-Type: application/json

  { "sub": "kwater_test_user_0001" }
  \`\`\`

#### MK-5: 트래픽 차단 안전장치 (필수)

- Mock 어댑터 인스턴스는 **운영 K-water 도메인으로 절대 트래픽을 발생시키지 않음**
- DNS 차단·방화벽 정책으로 운영 K-water 호스트 outbound 차단
- 환경 변수 \`MOCK_MODE=true\` 미설정 시 부팅 거부

### C.3 인터페이스 명세

#### C.3.1 페이로드 발급 (테스트 트리거)

\`\`\`
POST /mock/kwater/issue-payload
Content-Type: application/json

{
  "user_id": "kwater_test_user_0001",
  "state": "test_state_abc123"
}
\`\`\`

**응답:**
\`\`\`json
{
  "redirect_url": "https://auth.kwater.com/oauth2/kwater/callback?kwater_enc_payload=eyJhbGc...&state=test_state_abc123"
}
\`\`\`

#### C.3.2 가상 사용자 풀 조회

\`\`\`
GET /mock/kwater/users?limit=100&offset=0
\`\`\`

#### C.3.3 SSO 세션 사전 주입 (부하 시험 전용)

부하 시험 사전 준비 단계에서 Mock 어댑터가 직접 IdP Redis에 SSO 세션을 N개 일괄 주입하는 관리 API. IdP의 정상 인증 흐름을 거치지 않고 즉시 발급:

\`\`\`
POST /mock/kwater/preload-sessions
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "count": 1000,
  "ttl_seconds": 28800
}
\`\`\`

### C.4 환경 분리

| 환경 | Mock 어댑터 | 실 K-water | 부하 테스트 |
|------|-------------|-----------|------------|
| Dev | ✅ 사용 | ❌ 차단 | ✅ 자유 |
| Test | ✅ 사용 | ❌ 차단 | ✅ 자유 |
| Staging | 선택적 사용 | K-water 시험계만 (사전 합의) | 합의된 시간/규모 한정 |
| **Production** | **❌ 배포 금지** | 실 K-water | **❌ 운영 부하 테스트 절대 금지** |

### C.5 보안 요구사항

- Mock 어댑터의 모든 엔드포인트는 **사내 망에서만 접근 가능** (NAT/방화벽으로 외부 차단)
- 관리 API(\`/mock/kwater/preload-sessions\` 등)는 별도 admin 인증 필요
- 테스트 키는 KMS 또는 안전한 키 저장소에 보관 (소스 코드 미포함)
- 시험 후 가상 사용자 데이터는 즉시 삭제 (개인정보 오인 방지)

### C.6 산출물

| 산출물 | 단계 |
|-------|------|
| Mock 어댑터 설계서 | 설계 |
| Mock 어댑터 소스코드 + Docker 이미지 | 개발 |
| Mock 어댑터 사용 매뉴얼 | 시험 |
| 가상 사용자 데이터 생성 스크립트 | 시험 |
| 환경 분리 검증 절차서 (외부 차단 확인) | 시험 |

### C.7 운영 이관 시 처리

- 운영 이관 전 Mock 어댑터를 **컨테이너 레지스트리에서 제거**
- 운영 환경 헬름 차트/Terraform에서 Mock 관련 리소스 정의 삭제
- 운영 IdP 환경 변수 \`MOCK_MODE\` 미설정 강제 (시작 시 차단)
- 운영 K-water와 Mock 도메인 이중 등록 방지 검증

---

*문서 버전: v1.0*
*작성일: ${new Date().toISOString().slice(0, 10)}*
*본 문서의 URL · 도메인 · client_id · 토큰 값은 예시이며, 실제 운영 환경 값은 별도 비밀 저장소에서 관리합니다.*
`;
