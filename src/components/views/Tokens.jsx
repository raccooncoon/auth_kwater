import React from 'react';
import { Info, ShieldCheck, Key, RefreshCw, Code2, Database, Laptop, Server, Activity, AlertTriangle, Check, ChevronRight } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

export default function Tokens() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">토큰 라이프사이클 및 보안 메커니즘</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          토큰은 "로그인 후 사용자임을 증명하는 통행증"입니다. 어떻게 발급되고, 어디에 저장하며, 만료되기 전에 어떻게 갱신하고, 어떤 위협에서 어떻게 보호하는지 한 곳에서 살펴봅니다.
        </p>
      </div>

      {/* Intuitive analogy */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
          <Info className="text-indigo-400" size={18} />
          비유로 이해하기: 호텔 객실 키
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300 leading-relaxed">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-indigo-300 font-bold mb-1">Access Token = 객실 키카드</div>
            <p className="text-slate-400 text-xs leading-relaxed">방문을 열 때마다 매번 보여줍니다. 분실 시 누군가 일정 시간 안에 들어갈 수 있으므로 <strong className="text-white">유효 시간이 짧습니다(15분~1시간)</strong>. 카드 표면에 "객실 번호 + 만료 시각"이 적혀있어 따로 프런트에 묻지 않아도 검증 가능 (JWT 자체검증).</p>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-emerald-300 font-bold mb-1">Refresh Token = 프런트에 맡긴 신분증</div>
            <p className="text-slate-400 text-xs leading-relaxed">키카드가 만료되면 프런트에 신분증을 보여주고 새 키카드를 받습니다. 신분증은 직접 방문에 쓰지 않고 안전한 곳(서버 세션)에 보관됩니다. <strong className="text-white">유효 기간이 깁니다(7~30일)</strong>. 한 번 쓰면 새 신분증으로 교체(RTR)됩니다.</p>
          </div>
        </div>
      </div>

      {/* K-water Token Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-xl mb-4 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" size={20} />
          K-water Payload ➜ 디지털플랫폼 통합 토큰 체계
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          최초 로그인 시 K-water 상위 시스템에서 사용자 데이터를 암호화하여 전달합니다. 디지털플랫폼 통합인증 서버는 이를 복호화하여 K-water 사용자 식별 및 권한을 확인하고,
          본격적으로 디지털플랫폼 생태계 내부(클라우드 관리 포털 (CMP), 데이터허브, 생성형 AI 등)에서 통용되는 자체 <strong className="text-white">Access Token</strong>과 <strong className="text-white">Refresh Token</strong>을 발급하여 보안과 세션을 독립적으로 관리합니다. K-water 신원은 입구에서만 사용하고, 디지털플랫폼 내부 활동은 자체 토큰으로 이뤄지는 셈입니다.
        </p>
      </div>

      {/* Access vs Refresh Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950/40 p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[12px] font-mono px-3 py-1 rounded-bl-xl border-l border-b border-indigo-500/10">Access Token</div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Key className="text-indigo-400" size={18} />
            Access Token (액세스 토큰)
          </h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p><strong className="text-slate-200">역할:</strong> 보호된 API를 호출할 때마다 <code className="text-indigo-300">Authorization: Bearer ...</code> 헤더에 실어 보내는 "통행증"입니다.</p>
            <p><strong className="text-slate-200">포맷:</strong> 표준 JWT(JSON Web Token). 헤더·페이로드·서명의 3부분으로 구성되며 페이로드에 user_id, scope, exp(만료 시각), iat(발급 시각) 등이 들어 있습니다.</p>
            <p><strong className="text-slate-200">검증 방식:</strong> 리소스 서버가 IdP의 공개키(JWKS)로 서명을 검증 — IdP에 매번 묻지 않아도 됨 (자체검증).</p>
            <p><strong className="text-slate-200">만료 기간:</strong> <span className="text-indigo-400 font-bold">15분 ~ 1시간</span>. 짧을수록 안전하지만 갱신 요청이 잦아져 트레이드오프.</p>
          </div>
        </div>

        <div className="bg-slate-950/40 p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[12px] font-mono px-3 py-1 rounded-bl-xl border-l border-b border-emerald-500/10">Refresh Token</div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <RefreshCw className="text-emerald-400 animate-spin-slow" size={18} />
            Refresh Token (리프레시 토큰)
          </h3>
          <div className="space-y-3 text-sm text-slate-400">
            <p><strong className="text-slate-200">역할:</strong> Access Token이 만료되면 사용자 재로그인 없이 자동으로 새 토큰을 받아오는 데 사용합니다.</p>
            <p><strong className="text-slate-200">포맷:</strong> 인증 서버 DB와 즉시 대조 가능한 <strong>Opaque(불투명) 문자열</strong> 권장 (예: UUID, 랜덤 128bit). JWT로도 가능하지만 폐기 관리가 어려워짐.</p>
            <p><strong className="text-slate-200">전달 방식:</strong> <strong className="text-white">HttpOnly + Secure 쿠키</strong> 또는 BFF 백엔드 세션 스토어에만 보관. JS에서 절대 접근 불가.</p>
            <p><strong className="text-slate-200">만료 기간:</strong> <span className="text-emerald-400 font-bold">7일 ~ 30일</span>. RTR로 한 번 쓸 때마다 새것으로 교체되므로 실제 노출 시간은 매우 짧음.</p>
          </div>
        </div>
      </div>

      {/* JWT decomposition */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Code2 className="text-indigo-400" size={18} />
          <h3 className="font-bold text-white text-base">JWT 구조 분해 — Access Token이 실제로 어떻게 생겼는가</h3>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            JWT는 점(.)으로 구분된 3부분의 Base64URL 문자열입니다. 디코딩하면 사람이 읽을 수 있는 JSON이지만, 마지막 서명 덕분에 위·변조가 불가능합니다.
          </p>
          <pre className="text-[13px] bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono overflow-x-auto whitespace-pre leading-relaxed">
<span className="text-indigo-300">eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjEyMyJ9</span>.<span className="text-emerald-300">eyJpc3MiOiJodHRwczovL2F1dGgua3dhdGVyLmNvbSIsInN1YiI6Imt3YXRlcl91c2VyXzEyMzQiLCJhdWQiOiJjbXAtcG9ydGFsIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSIsImV4cCI6MTcxNjk4NTU5MywiaWF0IjoxNzE2OTgxOTkzfQ</span>.<span className="text-rose-300">[RSA Signature]</span></pre>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-4">
              <div className="text-indigo-300 text-[12px] font-mono font-bold uppercase mb-2">Header (헤더)</div>
              <CodeBlock language="json" fontSize="0.72rem" code={`{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "123"
}`} />
              <p className="text-[13px] text-slate-400 mt-2">서명 알고리즘과 키 ID. 리소스 서버가 JWKS에서 어떤 공개키로 검증할지 식별.</p>
            </div>
            <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4">
              <div className="text-emerald-300 text-[12px] font-mono font-bold uppercase mb-2">Payload (페이로드)</div>
              <CodeBlock language="json" fontSize="0.72rem" code={`{
  "iss": "auth.kwater.com",
  "sub": "kwater_user_1234",
  "aud": "cmp-portal",
  "scope": "openid profile",
  "exp": 1716985593,
  "iat": 1716981993
}`} />
              <p className="text-[13px] text-slate-400 mt-2">사용자 정보·권한·만료시각. <strong className="text-emerald-300">암호화되지 않음</strong> — 비밀번호 절대 금지.</p>
            </div>
            <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-4">
              <div className="text-rose-300 text-[12px] font-mono font-bold uppercase mb-2">Signature (서명)</div>
              <CodeBlock language="javascript" fontSize="0.72rem" code={`RSA_SHA256(
  Base64(header) + "." +
  Base64(payload),
  IdP_PrivateKey
)`} />
              <p className="text-[13px] text-slate-400 mt-2">IdP의 비공개키로 서명. 페이로드를 1바이트만 바꿔도 서명 검증 실패.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Token storage comparison */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Database className="text-emerald-400" size={18} />
          <h3 className="font-bold text-white text-base">토큰을 어디에 저장해야 하는가</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            저장 위치가 보안의 절반입니다. 같은 토큰도 보관 장소가 어디냐에 따라 XSS·CSRF 노출도가 달라집니다.
          </p>

          {/* Storage layer diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-4 text-center">BFF 패턴 권장 저장 구조</div>
            <div className="grid grid-cols-3 gap-4">
              {/* Browser layer */}
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-300 text-[12px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase border border-slate-700 whitespace-nowrap">사용자 브라우저</div>
                <Laptop className="text-slate-400 my-2 mx-auto" size={28} />
                <div className="space-y-2 mt-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
                    <div className="text-[12px] text-emerald-300 font-bold">✓ HttpOnly Session Cookie</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">portal_sid=abc...</div>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded p-2">
                    <div className="text-[12px] text-rose-300 font-bold">✗ Access Token · Refresh Token 저장 안 함</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">XSS 탈취 위험 차단</div>
                  </div>
                </div>
              </div>

              {/* Portal backend layer */}
              <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-purple-300 text-[12px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase border border-purple-500/40 whitespace-nowrap">포털 백엔드</div>
                <Server className="text-purple-400 my-2 mx-auto" size={28} />
                <div className="space-y-2 mt-3">
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded p-2">
                    <div className="text-[12px] text-indigo-300 font-bold">Access Token (메모리)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">15분 TTL · 세션 캐시</div>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-2">
                    <div className="text-[12px] text-emerald-300 font-bold">Refresh Token (Redis)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">7~30일 · 세션 스토어</div>
                  </div>
                </div>
              </div>

              {/* IdP layer */}
              <div className="bg-slate-900 border border-indigo-500/40 rounded-xl p-4 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-indigo-300 text-[12px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase border border-indigo-500/40 whitespace-nowrap">IdP 인증 서버</div>
                <ShieldCheck className="text-indigo-400 my-2 mx-auto" size={28} />
                <div className="space-y-2 mt-3">
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                    <div className="text-[12px] text-amber-300 font-bold">Refresh Token 해시 (DB)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">SHA-256(rt) + used flag</div>
                  </div>
                  <div className="bg-sky-500/10 border border-sky-500/30 rounded p-2">
                    <div className="text-[12px] text-sky-300 font-bold">JWT 서명 키 (KMS)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">RSA private key</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow arrows */}
            <div className="mt-5 grid grid-cols-3 gap-4 text-[12px] font-mono">
              <div className="text-center text-slate-500">↑ 세션 쿠키만 노출</div>
              <div className="text-center text-slate-500">↔ 백채널 토큰 교환</div>
              <div className="text-center text-slate-500">↑ 발급/검증</div>
            </div>
          </div>

          {/* 브라우저 쿠키 내용 친절 풀이 */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden">
            <div className="bg-emerald-950/30 px-5 py-3 border-b border-emerald-500/20 flex items-center gap-2">
              <Laptop className="text-emerald-400" size={16} />
              <h4 className="font-bold text-white text-sm">브라우저 쿠키, 정확히 뭐가 들어있나? (BFF 패턴)</h4>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-[13px] text-slate-300 leading-relaxed">
                BFF 패턴에서 브라우저가 가지는 건 <strong className="text-white">단 한 줄의 세션 ID 쿠키</strong>입니다.
                토큰 자체는 절대 브라우저로 오지 않습니다.
              </p>

              {/* 쿠키 한 줄 분해 */}
              <div>
                <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-emerald-300 mb-2">실제 발급되는 쿠키 (Set-Cookie 한 줄)</div>
                <CodeBlock language="http" fontSize="0.72rem" code={`Set-Cookie: portal_sid=A1f2eK_kLqz9wQv8mYpX...
            Path=/;
            HttpOnly;
            Secure;
            SameSite=Lax;
            Max-Age=86400`} />
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-left text-[12px] border-collapse text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2 px-2 font-semibold">속성</th>
                        <th className="py-2 px-2 font-semibold">의미</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">portal_sid</td><td className="py-2 px-2 text-slate-400">쿠키 이름 (개발자 작명 — JSESSIONID·connect.sid 등 어떤 이름이든 OK)</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">A1f2eK_kLqz9wQv...</td><td className="py-2 px-2 text-slate-400"><strong className="text-white">세션 ID 값</strong> — 백엔드가 발급한 무작위 토큰 (보통 128bit 이상 랜덤)</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">HttpOnly</td><td className="py-2 px-2 text-slate-400">JS 접근 불가 — XSS로 훔칠 수 없음</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">Secure</td><td className="py-2 px-2 text-slate-400">HTTPS에서만 전송 — 도청 방어</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">SameSite=Lax</td><td className="py-2 px-2 text-slate-400">다른 사이트가 요청 보낼 때 자동 첨부 차단 — CSRF 방어</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">Path=/</td><td className="py-2 px-2 text-slate-400">사이트 전체 경로에서 자동 전송</td></tr>
                      <tr><td className="py-2 px-2 font-mono text-emerald-300">Max-Age=86400</td><td className="py-2 px-2 text-slate-400">24시간 후 만료 (초 단위)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 세션 ID 값 종류 */}
              <div>
                <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-indigo-300 mb-2">세션 ID 값의 3가지 형태</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-slate-950/60 border border-emerald-500/40 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">권장</span>
                      <span className="text-[13px] font-bold text-white">Opaque random</span>
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300 break-all bg-slate-950 rounded px-1.5 py-1 mb-1.5">A1f2eK_kLqz9wQv...</div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">무의미한 랜덤 문자열. 백엔드가 세션 스토어에서 이걸 키로 lookup. 폐기 즉시 가능. <strong className="text-emerald-300">Spring Session · express-session · Django session 기본 방식</strong>.</p>
                  </div>
                  <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">대안</span>
                      <span className="text-[13px] font-bold text-white">JWT (Stateless)</span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 break-all bg-slate-950 rounded px-1.5 py-1 mb-1.5">eyJhbGciOiJIUzI1NiIs...</div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">세션 정보를 JWT로 인코딩해 쿠키 자체가 되는 방식. 서버 스토어 불필요. 단점: 폐기 어려움(블랙리스트 필요), 크기 큼.</p>
                  </div>
                  <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[11px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">변형</span>
                      <span className="text-[13px] font-bold text-white">Signed ID</span>
                    </div>
                    <div className="text-[11px] font-mono text-indigo-300 break-all bg-slate-950 rounded px-1.5 py-1 mb-1.5">A1f2eK.HMAC-SHA256(...)</div>
                    <p className="text-[12px] text-slate-400 leading-relaxed">Opaque ID + HMAC 서명. ID는 서버 lookup용, 서명은 위변조 방지용.</p>
                  </div>
                </div>
              </div>

              {/* 백엔드 매핑 */}
              <div>
                <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-purple-300 mb-2">백엔드 세션 스토어 (Redis 예시)</div>
                <CodeBlock language="bash" fontSize="0.72rem" code={`# Redis 키: session:<sessionId>
session:A1f2eK_kLqz9wQv8mYpX = {
  user_id:       "kwater_user_1234",
  access_token:  "eyJhbGciOiJSUzI1NiIs...",    # ← 진짜 토큰은 여기에
  refresh_token: "rfr_771239ab8c19ef",         # ← 여기에
  id_token:      "eyJhbGciOiJSUzI1NiIs...",
  expires_at:    1716985593,
  scope:         "openid profile datahub:read"
}
TTL: 86400`} />
              </div>

              {/* API 호출 흐름 */}
              <div>
                <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-sky-300 mb-2">API 호출 흐름 — 토큰이 절대 브라우저에 노출되지 않는 이유</div>
                <ol className="space-y-1.5 text-[13px] text-slate-300 list-decimal list-inside">
                  <li>브라우저 → 포털 백엔드 요청 (<code className="text-emerald-300">portal_sid=A1f2eK...</code> 쿠키 자동 동봉)</li>
                  <li>백엔드 → Redis lookup: <code className="text-purple-300">session:A1f2eK</code> → access_token 꺼냄</li>
                  <li>백엔드 → IdP/리소스 서버 호출 (<code className="text-indigo-300">Authorization: Bearer eyJ...</code>)</li>
                  <li>백엔드 → 응답을 브라우저에 그대로 전달</li>
                </ol>
                <p className="text-[12px] text-slate-400 mt-2 leading-relaxed">
                  <strong className="text-slate-200">결과:</strong> 브라우저는 access_token이 존재하는지조차 모름. 그저 자기 portal_sid만 자동 동봉할 뿐.
                  XSS가 일어나도 portal_sid만 노출되며(만료/회전 가능), 진짜 토큰은 영원히 안전.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-2 px-3 font-semibold">저장 위치</th>
                  <th className="py-2 px-3 font-semibold">XSS 노출</th>
                  <th className="py-2 px-3 font-semibold">CSRF 노출</th>
                  <th className="py-2 px-3 font-semibold">권장 여부</th>
                  <th className="py-2 px-3 font-semibold">설명</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">localStorage</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold">위험</td>
                  <td className="py-2 px-3 text-emerald-400">안전</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold">❌ 절대 금지</td>
                  <td className="py-2 px-3 text-slate-400">JS로 접근 가능 → XSS 한 번이면 모든 토큰 유출</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-amber-300">sessionStorage</td>
                  <td className="py-2 px-3 text-rose-400 font-semibold">위험</td>
                  <td className="py-2 px-3 text-emerald-400">안전</td>
                  <td className="py-2 px-3 text-amber-400">⚠️ state만 가능</td>
                  <td className="py-2 px-3 text-slate-400">OIDC state 일회용 값에만 사용. 토큰은 금지</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-emerald-300">JS in-memory</td>
                  <td className="py-2 px-3 text-amber-400">중간</td>
                  <td className="py-2 px-3 text-emerald-400">안전</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">✓ SPA용 AT</td>
                  <td className="py-2 px-3 text-slate-400">새로고침 시 사라짐 — 짧은 Access Token만 권장</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-emerald-300">HttpOnly Cookie</td>
                  <td className="py-2 px-3 text-emerald-400">안전</td>
                  <td className="py-2 px-3 text-amber-400">중간*</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">✓ Refresh Token 표준</td>
                  <td className="py-2 px-3 text-slate-400">JS 접근 불가. CSRF는 SameSite=Lax/Strict로 차단</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-emerald-300">백엔드 세션</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">최고</td>
                  <td className="py-2 px-3 text-emerald-400">안전</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">✓ BFF 권장</td>
                  <td className="py-2 px-3 text-slate-400">브라우저엔 세션 쿠키만, 토큰 자체는 서버에만</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SPA 환경에서 백엔드를 못 둘 때 — 의사결정 트리 + 4가지 패턴 비교 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <ShieldCheck className="text-amber-400" size={18} />
          <h3 className="font-bold text-white text-base">백엔드를 못 둘 때 — SPA 환경의 저장 전략</h3>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-300 leading-relaxed">
            BFF(Backend-for-Frontend)가 가장 안전하지만, 정적 호스팅 SPA처럼 백엔드를 둘 수 없을 때도 있습니다.
            그런 경우 <strong className="text-white">모든 옵션이 BFF보다 위험</strong>하다는 점을 인식하고, 다음 우선순위로 선택합니다.
          </p>

          {/* 의사결정 트리 */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-amber-300 mb-4 text-center">의사결정 트리</div>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center text-slate-200 font-semibold">
                Q1. 백엔드를 둘 수 있는가?
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-6">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="text-emerald-300 font-bold text-[13px] mb-1">YES — BFF 패턴 ✓</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">서버 세션 + HttpOnly 세션 쿠키만 브라우저로. 가장 안전.</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-amber-300 font-bold text-[13px] mb-1">NO — SPA 환경 ↓</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">Q2로 진행.</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center text-slate-200 font-semibold ml-0 md:ml-6">
                Q2. IdP가 Silent SSO를 잘 지원하는가? (같은 사이트 + <code className="text-indigo-300">prompt=none</code> + iframe 허용)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-12">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                  <div className="text-emerald-300 font-bold text-[13px] mb-1">YES — 🥉 Silent SSO 의존</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">SPA에 토큰 저장 자체를 안 함. 매 페이지 로드 시 IdP에서 새로 받음.</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="text-amber-300 font-bold text-[13px] mb-1">NO — 토큰을 저장해야 함 ↓</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">Q3로 진행.</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center text-slate-200 font-semibold ml-0 md:ml-12">
                Q3. XSS 방어를 한 단계 더 강화하고 싶은가? (Service Worker 사용 가능 환경)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-16">
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
                  <div className="text-indigo-300 font-bold text-[13px] mb-1">YES — 🥈 Service Worker 격리</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">토큰을 SW 스코프에 격리. 메인 JS는 토큰 접근 불가 → 브라우저 안의 BFF.</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-purple-300 font-bold text-[13px] mb-1">NO — 🥇 메모리 + HttpOnly RT 쿠키</div>
                  <p className="text-[12px] text-slate-400 leading-relaxed">표준 SPA 패턴. AT는 JS 메모리, RT는 HttpOnly 쿠키. + RTR + CSP 필수.</p>
                </div>
              </div>

              {/* DPoP는 별도 레이어 — 위 어느 것에든 결합 */}
              <div className="mt-5 pt-4 border-t border-slate-800">
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-3 flex items-start gap-3">
                  <span className="shrink-0 text-sky-300 font-bold text-[13px]">💎 DPoP (가산 옵션)</span>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">위 4가지(BFF · 🥇 · 🥈 · 🥉) 어느 것에든 결합 가능한 별도 레이어.</strong>
                    토큰을 클라이언트 키쌍에 묶어 <strong className="text-sky-300">탈취해도 비공개키 없이는 사용 불가</strong>하게 만듦 (RFC 9449).
                    IdP·리소스 서버·SPA가 모두 DPoP를 구현해야 적용 가능.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4가지 패턴 카드 */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-purple-500/20 text-purple-300 text-[12px] font-mono px-2 py-0.5 rounded">PATTERNS</span>
              SPA에서 쓸 수 있는 4가지 패턴
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1순위 */}
              <div className="bg-slate-950/60 border border-purple-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">🥇 1순위</span>
                  <span className="text-sm font-bold text-white">메모리(AT) + HttpOnly 쿠키(RT)</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  <strong className="text-white">Access Token</strong>은 JS 메모리(전역 변수·Context·Zustand 등)에만,
                  <strong className="text-white"> Refresh Token</strong>은 HttpOnly + Secure + SameSite 쿠키에.
                </p>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· 새로고침/새 탭 → 메모리 AT 사라짐 → RT 쿠키로 자동 갱신</li>
                  <li>· XSS 시 AT는 짧은 시간 탈취 위험, RT는 절대 안전</li>
                  <li>· <strong className="text-purple-300">RTR + CSP 필수</strong></li>
                </ul>
              </div>

              {/* 2순위 */}
              <div className="bg-slate-950/60 border border-indigo-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">🥈 2순위</span>
                  <span className="text-sm font-bold text-white">Service Worker 격리</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  토큰을 <strong className="text-white">Service Worker 스코프</strong>에 보관. 메인 스레드 JS에서 토큰 접근 불가 → XSS가 일어나도 토큰을 볼 수 없음.
                </p>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· SW가 모든 fetch 가로채서 Authorization 헤더 자동 첨부</li>
                  <li>· 사실상 "브라우저 안의 BFF"</li>
                  <li>· Safari 시크릿 모드 등 일부 환경 제약</li>
                </ul>
              </div>

              {/* 3순위 */}
              <div className="bg-slate-950/60 border border-emerald-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">🥉 3순위</span>
                  <span className="text-sm font-bold text-white">Silent SSO 의존 (저장 안 함)</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  토큰을 SPA에 보관하지 <strong className="text-white">않고</strong> 필요할 때마다 IdP에서 새로 받음. SSO 쿠키만 IdP 도메인에 HttpOnly로 박혀있으면 됨.
                </p>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· SPA 코드에 토큰 자체가 없음 → XSS로 훔칠 게 없음</li>
                  <li>· 매번 IdP 왕복 → 지연 증가</li>
                  <li>· <strong className="text-emerald-300">본 가이드처럼 잘 갖춰진 IdP 환경에 적합</strong></li>
                </ul>
              </div>

              {/* 보너스 */}
              <div className="bg-slate-950/60 border border-sky-500/40 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">💎 BONUS</span>
                  <span className="text-sm font-bold text-white">DPoP (Sender-Constrained Token)</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  RFC 9449. 토큰을 클라이언트의 비공개 키쌍에 묶어, <strong className="text-white">탈취해도 비공개키 없이는 사용 불가</strong>.
                </p>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· <code className="text-sky-300">Authorization: DPoP &lt;token&gt;</code> + <code className="text-sky-300">DPoP: &lt;proof JWT&gt;</code></li>
                  <li>· 위 1·2·3순위 어느 것에든 추가 가능</li>
                  <li>· IdP·리소스 서버·SPA 모두 구현 필요</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RTR + CSP 친절 설명 */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden">
            <div className="bg-emerald-950/30 px-5 py-3 border-b border-emerald-500/20 flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={16} />
              <h4 className="font-bold text-white text-sm">🥇 1순위 카드의 "RTR + CSP 필수" — 두 약어 풀이</h4>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-[13px] text-slate-300 leading-relaxed">
                메모리 + HttpOnly RT 쿠키 패턴을 안전하게 운영하려면 <strong className="text-white">RTR</strong>과 <strong className="text-white">CSP</strong>를 둘 다 적용해야 합니다.
                둘은 서로 다른 위협을 막는 짝꿍입니다.
              </p>

              {/* RTR 설명 */}
              <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">RTR</span>
                  <span className="text-sm font-bold text-white">Refresh Token Rotation — 한 번 쓰면 즉시 교체</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  Refresh Token을 <strong className="text-white">한 번 사용할 때마다 새것으로 회전</strong>하고 이전 것은 즉시 무효화하는 정책입니다.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-2">
                  <div className="text-[12px] font-mono text-slate-300 leading-relaxed">
                    <div><span className="text-emerald-300">정상:</span> RT#1 사용 → 서버가 AT#2 + <strong className="text-emerald-300">RT#2</strong> 발급, RT#1 즉시 폐기</div>
                    <div className="mt-1"><span className="text-rose-300">공격자:</span> 탈취한 RT#1 다시 사용 시도 → <strong className="text-rose-300">"이미 사용됨" 감지</strong> → 해당 사용자의 RT family 전체 폐기 + 알림</div>
                  </div>
                </div>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· <strong className="text-slate-300">막는 것</strong>: Refresh Token이 탈취당해도 정상 사용자가 먼저 갱신하면 공격자 토큰이 자동 폐기됨</li>
                  <li>· <strong className="text-slate-300">구현 포인트</strong>: 서버에 <code className="text-emerald-300">used_at</code>, <code className="text-emerald-300">replaced_by</code> 컬럼 두고 추적. 동시 요청은 5초 grace period 허용</li>
                  <li>· <strong className="text-slate-300">상세</strong>: 이 페이지의 "Refresh Token Rotation (RTR)" 섹션 참조</li>
                </ul>
              </div>

              {/* CSP 설명 */}
              <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">CSP</span>
                  <span className="text-sm font-bold text-white">Content Security Policy — 브라우저에게 "이것만 실행해" 알리기</span>
                </div>
                <p className="text-[13px] text-slate-300 leading-relaxed mb-2">
                  서버가 보내는 <strong className="text-white">HTTP 응답 헤더</strong>로, 브라우저에게 "이 페이지에서는 이런 출처의 스크립트·이미지·연결만 허용한다"고 선언합니다.
                  XSS 공격이 inline script를 끼워넣어도 브라우저가 차단합니다.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded p-3 mb-2">
                  <div className="text-[12px] font-mono leading-relaxed">
                    <div><span className="text-indigo-300">Content-Security-Policy:</span></div>
                    <div className="ml-3"><span className="text-amber-300">default-src</span> &apos;self&apos;;</div>
                    <div className="ml-3"><span className="text-amber-300">script-src</span> &apos;self&apos;;                  <span className="text-slate-500">{`/* 외부 스크립트·inline·eval 차단 */`}</span></div>
                    <div className="ml-3"><span className="text-amber-300">connect-src</span> &apos;self&apos; https://auth.kwater.com;</div>
                    <div className="ml-3"><span className="text-amber-300">frame-ancestors</span> &apos;none&apos;;          <span className="text-slate-500">{`/* iframe 임베드 차단 */`}</span></div>
                    <div className="ml-3"><span className="text-amber-300">object-src</span> &apos;none&apos;;</div>
                  </div>
                </div>
                <ul className="text-[12px] text-slate-400 space-y-1 leading-relaxed">
                  <li>· <strong className="text-slate-300">막는 것</strong>: XSS가 페이지에 <code className="text-indigo-300">&lt;script&gt;evil()&lt;/script&gt;</code>을 삽입해도 브라우저가 실행 거부 → 메모리 AT 탈취 시도 차단</li>
                  <li>· <strong className="text-slate-300">핵심 지시어</strong>: <code className="text-indigo-300">script-src &apos;self&apos;</code> (외부·inline 스크립트 금지), <code className="text-indigo-300">connect-src</code> (API 호출 가능 도메인 제한)</li>
                  <li>· <strong className="text-slate-300">주의</strong>: <code className="text-rose-300">&apos;unsafe-inline&apos;</code>, <code className="text-rose-300">&apos;unsafe-eval&apos;</code> 절대 추가 금지 (CSP 효과 무력화)</li>
                  <li>· <strong className="text-slate-300">테스트</strong>: 처음엔 <code className="text-indigo-300">Content-Security-Policy-Report-Only</code> 헤더로 위반만 로그 수집 후 점진 적용</li>
                </ul>
              </div>

              {/* 함께 적용 시 효과 */}
              <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4">
                <h5 className="text-[13px] font-bold text-amber-200 mb-2 flex items-center gap-2">
                  <Info className="text-amber-400" size={14} />
                  둘을 함께 적용해야 하는 이유 — 보완 관계
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px] border-collapse text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2 px-2 font-semibold">방어책</th>
                        <th className="py-2 px-2 font-semibold">막는 위협</th>
                        <th className="py-2 px-2 font-semibold">단독으로는?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      <tr>
                        <td className="py-2 px-2 font-mono text-emerald-300">RTR</td>
                        <td className="py-2 px-2 text-slate-400">Refresh Token 탈취 후 재사용</td>
                        <td className="py-2 px-2 text-slate-400">XSS로 AT가 즉시 탈취되는 건 못 막음</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-mono text-indigo-300">CSP</td>
                        <td className="py-2 px-2 text-slate-400">XSS로 인한 inline script 실행</td>
                        <td className="py-2 px-2 text-slate-400">CSP를 우회한 RT 탈취까지는 못 막음</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-mono text-amber-300">RTR + CSP</td>
                        <td className="py-2 px-2 text-emerald-300">두 위협 모두 차단 — 다층 방어</td>
                        <td className="py-2 px-2 text-emerald-300">✓ 권장</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 절대 금지 */}
          <div className="bg-rose-500/5 border border-rose-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-rose-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="text-rose-400" size={14} />
              어떤 SPA 패턴에서도 절대 금지
            </h4>
            <ul className="space-y-1 text-[13px] text-slate-300">
              <li className="flex gap-2"><span className="text-rose-400 shrink-0">✗</span><span><code className="text-rose-300">localStorage</code> — XSS 한 번이면 모든 토큰 영구 유출</span></li>
              <li className="flex gap-2"><span className="text-rose-400 shrink-0">✗</span><span><code className="text-rose-300">sessionStorage</code>에 토큰 (state 일회용 값에만 사용 OK)</span></li>
              <li className="flex gap-2"><span className="text-rose-400 shrink-0">✗</span><span>URL 쿼리/해시에 토큰 — 브라우저 히스토리·서버 로그에 영구 노출</span></li>
              <li className="flex gap-2"><span className="text-rose-400 shrink-0">✗</span><span>HttpOnly 없는 쿠키 — JS로 접근 가능 → XSS 노출</span></li>
            </ul>
          </div>

          {/* 핵심 원칙 */}
          <div className="bg-indigo-500/5 border border-indigo-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-indigo-200 mb-2 flex items-center gap-2">
              <Info className="text-indigo-400" size={14} />
              어떤 패턴이든 공통 핵심 원칙 3가지
            </h4>
            <ol className="space-y-1.5 text-[13px] text-slate-300 list-decimal list-inside">
              <li><strong className="text-white">localStorage·sessionStorage에 토큰 절대 금지</strong> — 첫 번째 방어선</li>
              <li><strong className="text-white">CSP 헤더로 inline script 차단</strong> — XSS의 주 진입로 차단</li>
              <li><strong className="text-white">Refresh Token Rotation 필수</strong> — 한 번 쓰면 회전, 도난 감지 시 family 전체 폐기</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Lifecycle timeline (visual) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
          <Activity className="text-indigo-400" size={18} />
          <h3 className="font-bold text-white text-base">한 토큰 쌍의 라이프사이클 타임라인</h3>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            Access Token은 짧게 여러 번 교체되고, Refresh Token은 길게 유지됩니다. 두 토큰의 수명을 한 축에 비교하면 다음과 같습니다.
          </p>

          {/* Horizontal timeline diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            {/* Time axis labels */}
            <div className="flex justify-between text-[12px] font-mono text-slate-500 mb-2 px-1">
              <span>t=0 (로그인)</span>
              <span>15분</span>
              <span>30분</span>
              <span>45분</span>
              <span>60분</span>
              <span>...</span>
              <span>7일 (Refresh Token 만료)</span>
            </div>

            {/* Access Token bars (multiple short segments) */}
            <div className="mb-2">
              <div className="flex items-center gap-1 mb-1">
                <Key size={11} className="text-indigo-400" />
                <span className="text-[12px] font-bold text-indigo-300 uppercase tracking-wider">Access Token · 15분마다 교체</span>
              </div>
              <div className="flex h-6 gap-px relative">
                <div className="flex-1 bg-gradient-to-r from-indigo-500/80 to-indigo-500/40 rounded-l border border-indigo-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#1</div>
                <div className="flex-1 bg-gradient-to-r from-indigo-500/80 to-indigo-500/40 border border-indigo-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#2</div>
                <div className="flex-1 bg-gradient-to-r from-indigo-500/80 to-indigo-500/40 border border-indigo-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#3</div>
                <div className="flex-1 bg-gradient-to-r from-indigo-500/80 to-indigo-500/40 border border-indigo-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#4</div>
                <div className="flex-[6] bg-gradient-to-r from-indigo-500/40 via-indigo-500/20 to-indigo-500/10 border border-indigo-500/30 border-dashed flex items-center justify-center text-[11px] font-mono text-slate-400">... 매 15분 자동 회전 ...</div>
                <div className="flex-1 bg-rose-500/30 rounded-r border border-rose-500/40 flex items-center justify-center text-[11px] font-mono text-rose-200">만료</div>
              </div>
            </div>

            {/* Refresh Token bar (single long segment) */}
            <div className="mt-3">
              <div className="flex items-center gap-1 mb-1">
                <RefreshCw size={11} className="text-emerald-400" />
                <span className="text-[12px] font-bold text-emerald-300 uppercase tracking-wider">Refresh Token · 7일 + 사용마다 회전(RTR)</span>
              </div>
              <div className="flex h-6 gap-px relative">
                <div className="flex-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/60 rounded-l border border-emerald-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#1</div>
                <div className="flex-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/60 border border-emerald-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#2</div>
                <div className="flex-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/60 border border-emerald-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#3</div>
                <div className="flex-1 bg-gradient-to-r from-emerald-500/80 to-emerald-500/60 border border-emerald-500/50 flex items-center justify-center text-[11px] font-mono text-white font-bold">#4</div>
                <div className="flex-[6] bg-gradient-to-r from-emerald-500/60 via-emerald-500/40 to-emerald-500/20 border border-emerald-500/30 border-dashed flex items-center justify-center text-[11px] font-mono text-slate-300">... 갱신마다 회전 ...</div>
                <div className="flex-1 bg-rose-500/30 rounded-r border border-rose-500/40 flex items-center justify-center text-[11px] font-mono text-rose-200">재로그인</div>
              </div>
            </div>

            {/* Event markers */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>각 Access Token 만료 시점마다 Refresh Token으로 자동 갱신 (사용자 모름)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Refresh Token은 한 번 쓰일 때마다 새것으로 교체 (RTR)</span>
              </div>
            </div>
          </div>

          {/* 4-step cards (kept) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4 relative">
              <div className="absolute -top-2 left-3 bg-emerald-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">1. 발급</div>
              <p className="text-slate-300 mt-2 leading-relaxed">로그인 또는 Silent SSO 완료 시점에 <strong className="text-white">Access + Refresh</strong>가 함께 발급. 포털 백엔드 세션에 저장.</p>
            </div>
            <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-4 relative">
              <div className="absolute -top-2 left-3 bg-indigo-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">2. 사용</div>
              <p className="text-slate-300 mt-2 leading-relaxed">API 호출마다 <code className="text-indigo-300">Authorization: Bearer &lt;Access Token&gt;</code> 헤더 첨부. Refresh Token은 절대 노출하지 않음.</p>
            </div>
            <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 relative">
              <div className="absolute -top-2 left-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">3. 갱신</div>
              <p className="text-slate-300 mt-2 leading-relaxed">Access Token 만료 임박/401 응답 감지 → Refresh Token으로 <code className="text-amber-300">/token</code> 호출 → 새 Access Token + 새 Refresh Token 받기 (RTR).</p>
            </div>
            <div className="bg-slate-950/60 border border-rose-500/30 rounded-xl p-4 relative">
              <div className="absolute -top-2 left-3 bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">4. 폐기</div>
              <p className="text-slate-300 mt-2 leading-relaxed">로그아웃 / Refresh Token 만료 / 도난 감지 시 즉시 무효화. 백채널로 모든 포털에 푸시.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Token Rotation Detail */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden">
        <div className="bg-emerald-950/30 px-6 py-4 border-b border-emerald-500/20 flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={20} />
          <h3 className="font-bold text-white text-base">보안의 핵심: Refresh Token Rotation (RTR)</h3>
        </div>
        <div className="p-6 space-y-5 text-sm text-slate-300 leading-relaxed">
          <p>
            RTR은 "Refresh Token을 한 번만 쓰고 즉시 새것으로 교체"하는 정책입니다. 단순하지만 강력한 도난 감지 메커니즘이 따라옵니다.
          </p>

          {/* RTR token family chain diagram */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-5">
            {/* Normal chain */}
            <div>
              <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-emerald-300 mb-3">정상 회전 (Token Family Chain)</div>
              <div className="flex items-center gap-2 overflow-x-auto">
                <div className="shrink-0 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-[12px] font-mono font-bold text-emerald-300">#1</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">used</div>
                </div>
                <ChevronRight className="shrink-0 text-emerald-400" size={18} />
                <div className="shrink-0 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-[12px] font-mono font-bold text-emerald-300">#2</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">used</div>
                </div>
                <ChevronRight className="shrink-0 text-emerald-400" size={18} />
                <div className="shrink-0 bg-emerald-500/15 border border-emerald-500/40 rounded-lg px-3 py-2 text-center min-w-[80px]">
                  <div className="text-[12px] font-mono font-bold text-emerald-300">#3</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">used</div>
                </div>
                <ChevronRight className="shrink-0 text-emerald-400" size={18} />
                <div className="shrink-0 bg-emerald-500/25 border-2 border-emerald-500 rounded-lg px-3 py-2 text-center min-w-[80px] shadow-lg shadow-emerald-500/20">
                  <div className="text-[12px] font-mono font-bold text-emerald-200">#4</div>
                  <div className="text-[11px] text-emerald-300 mt-0.5 font-bold">active</div>
                </div>
              </div>
              <p className="text-[13px] text-slate-400 mt-2">매 갱신마다 한 단계씩 회전. 이전 Refresh Token은 즉시 used 표시되고 DB에서 사용 불가.</p>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800"></div>

            {/* Theft detection scenario */}
            <div>
              <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-rose-300 mb-3">도난 감지 시나리오 — 공격자가 Refresh Token #2 탈취 후 사용 시도</div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-slate-700 text-slate-200 font-bold flex items-center justify-center text-[11px]">1</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-300">정상 사용자:</span>
                    <span className="bg-emerald-500/15 border border-emerald-500/40 rounded px-2 py-0.5 font-mono text-[12px] text-emerald-300">Refresh Token #2</span>
                    <ChevronRight className="text-emerald-400" size={12} />
                    <span className="bg-emerald-500/15 border border-emerald-500/40 rounded px-2 py-0.5 font-mono text-[12px] text-emerald-300">Refresh Token #3 발급</span>
                    <span className="text-emerald-400">✓ OK</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-rose-500/30 text-rose-200 font-bold flex items-center justify-center text-[11px]">2</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-rose-300">공격자(뒤늦게):</span>
                    <span className="bg-rose-500/15 border border-rose-500/40 rounded px-2 py-0.5 font-mono text-[12px] text-rose-300 line-through">Refresh Token #2</span>
                    <ChevronRight className="text-rose-400" size={12} />
                    <span className="text-rose-300 font-bold">⚠ 재사용 탐지!</span>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-[13px]">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-amber-500/30 text-amber-200 font-bold flex items-center justify-center text-[11px]">3</span>
                  <div className="text-amber-200">서버 자동 대응 → <strong className="text-white">family 전체 폐기</strong>:</div>
                </div>
                <div className="ml-7 flex items-center gap-2 overflow-x-auto">
                  <div className="shrink-0 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-1.5 text-center min-w-[70px] opacity-60">
                    <div className="text-[12px] font-mono font-bold text-rose-300 line-through">#1</div>
                  </div>
                  <div className="shrink-0 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-1.5 text-center min-w-[70px] opacity-60">
                    <div className="text-[12px] font-mono font-bold text-rose-300 line-through">#2</div>
                  </div>
                  <div className="shrink-0 bg-rose-500/10 border border-rose-500/40 rounded-lg px-3 py-1.5 text-center min-w-[70px] opacity-60">
                    <div className="text-[12px] font-mono font-bold text-rose-300 line-through">#3</div>
                  </div>
                  <span className="text-[12px] text-rose-300 font-bold ml-2">+ 사용자 강제 로그아웃 + 보안 알림</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[12px] font-mono font-bold px-2 py-0.5 rounded">정상 흐름</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                <li>클라이언트가 <code className="text-emerald-300">Refresh Token #1</code>로 갱신 요청</li>
                <li>서버 검증 OK → <code className="text-emerald-300">새 Access Token + Refresh Token #2</code> 발급</li>
                <li><code className="text-emerald-300">Refresh Token #1</code> 즉시 무효화 (DB에 used=true 표시)</li>
                <li>다음 갱신 때는 <code className="text-emerald-300">Refresh Token #2</code> 사용</li>
              </ol>
            </div>
            <div className="bg-slate-950 border border-rose-500/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-rose-500/20 text-rose-300 text-[12px] font-mono font-bold px-2 py-0.5 rounded">도난 감지 시나리오</span>
              </div>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                <li>공격자가 <code className="text-rose-300">Refresh Token #1</code>을 탈취했다고 가정</li>
                <li>정상 사용자가 먼저 갱신 → <code className="text-rose-300">Refresh Token #1</code> 무효화됨</li>
                <li>공격자가 뒤늦게 <code className="text-rose-300">Refresh Token #1</code>로 시도 → <strong className="text-rose-300">사용 흔적 발견!</strong></li>
                <li>서버가 <strong className="text-white">해당 사용자의 모든 Refresh Token 일괄 폐기</strong> + 알림</li>
              </ol>
            </div>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-200 mb-1 flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={14} />
              구현 시 핵심 포인트
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>· Refresh Token을 DB에 저장할 때는 <strong className="text-white">해시</strong>해서 보관 (SHA-256). 원본 보관 금지</li>
              <li>· 사용 이력(used_at, replaced_by)을 함께 기록해 도난 추적 가능하게</li>
              <li>· "이미 사용된 Refresh Token 재사용 시도" → 자동으로 해당 사용자 family 전체 폐기</li>
              <li>· 동시 요청(브라우저 탭 2개에서 갱신 동시 시도) 대비 grace period(~5초) 허용</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Threat vs Defense matrix */}
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl overflow-hidden">
        <div className="bg-rose-950/30 px-6 py-4 border-b border-rose-500/20 flex items-center gap-2">
          <ShieldCheck className="text-rose-400" size={18} />
          <h3 className="font-bold text-white text-base">보안 위협 ➜ 방어책 매핑</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-2 px-3 font-semibold">위협</th>
                  <th className="py-2 px-3 font-semibold">시나리오</th>
                  <th className="py-2 px-3 font-semibold">방어책</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">XSS</td>
                  <td className="py-2 px-3 text-slate-400">악성 스크립트가 JS로 토큰 읽기 시도</td>
                  <td className="py-2 px-3 text-slate-300">HttpOnly 쿠키 + 백엔드 세션 + CSP 헤더</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">CSRF</td>
                  <td className="py-2 px-3 text-slate-400">타 사이트가 사용자 쿠키 이용해 API 호출</td>
                  <td className="py-2 px-3 text-slate-300">SameSite=Lax/Strict + CSRF 토큰 + Origin 검증</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">Token 탈취</td>
                  <td className="py-2 px-3 text-slate-400">네트워크 또는 로그에서 토큰 유출</td>
                  <td className="py-2 px-3 text-slate-300">HTTPS 강제 + 짧은 Access Token 만료 + RTR 도난 감지</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">Replay</td>
                  <td className="py-2 px-3 text-slate-400">같은 토큰을 여러 번 재사용</td>
                  <td className="py-2 px-3 text-slate-300">jti claim + 일회용 검증 + 짧은 exp</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">JWT 위조</td>
                  <td className="py-2 px-3 text-slate-400">payload 변조 시도 (예: role=ADMIN)</td>
                  <td className="py-2 px-3 text-slate-300">RS256 서명 검증 + JWKS 공개키 회전</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-rose-300">Confused Deputy</td>
                  <td className="py-2 px-3 text-slate-400">A 포털 토큰으로 B 포털 API 호출 시도</td>
                  <td className="py-2 px-3 text-slate-300">aud claim 검증 + client_id별 scope 분리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Implementation checklist */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <Check className="text-indigo-400" size={18} />
          토큰 구현 체크리스트
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Access Token 만료 15분~1시간</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Refresh Token 만료 7~30일</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Refresh Token은 HttpOnly + Secure + SameSite 쿠키</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>localStorage에 어떤 토큰도 저장 금지</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Refresh Token 발급 시 RTR 활성화 (한 번 쓰면 회전)</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Refresh Token은 DB에 해시(SHA-256)로 저장</span></li>
          </ul>
          <ul className="space-y-1.5 text-xs text-slate-300">
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>JWT 검증 시 iss · aud · exp · nbf · signature 모두 확인</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>리소스 서버는 JWKS 캐싱(TTL 1시간) + 키 회전 대응</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>도난 감지 시 사용자 family 전체 Refresh Token 폐기 로직</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>토큰 payload에 비밀번호·개인정보 절대 금지</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>HTTPS 미사용 환경 운영 금지 (Secure 쿠키 전제)</span></li>
            <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>로그에 토큰 원본 절대 남기지 않기 (앞 8자만 마스킹)</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
