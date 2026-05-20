import React from 'react';
import { Info, Settings, ChevronLeft, ChevronRight, Eye, AlertTriangle, Terminal, Copy, Laptop, Database } from 'lucide-react';
import CodeBlock from '../shared/CodeBlock';

export default function Flow({ simulationSteps, simStep, setSimStep, handleCopy, setActiveTab }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">상세 연동 시뮬레이터</h2>
        <p className="text-slate-400 text-lg leading-relaxed">
          브라우저 로컬 데이터, 토큰 상태 및 백그라운드 교환 처리를 각 단계별 데이터 스냅샷을 통해 입체적으로 분석합니다. 각 Step 카드의 제목 끝 괄호는 시퀀스 다이어그램의 대응 단계 번호입니다.
        </p>
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
        <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
        <p className="text-[15px] text-slate-300 leading-relaxed">
          본 시뮬레이터는 핵심 흐름만 <strong className="text-white">6개 단계</strong>로 단순화하여 페이로드·상태 변화를 추적합니다. 토큰 갱신(RTR)·사용자 로그아웃 트리거 등을 포함한 <strong className="text-white">전체 17단계 흐름</strong>은 <button onClick={() => setActiveTab('sequence')} className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">3. 데이터 흐름 시퀀스</button> 탭의 시퀀스 다이어그램을 참고하세요.
        </p>
      </div>

      {/* Master Control Panel */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
          <Settings className="text-indigo-400 animate-spin-slow" size={20} />
          <span className="text-md font-bold text-slate-100">시뮬레이터 제어 센터</span>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-6 gap-2">
          {simulationSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setSimStep(idx)}
              className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-start h-auto min-h-[6rem] ${
                idx === simStep
                  ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-600/5'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <span className="text-[14px] font-bold tracking-wider uppercase mb-1.5">Step {idx + 1}</span>
              <span className="text-[15px] font-semibold line-clamp-2 leading-relaxed text-slate-300 break-keep">{step.shortTitle || step.title}</span>
            </button>
          ))}
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSimStep((s) => Math.max(0, s - 1))}
            disabled={simStep === 0}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ChevronLeft size={14} />
            <span>이전 단계</span>
          </button>
          <span className="text-xs font-mono text-slate-500">
            {simStep + 1} / {simulationSteps.length}
          </span>
          <button
            onClick={() => setSimStep((s) => Math.min(simulationSteps.length - 1, s + 1))}
            disabled={simStep === simulationSteps.length - 1}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <span>다음 단계</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Simulation Step Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          
          {/* Left Side: Step Details & Payloads */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <span className="self-start md:self-auto text-[14px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                  {simulationSteps[simStep].phase}
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
                  <span className="text-slate-300 font-semibold">{simulationSteps[simStep].sender}</span>
                  <span className="text-indigo-500/70">➜</span>
                  <span className="text-emerald-400 font-semibold">{simulationSteps[simStep].receiver}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">
                {simulationSteps[simStep].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {simulationSteps[simStep].desc}
              </p>
            </div>

            {/* Easy-to-understand context boxes */}
            {simulationSteps[simStep].userView && (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Eye className="text-emerald-400" size={16} />
                  <span className="text-[14px] font-mono font-bold uppercase tracking-widest text-emerald-300">User View · 사용자가 보는 화면</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{simulationSteps[simStep].userView}</p>
              </div>
            )}

            {simulationSteps[simStep].purpose && (
              <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="text-indigo-400" size={16} />
                  <span className="text-[14px] font-mono font-bold uppercase tracking-widest text-indigo-300">Why · 이 단계가 필요한 이유</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{simulationSteps[simStep].purpose}</p>
              </div>
            )}

            {simulationSteps[simStep].warning && (
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={16} />
                  <span className="text-[14px] font-mono font-bold uppercase tracking-widest text-amber-300">Pitfall · 자주 빠지는 함정</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{simulationSteps[simStep].warning}</p>
              </div>
            )}

            {/* Network Payload Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 flex items-center gap-1.5">
                  <Terminal size={14} /> Network Request & Response Trace
                </span>
                <button 
                  onClick={() => handleCopy(JSON.stringify(simulationSteps[simStep].payload, null, 2), `trace-${simStep}`)}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <Copy size={12} /> 복사
                </button>
              </div>
              <div className="p-4 bg-slate-950/40">
                <CodeBlock language="json" maxHeight="300px"
                  code={JSON.stringify(simulationSteps[simStep].payload, null, 2)} />
              </div>
            </div>
          </div>

          {/* Right Side: State Inspector */}
          <div className="lg:col-span-5 space-y-6">
              
              {/* Browser Local Storage Inspection */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                  <Laptop className="text-indigo-400" size={16} />
                  <span className="text-xs font-bold text-slate-300">브라우저 로컬 데이터 모니터</span>
                </div>
                <div className="p-4 space-y-4 text-xs">
                  {/* session storage */}
                  <div>
                    <div className="text-[14px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">sessionStorage (OIDC State / CSRF 방지)</div>
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono space-y-1">
                      {Object.entries(simulationSteps[simStep].browserState.sessionStorage).map(([key, val]) => (
                        <div key={key} className="flex justify-between gap-2">
                          <span className="text-indigo-300">{key}:</span>
                          <span className="text-slate-400 truncate max-w-[200px]" title={val}>{val}</span>
                        </div>
                      ))}
                      {Object.keys(simulationSteps[simStep].browserState.sessionStorage).length === 0 && (
                        <div className="text-slate-600 italic">비어 있음 (안전)</div>
                      )}
                    </div>
                  </div>

                  {/* Memory Access Token */}
                  <div>
                    <div className="text-[14px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">JS In-Memory State (Access Token)</div>
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono flex justify-between gap-2">
                      <span className="text-emerald-400">accessToken:</span>
                      <span className="text-slate-400 truncate max-w-[200px]" title={simulationSteps[simStep].browserState.memory.accessToken}>
                        {simulationSteps[simStep].browserState.memory.accessToken}
                      </span>
                    </div>
                  </div>

                  {/* HttpOnly Cookies */}
                  <div>
                    <div className="text-[14px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">HttpOnly Cookies (IdP SSO Session)</div>
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono space-y-1">
                      {Object.entries(simulationSteps[simStep].browserState.cookies).map(([key, val]) => (
                        <div key={key} className="flex justify-between gap-2">
                          <span className="text-indigo-400 font-semibold">{key}:</span>
                          <span className="text-slate-400 truncate max-w-[200px]" title={val}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Server State Inspection */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                  <Database className="text-emerald-400" size={16} />
                  <span className="text-xs font-bold text-slate-300">중앙 및 리소스 서버 상태</span>
                </div>
                <div className="p-4 space-y-4 text-xs">
                  <div className="space-y-1.5 pb-3 border-b border-slate-800/50">
                    <div className="text-[13px] font-mono font-semibold text-slate-500 uppercase tracking-wider">SSO 통합 인증 세션 (IdP)</div>
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-indigo-300 text-[14px] leading-relaxed break-all">{simulationSteps[simStep].serverState.authServer}</div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[13px] font-mono font-semibold text-slate-500 uppercase tracking-wider">백엔드 API 리소스 서버 인가</div>
                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-emerald-300 text-[14px] leading-relaxed break-all">{simulationSteps[simStep].serverState.resourceServer}</div>
                  </div>
                </div>
              </div>

          </div>

        </div>
      </div>
    </div>
  );
}
