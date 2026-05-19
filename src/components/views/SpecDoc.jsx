import React from 'react';
import {
  FileText, Target, ListChecks, ShieldCheck, Database, Layers,
  Activity, AlertTriangle, Check, X, GitBranch, Lock, Download
} from 'lucide-react';
import { SPEC_DOC_MARKDOWN } from '../../data/specDocMarkdown';
import { openPdfPreview } from '../../utils/mdToHtml';

function handleDownloadPdf() {
  openPdfPreview(SPEC_DOC_MARKDOWN, {
    title: '디지털플랫폼 통합인증 서버 — 구축 요구사항 & 스펙 v1.0',
  });
}

export default function SpecDoc() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl p-8 md:p-10 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[12px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded">Build Spec · v1.0</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">디지털플랫폼 통합인증 서버 — 구축 요구사항 & 스펙</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl mb-5">
            본 문서는 <strong className="text-white">디지털플랫폼 통합인증 서버(IdP)를 구축</strong>하기 위한 요구사항 정의서·시스템 스펙 핵심 항목을 정리한 문서입니다.
          </p>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-5 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition"
          >
            <Download size={16} />
            <span>요구사항 정의서 PDF 다운로드</span>
          </button>
          <p className="text-[12px] text-slate-500 mt-2.5">
            · 이 문서만으로 분석·설계·개발이 가능한 자체 완결 문서 (ERD/DDL · API 명세 · 시험 계획 포함)
            <br />
            · 버튼 클릭 시 인쇄 미리보기 창이 열립니다 → 대상 프린터에서 <strong className="text-slate-400">"PDF로 저장"</strong>을 선택해주세요
          </p>
        </div>
      </div>

      {/* SECTION 1 — 프로젝트 개요 */}
      <Section icon={Target} title="1. 프로젝트 개요" subtitle="목표와 범위">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card title="목표" accent="indigo">
            K-water 신원 기반 SSO로 <strong className="text-white">CMP + 3개 하위 포털</strong>이 단일 로그인 세션을 공유하도록 OIDC 표준 IdP를 구축한다.
          </Card>
          <Card title="기대 효과" accent="emerald">
            ① 사용자 계정 관리 단일화(K-water 마스터 활용) · ② 신규 포털 온보딩 단축 · ③ 통합 감사 로그 확보
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <ScopeCard inScope title="사업 범위 (In Scope)" items={[
            "OIDC Authorization Code Flow + PKCE",
            "Silent SSO (prompt=none)",
            "Refresh Token Rotation",
            "Back-Channel Single Logout",
            "K-water 페이로드 수신 + SSO 세션 발급",
            "4개 클라이언트 등록 (CMP/데이터허브/생성형 AI/SaaS)",
          ]} />
          <ScopeCard inScope={false} title="범위 제외 (Out of Scope)" items={[
            "자체 회원가입/비밀번호 관리 (K-water 영역)",
            "MFA · OTP (K-water 영역)",
            "포털별 권한(Role) 관리 (각 포털 자체 관리)",
            "사용자 프로필 편집 UI",
          ]} />
        </div>
      </Section>

      {/* SECTION 2 — 기능 요구사항 */}
      <Section icon={ListChecks} title="2. 기능 요구사항 (Functional Requirements)" subtitle="FR-1 ~ FR-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider w-20">ID</th>
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider">기능</th>
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider">요구 내용</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <FrRow id="FR-1" name="사용자 인증" desc="K-water 페이로드 수신 → 복호화·검증 → SSO 세션 쿠키(HttpOnly·Secure·SameSite=Lax) 발급" />
              <FrRow id="FR-2" name="인가 코드 발급" desc="/authorize · PKCE 필수 · state 검증 · prompt=none 지원 · redirect_uri 화이트리스트 매칭" />
              <FrRow id="FR-3" name="토큰 발급" desc="/token · Access Token + Refresh Token + ID Token 발급 · client_secret 검증" />
              <FrRow id="FR-4" name="토큰 갱신 (RTR)" desc="기존 RT 즉시 폐기 후 새 토큰 발급 · 재사용 감지 시 chain 전체 폐기" />
              <FrRow id="FR-5" name="단일 로그아웃 (SLO)" desc="SSO 쿠키 만료 + 등록된 모든 client의 backchannel_logout_uri로 logout_token 푸시" />
              <FrRow id="FR-6" name="UserInfo · JWKS · Discovery" desc="/userinfo · /.well-known/jwks.json · /.well-known/openid-configuration 제공" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* SECTION 3 — 비기능 요구사항 */}
      <Section icon={Activity} title="3. 비기능 요구사항 (Non-Functional Requirements)" subtitle="성능 · 가용성 · 보안 · 운영">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider w-20">ID</th>
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider w-32">항목</th>
                <th className="py-3 px-4 font-semibold text-[12px] uppercase tracking-wider">요구 수준</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <NfrRow id="NFR-1" name="가용성" target="월 99.5% 이상 (월 다운타임 ≤ 3.6h)" />
              <NfrRow id="NFR-2" name="응답 성능" target="평균 응답 시간 ≤ 300ms (/token · /authorize 기준)" />
              <NfrRow id="NFR-3" name="처리량" target="동시 1,000 사용자 / 초당 100 토큰 발급 처리" />
              <NfrRow id="NFR-4" name="보안" target="TLS 1.2 이상, JWT RS256 서명, 토큰 키 연 1회 로테이션" />
              <NfrRow id="NFR-5" name="감사 로그" target="로그인·토큰·로그아웃 이벤트 보관 (사업자 보관 정책 준수)" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* SECTION 4 — 표준 준수 */}
      <Section icon={ShieldCheck} title="4. 준수 표준" subtitle="핵심 OIDC · OAuth · RFC">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StdCard std="OIDC Core 1.0" desc="Authorization Code Flow · ID Token · Discovery · UserInfo" />
          <StdCard std="OAuth 2.1" desc="Confidential Client · redirect_uri 엄격 매칭 · Implicit Flow 금지" />
          <StdCard std="RFC 7636 (PKCE)" desc="code_challenge_method=S256 필수" />
          <StdCard std="RFC 7519 (JWT) · RFC 7515 (JWS)" desc="Access/ID Token · RS256 서명" />
          <StdCard std="OIDC Back-Channel Logout 1.0 · RFC 8417" desc="logout_token 발송 · 검증 프로토콜" />
        </div>
      </Section>

      {/* SECTION 5 — 시스템 아키텍처 */}
      <Section icon={Layers} title="5. 시스템 구성" subtitle="3-tier 구조">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ArchBox color="sky" title="Web Tier" items={["L4/L7 로드밸런서", "TLS Termination"]} />
            <ArchBox color="indigo" title="Application Tier" items={["/authorize · /token", "/userinfo · /logout", "/.well-known/*", "Stateless (수평 확장)"]} />
            <ArchBox color="emerald" title="Data Tier" items={["RDBMS (Clients · Users · RT)", "Redis (Session · Auth Code)", "암호화 키 저장소"]} />
          </div>
          <div className="mt-4 text-[13px] text-slate-400 leading-relaxed">
            외부 인터페이스: <strong className="text-white">K-water 인증 시스템</strong>(상위 IdP) · <strong className="text-white">4개 포털 백엔드</strong>(RP) · <strong className="text-white">암호화 키 저장소</strong>(KMS 또는 OS 키 스토어)
          </div>
        </div>
      </Section>

      {/* SECTION 6 — 데이터 모델 */}
      <Section icon={Database} title="6. 데이터 모델" subtitle="핵심 테이블 5종">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DbTable name="clients" desc="RP(포털) 등록 정보" rows={[
            ["client_id", "PK"],
            ["client_secret_hash", "암호 해시"],
            ["redirect_uris", "화이트리스트"],
            ["backchannel_logout_uri", "SLO 콜백"],
            ["allowed_scopes", "허용 scope"],
          ]} />
          <DbTable name="users" desc="K-water 사용자 매핑" rows={[
            ["sub", "PK"],
            ["kwater_user_id", "K-water 사용자 ID"],
            ["display_name · email", "암호화 저장"],
            ["last_login_at", "최근 로그인"],
            ["status", "active / suspended"],
          ]} />
          <DbTable name="sso_sessions" desc="Redis · TTL 8h" rows={[
            ["session_id", "Key"],
            ["sub", "사용자"],
            ["expires_at · last_activity", "만료/sliding"],
            ["associated_clients[]", "SLO 대상"],
          ]} />
          <DbTable name="authorization_codes" desc="Redis · TTL 10min · 1회용" rows={[
            ["code", "Key"],
            ["client_id · sub", "발급 대상"],
            ["redirect_uri · code_challenge", "검증용"],
            ["scope · nonce", "토큰 발급 시 반영"],
          ]} />
          <DbTable name="refresh_tokens" desc="RTR chain 추적" rows={[
            ["jti", "PK"],
            ["chain_id · parent_jti", "RTR 추적"],
            ["client_id · sub", "발급 대상"],
            ["status", "active/rotated/revoked"],
            ["expires_at", "만료"],
          ]} />
          <DbTable name="audit_logs" desc="감사 이벤트" rows={[
            ["event_type", "login/token/logout/error"],
            ["client_id · sub", "주체"],
            ["ip · user_agent", "요청 정보"],
            ["result · error_code", "결과"],
            ["created_at", "타임스탬프"],
          ]} />
        </div>
      </Section>

      {/* SECTION 7 — 보안 요구사항 */}
      <Section icon={Lock} title="7. 보안 요구사항" subtitle="암호화 · 키 관리 · 통신">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SecCard title="암호화 · 서명">
            <ul className="text-[13px] text-slate-300 space-y-1.5">
              <li>· JWT 서명: <code className="text-emerald-300">RS256</code></li>
              <li>· K-water 페이로드: <code className="text-emerald-300">JWE A256GCM + RSA-OAEP</code></li>
              <li>· DB 개인정보: <code className="text-emerald-300">AES-256</code> 컬럼 암호화</li>
              <li>· 통신: <code className="text-emerald-300">TLS 1.2 이상</code>, HTTPS 강제</li>
            </ul>
          </SecCard>
          <SecCard title="공격 방어">
            <ul className="text-[13px] text-slate-300 space-y-1.5">
              <li>· CSRF: <code className="text-emerald-300">state</code> 파라미터 검증</li>
              <li>· XSS: HttpOnly 쿠키 + CSP 헤더</li>
              <li>· 토큰 도난: 짧은 AT TTL(15분) + RTR + 재사용 탐지</li>
              <li>· redirect_uri 엄격 화이트리스트 (와일드카드 금지)</li>
            </ul>
          </SecCard>
        </div>
      </Section>

      {/* SECTION 8 — 개발 Phase */}
      <Section icon={GitBranch} title="8. 개발 마일스톤" subtitle="단계별 구축 계획">
        <div className="space-y-3">
          <PhaseCard phase="Phase 1" weeks="W1~W4" name="MVP — CMP 단일 로그인" deliverables={[
            "K-water 페이로드 수신 + SSO 세션 발급",
            "Authorization Code Flow + PKCE",
            "Access Token / ID Token 발급",
            "JWKS · Discovery 엔드포인트",
          ]} color="indigo" />
          <PhaseCard phase="Phase 2" weeks="W5~W6" name="Silent SSO + 하위 포털 연동" deliverables={[
            "prompt=none 지원",
            "3개 하위 포털 client 등록",
            "포털별 scope 분리 검증",
          ]} color="purple" />
          <PhaseCard phase="Phase 3" weeks="W7~W8" name="Refresh Token Rotation" deliverables={[
            "RT 발급 + 갱신 + RTR chain 관리",
            "RT 재사용 탐지 → chain 폐기",
          ]} color="emerald" />
          <PhaseCard phase="Phase 4" weeks="W9~W10" name="Single Logout" deliverables={[
            "/logout + SSO 쿠키 만료",
            "logout_token 발송 (RFC 8417)",
            "재시도 큐 + 멱등성 보장 (jti)",
          ]} color="amber" />
          <PhaseCard phase="Phase 5" weeks="W11~W12" name="안정화 & 인수 준비" deliverables={[
            "K-water Upstream SLO 수신",
            "감사 로그 + 모니터링",
            "Mock K-water 어댑터 기반 부하 테스트 (운영 K-water 무영향)",
            "인수 시험 (UAT)",
          ]} color="rose" />
        </div>
      </Section>

      {/* SECTION 9 — 시험 환경 & K-water Mock 어댑터 */}
      <Section icon={ShieldCheck} title="9. 시험 환경 (중요)" subtitle="K-water 운영계 무영향 원칙">
        <div className="bg-rose-500/5 border border-rose-500/30 rounded-2xl p-5 mb-4 flex items-start gap-3">
          <AlertTriangle className="shrink-0 text-rose-400 mt-0.5" size={18} />
          <div className="text-[13px] text-slate-300 leading-relaxed">
            <strong className="text-rose-200">K-water 운영 시스템은 어떠한 시험 트래픽도 받아서는 안 됩니다.</strong> 부하 테스트는 IdP가 소유한 엔드포인트에 한정하며, K-water 페이로드 수신부는 <strong className="text-white">Mock 어댑터</strong>로 대체합니다.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SecCard title="Mock K-water 어댑터 (개발·시험 환경 전용)">
            <ul className="text-[13px] text-slate-300 space-y-1.5">
              <li>· K-water와 동일한 JWE 페이로드 발급 (테스트 키 사용)</li>
              <li>· 사전 정의된 N명의 가상 사용자 풀 (예: kwater_test_user_0001 ~ 1000)</li>
              <li>· <strong className="text-white">운영 K-water와 네트워크 격리</strong> — DNS는 사내 VIP/Hosts로 분리</li>
              <li>· 실 K-water Upstream SLO 수신은 <strong className="text-white">시험 발송기</strong>로 시뮬레이션</li>
            </ul>
          </SecCard>
          <SecCard title="부하 테스트 시나리오 (IdP 자체)">
            <ul className="text-[13px] text-slate-300 space-y-1.5">
              <li>· <strong className="text-white">사전 준비</strong>: Redis에 N개 SSO 세션 직접 주입 (Mock 어댑터로 사전 로그인)</li>
              <li>· <strong className="text-white">측정 대상</strong>: /authorize · /token · /userinfo · /logout · 백채널 푸시</li>
              <li>· <strong className="text-white">측정 제외</strong>: /oauth2/kwater/callback (Mock로 대체)</li>
              <li>· 도구: k6 / Apache JMeter / Locust 등</li>
              <li>· 합격: 평균 ≤ 300ms · 에러율 ≤ 0.1%</li>
            </ul>
          </SecCard>
        </div>
      </Section>

      {/* SECTION 10 — 표준 SI 산출물 */}
      <Section icon={FileText} title="10. 산출물" subtitle="SI 표준 산출물">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-2 px-3 font-semibold text-[12px] uppercase tracking-wider w-32">단계</th>
                <th className="py-2 px-3 font-semibold text-[12px] uppercase tracking-wider">산출물</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <DelvRow stage="분석" items="요구사항 정의서 · 인터페이스 정의서 (K-water · 포털)" />
              <DelvRow stage="설계" items="시스템 아키텍처 설계서 · DB 설계서 (ERD) · API 설계서 (OpenAPI)" />
              <DelvRow stage="개발" items="소스코드 · 형상 관리 (Git) · 단위 시험 결과서" />
              <DelvRow stage="시험" items="통합 시험 계획서 · 통합 시험 결과서 · 부하 시험 결과서" />
              <DelvRow stage="이관" items="설치/배포 매뉴얼 · 운영 매뉴얼 · 장애 대응 매뉴얼" />
              <DelvRow stage="인수" items="인수 확인서 · 최종 보고서" />
            </tbody>
          </table>
        </div>
      </Section>

      {/* 마무리 */}
      <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="shrink-0 text-amber-400 mt-0.5" size={18} />
        <div className="text-[13px] text-slate-300 leading-relaxed">
          본 문서는 사업 진행 시 실제 요구사항 정의서·제안 요청서(RFP)와 발주처 표준 양식에 맞춰 재구성합니다. 표준 산출물 외 추가 산출물(보안 검토서·개인정보 영향평가 등)은 발주처 요구에 따라 별도 작성합니다.
        </div>
      </div>
    </div>
  );
}

