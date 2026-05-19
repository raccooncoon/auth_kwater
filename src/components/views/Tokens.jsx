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
