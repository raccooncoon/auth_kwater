import React from 'react';
import {
  Scale, AlertTriangle, Check, X, ShieldCheck, Zap, Lock, Eye,
  Network, AlertOctagon, Lightbulb, Users, Database, GitBranch, FileWarning, MessageSquare
} from 'lucide-react';

export default function Comparison() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 rounded-3xl p-8 md:p-10 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[16px] font-mono font-bold uppercase tracking-widest bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded">왜 별도 IdP가 필요한가</span>
            <span className="text-[16px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded">설득 근거 자료</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">디지털플랫폼 통합인증 서버 구축 필요성 — 구조적 분리 근거</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
            <strong className="text-emerald-200">OASIS는 K-water가 기존부터 운영해 온 시스템</strong>으로 그 자체로는 안정적으로 작동하고 있습니다. 본 페이지는 OASIS의 결함을 지적하는 것이 아니라, <strong className="text-white">디지털플랫폼 사업 안에서 클라우드(CMP)가 디지털플랫폼 통합인증 서버를 별도로 구축하지 않고 OASIS 인증값을 그대로 다른 포털(데이터허브·생성형 AI·SaaS)에 넘기는 현재 가이드 구조</strong>의 구조적 문제와, <strong className="text-indigo-300">디지털플랫폼이 자체 통합인증 서버를 갖춰야 하는 이유</strong>를 정리한 자료입니다.
          </p>
        </div>
      </div>

      {/* SECTION 1 — 두 사업의 영역 차이 */}
      <Section icon={FileWarning} title="1. 두 사업의 영역 차이" subtitle="OASIS는 K-water 기존 운영 시스템 · 디지털플랫폼은 4개 포털(클라우드·데이터허브·생성형 AI·SaaS)로 구성된 신규 사업">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider">OASIS — K-water 기존 운영 시스템</h4>
            <ul className="space-y-1.5 text-[17px] text-slate-300">
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water Fasoo SSO 페이로드 복호화</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water 사내 사용자 토큰 발급</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water 사용자 마스터 조회 (<code className="text-[17px] text-emerald-300">/api/member</code>)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water 사내 알림 발송 (카카오)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water 사내 결재 워크플로 (<code className="text-[17px] text-emerald-300">/api/approval</code>)</span></li>
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[15px] text-slate-400 leading-relaxed">→ <strong className="text-emerald-300">K-water 사내 시스템으로 운영 중</strong></div>
          </div>
          <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wider">디지털플랫폼 — 신규 사업의 4개 포털</h4>
            <ul className="space-y-1.5 text-[17px] text-slate-300">
              <li className="flex gap-2"><Check className="shrink-0 text-indigo-400 mt-0.5" size={14} /><span><strong className="text-white">클라우드(CMP)</strong> — 디지털플랫폼 진입점·메인 포털</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-indigo-400 mt-0.5" size={14} /><span>데이터허브 포털</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-indigo-400 mt-0.5" size={14} /><span>생성형 AI 포털</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-indigo-400 mt-0.5" size={14} /><span>SaaS 포털</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-indigo-400 mt-0.5" size={14} /><span>포털별 권한·스코프·감사 분리 운영 필요</span></li>
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-800 text-[15px] text-slate-400 leading-relaxed">→ <strong className="text-indigo-300">자체 인증 책임을 갖는 별도 사업</strong></div>
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/30 rounded-xl p-5 mt-4">
          <h4 className="text-base font-bold text-rose-200 mb-3 flex items-center gap-2">
            <AlertOctagon size={18} className="text-rose-400" />
            현재 가이드의 문제 — 디지털플랫폼 통합인증 서버 부재
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-rose-500/30 rounded-lg p-4">
              <div className="text-[13px] font-mono font-bold uppercase tracking-wider text-rose-300 mb-2">현재 가이드 구조</div>
              <pre className="text-[15px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{`K-water Fasoo SSO
       ↓
   OASIS (인증값 발급)
       ↓
   클라우드(CMP)
       ↓ (인증값 그대로 전달)
   데이터허브 / 생성형 AI / SaaS`}</pre>
              <div className="mt-3 text-[15px] text-rose-200 leading-relaxed">
                → 클라우드(CMP)가 <strong className="text-rose-300">디지털플랫폼 통합인증 서버를 만들지 않고</strong> OASIS 인증값을 다른 포털에 그대로 넘김
              </div>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-lg p-4">
              <div className="text-[13px] font-mono font-bold uppercase tracking-wider text-emerald-300 mb-2">권장 구조</div>
              <pre className="text-[15px] font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">{`K-water Fasoo SSO
       ↓
   OASIS (K-water 신원 공급)
       ↓
