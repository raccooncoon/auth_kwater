import React from 'react';
import { Terminal } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

export default function ApiSpec() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">인증 API 엔드포인트 세부 명세</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          디지털플랫폼 통합인증 서버가 노출하는 OIDC 표준 엔드포인트 + K-water 연동 전용 엔드포인트 + 하위 포털 백채널 로그아웃 수신 엔드포인트의 전체 명세입니다.
        </p>
      </div>

      {/* Endpoint summary table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Terminal className="text-indigo-400" size={18} />
          <h3 className="font-bold text-white text-base">엔드포인트 개요</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase">
                <th className="py-2.5 px-5">Method</th>
                <th className="py-2.5 px-5">Path</th>
                <th className="py-2.5 px-5">분류</th>
                <th className="py-2.5 px-5">용도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/.well-known/openid-configuration</td><td className="py-2 px-5 text-slate-400">Discovery</td><td className="py-2 px-5 text-slate-400">메타데이터·엔드포인트·지원 알고리즘 자동 노출</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/.well-known/jwks.json</td><td className="py-2 px-5 text-slate-400">Discovery</td><td className="py-2 px-5 text-slate-400">JWT 서명 검증용 공개 키 집합</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/authorize</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">사용자 인가 요청 (front-channel)</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/token</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">인가 코드 ↔ 토큰 교환 · Refresh Token 갱신</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/userinfo</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">Access Token으로 사용자 프로필 조회</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/logout</td><td className="py-2 px-5 text-slate-400">RP-Initiated Logout</td><td className="py-2 px-5 text-slate-400">사용자 발화 통합 로그아웃 시작점</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/introspect</td><td className="py-2 px-5 text-slate-400">RFC 7662</td><td className="py-2 px-5 text-slate-400">토큰 유효성/메타 정보 조회 (서버 간)</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/revoke</td><td className="py-2 px-5 text-slate-400">RFC 7009</td><td className="py-2 px-5 text-slate-400">개별 토큰 즉시 폐기</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/kwater/callback</td><td className="py-2 px-5 text-slate-400">K-water 연동</td><td className="py-2 px-5 text-slate-400">K-water 암호화 페이로드 수신·복호화·SSO 발급</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/kwater/backchannel-logout</td><td className="py-2 px-5 text-slate-400">OIDC BCL 1.0 (수신)</td><td className="py-2 px-5 text-slate-400">K-water가 호출 — 상위 SLO 수신</td></tr>
              <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[14px]">POST</span></td><td className="py-2 px-5 font-mono">{`{portal}/oauth2/v1/backchannel-logout`}</td><td className="py-2 px-5 text-slate-400">OIDC BCL 1.0 (송신)</td><td className="py-2 px-5 text-slate-400">IdP가 각 포털 백엔드로 호출 — 하위 SLO 전파</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Discovery & Keys ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-emerald-400 rounded"></span>
          Discovery & Keys
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/.well-known/openid-configuration</h4>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-400">OIDC Discovery 표준 문서. 클라이언트·리소스 서버가 모든 엔드포인트·지원 알고리즘·JWKS URI를 자동 발견하도록 합니다.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK · 일부 발췌)</div>
            <CodeBlock language="json" code={`{
  "issuer": "https://auth.kwater.com",
  "authorization_endpoint": "https://auth.kwater.com/oauth2/v1/authorize",
  "token_endpoint": "https://auth.kwater.com/oauth2/v1/token",
  "userinfo_endpoint": "https://auth.kwater.com/oauth2/v1/userinfo",
  "jwks_uri": "https://auth.kwater.com/.well-known/jwks.json",
  "end_session_endpoint": "https://auth.kwater.com/oauth2/v1/logout",
  "introspection_endpoint": "https://auth.kwater.com/oauth2/v1/introspect",
  "revocation_endpoint": "https://auth.kwater.com/oauth2/v1/revoke",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token", "client_credentials"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "backchannel_logout_supported": true,
  "backchannel_logout_session_supported": true
}`} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/.well-known/jwks.json (서명 검증용 공개 키 목록)</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <p className="text-slate-300 leading-relaxed">
              IdP의 <strong className="text-white">공개 도장 목록</strong>입니다. 리소스 서버는 토큰의 서명이 진짜 IdP가 찍은 것인지 이 공개키로 확인합니다.
            </p>

            {/* Three-part friendly explanation */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div>
                <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-emerald-300 mb-1">① 공개 키란?</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  JWT(Access Token)는 IdP의 <strong className="text-slate-200">비공개 키(private key)</strong>로 서명되어 있습니다. 리소스 서버가 그 서명이 진짜인지 확인하려면 짝이 되는 <strong className="text-slate-200">공개 키(public key)</strong>가 필요한데, 그 공개 키들을 모아놓은 게 JWKS(JSON Web Key Set)입니다.
                </p>
              </div>

              <div>
                <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-indigo-300 mb-1">② TTL 1시간 캐싱</div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  매 API 호출마다 JWKS를 IdP에 묻으면 트래픽이 폭주합니다. 그래서 한 번 받은 키들을 메모리(또는 Redis)에 1시간 정도 저장해두고 재사용합니다. 1시간 후 새로 가져오면 그동안 회전된 키도 자연스럽게 반영됩니다.
                </p>
              </div>

              <div>
                <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-amber-300 mb-1">③ <code className="text-amber-300">kid</code> = key ID (어느 키로 서명했는지 표시)</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">
                  IdP는 보안을 위해 서명용 키를 주기적으로 교체(<strong className="text-slate-200">key rotation</strong>)합니다. 단, 바꾸자마자 기존 토큰을 무효화하면 사용자들이 갑자기 로그아웃되므로 <strong className="text-slate-200">옛 키 + 새 키를 잠시 같이</strong> JWKS에 둡니다. 어느 키로 서명한 토큰인지 알려주는 게 JWT 헤더의 <code className="text-amber-300">kid</code> 값입니다.
                </p>
                <CodeBlock language="json" fontSize="0.72rem" code={`JWT Header:  { "alg": "RS256", "kid": "key-2026-q2" }
                               ↑ "이 토큰은 이 키로 서명함"

JWKS 응답에서 같은 kid를 찾아 그 공개키로 검증`} />
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
            <CodeBlock language="json" code={`{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key-2026-q1",
      "use": "sig",
      "alg": "RS256",
      "n": "<modulus base64url>",
      "e": "AQAB",
      "_comment": "이전 키 — 잠시 유지하여 옛 토큰 검증"
    },
    {
      "kty": "RSA",
      "kid": "key-2026-q2",
      "use": "sig",
      "alg": "RS256",
      "n": "<modulus base64url>",
      "e": "AQAB",
      "_comment": "현재 사용 중인 키"
    }
  ]
}`} />
          </div>
        </div>
      </div>

      {/* ─── OAuth/OIDC 핵심 흐름 ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-indigo-400 rounded"></span>
          OAuth/OIDC 핵심 흐름
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/authorize (사용자 인가 요청)</h4>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-400">사용자를 SSO 통합 로그인 화면으로 유도하거나, 하위 포털에서 Silent 인증을 요청하기 위한 관문 엔드포인트입니다.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Query Parameters</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">파라미터명</th>
                    <th className="py-2 px-3 font-semibold">필수 여부</th>
                    <th className="py-2 px-3 font-semibold">타입</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr><td className="py-2 px-3 font-mono text-white">response_type</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">반드시 <code className="text-slate-300">code</code></td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">요청 포털 고유 식별자</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">redirect_uri</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">인가 코드를 수신할 콜백 주소 (사전 등록 필수)</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">scope</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">최소 <code className="text-slate-300">openid</code> 포함, 공백 구분</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">CSRF 방지 일회용 무작위 값</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">prompt</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">none</code> 사용 시 Silent SSO</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">nonce</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">Replay 방지용 — ID Token에 그대로 반환</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">code_challenge</td><td className="py-2 px-3 text-slate-400">Optional (PKCE)</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">SPA·모바일 등 공용 클라이언트에서 권장. <code className="text-slate-300">code_verifier</code>를 SHA-256 + base64url로 인코딩한 값</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">code_challenge_method</td><td className="py-2 px-3 text-amber-400">PKCE 시 필수</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">반드시 <code className="text-slate-300">S256</code>. <code className="text-slate-300">plain</code>은 보안상 사용 금지</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">response_mode</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">query</code> (기본) / <code className="text-slate-300">fragment</code> / <code className="text-slate-300">form_post</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/token (토큰 발급 · 갱신)</h4>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-400">인가 코드를 Access/Refresh Token으로 교환하거나, Refresh Token으로 새 토큰을 갱신(RTR)합니다. Confidential client는 <code className="text-indigo-300">client_secret</code> 필수, 공용 client는 PKCE 사용.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Request Body (application/x-www-form-urlencoded)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">파라미터명</th>
                    <th className="py-2 px-3 font-semibold">필수 여부</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr><td className="py-2 px-3 font-mono text-white">grant_type</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">authorization_code</code> · <code className="text-slate-300">refresh_token</code> · <code className="text-slate-300">client_credentials</code> (CMP 권한 허브 → 각 포털 Admin API 호출용)</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">code</td><td className="py-2 px-3 text-amber-400">Code 교환 시</td><td className="py-2 px-3 text-slate-400">/authorize에서 받은 일회용 인가 코드</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">refresh_token</td><td className="py-2 px-3 text-amber-400">갱신 시</td><td className="py-2 px-3 text-slate-400">HttpOnly 쿠키 또는 본문 어느 쪽으로든 가능</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">redirect_uri</td><td className="py-2 px-3 text-amber-400">Code 교환 시</td><td className="py-2 px-3 text-slate-400">/authorize에서 사용한 값과 정확히 일치</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">포털 식별자</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">client_secret</td><td className="py-2 px-3 text-amber-400">Confidential</td><td className="py-2 px-3 text-slate-400">백엔드 환경변수에서만 주입 (BFF·서버)</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">code_verifier</td><td className="py-2 px-3 text-amber-400">PKCE</td><td className="py-2 px-3 text-slate-400">/authorize에 보낸 challenge의 원본</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
            <CodeBlock language="json" code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "rfr_771239ab8c19ef",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile datahub:read"
}`} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/userinfo (사용자 프로필 조회)</h4>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-400">Access Token으로 인증된 사용자의 프로필 정보를 반환합니다. <code className="text-emerald-300">Authorization: Bearer ...</code> 헤더 필수.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
            <CodeBlock language="json" code={`{
  "sub": "kwater_user_1234",
  "name": "홍길동",
  "email": "hong@example.com",
  "department": "수자원관리본부",
  "role": "ADMIN",
  "kwater_employee_id": "K012345"
}`} />
          </div>
        </div>
      </div>

      {/* ─── K-water 연동 ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-sky-400 rounded"></span>
          K-water 연동 (Upstream)
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/oauth2/kwater/callback (K-water 페이로드 수신)</h4>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-400">K-water 인증 시스템에서 암호화 페이로드(JWE/SAML)를 수신·복호화하여 디지털플랫폼 통합 SSO 세션을 생성합니다.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Query Parameters</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">파라미터명</th>
                    <th className="py-2 px-3 font-semibold">필수 여부</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr><td className="py-2 px-3 font-mono text-white">kwater_enc_payload</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">K-water가 발급한 암호화 사용자 정보 토큰 (JWE/SAML Assertion)</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">CSRF 방지 — 리다이렉트 시작 시 저장해둔 값과 일치 검증</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/kwater/backchannel-logout (K-water 로그아웃 수신)</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <p className="text-slate-400 leading-relaxed">K-water 측에서 사용자가 로그아웃하면 K-water가 이 엔드포인트로 <code className="text-sky-300">logout_token</code>(JWT)을 POST합니다. 디지털플랫폼 통합인증 서버는 이를 검증한 뒤 SSO 세션을 만료시키고, 다시 하위 4개 포털로 백채널 로그아웃을 연쇄 전파합니다.</p>

            <div>
              <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Request Body (application/x-www-form-urlencoded)</div>
              <CodeBlock language="bash" code={`logout_token=<JWT signed by K-water, OIDC BCL 1.0 §2.4 (RFC 8417 SET)>`} />
            </div>

            <div className="bg-slate-950/60 border border-sky-500/30 rounded-xl p-4">
              <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-sky-300 mb-2">logout_token 검증 항목 (OIDC BCL 1.0 §2.4 (RFC 8417 SET))</div>
              <p className="text-[15px] text-slate-400 leading-relaxed mb-3">
                K-water가 보낸 JWT 안의 클레임들을 한 줄 한 줄 확인하여 — <strong className="text-white">정말 K-water가 보낸 것인지 + 우리에게 보낸 것인지 + 변조·재사용·위장이 없는지</strong>를 검증합니다.
              </p>
              <ul className="space-y-2 text-[15px] text-slate-300">
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">typ</code>
                  <span>JWT 헤더가 <code className="text-slate-300">&quot;logout+jwt&quot;</code> — 일반 ID Token으로 위장된 공격 차단</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">iss</code>
                  <span>발행자가 <strong className="text-white">K-water issuer URL과 정확히 일치</strong> (예: <code className="text-slate-300">https://auth.kwater.go.kr/auth</code>)</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">aud</code>
                  <span>수신자가 <strong className="text-white">우리 client_id</strong> — 다른 RP에게 보낸 토큰을 우리가 받으면 거부</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">iat</code>
                  <span>발행 시각이 <strong className="text-white">최근 5분 이내</strong> (서버 간 clock skew ±30초 허용) — 오래된 토큰 재생(replay) 차단</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">jti</code>
                  <span>JWT 고유 ID — 이미 처리한 jti는 재사용 차단 (Caffeine 같은 TTL 캐시 권장)</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">events</code>
                  <span>{`{ "http://schemas.openid.net/event/backchannel-logout": {} }`} 가 들어있어야 함 — 로그아웃 이벤트임을 명시</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-rose-300 font-mono line-through">nonce</code>
                  <span><strong className="text-rose-300">절대 있어선 안 됨</strong> — OIDC BCL 1.0 §2.4 (RFC 8417 SET) 명시. nonce가 있으면 ID Token 위장 공격이므로 거부</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-sky-300 font-mono">sub / sid</code>
                  <span>둘 중 최소 하나는 있어야 — 누구 세션을 끊을지 식별. <code className="text-slate-300">sub</code>는 사용자, <code className="text-slate-300">sid</code>는 특정 세션 ID</span>
                </li>
              </ul>
              <p className="text-[14px] text-slate-500 mt-3 italic">한 항목이라도 실패하면 <span className="text-rose-300">400 Bad Request</span> 반환. 검증 통과 시 해당 sub/sid 세션을 폐기하고 <span className="text-emerald-300">200 OK</span> + <code className="text-slate-300">Cache-Control: no-store</code>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 세션 관리 ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-rose-400 rounded"></span>
          세션 · 토큰 관리
        </h3>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/logout (RP-Initiated Logout)</h4>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-400">사용자가 임의 포털에서 로그아웃 클릭 시 브라우저가 이동하는 엔드포인트. IdP는 중앙 SSO 쿠키를 만료시키고, 등록된 모든 클라이언트의 <code className="text-emerald-300">backchannel_logout_uri</code>로 logout_token JWT를 POST 푸시합니다.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Query Parameters</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">파라미터명</th>
                    <th className="py-2 px-3 font-semibold">필수 여부</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr><td className="py-2 px-3 font-mono text-white">id_token_hint</td><td className="py-2 px-3 text-emerald-400">Recommended</td><td className="py-2 px-3 text-slate-400">로그인 시 발급된 ID Token. 사용자 식별 + 요청 무결성 확인용. 누락 시 client_id로 대체 가능</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">id_token_hint</code>가 없을 때 클라이언트 식별 — post_logout_redirect_uri 화이트리스트 검증에 사용</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">post_logout_redirect_uri</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">로그아웃 완료 후 이동할 URL. 사전 등록 필수</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">CSRF 방지 — post_logout_redirect_uri 응답에 그대로 반환</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">logout_hint</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">사용자 선택 화면 노출이 필요한 경우 사용자 식별 힌트</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">ui_locales</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">로그아웃 확인 화면 언어 (BCP47), 예: <code className="text-slate-300">ko-KR en</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/introspect (토큰 검증 · RFC 7662)</h4>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-400">리소스 서버가 Access Token의 유효성과 메타 정보를 IdP에 직접 묻는 엔드포인트. JWT 자체검증을 못 하거나 폐기 여부까지 확인하고 싶을 때 사용. <strong className="text-white">Confidential client만 호출 가능</strong> (Basic Auth 또는 client_id/secret 필수).</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Request Body (application/x-www-form-urlencoded)</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 px-3 font-semibold">파라미터명</th>
                    <th className="py-2 px-3 font-semibold">필수 여부</th>
                    <th className="py-2 px-3 font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  <tr><td className="py-2 px-3 font-mono text-white">token</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">검증할 Access Token 또는 Refresh Token</td></tr>
                  <tr><td className="py-2 px-3 font-mono text-white">token_type_hint</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">access_token</code> 또는 <code className="text-slate-300">refresh_token</code> — 서버 lookup 최적화 힌트</td></tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK · 활성 토큰)</div>
            <CodeBlock language="json" code={`{
  "active": true,
  "scope": "openid profile datahub:read",
  "client_id": "datahub-portal-id",
  "username": "kwater_user_1234",
  "exp": 1716985593,
  "iat": 1716981993,
  "sub": "kwater_user_1234"
}`} />
            <p className="text-[15px] text-slate-400">폐기/만료된 토큰은 <code className="text-rose-300">{`{ "active": false }`}</code>만 반환 (토큰 열거 방지).</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
            <h4 className="font-bold text-white text-sm">/oauth2/v1/revoke (토큰 폐기 · RFC 7009)</h4>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <p className="text-slate-400">특정 Access Token 또는 Refresh Token을 즉시 무효화합니다. 사용자가 명시적으로 "이 기기에서 로그아웃"을 누르거나, 도난 감지 시 사용.</p>
            <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Request Body</div>
            <CodeBlock language="bash" code={`token=<폐기할 토큰>
token_type_hint=refresh_token   # 또는 access_token
client_id=cmp-portal
client_secret=<...>`} />
            <p className="text-[15px] text-slate-400 leading-relaxed">응답:
              <span className="text-emerald-300"> 200 OK</span> — 폐기 성공 또는 알 수 없는 토큰 (토큰 열거 방지 차원에서 동일 처리, 본문 없음) ·
              <span className="text-amber-300"> 400</span> — <code className="text-slate-300">invalid_request</code> 등 요청 자체 오류 ·
              <span className="text-rose-300"> 401</span> — 클라이언트 인증 실패
            </p>
          </div>
        </div>
      </div>

      {/* ─── 백채널 로그아웃 송신 ─── */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1 h-4 bg-purple-400 rounded"></span>
          백채널 로그아웃 송신 (하위 포털 측 구현)
        </h3>

        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden">
          <div className="bg-purple-950/30 px-6 py-4 border-b border-purple-500/20 flex items-center gap-3">
            <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
            <h4 className="font-bold text-white text-sm">{`{portal}/oauth2/v1/backchannel-logout`}</h4>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <p className="text-slate-400 leading-relaxed">디지털플랫폼 통합인증 서버가 SLO 시 각 하위 포털 백엔드로 호출하는 엔드포인트입니다. <strong className="text-white">각 포털이 구현하여 IdP에 등록</strong>합니다 (예: <code className="text-purple-300">https://datahub.kwater.com/oauth2/v1/backchannel-logout</code>).</p>

            <div>
              <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Request Body</div>
              <CodeBlock language="bash" code={`logout_token=<JWT signed by IdP per OIDC Back-Channel Logout 1.0 §2.4 (RFC 8417 SET 위에 정의)>`} />
            </div>

            <div className="bg-slate-950/60 border border-purple-500/30 rounded-xl p-4">
              <div className="text-[14px] font-mono font-bold uppercase tracking-widest text-purple-300 mb-2">logout_token 검증 항목 (OIDC BCL 1.0 §2.4 (RFC 8417 SET))</div>
              <p className="text-[15px] text-slate-400 leading-relaxed mb-3">
                IdP가 보낸 JWT 안의 클레임들을 한 줄 한 줄 확인하여 — <strong className="text-white">정말 우리 IdP가 보낸 것인지 + 우리 포털에게 보낸 것인지 + 변조·재사용·위장이 없는지</strong>를 검증합니다.
              </p>
              <ul className="space-y-2 text-[15px] text-slate-300">
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">typ</code>
                  <span>JWT 헤더가 <code className="text-slate-300">&quot;logout+jwt&quot;</code> — 일반 ID Token으로 위장된 공격 차단</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">signature</code>
                  <span>IdP JWKS 공개키로 서명 검증 — 위·변조된 JWT 거부</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">iss</code>
                  <span><strong className="text-white">발행자가 IdP issuer URL과 정확히 일치</strong> (예: <code className="text-slate-300">https://auth.kwater.com</code>) — 가짜 IdP 위조 차단</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">aud</code>
                  <span>수신자가 <strong className="text-white">우리 client_id</strong> — 다른 RP에게 발급된 토큰을 우리가 받으면 거부 (Confused Deputy 방어)</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">iat</code>
                  <span>발행 시각이 <strong className="text-white">최근 5분 이내</strong> + <strong className="text-white">±30초 clock skew 허용</strong> (서버 간 시계 오차) — 오래된 토큰 재생(replay) 차단하면서 정상 요청은 시계 오차로 거부되지 않도록</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">jti</code>
                  <span>JWT 고유 ID — 이미 처리한 jti는 재사용 차단 (Caffeine 같은 TTL 캐시 권장, 10분 정도)</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">events</code>
                  <span>{`{ "http://schemas.openid.net/event/backchannel-logout": {} }`} 가 들어있어야 함 — 로그아웃 이벤트임을 명시</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-rose-300 font-mono line-through">nonce</code>
                  <span><strong className="text-rose-300">절대 있어선 안 됨</strong> — OIDC BCL 1.0 §2.4 (RFC 8417 SET) 명시. nonce가 있으면 ID Token 위장 공격이므로 거부</span>
                </li>
                <li className="flex gap-2">
                  <code className="shrink-0 text-purple-300 font-mono">sub / sid</code>
                  <span>둘 중 최소 하나는 있어야 — 누구 세션을 끊을지 식별. <code className="text-slate-300">sub</code>는 사용자, <code className="text-slate-300">sid</code>는 특정 세션 ID</span>
                </li>
              </ul>
            </div>

            <div className="text-[14px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">응답:</strong>
              <span className="text-emerald-300 ml-1">200 OK</span> + <code className="text-purple-300">Cache-Control: no-store</code> 헤더 (OIDC BCL 1.0 §2.8 (Cache-Control)) · 빈 본문 ·
              검증 실패 시 <span className="text-rose-300">400 Bad Request</span> → IdP가 재시도 큐에 적재.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
