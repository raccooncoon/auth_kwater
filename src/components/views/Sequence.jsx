import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Sequence() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">데이터 흐름 시퀀스 (Sequence Diagram)</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            전체 로그인 및 연동 과정의 데이터 패킷 흐름을 한눈에 파악할 수 있는 시퀀스 다이어그램입니다.
          </p>
        </div>
      </div>

      {/* Canvas for Sequence Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-10 relative flex flex-col shadow-2xl">
        
        {/* Swimlanes Headers — 사용자 브라우저 / 포털 백엔드 / IdP / K-water */}
        <div className="flex justify-between relative z-10 mb-8">
          {[
            { name: '사용자 브라우저', role: 'Front-channel', accent: 'border-slate-700 text-slate-200', roleBg: 'bg-slate-800 text-slate-400' },
            { name: '포털 백엔드', role: 'Back-channel Client', accent: 'border-purple-500/60 text-purple-200', roleBg: 'bg-purple-500/10 text-purple-300' },
            { name: '디지털플랫폼 통합인증 서버', role: 'IdP / OIDC Provider', accent: 'border-indigo-500/60 text-indigo-200', roleBg: 'bg-indigo-500/10 text-indigo-300' },
            { name: 'K-water 인증 서버', role: 'Upstream IdP', accent: 'border-sky-500/60 text-sky-200', roleBg: 'bg-sky-500/10 text-sky-300' },
          ].map((lane, i) => (
            <div key={i} className="flex flex-col items-center w-1/4 gap-1.5">
              <div className={`bg-slate-900 border px-3 md:px-4 py-2 rounded-xl text-[13px] md:text-xs font-bold shadow-lg relative z-20 whitespace-nowrap ${lane.accent}`}>
                {lane.name}
              </div>
              <span className={`text-[11px] md:text-[12px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${lane.roleBg}`}>
                {lane.role}
              </span>
            </div>
          ))}
        </div>

        {/* Diagram Area */}
        <div className="relative w-full pb-8">
          {/* Dynamic Vertical Lines Background */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex z-0 pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-1/4 relative">
                <div className={`absolute top-0 bottom-0 left-1/2 w-px ${i === 1 ? 'bg-purple-500/30' : i === 2 ? 'bg-indigo-500/30' : i === 3 ? 'bg-sky-500/30' : 'bg-slate-800'}`}></div>
              </div>
            ))}
          </div>

          {/* Sequence Steps Grouped by Phase — lanes: 0=Browser, 1=Portal, 2=Inogrid IdP, 3=K-water */}
          <div className="relative z-10 flex flex-col pt-6">
            {[
              {
                title: "메인 포털 로그인",
                subtitle: "K-water 인증 → 디지털플랫폼 통합인증 서버 SSO 세션 → 클라우드 관리 포털 (CMP) 토큰 발급",
                phaseBadge: "Phase 1 · Master Login",
                phaseColor: "border-sky-500/40 bg-sky-500/5 text-sky-300",
                steps: [
                  { step: 1, from: 0, to: 3, label: "1. K-water 로그인 시도 (사용자 진입)", lineColor: "bg-sky-500/80 group-hover:bg-sky-400 shadow-[0_0_15px_1px] shadow-sky-500/40", arrowColor: "text-sky-400", dotClass: "border-sky-500 text-sky-300", labelClass: "text-sky-300 border-sky-500/30", desc: "사용자가 디지털플랫폼 포털 접근 과정에서 K-water 인증 페이지로 이동하여 ID/PW로 1차 로그인을 시도합니다." },
                  { step: 2, from: 3, to: 0, label: "2. 인증 완료 + 암호화 페이로드 발급", lineColor: "bg-sky-500/80 group-hover:bg-sky-400 shadow-[0_0_15px_1px] shadow-sky-500/40", arrowColor: "text-sky-400", dotClass: "border-sky-500 text-sky-300", labelClass: "text-sky-300 border-sky-500/30", desc: "K-water가 사용자 정보를 암호화한 페이로드(JWE/SAML)를 응답으로 발급하고, 디지털플랫폼 콜백 URL로 브라우저를 리다이렉트합니다." },
                  { step: 3, from: 0, to: 2, label: "3. 페이로드 전달", lineColor: "bg-indigo-500/80 group-hover:bg-indigo-400 shadow-[0_0_15px_1px] shadow-indigo-500/40", arrowColor: "text-indigo-400", dotClass: "border-indigo-500 text-indigo-300", labelClass: "text-indigo-300 border-indigo-500/30", desc: "브라우저는 K-water가 발급한 암호화 페이로드를 디지털플랫폼 통합인증 서버의 /oauth2/kwater/callback 엔드포인트로 전달합니다." },
                  { step: 4, from: 2, to: 0, label: "4. 복호화 및 통합 SSO 쿠키 발급", lineColor: "bg-emerald-500/80 group-hover:bg-emerald-400 shadow-[0_0_15px_1px] shadow-emerald-500/40", arrowColor: "text-emerald-400", dotClass: "border-emerald-500 text-emerald-300", labelClass: "text-emerald-300 border-emerald-500/30", desc: "디지털플랫폼 통합인증 서버가 K-water 페이로드를 복호화하여 디지털플랫폼 생태계 전용 통합 SSO 세션 쿠키를 브라우저에 발급합니다." },
                  { step: 5, from: 1, to: 2, label: "5. CMP 토큰 교환", lineColor: "bg-purple-500/80 group-hover:bg-purple-400 shadow-[0_0_15px_1px] shadow-purple-500/40", arrowColor: "text-purple-400", dotClass: "border-purple-500 text-purple-300", labelClass: "text-purple-300 border-purple-500/30", desc: "클라우드 관리 포털 (CMP) 백엔드가 디지털플랫폼 통합인증 서버와 백채널(Back-channel)로 통신하여 전용 토큰을 획득합니다." },
                ],
              },
              {
                title: "서브 포털 로그인 및 토큰 발급",
                subtitle: "데이터허브 / 생성형 AI / SaaS 포털 — Silent SSO 후 전용 Access Token 발급",
                phaseBadge: "Phase 2 · Silent SSO + Token Issue",
                phaseColor: "border-indigo-500/40 bg-indigo-500/5 text-indigo-300",
                steps: [
                  { step: 6, from: 0, to: 2, label: "6. 하위 포털 무상호작용 연동 (Silent)", lineColor: "bg-indigo-500/80 group-hover:bg-indigo-400 shadow-[0_0_15px_1px] shadow-indigo-500/40", arrowColor: "text-indigo-400", dotClass: "border-indigo-500 text-indigo-300", labelClass: "text-indigo-300 border-indigo-500/30", desc: "사용자가 데이터허브나 생성형 AI 포털에 접근 시, 기존 SSO 세션을 기반으로 조용히 인증을 시도합니다." },
                  { step: 7, from: 1, to: 2, label: "7. 하위 포털 Access Token 발급 (데이터허브 등)", lineColor: "bg-emerald-500/80 group-hover:bg-emerald-400 shadow-[0_0_15px_1px] shadow-emerald-500/40", arrowColor: "text-emerald-400", dotClass: "border-emerald-500 text-emerald-300", labelClass: "text-emerald-300 border-emerald-500/30", desc: "하위 포털(데이터허브) 백엔드가 개별적인 인가 코드를 전송하여 전용 Access Token + Refresh Token을 발급받습니다." },
                ],
              },
              {
                title: "토큰 갱신 (Refresh Token Rotation)",
                subtitle: "사용자 API 호출 도중 Access Token 만료 감지 → Refresh Token으로 무중단 재발급",
                phaseBadge: "Phase 3 · Token Refresh (RTR)",
                phaseColor: "border-amber-500/40 bg-amber-500/5 text-amber-300",
                steps: [
                  { step: 8, from: 0, to: 1, label: "8. 사용자 API 호출 (Access Token 만료 감지)", lineColor: "bg-amber-500/80 group-hover:bg-amber-400 shadow-[0_0_15px_1px] shadow-amber-500/40", arrowColor: "text-amber-400", dotClass: "border-amber-500 text-amber-300", labelClass: "text-amber-300 border-amber-500/30", desc: "사용자가 포털에서 작업을 이어가면서 보호된 API를 호출합니다. 포털 백엔드는 첨부할 Access Token이 곧 만료되거나(또는 리소스 서버로부터 401 응답) 감지합니다." },
                  { step: 9, from: 1, to: 2, label: "9. 토큰 갱신 요청 (grant_type=refresh_token)", lineColor: "bg-amber-500/80 group-hover:bg-amber-400 shadow-[0_0_15px_1px] shadow-amber-500/40", arrowColor: "text-amber-400", dotClass: "border-amber-500 text-amber-300", labelClass: "text-amber-300 border-amber-500/30", desc: "포털 백엔드가 자기 세션 스토어에 보관된 Refresh Token으로 디지털플랫폼 통합인증 서버에 갱신 요청을 보냅니다 (사용자 화면은 그대로)." },
                  { step: 10, from: 2, to: 1, label: "10. 새 Access + Refresh Token 재발급", lineColor: "bg-emerald-500/80 group-hover:bg-emerald-400 shadow-[0_0_15px_1px] shadow-emerald-500/40", arrowColor: "text-emerald-400", dotClass: "border-emerald-500 text-emerald-300", labelClass: "text-emerald-300 border-emerald-500/30", desc: "디지털플랫폼 통합인증 서버가 새 Access Token과 새 Refresh Token을 발급하고 기존 Refresh Token을 즉시 폐기(RTR)하여 탈취 위험을 차단합니다. 포털은 새 토큰으로 원 API 요청을 재처리합니다." },
                ],
              },
              {
                title: "통합 로그아웃 (SLO)",
                subtitle: "사용자의 로그아웃 클릭에서 시작 → 모든 하위 포털 세션 일괄 종료",
                phaseBadge: "Phase 4 · Single Logout",
                phaseColor: "border-rose-500/40 bg-rose-500/5 text-rose-300",
                steps: [
                  { step: 11, from: 0, to: 2, label: "11. 사용자 로그아웃 클릭 (/logout 요청)", lineColor: "bg-rose-500/80 group-hover:bg-rose-400 shadow-[0_0_15px_1px] shadow-rose-500/40", arrowColor: "text-rose-400", dotClass: "border-rose-500 text-rose-300", labelClass: "text-rose-300 border-rose-500/30", desc: "사용자가 임의 포털에서 '로그아웃' 버튼을 누릅니다. 브라우저가 디지털플랫폼 통합인증 서버의 /oauth2/v1/logout 으로 이동하며 SSO 쿠키가 자동 동봉됩니다." },
                  { step: 12, from: 2, to: 1, label: "12. 백채널 로그아웃 브로드캐스트 (SLO)", lineColor: "bg-rose-500/80 group-hover:bg-rose-400 shadow-[0_0_15px_1px] shadow-rose-500/40", arrowColor: "text-rose-400", dotClass: "border-rose-500 text-rose-300", labelClass: "text-rose-300 border-rose-500/30", desc: "디지털플랫폼 통합인증 서버가 SSO 쿠키를 만료시키고, 모든 하위 포털(CMP, 데이터허브, 생성형 AI, SaaS) 백엔드로 logout_token을 서버-투-서버로 푸시해 각 세션을 강제 종료합니다." },
                ],
              },
            ].map((phase, pIdx) => (
              <div key={pIdx} className={pIdx > 0 ? 'pt-16 md:pt-20' : ''}>
                {/* Phase Header Banner */}
                <div className={`relative z-20 mb-20 md:mb-24 rounded-xl border ${phase.phaseColor} px-4 md:px-5 py-3 backdrop-blur-md shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-[12px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${phase.phaseColor}`}>
                      {phase.phaseBadge}
                    </span>
                    <h4 className="text-sm md:text-base font-bold text-white">{phase.title}</h4>
                  </div>
                  <p className="text-[13px] md:text-xs text-slate-400 mt-1.5 leading-relaxed">{phase.subtitle}</p>
                </div>

                {/* Steps inside this phase */}
                <div className="flex flex-col space-y-24 md:space-y-28">
                  {phase.steps.map((s, idx) => {
                    const startPercent = (s.from * 25) + 12.5;
                    const endPercent = (s.to * 25) + 12.5;
                    const isLeftToRight = s.from < s.to;
                    const widthPercent = Math.abs(endPercent - startPercent);
                    const leftPercent = Math.min(startPercent, endPercent);

                    return (
                      <div key={idx} className="relative w-full group">
                        {/* Step Number Dot */}
                        <div className={`absolute top-0 w-7 h-7 rounded-full bg-slate-900 border-2 flex items-center justify-center text-[13px] font-bold z-20 shadow-lg ${s.dotClass}`}
                             style={{ left: `${startPercent}%`, transform: 'translate(-50%, -50%)' }}>
                          {s.step}
                        </div>

                        {/* The Connecting Line */}
                        <div className={`absolute top-0 h-0.5 transition-colors z-10 ${s.lineColor}`}
                             style={{ left: `${leftPercent}%`, width: `${widthPercent}%`, transform: 'translateY(-50%)' }}>

                          {/* Arrow Head */}
                          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center ${s.arrowColor}`}
                               style={{ [isLeftToRight ? 'right' : 'left']: '-4px', transform: isLeftToRight ? 'none' : 'rotate(180deg)' }}>
                            <ChevronRight size={20} />
                          </div>

                          {/* Label */}
                          <div className={`absolute -top-12 whitespace-nowrap font-bold text-xs md:text-sm px-3 py-1.5 rounded-full bg-slate-900/90 border backdrop-blur-sm shadow-md ${s.labelClass}`}
                               style={{ left: '50%', transform: 'translateX(-50%)' }}>
                            {s.label}
                          </div>
                        </div>

                        {/* Optional Description Below Line */}
                        <div className="pt-8 text-center relative z-0">
                          <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors mx-auto max-w-sm bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 inline-block shadow-md">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