디지털플랫폼 통합인증 서버
       ↓ (OIDC 표준 토큰)
클라우드(CMP) / 데이터허브
  / 생성형 AI / SaaS`}</pre>
              <div className="mt-3 text-[15px] text-emerald-200 leading-relaxed">
                → 디지털플랫폼이 <strong className="text-emerald-300">자체 인증 계층을 갖춤</strong>. OASIS는 K-water 신원 공급자로 그대로 유지
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-500/5 border border-indigo-500/30 rounded-xl p-5 mt-4 flex items-start gap-3">
          <Lightbulb className="shrink-0 text-indigo-400 mt-0.5" size={18} />
          <div className="text-[17px] text-slate-300 leading-relaxed">
            <strong className="text-indigo-200">핵심 관점:</strong> OASIS는 K-water 사내 시스템으로 그대로 두고, <strong className="text-white">디지털플랫폼 사업 안에서 자체 통합인증 서버를 구축</strong>해 4개 포털(클라우드·데이터허브·생성형 AI·SaaS)의 인증 책임을 캡슐화하는 것이 표준 구조입니다. 현재 가이드는 이 계층이 빠져 있어 디지털플랫폼 사업의 자율성을 확보할 수 없습니다.
          </div>
        </div>
      </Section>

      {/* SECTION 2 — 직접 비교표 */}
      <Section icon={Scale} title="2. 직접 비교 — 디지털플랫폼 통합인증 서버 vs OASIS" subtitle="11개 핵심 영역 사이드-바이-사이드">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider">항목</th>
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider text-indigo-300">디지털플랫폼 통합인증 서버 (제안)</th>
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider text-rose-300">OASIS Portal API (현재 가이드)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <CmpRow item="표준 준수" ours="OIDC Core 1.0 + OAuth 2.1" theirs="비표준 자체 인증" />
              <CmpRow item="JWT 서명" ours="RS256 (비대칭, JWKS 공개)" theirs="HS256 (대칭키 추정)" warn />
              <CmpRow item="PKCE" ours="S256 필수" theirs="없음" warn />
              <CmpRow item="client_id 분리" ours="4개 포털 별도 (cmp/datahub/genai/saas)" theirs="단일 — 4 포털 통용" warn />
              <CmpRow item="audience(aud) 검증" ours="client_id별 분리" theirs="없음" warn />
              <CmpRow item="scope 분리" ours="포털별 (datahub:read 등)" theirs="없음" warn />
              <CmpRow item="Refresh Token Rotation" ours="RTR + chain DB + 재사용 탐지" theirs="RT 재발급 안 됨" warn />
              <CmpRow item="Token Revocation" ours="/oauth2/v1/revoke (RFC 7009)" theirs="없음" warn />
              <CmpRow item="Single Logout (SLO)" ours="OIDC BCL 1.0 백채널 푸시" theirs="없음" warn />
              <CmpRow item="Upstream SLO 수신" ours="/oauth2/v1/kwater/backchannel-logout" theirs="콜백 엔드포인트 없음" warn />
              <CmpRow item="Discovery" ours="/.well-known/openid-configuration" theirs="없음" warn />
              <CmpRow item="JWKS" ours="/.well-known/jwks.json" theirs="없음" warn />
              <CmpRow item="UserInfo" ours="별도 엔드포인트 (PII 분리)" theirs="없음 (PII가 JWT payload에 인라인)" warn />
              <CmpRow item="저장 모델" ours="BFF (브라우저는 불투명 세션 ID)" theirs="JWT를 query string으로 전달" warn />
              <CmpRow item="권한 관리" ours="CMP 권한 허브 + 각 포털 RBAC DB" theirs="미정 (role claim 없음)" warn />
              <CmpRow item="Step-up 재인증" ours="prompt=login 표준" theirs="없음" warn />
              <CmpRow item="외부 SaaS 호환" ours="OIDC 표준 — 즉시 연동" theirs="비표준 — 어댑터 매번 개발" warn />
            </tbody>
          </table>
        </div>
      </Section>

      {/* SECTION 3 — 검증 트릴레마 */}
      <Section icon={Scale} title="3. 토큰 검증 모델 — 4 포털이 OASIS JWT를 직접 검증할 때의 구조적 선택" subtitle="OASIS의 결함이 아니라, JWKS 미노출 구조에서 외부 시스템이 검증할 때 마주하는 선택지">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider">방식</th>
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider w-32">비밀키 공유</th>
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider w-24">성능</th>
                <th className="py-3 px-4 font-semibold text-[16px] uppercase tracking-wider">보안 약점</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-3 px-4 text-white font-semibold">A. 각 포털이 로컬 HS256 검증</td>
                <td className="py-3 px-4 text-rose-300 font-bold">❌ 필요</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 빠름</td>
                <td className="py-3 px-4 text-[17px] text-rose-300">4개 포털에 비밀키 분산 → 한 곳 유출 = 전체 위조</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-semibold">B. 매 요청마다 <code className="text-emerald-300 text-[16px]">/api/auth/validate</code> 호출</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 불필요</td>
                <td className="py-3 px-4 text-rose-300 font-bold">❌ 느림</td>
                <td className="py-3 px-4 text-[17px] text-rose-300">OASIS가 4 포털 SPOF, latency hop, 부하 폭발</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-white font-semibold">C. /validate + 캐시</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 불필요</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 빠름</td>
                <td className="py-3 px-4 text-[17px] text-rose-300">캐시 만료 전 권한 회수 무효 (퇴직자·사고 대응 지연)</td>
              </tr>
              <tr className="bg-emerald-500/5">
                <td className="py-3 px-4 text-emerald-200 font-bold">D. <strong>OIDC RS256 + JWKS</strong> (디지털플랫폼 통합인증 서버)</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 불필요</td>
                <td className="py-3 px-4 text-emerald-300 font-bold">✓ 빠름</td>
                <td className="py-3 px-4 text-[17px] text-emerald-300 font-semibold">트릴레마 깨짐 — 공개키로 로컬 검증 + JWKS 1시간 캐시 + revoke API로 즉시 폐기</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-indigo-500/5 border border-indigo-500/30 rounded-xl p-5 mt-4 flex items-start gap-3">
          <Lightbulb className="shrink-0 text-indigo-400 mt-0.5" size={18} />
          <div className="text-[17px] text-slate-300 leading-relaxed">
            <strong className="text-indigo-200">구조적 관점:</strong> OASIS는 K-water 사내 호출 패턴을 가정해 설계됨 — 외부 시스템이 직접 토큰을 검증할 필요가 없는 환경. 디지털플랫폼 4개 포털이 OASIS JWT를 외부에서 검증하려면 위 3가지 선택 중 하나를 골라야 하고, <strong className="text-white">어떤 선택도 디지털플랫폼의 운영 요구사항을 충족하지 못합니다</strong>. 별도 IdP 계층이 OIDC 표준 RS256+JWKS로 이 구조적 선택을 무력화합니다.
          </div>
        </div>
      </Section>

      {/* SECTION 4 — 8 구조적 분리 근거 */}
      <Section icon={AlertOctagon} title="4. 디지털플랫폼에 OASIS를 그대로 위임할 수 없는 8가지 구조적 이유" subtitle="OASIS 자체의 결함이 아니라, 두 사업의 책임 영역·운영 모델·확장 모델 차이에서 비롯되는 근거">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReasonCard num="1" severity="critical" icon={GitBranch}
            title="사업 책임 영역 분리 원칙"
            evidence="SI 모범 사례"
            evidenceLevel="strongest"
            problem="OASIS는 K-water 사내 운영 시스템. 디지털플랫폼은 별도 사업으로 운영 주체·예산·SLA·일정·KPI가 다름. 인증을 결합하면 한쪽 변경이 양쪽 영향. OASIS 사업의 보안 패치·기능 추가·인터페이스 변경마다 디지털플랫폼 4개 포털 영향."
            solution="별도 인증 계층 = 사업 책임·일정·예산·승인 라인 독립 운영. 두 사업 모두 자율 진행 가능." />
          <ReasonCard num="2" severity="critical" icon={Network}
            title="장애 격리 · 운영 SLA 분리"
            evidence="운영 모델 차이"
            evidenceLevel="strongest"
            problem="디지털플랫폼이 OASIS 단일 의존이면 OASIS 장애 = 디지털플랫폼 4개 포털 동시 마비. OASIS와 디지털플랫폼은 SLA·운영 시간·복구 절차가 다른데 결합 시 같은 가용성에 강제 종속."
            solution="별도 IdP 계층은 세션 캐시·키 캐시로 OASIS 부분 장애를 흡수. 디지털플랫폼 가용성을 자체적으로 관리." />
          <ReasonCard num="3" severity="critical" icon={ShieldCheck}
            title="포털별 클라이언트 분리 불가"
            evidence="OASIS 구조"
            evidenceLevel="strong"
            problem="OASIS는 단일 클라이언트 가정 (K-water 사내용)으로 설계 (client_id 개념 부재). 디지털플랫폼 4개 포털은 각자 다른 스코프·권한·감사 영역이 필요한데 OASIS 구조로는 client별 분리·격리 운영 불가."
            solution="OIDC 표준의 client_id 분리 모델 적용 — 포털별 토큰·스코프·감사 로그 독립 운영" />
          <ReasonCard num="4" severity="critical" icon={Users}
            title="권한 관리 책임 분리"
            evidence="사업 범위 분할"
            evidenceLevel="strong"
            problem="OASIS는 K-water 사용자 마스터(신원)만 담당. 디지털플랫폼은 자체 권한(role·scope·dataset access·승인 워크플로)을 관리해야 함. 신원 마스터와 권한 관리를 같은 시스템에 묶으면 K-water 인사 변경마다 디지털플랫폼 권한도 영향."
            solution="IdP가 신원·인증만 책임 + CMP 권한 허브 + 각 포털 RBAC DB로 명확한 책임 분리" />
          <ReasonCard num="5" severity="critical" icon={Zap}
            title="신규 포털 확장 자율성"
            evidence="확장 모델"
            evidenceLevel="strong"
            problem="디지털플랫폼은 향후 신규 포털(5번째, 6번째…) 추가가 예상됨. OASIS 의존 구조에서는 신규 포털마다 K-water 측 사업 변경 요청·승인·일정 협조 필요. 디지털플랫폼 자체 일정으로 진행 불가."
            solution="자체 IdP는 신규 client 등록을 디지털플랫폼 측에서 자율 처리 — 사업 일정 자기 결정권 확보" />
          <ReasonCard num="6" severity="major" icon={Lock}
            title="외부 시스템 표준 연동"
            evidence="확장 호환성"
            evidenceLevel="medium"
            problem="디지털플랫폼이 향후 클라우드 SaaS(AWS IAM Identity Center, Azure AD, M365 등), 협력사 시스템, 신규 외부 서비스와 연동할 때 OIDC/SAML 표준 인증 필요. OASIS는 K-water 사내 호출 패턴 전제 → 외부 연동마다 별도 어댑터 개발."
            solution="OIDC 표준 IdP는 모든 표준 호환 시스템과 즉시 연동 — 1회 구축으로 향후 모든 외부 연동 자동 호환" />
          <ReasonCard num="7" severity="major" icon={Eye}
            title="포털별 인증 정책 차이"
            evidence="운영 정책 차이"
            evidenceLevel="medium"
            problem="OASIS(K-water 사내) = 일반 업무 사용자 (긴 세션, 단일 권한 구조). 디지털플랫폼 = 다양한 권한 등급, 짧은 토큰 회전, 외부 API 호출, BFF·SPA·SaaS 다양한 클라이언트 형태. 단일 인증 시스템으로 두 가지 정책을 만족시키려면 OASIS 측 사업 범위 확장 필요."
            solution="별도 IdP가 디지털플랫폼 전용 인증 정책(짧은 AT, RTR, BCL, scope 분리) 자율 수립" />
          <ReasonCard num="8" severity="major" icon={AlertTriangle}
            title="감사·로깅 책임 분리"
            evidence="운영 책임 분할"
            evidenceLevel="medium"
            problem="디지털플랫폼 4개 포털의 모든 인증·권한 이벤트가 OASIS에 분산되면 통합 감사·모니터링 어려움. 사업별 컴플라이언스 요구사항·감사 보존 정책이 다른데 같은 로그 시스템에 묶이면 분리 어려움."
            solution="별도 IdP가 디지털플랫폼 인증·권한 이벤트의 단일 진실 근거 — 통합 감사·모니터링·컴플라이언스 대응" />
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-5 mt-4 flex items-start gap-3">
          <Lightbulb className="shrink-0 text-emerald-400 mt-0.5" size={18} />
          <div className="text-[17px] text-slate-300 leading-relaxed">
            <strong className="text-emerald-200">8가지 모두 OASIS의 결함이 아닌 사업·운영 구조의 차이에서 비롯</strong>됩니다. OASIS는 K-water 사내 인증 계층으로 적절히 설계되어 있으며, 디지털플랫폼은 별도 사업이라 자체 인증 계층이 필요한 것뿐입니다.
          </div>
        </div>
      </Section>

      {/* SECTION 5 — 예상 반박 → 대응 */}
      <Section icon={MessageSquare} title="5. 예상 반박 → 대응 매트릭스" subtitle="회의·결재 자리에서 자주 받는 질문들">
        <div className="space-y-3">
          <CounterRow
            objection="OASIS가 이미 있는데 또 만드는 건 중복 아닌가?"
            rebut="중복이 아니라 사업 영역 분리입니다. OASIS는 K-water 기존 운영 시스템이고, 디지털플랫폼 통합인증 서버는 디지털플랫폼 사업의 인증 계층입니다. 두 사업은 운영 주체·SLA·일정·예산이 다르므로 인증 계층도 분리하는 게 표준 SI 모범 사례입니다. OASIS는 그대로 유지하고, 디지털플랫폼은 자체 인증 계층을 갖추는 구조입니다." />
          <CounterRow
            objection="OASIS JWT를 그냥 4 포털이 받아 쓰면 안 되나?"
            rebut="기술적으로 가능은 하지만 디지털플랫폼이 OASIS에 완전히 종속됩니다. OASIS 측 변경·장애·인터페이스 수정이 디지털플랫폼 4 포털 모두에 즉시 전파되어, 사업 일정·운영 책임을 분리할 수 없습니다. 또한 OASIS는 단일 client 가정으로 설계되어 포털별 권한·감사 분리도 어렵습니다. 별도 인증 계층이 두 사업의 자율성을 확보합니다." />
          <CounterRow
            objection="OASIS 측에 기능 추가 요청하면 되지 않나?"
            rebut="OASIS는 K-water 사내 시스템이므로 기능 추가는 별도 사업·예산·일정 협의가 필요합니다. 디지털플랫폼 사업이 OASIS 사업의 변경 일정에 종속되면 자체 일정 제어가 불가능합니다. 디지털플랫폼 통합인증 서버를 별도 구축하면 OASIS는 그대로 두고 디지털플랫폼이 자율적으로 진행할 수 있습니다." />
          <CounterRow
            objection="비용이 추가되는 것 아닌가?"
            rebut="단기 구축 비용은 추가되지만 장기적으로는 절감됩니다: (1) 디지털플랫폼 사업이 OASIS 변경 일정에 휘둘리지 않음, (2) 신규 포털 추가 시 OASIS 측 협조 불필요, (3) 외부 SaaS 연동 시 표준 호환으로 어댑터 개발 0, (4) 디지털플랫폼 장애 영향 격리. 사업 영역 분리에 따른 운영 자율성이 비용보다 큰 가치입니다." />
          <CounterRow
            objection="포털이 4개뿐인데 굳이 OIDC 표준까지 필요한가?"
            rebut="4개 포털도 각자 다른 스코프·권한·감사 요구사항을 가집니다. 단일 인증 시스템에 묶으면 한 포털의 정책 변경이 다른 포털 영향. 향후 신규 포털 추가(5번째, 6번째…)도 예상되므로 표준 IdP가 신규 client 등록만으로 자율 확장 가능. 1년 후 신규 포털 추가 일정·비용을 비교하면 차이가 명확합니다." />
          <CounterRow
            objection="OASIS와 디지털플랫폼 통합인증 서버는 어떻게 협력하나?"
            rebut="디지털플랫폼 통합인증 서버가 OASIS API를 호출해 K-water 신원을 받아오고, 그 신원을 기반으로 자체 OIDC 표준 토큰을 4 포털에 발급합니다. OASIS는 K-water 신원 마스터 공급자 역할로 그대로 유지되며, 디지털플랫폼은 표준 인증·권한·SLO 책임을 자체 부담합니다. 두 시스템은 직렬 협력하되 운영 책임은 분리됩니다." />
        </div>
      </Section>

      {/* SECTION 6 — 결정적 한 줄 메시지 */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border-2 border-indigo-500/40 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-indigo-400" size={24} />
          <h3 className="text-xl font-bold text-white">결정적 한 줄 메시지</h3>
        </div>
        <p className="text-base text-slate-200 leading-relaxed mb-4">
          <strong className="text-emerald-300">"OASIS는 K-water 사내 운영 시스템으로 적절히 설계·운영되고 있습니다.</strong> 단, OASIS(K-water 사내)와 디지털플랫폼은 <strong className="text-white">운영 주체·SLA·예산·일정·확장 모델·인증 정책·감사 요구사항이 모두 다른 별개 사업</strong>입니다. 두 사업의 인증 계층을 결합하면 <strong className="text-amber-300">사업 일정 종속·장애 전파·포털별 분리 불가·신규 확장 자율성 상실·외부 연동 비호환·감사 책임 혼재</strong>가 발생합니다. <strong className="text-indigo-300">디지털플랫폼 통합인증 서버는 OASIS를 K-water 신원 공급자로 그대로 유지한 상태에서, 디지털플랫폼 자체 인증·권한·SLO·감사 책임을 표준(OIDC)으로 캡슐화</strong>하여 두 사업의 자율성을 확보합니다. 이는 OASIS의 결함을 보완하는 것이 아니라, <strong className="text-white">사업 영역을 깨끗이 분리하는 구조적 분기점</strong>입니다."
        </p>
        <div className="text-[16px] text-slate-500 font-mono mt-3 pt-3 border-t border-slate-800">
          ※ 발주처·K-water 회의 자료, 결재 문서, RFP 수정 요청서 등에 그대로 인용 가능합니다.
        </div>
      </div>

      {/* 활용 가이드 */}
      <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3">
        <AlertTriangle className="shrink-0 text-amber-400 mt-0.5" size={18} />
        <div className="text-[17px] text-slate-300 leading-relaxed">
          <strong className="text-amber-200">활용 가이드</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>섹션 2 비교표는 회의 슬라이드 1장으로 압축 사용 가능</li>
            <li>섹션 3 트릴레마 표는 기술 의사결정자(CTO·기술 리드)에게 가장 강력한 근거</li>
            <li>섹션 4 8가지 근거는 RFP 수정 요청서의 항목별 정당화 근거로 활용</li>
            <li>섹션 5 반박 매트릭스는 사전 시뮬레이션 — 회의 전 미리 숙지</li>
            <li>섹션 6 한 줄 메시지는 임원·결재선에 그대로 보고 가능</li>
          </ul>
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
          {subtitle && <p className="text-[17px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function CmpRow({ item, ours, theirs, warn }) {
  return (
    <tr className="hover:bg-slate-900/40">
      <td className="py-2.5 px-4 text-slate-300 font-semibold text-[17px] align-top">{item}</td>
      <td className="py-2.5 px-4 text-[17px] text-emerald-200 align-top">{ours}</td>
      <td className={`py-2.5 px-4 text-[17px] align-top ${warn ? 'text-rose-300' : 'text-slate-400'}`}>{warn && <span className="mr-1">⚠</span>}{theirs}</td>
    </tr>
  );
}

function ReasonCard({ num, severity, icon: Icon, title, problem, solution, evidence, evidenceLevel }) {
  const colorMap = {
    critical: 'border-rose-500/30 bg-rose-500/5',
    major: 'border-amber-500/30 bg-amber-500/5',
  };
  const badgeMap = {
    critical: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    major: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  };
  const evidenceColorMap = {
    strongest: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    strong: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    conditional: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
  };
  const evidenceLabel = {
    strongest: '★★★★ 반박 불가',
    strong: '★★★ 강함',
    medium: '★★ 전제 필요',
    conditional: '★ 조건부',
  };
  const sevLabel = severity === 'critical' ? 'Critical' : 'Major';
  return (
    <div className={`rounded-xl border ${colorMap[severity]} p-5`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 w-9 h-9 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
          <span className="text-sm font-mono font-bold text-slate-300">{num}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Icon className="text-slate-400 shrink-0" size={14} />
            <span className={`text-[14px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${badgeMap[severity]}`}>{sevLabel}</span>
            {evidence && (
              <span className={`text-[13px] font-mono font-bold px-1.5 py-0.5 rounded border ${evidenceColorMap[evidenceLevel] || evidenceColorMap.medium}`}>
                {evidenceLabel[evidenceLevel] || '근거'} · {evidence}
              </span>
            )}
          </div>
          <h4 className="text-base font-bold text-white leading-tight">{title}</h4>
        </div>
      </div>
      <div className="space-y-2 text-[17px]">
        <div className="flex gap-2">
          <span className="shrink-0 text-rose-400 font-bold">문제</span>
          <span className="text-slate-300 leading-relaxed">{problem}</span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 text-emerald-400 font-bold">해결</span>
          <span className="text-slate-300 leading-relaxed">{solution}</span>
        </div>
      </div>
    </div>
  );
}

function CounterRow({ objection, rebut }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="text-[17px] mb-3 flex gap-2">
        <span className="shrink-0 text-rose-400 font-bold">"Q.</span>
        <span className="text-slate-200 italic">{objection}"</span>
      </div>
      <div className="text-[17px] flex gap-2 pl-4 border-l-2 border-emerald-500/40">
        <span className="shrink-0 text-emerald-400 font-bold">A.</span>
        <span className="text-slate-300 leading-relaxed">{rebut}</span>
      </div>
    </div>
  );
}
