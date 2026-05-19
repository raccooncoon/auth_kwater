import React, { useState } from 'react';

class ErrorBoundary extends React.Component {
  state = { err: null };
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) {
    console.log('[ErrorBoundary]', err?.message, err?.stack?.split('\n').slice(0, 8).join('\n'));
  }
  render() {
    if (this.state.err) {
      return <pre style={{ color: '#fca5a5', padding: 24, fontSize: 12, whiteSpace: 'pre-wrap' }}>
        ERROR: {String(this.state.err?.message || this.state.err)}
        {'\n\n'}
        {this.state.err?.stack?.split('\n').slice(0, 12).join('\n')}
      </pre>;
    }
    return this.props.children;
  }
}
import {
  BookOpen,
  Key,
  LogOut,
  ArrowRightLeft,
  ShieldCheck,
  Code2,
  Terminal,
  Check,
  ChevronRight,
  ChevronLeft,
  Layers,
  Activity,
  AlertTriangle,
  FileText
} from 'lucide-react';

import { simulationSteps } from './data/simulationSteps';

import Overview from './components/views/Overview';
import MultiSso from './components/views/MultiSso';
import Sequence from './components/views/Sequence';
import Flow from './components/views/Flow';
import Tokens from './components/views/Tokens';
import Logout from './components/views/Logout';
import ApiSpec from './components/views/ApiSpec';
import CodeExample from './components/views/CodeExample';
import SpecDoc from './components/views/SpecDoc';

// 탭 순서 — 사이드바·이전/다음 네비게이션 공통 사용
const TAB_ORDER = [
  { id: 'overview',  label: '1. 연동 개요' },
  { id: 'multi-sso', label: '2. 통합 & 하위 포털 SSO' },
  { id: 'sequence',  label: '3. 데이터 흐름 시퀀스' },
  { id: 'flow',      label: '4. 상세 연동 시뮬레이터' },
  { id: 'tokens',    label: '5. 토큰 발급 & 갱신 (RTR)' },
  { id: 'logout',    label: '6. 통합 로그아웃 (SLO)' },
  { id: 'api',       label: 'Endpoints Spec' },
  { id: 'code',      label: '구현 예제 코드' },
  { id: 'spec-doc',  label: '서버 구축 요구사항 & 스펙' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopy = (text, id) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      triggerToast('클립보드에 복사되었습니다.');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased overflow-hidden">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              SSO Auth Server
              <span className="text-xs font-normal bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">OIDC Multi-Portal Specs</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">클라우드 관리 포털 (CMP) & 하위 독립 포털 상세 연동 시뮬레이터</p>
          </div>
        </div>
      </header>

      {/* Sample data disclaimer banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-center gap-2">
        <AlertTriangle className="text-amber-400 shrink-0" size={14} />
        <p className="text-[13px] md:text-xs text-amber-200 leading-relaxed text-center">
          본 가이드의 모든 <strong className="text-amber-100">URL · 도메인 · client_id · 토큰 값 · 사용자 정보</strong>는 설명을 위해 만든 <strong className="text-amber-100">임의의 예시 데이터</strong>입니다. 실제 운영 환경의 값과 다릅니다.
        </p>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Navigation Sidebar (collapsible on lg+) */}
        <nav className={`w-full ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'} border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 p-3 lg:p-4 space-y-1 shrink-0 transition-all duration-200 relative lg:overflow-y-auto`}>
          {/* Collapse toggle (visible on lg+) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-full mb-3 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 transition"
            title={sidebarCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={16} /><span className="ml-1.5 text-xs font-semibold">메뉴 접기</span></>}
          </button>

          {!sidebarCollapsed && <div className="hidden lg:block text-[13px] font-semibold text-slate-500 tracking-wider uppercase px-3 mb-2">메인 가이드</div>}

          {[
            { id: 'overview', icon: BookOpen, label: '1. 연동 개요' },
            { id: 'multi-sso', icon: Layers, label: '2. 통합 & 하위 포털 SSO' },
            { id: 'sequence', icon: Activity, label: '3. 데이터 흐름 시퀀스' },
            { id: 'flow', icon: ArrowRightLeft, label: '4. 상세 연동 시뮬레이터' },
            { id: 'tokens', icon: Key, label: '5. 토큰 발급 & 갱신 (RTR)' },
            { id: 'logout', icon: LogOut, label: '6. 통합 로그아웃 (SLO)' },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                <Icon size={18} className="shrink-0" />
                <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </button>
            );
          })}

          {!sidebarCollapsed && <div className="hidden lg:block text-[13px] font-semibold text-slate-500 tracking-wider uppercase px-3 pt-6 mb-2">개발 정보</div>}
          {sidebarCollapsed && <div className="hidden lg:block border-t border-slate-800 my-3"></div>}

          {[
            { id: 'api', icon: Terminal, label: 'Endpoints Spec' },
            { id: 'code', icon: Code2, label: '구현 예제 코드' },
            { id: 'spec-doc', icon: FileText, label: '서버 구축 요구사항 & 스펙' },
          ].map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'space-x-3 px-3'} py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
              >
                <Icon size={18} className="shrink-0" />
                <span className={sidebarCollapsed ? 'lg:hidden' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Area */}
        <main className="flex-1 px-6 md:px-10 pt-6 md:pt-10 pb-0 overflow-y-auto">
          
          {/* TOAST NOTIFICATION */}
          {showToast && (
            <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-slate-700 text-indigo-400 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
              <Check size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-slate-200">{toastMessage}</span>
            </div>
          )}

          {activeTab === 'overview' && <Overview setActiveTab={setActiveTab} handleCopy={handleCopy} />}
          {activeTab === 'multi-sso' && <MultiSso />}
          {activeTab === 'sequence' && <Sequence />}
          {activeTab === 'flow' && <Flow simulationSteps={simulationSteps} simStep={simStep} setSimStep={setSimStep} handleCopy={handleCopy} setActiveTab={setActiveTab} />}
          {activeTab === 'tokens' && <ErrorBoundary><Tokens /></ErrorBoundary>}
          {activeTab === 'logout' && <ErrorBoundary><Logout handleCopy={handleCopy} /></ErrorBoundary>}
          {activeTab === 'api' && <ErrorBoundary><ApiSpec /></ErrorBoundary>}
          {activeTab === 'code' && <ErrorBoundary><CodeExample handleCopy={handleCopy} copiedId={copiedId} /></ErrorBoundary>}
          {activeTab === 'spec-doc' && <ErrorBoundary><SpecDoc /></ErrorBoundary>}

          {/* 페이지 하단 이전/다음 네비게이션 — 모든 탭 공통 */}
          <PageNav activeTab={activeTab} onChange={setActiveTab} />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/60 px-6 py-2.5 text-center text-[11px] text-slate-500 shrink-0">
        <p>© 2026 Enterprise SSO Auth Portal · OAuth 2.1 & OpenID Connect 표준 사양 준수</p>
      </footer>
    </div>
  );
}

