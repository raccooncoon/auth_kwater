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
          <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3 leading-tight">OASIS 비교 · 디지털플랫폼 통합인증 서버 구축 필요성</h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
            K-water가 제공한 가이드(OASIS Portal API)는 메인 포탈 전용 JWT 발급기일 뿐 IdP가 아닙니다. 디지털플랫폼 4개 포털(CMP·데이터허브·생성형 AI·SaaS)을 OASIS JWT에 그대로 묶으면 <strong className="text-rose-200">보안·확장성·감사 측면에서 누적 리스크</strong>가 발생합니다. 본 페이지는 별도 OIDC 표준 IdP 구축 필요성을 발주처·K-water 측에 설득하기 위한 근거 자료입니다.
          </p>
        </div>
      </div>

      {/* SECTION 1 — 현재 상황 정리 */}
      <Section icon={FileWarning} title="1. 현재 받은 가이드의 의미" subtitle="OASIS는 OIDC 표준 IdP가 아닙니다">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-emerald-300 mb-3 uppercase tracking-wider">OASIS가 하는 일</h4>
            <ul className="space-y-1.5 text-[17px] text-slate-300">
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water Fasoo SSO 페이로드 복호화</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>자체 JWT 발급 (HS256 추정)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>사용자 마스터 조회 (<code className="text-[17px] text-emerald-300">/api/member</code>)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>토큰 검증 (<code className="text-[17px] text-emerald-300">/api/auth/validate</code>)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>카카오 알림톡 발송</span></li>
            </ul>
          </div>
          <div className="bg-slate-900 border border-rose-500/30 rounded-xl p-5">
            <h4 className="text-sm font-bold text-rose-300 mb-3 uppercase tracking-wider">OASIS가 안 하는 일</h4>
            <ul className="space-y-1.5 text-[17px] text-slate-300">
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>OIDC 표준 흐름 (<code className="text-[17px] text-rose-300">/authorize</code>, PKCE, state, nonce)</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>Discovery / JWKS 공개</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>Refresh Token Rotation</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>Single Logout / 백채널 콜백</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>client_id별 토큰 분리</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>scope·role 관리</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>토큰 즉시 폐기(revoke)</span></li>
              <li className="flex gap-2"><X className="shrink-0 text-rose-400 mt-0.5" size={14} /><span>Step-up 재인증 (<code className="text-[17px] text-rose-300">prompt=login</code>)</span></li>
            </ul>
          </div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-5 mt-4 flex items-start gap-3">
          <AlertTriangle className="shrink-0 text-amber-400 mt-0.5" size={18} />
          <div className="text-[17px] text-slate-300 leading-relaxed">
            <strong className="text-amber-200">OASIS의 메시지를 한 줄로:</strong> "Fasoo 어려운 거 내가 풀어줄게. JWT 받아서 나머지는 너희가 알아서 해." → 그런데 "나머지"가 OIDC IdP 본체이며, 4개 포털이 안전하게 묶이려면 누군가는 그 본체를 만들어야 합니다.
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
      <Section icon={Scale} title="3. 토큰 검증 트릴레마 — OASIS만 사용 시 빠지는 딜레마" subtitle="3가지 옵션 모두 결함이 있고, OIDC 표준은 이 트릴레마를 깸">
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
            <strong className="text-indigo-200">OIDC가 해결한 핵심:</strong> 비대칭 키(RS256/ES256) + 공개 JWKS 모델은 각 포털이 <strong className="text-white">공개키로 로컬 검증</strong>(빠름) + <strong className="text-white">비공개키는 IdP에만 보관</strong>(안전) + <strong className="text-white">revoke API로 즉시 폐기</strong>(권한 회수). 이 트릴레마를 OASIS 단독으로는 어떤 방식으로도 해결할 수 없습니다.
          </div>
        </div>
      </Section>

      {/* SECTION 4 — 8 핵심 근거 (강도 순) */}
      <Section icon={AlertOctagon} title="4. 8가지 핵심 근거 — OASIS만 사용 시 누적 리스크" subtitle="각 카드의 '근거' 표시는 K-water가 반박하기 어려운 정도를 의미. 강한 순서대로 정렬">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReasonCard num="1" severity="critical" icon={GitBranch}
            title="Refresh Token Rotation 부재"
            evidence="OpenAPI 스펙 명시"
            evidenceLevel="strongest"
            problem='OpenAPI 스펙 명시: "리프레시 토큰은 재발급되지 않습니다". 도난당해도 RT 만료까지 무한 갱신 가능, 탐지 불가.'
            solution="RTR + chain DB 추적 + 재사용 즉시 chain 폐기 — RT 도난 자동 탐지" />
          <ReasonCard num="2" severity="critical" icon={AlertTriangle}
            title="accessToken을 URL Query string으로"
            evidence="OpenAPI 스펙 명시"
            evidenceLevel="strongest"
            problem="/api/approval/v2 GET 파라미터에 accessToken을 query string으로 받음 → URL 로그·브라우저 히스토리·Referer 헤더에 토큰 노출. OAuth 2.1 BCP 위반."
            solution="모든 토큰을 Authorization 헤더 + POST body로 — 표준 OAuth 2.1 강제" />
          <ReasonCard num="3" severity="critical" icon={Network}
            title="Single Logout 부재"
            evidence="스펙에 백채널 콜백 없음"
            evidenceLevel="strong"
            problem="OASIS에 백채널 로그아웃 콜백 엔드포인트 자체가 없음 → 한 포털 로그아웃이 다른 포털에 전파 안 됨. 퇴직자·보안사고 시 토큰 만료까지 통과."
            solution="OIDC BCL 1.0 (RFC 8417 SET) 백채널 푸시로 4 포털 동시 종료" />
          <ReasonCard num="4" severity="critical" icon={Eye}
            title="PII가 JWT에 인라인"
            evidence="OpenAPI 스펙 명시"
            evidenceLevel="strong"
            problem='TokenResponse 설명: "Payload에 id, name, position, dept, phone 포함". 사번·이름은 OIDC ID Token에도 통상 포함되지만 직위·부서·내선번호까지는 OIDC 권고 범위를 벗어남. accessToken을 query string으로 노출하는 흐름과 결합되면 PII 유출 경로 발생.'
            solution="payload는 sub만, 나머지는 /userinfo 별도 — OIDC 표준 minimal claims 패턴" />
          <ReasonCard num="5" severity="critical" icon={Lock}
            title="토큰 검증 트릴레마"
            evidence="JWKS 미노출 사실"
            evidenceLevel="strong"
            problem="OASIS는 JWKS·Discovery를 노출하지 않음 → 각 포털이 (a) 비밀키 공유로 로컬 검증 (b) /api/auth/validate 매번 호출 (c) 캐시 — 세 가지 옵션 모두 결함. ※ 예시 토큰 디코딩 시 HS256으로 보이나 운영 알고리즘은 확인 필요."
            solution="OIDC RS256 + JWKS 공개로 트릴레마 자체를 무력화 (공개키 로컬 검증 + 즉시 폐기)" />
          <ReasonCard num="6" severity="major" icon={Users}
            title="권한 관리 위치 부재"
            evidence="스펙 범위 밖"
            evidenceLevel="medium"
            problem="OASIS JWT에 role claim 없음. 권한 신청·승인·감사 워크플로 미정의. ※ OASIS의 잘못이라기보다 '단순 빈칸' — K-water 측이 '권한은 우리 영역 아님'이라고 답할 수 있지만, 그러면 '누가 어디서?'가 명확해야 함."
            solution="CMP 권한 허브 + 각 포털 RBAC DB 모델로 책임 분리 명확화" />
          <ReasonCard num="7" severity="major" icon={ShieldCheck}
            title="client_id 분리 부재"
            evidence="현재 가이드 구조"
            evidenceLevel="medium"
            problem="현재 가이드 구조상 client_id 분리·aud 검증 명세 없음. 그대로 적용하면 단일 OASIS JWT를 4 포털이 통용 → 한 곳에서 토큰 새면 4 포털 모두 침투. ※ K-water가 'client별 발급 가능합니다'라고 답하면 별도 명세 추가 필요."
            solution="포털별 client_id + aud claim 검증으로 토큰 침투 격리" />
          <ReasonCard num="8" severity="major" icon={Zap}
            title="외부 SaaS 호환성 (조건부)"
            evidence="사업 범위 조건"
            evidenceLevel="conditional"
            problem="OASIS는 OIDC 표준 아님 → 향후 외부 SaaS(AWS IAM Identity Center, Azure AD, M365, 협력사 SaaS) 연동 시 어댑터 매번 개발 필요. ※ 외부 연동이 본 사업 또는 향후 로드맵에 있는 경우에만 유효한 근거."
            solution="OIDC 표준 IdP → 모든 표준 호환 시스템과 즉시 연동 (향후 비용 절감)" />
        </div>
      </Section>

      {/* SECTION 5 — 예상 반박 → 대응 */}
      <Section icon={MessageSquare} title="5. 예상 반박 → 대응 매트릭스" subtitle="회의·결재 자리에서 자주 받는 질문들">
        <div className="space-y-3">
          <CounterRow
            objection="OASIS가 이미 있는데 또 만드는 건 중복 아닌가?"
            rebut="역할이 다릅니다. OASIS = K-water Fasoo → JWT 변환기 + 메인 포탈 백엔드. 디지털플랫폼 통합인증 서버 = OIDC 표준 IdP for 디지털플랫폼 4개 포털. 둘은 직렬 연결되는 다른 계층입니다. OASIS가 OS면 디지털플랫폼 통합인증 서버는 그 위의 표준 인증 미들웨어." />
          <CounterRow
            objection="JWT 발급되니까 충분하지 않나?"
            rebut="JWT는 토큰 형식일 뿐 인증 시스템이 아닙니다. 보안의 핵심은 PKCE·state·RTR·SLO·BCL·scope 분리이고, OASIS는 이 중 어느 것도 제공하지 않습니다. 같은 JWT라도 누가 어떻게 검증하느냐가 보안의 본질입니다." />
          <CounterRow
            objection="각 포털이 알아서 /api/auth/validate로 검증하면 되지 않나?"
            rebut="섹션 3 트릴레마 참조. HS256 공유는 키 유출 위험, /validate 매번 호출은 OASIS SPOF + 성능 저하, 캐시는 권한 즉시 회수 불가. OIDC RS256+JWKS만이 세 가지 모두 해결합니다. 게다가 SLO·RTR·권한 허브·PII 분리는 검증 방식과 무관하게 OASIS에 없는 기능들입니다." />
          <CounterRow
            objection="OASIS 측이 OIDC 표준 추가하면 되지 않나?"
            rebut="OASIS는 메인 포탈 사업 범위 — 이미 운영 중인 시스템. OIDC 표준 추가는 별도 사업으로 추진해야 하며 일정·예산이 분리됩니다. 그 동안 디지털플랫폼은 보안 약점 상태로 운영해야 합니다. 디지털플랫폼 통합인증 서버를 별도 만들면 OASIS는 그대로 두고 즉시 표준화 효과를 얻을 수 있습니다." />
          <CounterRow
            objection="비용이 추가되는 것 아닌가?"
            rebut="별도 구축 안 했을 때 누적 비용이 훨씬 큽니다: 보안 사고 대응 비용, 감사 지적 시 재구축 비용, 외부 SaaS 연동마다 어댑터 비용, 권한 관리 시스템 4중 구축 비용. 표준 OIDC IdP는 1회성 구축 비용으로 모두 해결되며, 향후 모든 표준 호환 시스템과 자동 연동됩니다." />
          <CounterRow
            objection="포털이 4개뿐인데 굳이 OIDC 표준까지 필요한가?"
            rebut="4개가 5개·6개로 늘어나는 것은 시간 문제입니다. 표준 없이 만들면 N번째 포털 추가할 때마다 인증 모듈 재개발 + OASIS 비밀키 분산. 표준으로 만들면 신규 포털은 client_id 등록만으로 즉시 통합. 1년 후 신규 포털 1개 추가 비용만 비교해도 차이가 명확합니다." />
        </div>
      </Section>

      {/* SECTION 6 — 결정적 한 줄 메시지 */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-950 border-2 border-indigo-500/40 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-indigo-400" size={24} />
          <h3 className="text-xl font-bold text-white">결정적 한 줄 메시지</h3>
        </div>
        <p className="text-base text-slate-200 leading-relaxed mb-4">
          <strong className="text-indigo-300">"OASIS는 K-water 메인 포탈 전용 JWT 발급기이지 OIDC 표준 IdP가 아닙니다.</strong> 현재 가이드에서 확인 가능한 결함은 <strong className="text-rose-300">RTR 부재(스펙 명시), URL Query string 토큰 노출(스펙 명시), SLO 부재, PII 인라인, JWKS 미노출로 인한 검증 트릴레마</strong> 5가지가 명확하며, 추가로 <strong className="text-amber-300">권한 관리 위치, client_id 분리, 외부 SaaS 호환성</strong>은 사업 범위·전제에 따라 누적 리스크가 됩니다. <strong className="text-emerald-300">디지털플랫폼 통합인증 서버는 OIDC 표준(RS256+JWKS, PKCE, RTR, BCL 1.0, client_id 분리, /userinfo)으로 이 모든 리스크를 해결</strong>하면서 향후 외부 SaaS 연동·권한 통합 관리·감사 단일 지점을 확보합니다."
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
