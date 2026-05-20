import React from 'react';
import {
  ShieldCheck, Network, Building2, Server,
  Boxes, Layers, Key, LogOut, BookOpen,
  ChevronRight, Activity, ArrowRightLeft, Code2, Copy
} from 'lucide-react';

export default function Overview({ setActiveTab, handleCopy }) {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 md:p-10 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[14px] font-mono font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded">SSO Integration Guide v1.0</span>
            <span className="text-[14px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded">OIDC · OAuth 2.1</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">디지털플랫폼 통합인증 서버 연동 개요</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
            K-water 인증 시스템에서 1차 인증을 거친 후, <strong className="text-white">디지털플랫폼 통합인증 서버</strong>를 매개로 <strong className="text-white">클라우드 관리 포털 (CMP)</strong>과 하위 포털(데이터허브 · 생성형 AI · SaaS)이 <strong className="text-indigo-300">단일 로그인 세션</strong>을 공유하도록 연동하는 표준 규격을 설명합니다.
          </p>
        </div>

        {/* Key stats */}
        <div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-indigo-300">4</div>
            <div className="text-[15px] text-slate-400 mt-1">클라이언트 포털 (CMP + 3 Sub)</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-emerald-300">17</div>
            <div className="text-[15px] text-slate-400 mt-1">시퀀스 단계 (4 Phase)</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-amber-300">15분</div>
            <div className="text-[15px] text-slate-400 mt-1">Access Token TTL</div>
          </div>
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <div className="text-3xl font-extrabold text-rose-300">RTR</div>
            <div className="text-[15px] text-slate-400 mt-1">Refresh Token 회전 + 도난 감지</div>
          </div>
        </div>
      </div>

      {/* Standards compliance */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase mb-3 flex items-center gap-2">
          <ShieldCheck className="text-indigo-400" size={16} />
          준수 표준 (Standards Compliance)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div className="bg-slate-950 border border-indigo-500/30 rounded-lg px-3 py-2.5 text-center">
            <div className="text-indigo-300 font-bold font-mono">OIDC Core 1.0</div>
            <div className="text-[14px] text-slate-500 mt-0.5">OpenID Connect</div>
          </div>
          <div className="bg-slate-950 border border-emerald-500/30 rounded-lg px-3 py-2.5 text-center">
            <div className="text-emerald-300 font-bold font-mono">OAuth 2.1</div>
            <div className="text-[14px] text-slate-500 mt-0.5">최신 보안 BCP 반영</div>
          </div>
          <div className="bg-slate-950 border border-purple-500/30 rounded-lg px-3 py-2.5 text-center">
            <div className="text-purple-300 font-bold font-mono">RFC 8417</div>
            <div className="text-[14px] text-slate-500 mt-0.5">Back-Channel Logout</div>
          </div>
          <div className="bg-slate-950 border border-amber-500/30 rounded-lg px-3 py-2.5 text-center">
            <div className="text-amber-300 font-bold font-mono">JWT · JWS · JWE</div>
            <div className="text-[14px] text-slate-500 mt-0.5">RFC 7519 / 7515 / 7516</div>
          </div>
        </div>
      </div>

      {/* Architecture preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Network size={18} className="text-indigo-400" />
            아키텍처 미리보기
          </h3>
          <button onClick={() => setActiveTab('multi-sso')} className="text-[15px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
            전체 다이어그램 보기 <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="shrink-0 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[14px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 1</div>
            <div className="flex-1 bg-slate-950 border border-sky-500/40 rounded-lg px-4 py-2.5 relative flex items-center justify-center gap-2">
              <Building2 size={16} className="text-sky-400" />
              <span className="text-sm text-white font-bold">K-water 통합 인증 시스템</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 font-mono">Upstream IdP</span>
            </div>
          </div>
          <div className="flex items-center justify-center text-slate-600 text-xs">↓ 암호화 페이로드 (JWE/SAML)</div>
          <div className="flex items-center gap-3">
            <div className="shrink-0 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[14px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 2</div>
            <div className="flex-1 bg-slate-950 border border-indigo-500/40 rounded-lg px-4 py-2.5 relative flex items-center justify-center gap-2">
              <Server size={16} className="text-indigo-400" />
              <span className="text-sm text-white font-bold">디지털플랫폼 통합인증 서버</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-emerald-400 font-mono">auth.kwater.com</span>
            </div>
          </div>
          <div className="flex items-center justify-center text-slate-600 text-xs">↓ Silent SSO · 포털별 토큰 발급</div>
          <div className="flex items-center gap-3">
            <div className="shrink-0 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[14px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 3</div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-slate-950 border border-indigo-500/30 rounded px-2 py-1.5 text-center">
                <div className="text-[15px] text-indigo-200">CMP</div>
                <div className="text-[13px] font-mono text-slate-500 mt-0.5">cmp.kwater.com</div>
              </div>
              <div className="bg-slate-950 border border-emerald-500/30 rounded px-2 py-1.5 text-center">
                <div className="text-[15px] text-emerald-200">데이터허브</div>
                <div className="text-[13px] font-mono text-slate-500 mt-0.5">datahub.kwater.com</div>
              </div>
              <div className="bg-slate-950 border border-purple-500/30 rounded px-2 py-1.5 text-center">
                <div className="text-[15px] text-purple-200">생성형 AI</div>
                <div className="text-[13px] font-mono text-slate-500 mt-0.5">genai.kwater.com</div>
              </div>
              <div className="bg-slate-950 border border-amber-500/30 rounded px-2 py-1.5 text-center">
                <div className="text-[15px] text-amber-200">SaaS</div>
                <div className="text-[13px] font-mono text-slate-500 mt-0.5">saas.kwater.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Three pillars */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase mb-3">세 가지 핵심 원칙</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border border-indigo-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center"><Layers className="text-indigo-300" size={16} /></div>
              <div className="text-indigo-300 font-bold">중앙 허브 SSO</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">K-water 1차 인증을 통합인증 서버 SSO 세션으로 한 번만 교환. 이후 모든 포털 진입은 자동 무중단 연동.</p>
          </div>
          <div className="bg-gradient-to-br from-purple-950/40 to-slate-950 border border-purple-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center"><Key className="text-purple-300" size={16} /></div>
              <div className="text-purple-300 font-bold">독립 인가 제어</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">포털별 <code className="text-purple-300">client_id</code>·scope·토큰 분리. 한 포털 토큰이 유출되어도 나머지는 안전, 감사 로그도 포털 단위.</p>
          </div>
          <div className="bg-gradient-to-br from-rose-950/40 to-slate-950 border border-rose-500/30 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center"><LogOut className="text-rose-300" size={16} /></div>
              <div className="text-rose-300 font-bold">전사 단일 로그아웃</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">임의 포털 로그아웃 → 중앙 SSO 쿠키 파기 + 백채널로 모든 포털 세션 일괄 종료. 상위 K-water SLO도 연계 가능.</p>
          </div>
        </div>
      </div>

      {/* Component table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Boxes className="text-indigo-400" size={18} />
            구성 요소 한눈에
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[15px] text-slate-500 uppercase">
                <th className="py-3 px-5 font-semibold">구성 요소</th>
                <th className="py-3 px-5 font-semibold">도메인</th>
                <th className="py-3 px-5 font-semibold">역할</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              <tr>
                <td className="py-3 px-5"><span className="bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded px-2 py-0.5 text-[14px] font-bold">UPSTREAM</span> <span className="text-white font-semibold ml-2">K-water 통합 인증 시스템</span></td>
                <td className="py-3 px-5"><code className="text-slate-400 font-mono">(별도)</code></td>
                <td className="py-3 px-5 text-slate-400">1차 사용자 인증 + 암호화 페이로드 발급</td>
              </tr>
              <tr>
                <td className="py-3 px-5"><span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-[14px] font-bold">IDP HUB</span> <span className="text-white font-semibold ml-2">디지털플랫폼 통합인증 서버</span></td>
                <td className="py-3 px-5"><code className="text-emerald-400 font-mono">auth.kwater.com</code></td>
                <td className="py-3 px-5 text-slate-400">SSO 세션 발급/관리 · 포털별 토큰 교환 · SLO 브로드캐스트</td>
              </tr>
              <tr>
                <td className="py-3 px-5"><span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-[14px] font-bold">MASTER</span> <span className="text-white font-semibold ml-2">클라우드 관리 포털 (CMP)</span></td>
                <td className="py-3 px-5"><code className="text-slate-400 font-mono">cmp.kwater.com</code></td>
                <td className="py-3 px-5 text-slate-400">K-water 페이로드 최초 수신 · 디지털플랫폼 진입점 · <strong className="text-indigo-300">전사 권한 신청·승인 허브</strong></td>
              </tr>
              <tr>
                <td className="py-3 px-5"><span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded px-2 py-0.5 text-[14px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">데이터허브 포털</span></td>
                <td className="py-3 px-5"><code className="text-slate-400 font-mono">datahub.kwater.com</code></td>
                <td className="py-3 px-5 text-slate-400">데이터셋·테이블 조회 · 데이터허브 전용 scope</td>
              </tr>
              <tr>
                <td className="py-3 px-5"><span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded px-2 py-0.5 text-[14px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">생성형 AI 포털</span></td>
                <td className="py-3 px-5"><code className="text-slate-400 font-mono">genai.kwater.com</code></td>
                <td className="py-3 px-5 text-slate-400">LLM 호출 · 토큰 사용량 관리</td>
              </tr>
              <tr>
                <td className="py-3 px-5"><span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded px-2 py-0.5 text-[14px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">SaaS 포털</span></td>
                <td className="py-3 px-5"><code className="text-slate-400 font-mono">saas.kwater.com</code></td>
                <td className="py-3 px-5 text-slate-400">SaaS 카탈로그 · 라이선스 관리</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Server Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Server size={18} className="text-indigo-400" />
            기본 서버 연동 정보
          </h3>
          <button onClick={() => handleCopy('https://auth.kwater.com/.well-known/openid-configuration', 'oidc-disc')} className="text-[15px] text-slate-400 hover:text-white flex items-center gap-1">
            <Copy size={11} /> Discovery URL 복사
          </button>
        </div>
        <div className="p-6 divide-y divide-slate-800/60">
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">Issuer (발행처)</span>
            <code className="text-xs bg-slate-950 text-emerald-400 px-3 py-1 rounded-md border border-slate-800">https://auth.kwater.com</code>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">Authorization Endpoint</span>
            <code className="text-xs bg-slate-950 text-indigo-300 px-3 py-1 rounded-md border border-slate-800">/oauth2/v1/authorize</code>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">Token Endpoint</span>
            <code className="text-xs bg-slate-950 text-indigo-300 px-3 py-1 rounded-md border border-slate-800">/oauth2/v1/token</code>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">JWKS URI (공개 키 경로)</span>
            <code className="text-xs bg-slate-950 text-indigo-300 px-3 py-1 rounded-md border border-slate-800">/.well-known/jwks.json</code>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">K-water 연동 (Payload)</span>
            <span className="text-xs bg-sky-500/10 text-sky-300 px-3 py-1 rounded-full border border-sky-500/20 font-mono">암호화 JWE / SAML Assertion</span>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">하위 포털 자동 연동</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20 font-mono">prompt=none (Silent Auth)</span>
          </div>
          <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-sm text-slate-400 font-medium">서명 알고리즘</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">RS256 · JWKS 자동 회전</span>
          </div>
        </div>
      </div>

      {/* Guide navigator */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-base mb-1 flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-400" />
          본 가이드에서 찾을 수 있는 내용
        </h3>
        <p className="text-xs text-slate-500 mb-4">왼쪽 메뉴를 따라가며 단계별로 학습하실 수 있습니다.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={() => setActiveTab('multi-sso')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <Layers size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">2. SSO 아키텍처</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">3계층 토폴로지 + Silent SSO 상세 동작</p>
          </button>
          <button onClick={() => setActiveTab('sequence')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <Activity size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">3. 데이터 흐름 시퀀스</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">17단계 · 4페이즈 시퀀스 다이어그램</p>
          </button>
          <button onClick={() => setActiveTab('flow')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRightLeft size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">4. 상세 연동 시뮬레이터</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">단계별 페이로드·브라우저 상태·사용자 시점</p>
          </button>
          <button onClick={() => setActiveTab('tokens')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <Key size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">5. 토큰 라이프사이클</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">JWT 분해 · RTR · 저장 위치 · 위협 매핑</p>
          </button>
          <button onClick={() => setActiveTab('logout')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <LogOut size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">6. 통합 로그아웃 (SLO)</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">하위 포털 + 상위 K-water 로그아웃 연계</p>
          </button>
          <button onClick={() => setActiveTab('code')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
            <div className="flex items-center gap-2 mb-1">
              <Code2 size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">구현 예제 코드</span>
              <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
            </div>
            <p className="text-[15px] text-slate-400">React Axios Interceptor + Spring Boot 3 · OAuth2 Resource Server</p>
          </button>
        </div>
      </div>
    </div>
  );
}