/* ========== Helpers ========== */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <Icon className="text-indigo-400 shrink-0" size={22} />
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Card({ title, accent, children }) {
  const colorMap = {
    indigo: 'border-indigo-500/30 bg-indigo-500/5',
    emerald: 'border-emerald-500/30 bg-emerald-500/5',
  };
  return (
    <div className={`rounded-xl border ${colorMap[accent]} p-5`}>
      <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">{title}</h4>
      <p className="text-[13px] text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

function ScopeCard({ inScope, title, items }) {
  const Icon = inScope ? Check : X;
  const iconColor = inScope ? 'text-emerald-400' : 'text-rose-400';
  const borderColor = inScope ? 'border-emerald-500/30' : 'border-rose-500/30';
  return (
    <div className={`rounded-xl border ${borderColor} bg-slate-900 p-5`}>
      <h4 className="text-sm font-bold text-white mb-3">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-[13px] text-slate-300 items-start">
            <Icon className={`shrink-0 ${iconColor} mt-0.5`} size={14} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FrRow({ id, name, desc }) {
  return (
    <tr className="hover:bg-slate-900/40">
      <td className="py-3 px-4 font-mono text-emerald-300 text-[12px] font-bold align-top">{id}</td>
      <td className="py-3 px-4 text-white font-semibold align-top">{name}</td>
      <td className="py-3 px-4 text-[13px] text-slate-300 leading-relaxed">{desc}</td>
    </tr>
  );
}

function NfrRow({ id, name, target }) {
  return (
    <tr className="hover:bg-slate-900/40">
      <td className="py-3 px-4 font-mono text-emerald-300 text-[12px] font-bold align-top">{id}</td>
      <td className="py-3 px-4 text-white font-semibold align-top">{name}</td>
      <td className="py-3 px-4 text-[13px] text-slate-300 leading-relaxed">{target}</td>
    </tr>
  );
}

function StdCard({ std, desc }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="font-mono text-sm font-bold text-emerald-300 mb-1.5">{std}</div>
      <div className="text-[13px] text-slate-400 leading-relaxed">{desc}</div>
    </div>
  );
}

function ArchBox({ color, title, items }) {
  const colorMap = {
    sky: 'border-sky-500/40 bg-sky-500/5',
    indigo: 'border-indigo-500/40 bg-indigo-500/5',
    emerald: 'border-emerald-500/40 bg-emerald-500/5',
  };
  return (
    <div className={`rounded-xl border ${colorMap[color]} p-4`}>
      <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
      <ul className="space-y-1 text-[12px] font-mono text-slate-300">
        {items.map((item, i) => <li key={i}>· {item}</li>)}
      </ul>
    </div>
  );
}

function DbTable({ name, desc, rows }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800">
        <div className="font-mono text-sm font-bold text-emerald-300">{name}</div>
        <div className="text-[12px] text-slate-500 mt-0.5">{desc}</div>
      </div>
      <table className="w-full text-left text-[12px] font-mono">
        <tbody>
          {rows.map(([col, type], i) => (
            <tr key={i} className="border-t border-slate-800/60">
              <td className="py-1.5 px-4 text-indigo-300 align-top w-1/2">{col}</td>
              <td className="py-1.5 px-4 text-slate-400">{type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecCard({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <Lock className="text-emerald-400" size={14} />
        {title}
      </h4>
      {children}
    </div>
  );
}

function PhaseCard({ phase, weeks, name, deliverables, color }) {
  const colorMap = {
    indigo: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-300',
  };
  return (
    <div className={`rounded-xl border ${colorMap[color]} p-5`}>
      <div className="flex flex-wrap items-baseline gap-3 mb-2">
        <span className="text-[12px] font-mono font-bold uppercase tracking-widest">{phase}</span>
        <span className="text-[12px] font-mono text-slate-500">{weeks}</span>
        <h4 className="text-base font-bold text-white">{name}</h4>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 mt-2">
        {deliverables.map((d, i) => (
          <li key={i} className="text-[13px] text-slate-300 flex gap-2 items-start">
            <Check className="shrink-0 text-emerald-400 mt-0.5" size={13} />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DelvRow({ stage, items }) {
  return (
    <tr className="hover:bg-slate-900/40">
      <td className="py-2.5 px-3 align-top">
        <span className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded">{stage}</span>
      </td>
      <td className="py-2.5 px-3 text-[13px] text-slate-300 leading-relaxed">{items}</td>
    </tr>
  );
}
