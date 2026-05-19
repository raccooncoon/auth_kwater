import React from 'react';
import { Network, Building2, Server, Laptop, Database, Sparkles, Boxes, ArrowDown, Layers, Eye, Check } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

export default function MultiSso() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">통합 & 하위 포털 SSO 아키텍처</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          중앙 인증 허브 모델에서 세션이 어떻게 유지되고 포털 간 로그인 정보가 공유되는지 구조적으로 시각화합니다.
        </p>
      </div>

      {/* Architecture diagram — 3-tier hierarchy */}
      <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl space-y-3">
        <h3 className="text-md font-bold text-white flex items-center gap-2 mb-10">
          <Network className="text-indigo-400" size={18} />
          K-water ➜ 디지털플랫폼 SSO ➜ 하위 포털 3계층 토폴로지
        </h3>

        {/* Tier 1: K-water (Upstream IdP) */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md bg-gradient-to-br from-sky-950/80 to-slate-900 border-2 border-sky-500/60 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg shadow-sky-500/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[12px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase">Upstream IdP</div>
            <Building2 className="text-sky-400 my-2" size={36} />
            <h4 className="font-bold text-white text-base">K-water 통합 인증 시스템</h4>
            <span className="text-[13px] text-slate-400 mt-1">별도 상위 인증 도메인</span>
            <div className="w-full h-px bg-slate-800 my-3"></div>
            <p className="text-xs text-slate-400 leading-relaxed">1차 사용자 인증 후, 암호화 페이로드(JWE/SAML)로 사용자 정보를 디지털플랫폼에 전달합니다.</p>
          </div>
        </div>

        {/* Arrow 1 ↓ */}
        <div className="flex flex-col items-center gap-2 py-4">
          <ArrowDown className="text-sky-400" size={26} strokeWidth={2.5} />
          <span className="text-[13px] font-mono text-sky-200 bg-sky-950/90 border border-sky-500/40 px-3 py-1 rounded-full shadow-md">
            암호화 페이로드 전달 (kwater_enc_payload)
          </span>
        </div>

        {/* Tier 2: Digital Platform 통합인증 서버 (Hub) */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md bg-gradient-to-br from-indigo-950/80 to-slate-900 border-2 border-indigo-500 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl shadow-indigo-500/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[12px] px-3 py-0.5 rounded-full font-bold tracking-wider uppercase">SSO IdP Hub</div>
            <Server className="text-indigo-400 my-2" size={36} />
            <h4 className="font-bold text-white text-base">디지털플랫폼 통합인증 서버</h4>
            <span className="text-[13px] text-emerald-400 font-mono mt-1">auth.kwater.com</span>
            <div className="w-full h-px bg-slate-800 my-3"></div>
            <span className="text-[13px] text-indigo-300 font-bold bg-indigo-950/80 px-2.5 py-1 rounded border border-indigo-800">디지털플랫폼 SSO Session Cookie</span>
          </div>
        </div>

        {/* Arrow 2 ↓ */}
        <div className="flex flex-col items-center gap-2 py-4">
          <ArrowDown className="text-indigo-400" size={26} strokeWidth={2.5} />
          <span className="text-[13px] font-mono text-indigo-200 bg-indigo-950/90 border border-indigo-500/40 px-3 py-1 rounded-full shadow-md">
            Silent SSO (prompt=none) + OIDC 인가 코드 전파
          </span>
        </div>

        {/* Tier 3: 4 Client Portals (master + 3 sub) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-indigo-300 text-[12px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase border border-indigo-500/40 whitespace-nowrap">Master Client</div>
            <Laptop className="text-indigo-400 my-2" size={26} />
            <h4 className="font-bold text-white text-[13px]">클라우드 관리 포털 (CMP)</h4>
            <span className="text-[12px] text-slate-500 mt-1 font-mono">cmp.kwater.com</span>
            <div className="w-full h-px bg-slate-800 my-2.5"></div>
            <p className="text-[12px] text-slate-400 leading-relaxed">K-water 페이로드 복호화 결과로 최초 로그인을 완료합니다.</p>
          </div>

          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-emerald-300 text-[12px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase border border-emerald-500/40 whitespace-nowrap">Sub Client</div>
            <Database className="text-emerald-400 my-2" size={26} />
            <h4 className="font-bold text-white text-[13px]">데이터허브 포털</h4>
            <span className="text-[12px] text-slate-500 mt-1 font-mono">datahub.kwater.com</span>
            <div className="w-full h-px bg-slate-800 my-2.5"></div>
            <p className="text-[12px] text-slate-400 leading-relaxed">전용 client_id로 데이터허브 API 권한 토큰 발급</p>
          </div>

          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-purple-300 text-[12px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase border border-purple-500/40 whitespace-nowrap">Sub Client</div>
            <Sparkles className="text-purple-400 my-2" size={26} />
            <h4 className="font-bold text-white text-[13px]">생성형 AI 포털</h4>
            <span className="text-[12px] text-slate-500 mt-1 font-mono">genai.kwater.com</span>
            <div className="w-full h-px bg-slate-800 my-2.5"></div>
            <p className="text-[12px] text-slate-400 leading-relaxed">LLM/AI 서비스 전용 Scope 부여 및 무중단 로그인</p>
          </div>

          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 flex flex-col items-center text-center shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-amber-300 text-[12px] px-2.5 py-0.5 rounded-full font-bold tracking-wider uppercase border border-amber-500/40 whitespace-nowrap">Sub Client</div>
            <Boxes className="text-amber-400 my-2" size={26} />
            <h4 className="font-bold text-white text-[13px]">SaaS 포털</h4>
            <span className="text-[12px] text-slate-500 mt-1 font-mono">saas.kwater.com</span>
            <div className="w-full h-px bg-slate-800 my-2.5"></div>
            <p className="text-[12px] text-slate-400 leading-relaxed">SaaS 카탈로그 및 라이선스 관리용 토큰 자동 발급</p>
          </div>
        </div>

        {/* Master vs Sub Client 차이 설명 */}
        <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl mt-6 overflow-hidden">
          <div className="bg-indigo-950/40 px-5 py-4 border-b border-indigo-500/20 flex items-center gap-2">
            <Layers className="text-indigo-400" size={18} />
            <h4 className="font-bold text-white text-base">Master Client (CMP) vs Sub Client — 같은 OIDC, 다른 역할</h4>
          </div>
          <div className="p-6 space-y-5">
            <p className="text-sm text-slate-300 leading-relaxed">
              자주 묻는 질문: "<strong className="text-white">CMP만 K-water로 로그인하고 나머지는 Silent SSO 쓰는 거 아냐?</strong>" — 부분적으로만 맞습니다.
              <span className="text-indigo-300"> CMP도 Silent SSO를 씁니다.</span> 다만 "최초 K-water 인증 직후의 진입점"이라는 점에서만 다릅니다.
            </p>

            {/* 시점별 동작 표 */}
            <div>
              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[12px] font-mono px-2 py-0.5 rounded">WHEN</span>
                시점별 로그인 동작
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2 px-3 font-semibold">상황</th>
                      <th className="py-2 px-3 font-semibold text-indigo-300">CMP (Master)</th>
                      <th className="py-2 px-3 font-semibold text-emerald-300">서브 포털 (Sub)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">최초 K-water 인증 직후 진입</td>
                      <td className="py-2.5 px-3 text-slate-400">K-water 페이로드 → SSO 세션 생성 → CMP 토큰 발급 <span className="text-sky-300 font-mono text-[12px]">(Phase 1)</span></td>
                      <td className="py-2.5 px-3 text-slate-500 italic">해당 없음 — K-water 페이로드는 CMP 콜백으로만 옴</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">SSO 쿠키 있는 상태에서 새 탭/재방문</td>
                      <td className="py-2.5 px-3 text-indigo-300 font-semibold">✓ Silent SSO (prompt=none)</td>
                      <td className="py-2.5 px-3 text-emerald-300 font-semibold">✓ Silent SSO (prompt=none)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold">SSO 세션 만료 후 다시 진입</td>
                      <td className="py-2.5 px-3 text-slate-400">K-water 풀 플로우 재실행</td>
                      <td className="py-2.5 px-3 text-slate-400"><code className="text-rose-300">login_required</code> → CMP 경유해서 K-water로 폴백</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 진짜 차이 3가지 */}
            <div>
              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-300 text-[12px] font-mono px-2 py-0.5 rounded">DIFF</span>
                진짜 차이 — OIDC 메커니즘이 아니라 역할
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/60 border border-sky-500/30 rounded-xl p-3.5">
                  <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-sky-300 mb-1">① K-water 페이로드 진입점</div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">K-water는 RP 등록 시 CMP 콜백 URL(<code className="text-sky-300 text-[12px]">cmp.kwater.com/callback</code>) 하나만 받음. K-water 인증이 끝나면 <strong className="text-white">항상 CMP로 먼저 옴</strong>.</p>
                </div>
                <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-3.5">
                  <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-indigo-300 mb-1">② 마스터 포털 역할</div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">CMP는 사용자가 다른 포털로 갈지 선택하는 <strong className="text-white">허브 + 권한·리소스 관리 콘솔</strong>. 서브 포털은 특정 도메인 기능만 제공.</p>
                </div>
                <div className="bg-slate-950/60 border border-purple-500/30 rounded-xl p-3.5">
                  <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-purple-300 mb-1">③ Scope 범위</div>
                  <p className="text-[13px] text-slate-300 leading-relaxed">CMP는 <code className="text-purple-300 text-[12px]">admin:*</code> 등 관리자 scope 허용. 서브 포털은 자기 도메인 scope만 (<code className="text-purple-300 text-[12px]">datahub:read</code> 등) — IdP가 client_id별로 제한.</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">정리:</strong> "Master Client"라는 이름은 <strong className="text-indigo-300">K-water 페이로드를 처음 받는 진입점</strong>이라는 뜻이지, Silent SSO를 안 쓴다는 의미가 아닙니다. OIDC 클라이언트로서는 두 종류 포털이 같은 메커니즘을 공유하며, 차이는 <em className="text-slate-200">"K-water와 직접 통신하느냐"</em> + <em className="text-slate-200">"역할/scope"</em>뿐입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Silent Authentication — Deep Dive */}
        <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl mt-6 overflow-hidden">
          <div className="bg-indigo-950/40 px-5 py-4 border-b border-indigo-500/20 flex items-center gap-2">
            <Eye className="text-indigo-400" size={18} />
            <h4 className="font-bold text-white text-base">Silent SSO 상세 동작 원리 (<code className="text-indigo-300 font-mono text-sm">prompt=none</code> 흐름)</h4>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-300 leading-relaxed">
              "한 번 로그인하면 다른 포털을 열어도 로그인 화면이 안 뜬다"의 핵심 메커니즘입니다. 사용자에게 어떤 UI도 노출하지 않은 채 브라우저 백그라운드에서 인가 코드를 받아오는 OIDC 표준 흐름입니다.
            </p>

            {/* 5-Step Flow */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 text-[12px] font-mono px-2 py-0.5 rounded">FLOW</span>
                무중단 인증 5단계
              </h5>
              <ol className="space-y-3 text-sm text-slate-300">
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">1</span>
                  <div>
                    <strong className="text-white">세션 분리 인식</strong> — 사용자가 데이터허브(<code className="text-indigo-300 text-xs">datahub.kwater.com</code>)에 접근. 데이터허브 프론트는 자기 포털 안에 토큰이 없음을 감지합니다. (각 포털은 <code className="text-indigo-300 text-xs">client_id</code>별로 토큰을 따로 관리)
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">2</span>
                  <div>
                    <strong className="text-white">백그라운드 인가 요청</strong> — 로그인 UI 대신 IdP <code className="text-indigo-300 text-xs">/authorize</code>로 조용히 리다이렉트. <code className="text-indigo-300 text-xs">prompt=none</code> 파라미터가 핵심.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">3</span>
                  <div>
                    <strong className="text-white">쿠키 자동 전송</strong> — 브라우저가 <code className="text-indigo-300 text-xs">auth.kwater.com</code> 도메인으로 요청하므로 Phase 1에서 발급된 <code className="text-indigo-300 text-xs">dp_sso_session</code> HttpOnly 쿠키가 자동 동봉됩니다.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">4</span>
                  <div>
                    <strong className="text-white">IdP의 무중단 판단</strong> — 쿠키 유효 시 즉시 인가 코드 발급 후 <code className="text-indigo-300 text-xs">datahub.kwater.com/callback?code=...&state=...</code>로 302 리다이렉트. 사용자는 로그인 페이지를 본 적이 없음.
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center">5</span>
                  <div>
                    <strong className="text-white">토큰 발급</strong> — 데이터허브 백엔드가 그 코드를 백채널로 토큰 엔드포인트와 교환하여 데이터허브 전용 Access Token + Refresh Token 획득.
                  </div>
                </li>
              </ol>
            </div>

            {/* Request example */}
            <div>
              <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[12px] font-mono px-2 py-0.5 rounded">REQUEST</span>
                Silent Authorize 요청 예시
              </h5>
              <CodeBlock language="http" code={`GET /oauth2/v1/authorize?response_type=code
    &client_id=datahub-portal-id
    &redirect_uri=https://datahub.kwater.com/callback
    &scope=openid profile datahub:read
    &state=sub_random_state_4410
    &prompt=none HTTP/1.1
Host: auth.kwater.com
Accept: text/html

# prompt=none — 사용자에게 UI를 띄우지 말고 백그라운드로만 인증 시도`} />
            </div>

            {/* prompt=none semantics */}
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4">
              <h5 className="text-sm font-bold text-white mb-2"><code className="text-indigo-300 font-mono">prompt=none</code>이 부여하는 의미</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                OIDC 스펙상 이 파라미터가 있으면 IdP는 사용자에게 어떤 UI도 보이지 않아야 합니다. 따라서 쿠키 유효 + 동의된 scope이면 성공, 그렇지 않으면 HTML 로그인 페이지가 아닌 <strong className="text-rose-300">에러 응답</strong>이 콜백 URL의 쿼리로 돌아옵니다.
              </p>
            </div>

            {/* Error codes table */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="bg-rose-500/20 text-rose-300 text-[12px] font-mono px-2 py-0.5 rounded">ERROR</span>
                실패 시 응답 (Error Codes)
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500">
                      <th className="py-2 px-3 font-semibold">error 코드</th>
                      <th className="py-2 px-3 font-semibold">의미</th>
                      <th className="py-2 px-3 font-semibold">대응</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-300">login_required</td>
                      <td className="py-2 px-3 text-slate-400">SSO 세션 없음/만료</td>
                      <td className="py-2 px-3 text-slate-400">일반 로그인 흐름(<code className="text-slate-300">prompt</code> 없음)으로 폴백</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-300">interaction_required</td>
                      <td className="py-2 px-3 text-slate-400">사용자 동작 필요</td>
                      <td className="py-2 px-3 text-slate-400">일반 흐름으로 폴백</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-300">consent_required</td>
                      <td className="py-2 px-3 text-slate-400">새 scope에 대한 동의 필요</td>
                      <td className="py-2 px-3 text-slate-400">동의 화면 거치는 흐름으로 폴백</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-rose-300">account_selection_required</td>
                      <td className="py-2 px-3 text-slate-400">다중 계정 중 선택 필요</td>
                      <td className="py-2 px-3 text-slate-400">계정 선택 화면 노출</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Implementation patterns */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-300 text-[12px] font-mono px-2 py-0.5 rounded">PATTERN</span>
                구현 패턴 두 가지
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">(A) Top-level redirect</span>
                    <span className="text-[12px] text-emerald-400 font-semibold">권장</span>
                  </div>
                  <div className="mb-2"><CodeBlock language="javascript" fontSize="0.72rem" code={`window.location.href =
  'https://auth.kwater.com/oauth2/v1/authorize?...&prompt=none'`} /></div>
                  <p className="text-[13px] text-slate-400 leading-relaxed">짧은 깜빡임은 있지만 안전. 가이드의 React 예제(구현 예제 코드 탭)가 이 방식입니다.</p>
                </div>
                <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">(B) Hidden iframe</span>
                  </div>
                  <div className="mb-2"><CodeBlock language="markup" fontSize="0.72rem" code={`<iframe src=
  'https://auth.kwater.com/oauth2/v1/authorize?...&prompt=none' />`} /></div>
                  <p className="text-[13px] text-slate-400 leading-relaxed">깜빡임 없음. 단, IdP가 <code className="text-amber-300">frame-ancestors</code> 화이트리스트에 sub-portal 도메인을 허용해야 함. <code className="text-amber-300">postMessage</code>로 부모 윈도우에 code 전달.</p>
                </div>
              </div>
            </div>

            {/* Security checklist */}
            <div>
              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <span className="bg-rose-500/20 text-rose-300 text-[12px] font-mono px-2 py-0.5 rounded">SECURITY</span>
                보안 체크리스트
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex gap-2">
                  <Check className="shrink-0 text-emerald-400 mt-0.5" size={14} />
                  <span><strong className="text-white">state 필수</strong> — CSRF 방지. sessionStorage 저장값과 콜백 시 동일해야 함 (시퀀스 Step 6 · 시뮬레이터 Step 4의 <code className="text-indigo-300">sub_random_state_4410</code>이 예시)</span>
                </li>
                <li className="flex gap-2">
                  <Check className="shrink-0 text-emerald-400 mt-0.5" size={14} />
                  <span><strong className="text-white">PKCE</strong> — 공용 클라이언트(BFF가 아닌 순수 SPA)인 경우 <code className="text-indigo-300">code_challenge</code> / <code className="text-indigo-300">code_verifier</code> 권장</span>
                </li>
                <li className="flex gap-2">
                  <Check className="shrink-0 text-emerald-400 mt-0.5" size={14} />
                  <span><strong className="text-white">Session Fixation 방어</strong> — IdP가 로그인 직후 세션 ID 재발급</span>
                </li>
                <li className="flex gap-2">
                  <Check className="shrink-0 text-emerald-400 mt-0.5" size={14} />
                  <span><strong className="text-white">state 일회성 사용</strong> — 콜백에서 검증 후 즉시 폐기, 재사용 차단</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