// 페이지 하단 이전/다음 네비게이션
function PageNav({ activeTab, onChange }) {
  const idx = TAB_ORDER.findIndex(t => t.id === activeTab);
  if (idx === -1) return null;
  const prev = idx > 0 ? TAB_ORDER[idx - 1] : null;
  const next = idx < TAB_ORDER.length - 1 ? TAB_ORDER[idx + 1] : null;

  const go = (id) => {
    onChange(id);
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const btn = "group flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 transition w-full";

  return (
    <div className="mt-16 pt-8 pb-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
      {prev ? (
        <button onClick={() => go(prev.id)} className={btn} title={prev.label}>
          <ChevronLeft className="shrink-0 text-slate-500 group-hover:text-indigo-400 transition" size={20} />
          <div className="text-left min-w-0 flex-1">
            <div className="text-[11px] text-slate-500 uppercase tracking-widest">← 이전</div>
            <div className="text-sm font-semibold text-white truncate">{prev.label}</div>
          </div>
        </button>
      ) : <div />}
      {next ? (
        <button onClick={() => go(next.id)} className={`${btn} md:flex-row-reverse`} title={next.label}>
          <ChevronRight className="shrink-0 text-slate-500 group-hover:text-indigo-400 transition" size={20} />
          <div className="text-right min-w-0 flex-1">
            <div className="text-[11px] text-slate-500 uppercase tracking-widest">다음 →</div>
            <div className="text-sm font-semibold text-white truncate">{next.label}</div>
          </div>
        </button>
      ) : <div />}
    </div>
  );
}
