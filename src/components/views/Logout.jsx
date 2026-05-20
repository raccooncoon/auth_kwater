import React from 'react';
import { Building2, Check, AlertTriangle, Copy } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

export default function Logout({ handleCopy }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">통합 로그아웃 및 글로벌 세션 만료 정책 (Single Logout)</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          사용자가 어느 한 포털에서 로그아웃을 수행하더라도 디지털플랫폼 하위 포털의 토큰 및 세션이 전사적으로 정비되어야 합니다. 필요시 최상위 K-water 세션까지 연계하여 동시 로그아웃(SLO)을 수행합니다.
        </p>
      </div>

      {/* Multi-tier Revocation Graphic */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 className="font-semibold text-white text-sm tracking-wider uppercase">통합 포털 환경에서의 Single Logout(SLO) 프로세스</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">1</div>
            <h4 className="font-bold text-white mb-1">통합 로그아웃 트리거</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              사용자가 통합 포털 혹은 하위 포털 내의 '로그아웃' 버튼을 클릭하면 세션을 정리하고 공통 OIDC 로그아웃 엔드포인트(`/logout`)로 리다이렉트합니다.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">2</div>
            <h4 className="font-bold text-white mb-1">인증 서버 SSO 쿠키 만료</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              인증 서버는 메인 세션 쿠키를 제거하여 하위 포털들이 더 이상 무중단(Silent) 인증 코드를 발급받을 수 없도록 핵심 세션을 파기합니다.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="h-8 w-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm mb-3">3</div>
            <h4 className="font-bold text-white mb-1">개별 포털 세션 정리 (Back-channel)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              인증 서버는 등록된 각 포털의 로그아웃 콜백 URI로 비동기 신호(Back-channel Logout)를 전송하여 개별 서버 및 토큰 저장 세션을 강제로 원격 철회시킵니다.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoint Spec for Logout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-white text-lg mb-3">OIDC SLO 로그아웃 요청 예시</h3>
        <div className="relative">
          <CodeBlock language="http"
            code={`GET /oauth2/v1/logout?id_token_hint=eyJhbGciOiJSUzI1NiIs...
    &post_logout_redirect_uri=https://cmp.kwater.com/login
    &state=secure_logout_state HTTP/1.1
Host: auth.kwater.com`} />
          <button
            onClick={() => handleCopy(`GET https://auth.kwater.com/oauth2/v1/logout?id_token_hint=eyJhbGciOiJSUzI1NiIs...&post_logout_redirect_uri=https://cmp.kwater.com/login&state=secure_logout_state`, 'logout-url')}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 bg-slate-900/80 p-1.5 rounded-md border border-slate-800 hover:border-slate-700 transition"
          >
            <Copy size={13} />
          </button>
        </div>
      </div>

      {/* Upstream K-water Logout Reception */}
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl overflow-hidden">
        <div className="bg-sky-950/40 px-6 py-4 border-b border-sky-500/20 flex items-center gap-2">
          <Building2 className="text-sky-400" size={18} />
          <h3 className="font-bold text-white text-base">상위 K-water 로그아웃 수신 (Upstream-initiated SLO)</h3>
        </div>
        <div className="p-6 space-y-5">
          <p className="text-sm text-slate-300 leading-relaxed">
            K-water 쪽에서 사용자가 로그아웃하면 디지털플랫폼 통합인증 서버가 이를 감지해야 SSO 세션을 끊고 하위 4개 포털로 전파할 수 있습니다. 표준은 OIDC가 정의한 3가지 방식이며, K-water와 사전 합의가 필요합니다.
          </p>

          {/* 3-method comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500">
                  <th className="py-2 px-3 font-semibold">방식</th>
                  <th className="py-2 px-3 font-semibold">호출 주체 / 채널</th>
                  <th className="py-2 px-3 font-semibold">신뢰성</th>
                  <th className="py-2 px-3 font-semibold">사용 조건</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                <tr>
                  <td className="py-2 px-3 font-mono text-emerald-300">Back-Channel</td>
                  <td className="py-2 px-3 text-slate-400">K-water 서버 → 우리 서버 (Server-to-Server POST)</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">높음 (권장)</td>
                  <td className="py-2 px-3 text-slate-400">K-water가 OIDC Back-Channel Logout 지원 시</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-amber-300">Front-Channel</td>
                  <td className="py-2 px-3 text-slate-400">K-water 로그아웃 페이지의 iframe이 우리 URL 호출</td>
                  <td className="py-2 px-3 text-amber-400 font-semibold">중간</td>
                  <td className="py-2 px-3 text-slate-400">브라우저가 K-water 로그아웃 페이지를 실제 방문해야 동작</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-purple-300">Fasoo 세션 폐기 콜백</td>
                  <td className="py-2 px-3 text-slate-400">K-water SSO → 우리 엔드포인트 (사내 표준 호출)</td>
                  <td className="py-2 px-3 text-emerald-400 font-semibold">중간~높음</td>
                  <td className="py-2 px-3 text-slate-400">K-water 사내 표준 콜백을 지원하는 경우 (인터페이스 협의 필요)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Back-channel example */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[14px] font-mono px-2 py-0.5 rounded">RECOMMENDED</span>
              Back-Channel Logout 수신 엔드포인트 예시
            </h4>
            <CodeBlock language="http" code={`POST /oauth2/v1/kwater/backchannel-logout HTTP/1.1
Host: auth.kwater.com
Content-Type: application/x-www-form-urlencoded

logout_token=eyJhbGciOiJSUzI1NiJ9.<JWT signed by K-water>`} />
            <p className="text-[15px] text-slate-400 mt-2 leading-relaxed">
              <code className="text-emerald-300">logout_token</code> 검증 필수 항목: <code className="text-slate-300">iss</code>=K-water issuer · <code className="text-slate-300">aud</code>=우리 client_id · <code className="text-slate-300">iat</code> 신선도 · <code className="text-slate-300">jti</code> 재사용 차단 · <code className="text-slate-300">events</code>에 <code className="text-slate-300">http://schemas.openid.net/event/backchannel-logout</code> 포함 · <code className="text-slate-300">nonce</code> 부재 · <code className="text-slate-300">sub</code> 또는 <code className="text-slate-300">sid</code>로 세션 식별 (OIDC BCL 1.0 §2.4 (RFC 8417 SET)).
            </p>
          </div>

          {/* K-water request checklist */}
          <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-300 text-[14px] font-mono px-2 py-0.5 rounded">CHECKLIST</span>
              K-water에 정식 요청할 항목
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Back-Channel Logout 지원 여부 확인</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>우리 측 URL 등록 요청: <code className="text-sky-300">https://auth.kwater.com/oauth2/v1/kwater/backchannel-logout</code></span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water Issuer URL 및 JWKS URI 공유 (logout_token 서명 검증용)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>우리에게 발급될 <code className="text-sky-300">client_id</code> (RP 등록)</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span><code className="text-sky-300">sub</code> claim 형식 및 디지털플랫폼 user_id 매핑 정책</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>(Back-channel 미지원시) Front-channel iframe 방식 협의</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>(Fasoo 세션 폐기 콜백 지원 시) 인터페이스 명세·인증서 교환 협의</span></li>
              <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>실제 <code className="text-sky-300">logout_token</code> 또는 <code className="text-sky-300">LogoutRequest</code> 샘플 1건 사전 공유 (테스트용)</span></li>
            </ul>
          </div>

          {/* Fallback note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
            <h4 className="text-sm font-bold text-amber-200 mb-2 flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={14} />
              Fallback — K-water가 SLO 미지원 시
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              <li>· 우리 SSO 쿠키 idle timeout을 짧게(15~30분)</li>
              <li>· Refresh Token 갱신 시점마다 K-water <code className="text-amber-300">/userinfo</code> 또는 <code className="text-amber-300">/introspect</code> 재검증</li>
              <li>· K-water 측에서 사용자에게 "디지털플랫폼도 함께 로그아웃" 안내 링크 제공</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
