import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  BookOpen,
  Key,
  RefreshCw,
  LogOut,
  ArrowRightLeft,
  ShieldCheck,
  Code2,
  Terminal,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Info,
  Server,
  Laptop,
  Layers,
  Network,
  Database,
  Eye,
  Settings,
  Activity,
  Building2,
  Sparkles,
  Boxes,
  ArrowDown,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedId, setCopiedId] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [codeLang, setCodeLang] = useState('react'); // react | spring
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

  // 6-Step Detailed Simulation Steps
  const simulationSteps = [
    {
      title: "1단계: K-water 통합 인증 시스템 연동 및 암호화 데이터 수신",
      sender: "K-water System (Browser)",
      receiver: "디지털플랫폼 통합인증 서버",
      phase: "Upstream IdP Login",
      desc: "사용자가 디지털플랫폼 통합 포털에 접근하기 위해 K-water 인증 시스템을 거칩니다. 인증이 완료되면 K-water는 사용자 아이디 등 주요 정보를 암호화한 페이로드(Payload)를 디지털플랫폼 통합인증 서버의 콜백 URL로 전달합니다.",
      userView: "사용자가 디지털플랫폼 포털 URL을 입력하면 자동으로 K-water 로그인 화면으로 이동합니다. 익숙한 K-water 사번과 비밀번호를 입력하면 됩니다 — 별도 회원가입이나 추가 계정이 전혀 없습니다.",
      purpose: "K-water는 전사 사용자 마스터 DB의 단일 신원 보증 주체입니다. 디지털플랫폼은 자체 ID/PW 관리 없이 K-water 신원을 그대로 활용하여 계정 동기화 부담을 0으로 만듭니다.",
      warning: "Step 0에서 디지털플랫폼이 K-water로 리다이렉트하기 전 sessionStorage에 미리 저장해둔 state 값을 콜백에서 반드시 검증해야 합니다. 빠지면 CSRF 공격으로 다른 사용자의 페이로드를 주입당할 수 있습니다.",
      payload: {
        endpoint: "GET https://auth.kwater.com/oauth2/kwater/callback",
        queryParams: {
          kwater_enc_payload: "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.OKOawW...[암호화된 JWE 토큰]",
          state: "secure_random_state_9812"
        }
      },
      browserState: {
        sessionStorage: {
          kwater_auth_state: "secure_random_state_9812"
        },
        memory: { accessToken: "Null" },
        cookies: { "auth.kwater.com": "No Session" }
      },
      serverState: {
        authServer: "K-water 페이로드 수신 및 대기 중",
        resourceServer: "토큰 인증 필요"
      }
    },
    {
      title: "2단계: 암호화 페이로드 복호화 및 통합 SSO 세션 수립",
      sender: "디지털플랫폼 통합인증 서버",
      receiver: "Browser (Set-Cookie)",
      phase: "Decryption & Session Creation",
      desc: "디지털플랫폼 통합인증 서버는 수신한 K-water 암호화 데이터를 복호화하여 사용자 아이디와 권한 정보를 추출합니다. 검증 성공 시 디지털플랫폼 생태계 전반에서 유효한 '디지털플랫폼 SSO 통합 세션 쿠키'를 브라우저에 발급합니다.",
      userView: "사용자 입장에서는 잠깐 흰 화면이 깜빡인 뒤 디지털플랫폼 화면이 나타납니다 — 어떤 폼도 추가로 보지 않았는데 이미 로그인이 끝나 있습니다. 이 시점부터 같은 브라우저로 어떤 디지털플랫폼 포털에 접속해도 다시 로그인할 필요가 없습니다.",
      purpose: "K-water 페이로드는 일회용 입장권입니다. 이를 디지털플랫폼 내부에서 통용되는 SSO 쿠키로 '교환'해두지 않으면, 사용자가 데이터허브로 이동할 때마다 K-water 로그인을 다시 거쳐야 합니다. 이 쿠키가 SSO의 출발점이자 단일 진실 근거(source of truth)입니다.",
      warning: "Set-Cookie에 HttpOnly · Secure · SameSite=Lax 중 하나라도 빠지면 XSS/CSRF 위험이 급격히 증가합니다. 특히 SameSite=None을 쓰려면 Secure가 반드시 동반되어야 하며, HTTPS가 아닌 환경은 운영 불가입니다.",
      payload: {
        internal_action: "DECRYPT(kwater_enc_payload)",
        extracted_data: {
          user_id: "kwater_user_1234",
          department: "수자원관리본부",
          role: "ADMIN"
        },
        responseHeaders: {
          "Set-Cookie": "innogrid_sso_session=inno_sess_892347a8f; Domain=auth.kwater.com; Secure; HttpOnly; SameSite=Lax"
        }
      },
      browserState: {
        sessionStorage: {
          kwater_auth_state: "Consumed (Cleared)"
        },
        memory: { accessToken: "Null" },
        cookies: { "auth.kwater.com": "innogrid_sso_session=inno_sess_892347a8f (HttpOnly)" }
      },
      serverState: {
        authServer: "Active (Session: inno_sess_892347a8f, User: kwater_user_1234)",
        resourceServer: "토큰 인증 필요"
      }
    },
    {
      title: "3단계: 클라우드 관리 포털 (CMP) 토큰 발급 (Token Exchange)",
      sender: "디지털플랫폼 통합인증 서버",
      receiver: "클라우드 관리 포털 (CMP) Backend",
      phase: "Back-channel Exchange",
      desc: "인증 서버는 클라우드 관리 포털 (CMP)로 1회용 인가 코드(Authorization Code)를 반환하고, 포털 백엔드는 이를 백채널로 인증 서버에 전송하여 실제 서비스 API 호출에 사용할 Access Token과 Refresh Token을 최종 획득합니다.",
      userView: "사용자는 CMP 대시보드를 마주합니다. 별도 로그인 절차 없이 자기 권한(예: 수자원관리본부 ADMIN)에 맞는 메뉴와 자원 목록이 자동으로 펼쳐져 보입니다. 토큰 교환은 백그라운드에서 일어나므로 화면에는 흔적이 없습니다.",
      purpose: "SSO 쿠키만으로는 보호된 API를 호출할 수 없습니다. OIDC 표준에 따라 client_id별로 묶인 Access Token이 필요한 이유는, 같은 사용자라도 어느 포털이 호출했는지 감사 로그(audit)에 정확히 남기고, 포털별 스코프(Scope)로 권한을 잘게 쪼개기 위함입니다.",
      warning: "client_secret이 프론트엔드 JS 번들에 노출되면 토큰 위조가 가능해집니다. 반드시 백엔드 환경변수(또는 KMS/Vault)에서만 주입하세요. 또한 인가 코드는 30초~10분 안에 1회만 교환 가능하며, 재사용 시도는 자동 차단됩니다.",
      payload: {
        step1_redirect: "REDIRECT https://cmp.kwater.com/callback?code=inno_auth_code_7718",
        step2_token_request_endpoint: "POST https://auth.kwater.com/oauth2/v1/token",
        step2_body: {
          grant_type: "authorization_code",
          code: "inno_auth_code_7718",
          redirect_uri: "https://cmp.kwater.com/callback",
          client_id: "cmp-portal",
          client_secret: "[Confidential Client 시크릿, 백엔드 환경 변수에서만 주입]"
        },
        responseBody: {
          access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI... [CMP용 Access Token]",
          refresh_token: "rfr_master_771239ab8c19ef",
          token_type: "Bearer",
          expires_in: 3600
        }
      },
      browserState: {
        sessionStorage: {},
        memory: { accessToken: "eyJhbGciOiJSUzI1NiI... (클라우드 관리 포털 (CMP) 세션 활성화)" },
        cookies: { "auth.kwater.com": "innogrid_sso_session=inno_sess_892347a8f" }
      },
      serverState: {
        authServer: "Active Session & Generated JWT (Client: cmp-portal)",
        resourceServer: "인가 성공 (통합 관리 권한 활성화)"
      }
    },
    {
      title: "4단계: 데이터허브 등 하위 포털 무상호작용 인가 (Silent SSO)",
      sender: "Browser (데이터허브/생성형 AI/SaaS)",
      receiver: "디지털플랫폼 통합인증 서버",
      phase: "Cross-Origin Navigation",
      desc: "사용자가 하위 서비스 포털(예: 데이터허브)로 접속합니다. 데이터허브 프론트엔드는 토큰이 없음을 파악하고, 사용자 개입을 없애기 위해 'prompt=none' 파라미터를 추가하여 디지털플랫폼 통합인증 서버로 리다이렉트합니다.",
      userView: "사용자가 CMP 메뉴에서 '데이터허브'를 클릭합니다. 새 탭이나 같은 탭에서 데이터허브 도메인으로 이동하지만 — 로그인 폼은 절대 보이지 않습니다. 짧은 페이지 깜빡임만 있고 데이터허브 메인이 떠 있습니다. 사용자는 \"같은 서비스 안에서 이동했다\"고 느낍니다.",
      purpose: "각 하위 포털은 독립 client_id를 갖고 자기만의 토큰을 받아야 합니다 (포털별 스코프 분리). 하지만 \"또 로그인하세요\"는 SSO 경험을 깨므로, OIDC 표준의 prompt=none 옵션으로 \"UI 없이 백그라운드에서만 인증해줘\"라고 인증 서버에 요청합니다. SSO 쿠키가 유효하면 인증 서버가 즉시 인가 코드만 발급합니다.",
      warning: "prompt=none 요청에 state가 빠지면 CSRF로 다른 사용자의 토큰을 갈취당할 수 있습니다. 또한 SSO 쿠키가 만료된 상태라면 login_required 에러가 돌아오는데, 이 경우 즉시 일반 로그인 흐름(prompt 없음)으로 폴백하는 처리를 반드시 구현해야 합니다.",
      payload: {
        endpoint: "GET https://auth.kwater.com/oauth2/v1/authorize",
        queryParams: {
          response_type: "code",
          client_id: "datahub-portal-id",
          redirect_uri: "https://datahub.kwater.com/callback",
          scope: "openid profile datahub:read",
          state: "sub_random_state_4410",
          prompt: "none"
        }
      },
      browserState: {
        sessionStorage: {
          auth_state: "sub_random_state_4410"
        },
        memory: { accessToken: "Null (하위 포털 기준 토큰 부재)" },
        cookies: { "auth.kwater.com": "innogrid_sso_session=inno_sess_892347a8f (이전 로그인 유지 중)" }
      },
      serverState: {
        authServer: "SSO 세션 유효함 확인완료 (ID: inno_sess_892347a8f)",
        resourceServer: "토큰 대기"
      }
    },
    {
      title: "5단계: 데이터허브 전용 토큰 자동 발급 (Silent Callback)",
      sender: "디지털플랫폼 통합인증 서버",
      receiver: "데이터허브 Backend",
      phase: "Silent SSO Completion",
      desc: "디지털플랫폼 통합인증 서버는 전송된 SSO 쿠키를 확인하여 K-water 사용자임을 승인하고, 폼 로그인 없이 데이터허브 콜백으로 인가 코드를 보냅니다. 데이터허브 백엔드는 이를 교환해 데이터허브 전용 토큰을 획득합니다.",
      userView: "데이터허브 화면이 완전히 로드되고, 사용자는 자기 권한 범위 내의 데이터셋·테이블만 목록에서 볼 수 있습니다. CMP 토큰과는 완전히 분리되어 있으므로, CMP에서 만료가 일어나도 데이터허브 세션은 독립적으로 유지됩니다.",
      purpose: "각 포털별로 토큰을 따로 발급하면 (1) 한 포털 토큰이 유출되어도 다른 포털은 안전하고, (2) 포털마다 서로 다른 scope/role을 분리 관리할 수 있고, (3) 로그·감사·과금을 포털 단위로 정확히 집계할 수 있습니다. 같은 사용자라도 \"누가 어느 포털에서 무엇을 했는지\"가 명확해집니다.",
      warning: "여러 포털 탭이 동시에 열리면 토큰 발급 요청이 병렬로 발생할 수 있습니다. 인증 서버는 각 client_id별로 독립 세션 카운터·rate limit을 둬야 하며, 데이터허브 백엔드도 발급된 Refresh Token을 자기 세션 스토어에 저장할 때 동시성 충돌을 막아야 합니다.",
      payload: {
        redirect: "REDIRECT https://datahub.kwater.com/callback?code=datahub_code_9918",
        token_request_body: {
          grant_type: "authorization_code",
          code: "datahub_code_9918",
          redirect_uri: "https://datahub.kwater.com/callback",
          client_id: "datahub-portal-id",
          client_secret: "[Datahub Confidential Client 시크릿]"
        },
        responseBody: {
          access_token: "eyJhbGciOiJSUzI1NiIsInR5c... [데이터허브 전용 토큰]",
          refresh_token: "rfr_datahub_995512bc8",
          token_type: "Bearer",
          expires_in: 3600
        }
      },
      browserState: {
        sessionStorage: {},
        memory: { accessToken: "eyJhbGciOiJSUzI1NiI... (데이터허브 세션 독립 활성화)" },
        cookies: { "auth.kwater.com": "innogrid_sso_session=inno_sess_892347a8f" }
      },
      serverState: {
        authServer: "SSO 활성 세션 유지 중 및 데이터허브 클라이언트 인가 완료",
        resourceServer: "데이터허브 API 권한 활성화"
      }
    },
    {
      title: "6단계: 디지털플랫폼 생태계 통합 단일 로그아웃 (SLO)",
      sender: "임의 포털 (CMP/데이터허브 등)",
      receiver: "디지털플랫폼 통합인증 서버 ➜ 하위 포털들",
      phase: "Global Revocation",
      desc: "포털 중 한 곳에서 로그아웃 시, 디지털플랫폼 통합인증 서버는 중앙 SSO 세션을 만료시키고, 데이터허브, 생성형 AI, SaaS 포털 등의 백엔드 로그아웃 엔드포인트(Back-channel)로 로그아웃 토큰을 밀어넣어 전사 동시 로그아웃을 완수합니다.",
      userView: "사용자가 어떤 포털에서든 '로그아웃'을 한 번 누르면, 다른 탭에 열려 있던 모든 디지털플랫폼 포털도 거의 동시에 로그아웃됩니다. 새로 고침하거나 다음 API 호출을 보내는 순간 로그인 화면으로 튕깁니다 — 한 곳에서 끄면 모든 곳이 꺼지는 SSO의 마지막 약속입니다.",
      purpose: "토큰만 무효화하는 것으로는 부족합니다. 브라우저에 남은 SSO 쿠키 때문에 사용자가 다른 포털을 열면 Silent SSO로 즉시 다시 토큰을 받아버리기 때문입니다. 중앙 SSO 쿠키 파기 + 백채널로 각 포털 세션 강제 종료 두 가지가 동시에 일어나야 진정한 \"전사 로그아웃\"이 완성됩니다.",
      warning: "백채널 로그아웃 푸시는 네트워크 실패·포털 일시 장애 등으로 누락될 수 있습니다. 비동기 재시도 큐와 멱등성 보장(jti 기반 중복 차단)이 필수이며, 끝내 실패한 포털은 짧은 토큰 TTL과 인트로스펙션으로 최종 정리해야 합니다.",
      payload: {
        logout_trigger: "GET https://auth.kwater.com/oauth2/v1/logout?id_token_hint=...",
        backchannel_push_to_datahub: "POST https://api.datahub.kwater.com/oauth2/v1/backchannel-logout",
        backchannel_push_to_genai: "POST https://api.genai.kwater.com/oauth2/v1/backchannel-logout",
        backchannel_payload: {
          logout_token: "eyJhbGciOiJSUzI1NiJ9.eyJlc3RfZXZlbnRzIjp... [서명된 로그아웃 토큰]"
        }
      },
      browserState: {
        sessionStorage: {},
        memory: { accessToken: "Null (메모리 완전 소거)" },
        cookies: { "auth.kwater.com": "Expired (innogrid_sso_session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT)" }
      },
      serverState: {
        authServer: "Inactive (All Sessions Revoked)",
        resourceServer: "모든 포털 API 요청 반려 (401 Unauthorized)"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col antialiased">
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
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Navigation Sidebar (collapsible on lg+) */}
        <nav className={`w-full ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-72'} border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950/40 p-3 lg:p-4 space-y-1 shrink-0 transition-all duration-200 relative`}>
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
            { id: 'sequence', icon: Activity, label: '3. 데이터 흐름 애니메이션' },
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
        <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
          
          {/* TOAST NOTIFICATION */}
          {showToast && (
            <div className="fixed bottom-5 right-5 z-50 bg-slate-800 border border-slate-700 text-indigo-400 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2">
              <Check size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-slate-200">{toastMessage}</span>
            </div>
          )}

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* Hero */}
              <div className="relative bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-8 md:p-10 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[12px] font-mono font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded">SSO Integration Guide v1.0</span>
                    <span className="text-[12px] font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded">OIDC · OAuth 2.1</span>
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
                    <div className="text-[13px] text-slate-400 mt-1">클라이언트 포털 (CMP + 3 Sub)</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-3xl font-extrabold text-emerald-300">12</div>
                    <div className="text-[13px] text-slate-400 mt-1">시퀀스 단계 (4 Phase)</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-3xl font-extrabold text-amber-300">15분</div>
                    <div className="text-[13px] text-slate-400 mt-1">Access Token TTL</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                    <div className="text-3xl font-extrabold text-rose-300">RTR</div>
                    <div className="text-[13px] text-slate-400 mt-1">Refresh Token 회전 + 도난 감지</div>
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
                    <div className="text-[12px] text-slate-500 mt-0.5">OpenID Connect</div>
                  </div>
                  <div className="bg-slate-950 border border-emerald-500/30 rounded-lg px-3 py-2.5 text-center">
                    <div className="text-emerald-300 font-bold font-mono">OAuth 2.1</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">최신 보안 BCP 반영</div>
                  </div>
                  <div className="bg-slate-950 border border-purple-500/30 rounded-lg px-3 py-2.5 text-center">
                    <div className="text-purple-300 font-bold font-mono">RFC 8417</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">Back-Channel Logout</div>
                  </div>
                  <div className="bg-slate-950 border border-amber-500/30 rounded-lg px-3 py-2.5 text-center">
                    <div className="text-amber-300 font-bold font-mono">JWT · JWS · JWE</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">RFC 7519 / 7515 / 7516</div>
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
                  <button onClick={() => setActiveTab('multi-sso')} className="text-[13px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
                    전체 다이어그램 보기 <ChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[12px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 1</div>
                    <div className="flex-1 bg-slate-950 border border-sky-500/40 rounded-lg px-4 py-2.5 relative flex items-center justify-center gap-2">
                      <Building2 size={16} className="text-sky-400" />
                      <span className="text-sm text-white font-bold">K-water 통합 인증 시스템</span>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-slate-500 font-mono">Upstream IdP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-slate-600 text-xs">↓ 암호화 페이로드 (JWE/SAML)</div>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[12px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 2</div>
                    <div className="flex-1 bg-slate-950 border border-indigo-500/40 rounded-lg px-4 py-2.5 relative flex items-center justify-center gap-2">
                      <Server size={16} className="text-indigo-400" />
                      <span className="text-sm text-white font-bold">디지털플랫폼 통합인증 서버</span>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-emerald-400 font-mono">auth.kwater.com</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center text-slate-600 text-xs">↓ Silent SSO · 포털별 토큰 발급</div>
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[12px] font-mono font-bold uppercase px-3 py-1.5 rounded">Tier 3</div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-slate-950 border border-indigo-500/30 rounded px-2 py-1.5 text-[13px] text-center text-indigo-200">CMP</div>
                      <div className="bg-slate-950 border border-emerald-500/30 rounded px-2 py-1.5 text-[13px] text-center text-emerald-200">데이터허브</div>
                      <div className="bg-slate-950 border border-purple-500/30 rounded px-2 py-1.5 text-[13px] text-center text-purple-200">생성형 AI</div>
                      <div className="bg-slate-950 border border-amber-500/30 rounded px-2 py-1.5 text-[13px] text-center text-amber-200">SaaS</div>
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
                      <tr className="border-b border-slate-800 text-[13px] text-slate-500 uppercase">
                        <th className="py-3 px-5 font-semibold">구성 요소</th>
                        <th className="py-3 px-5 font-semibold">도메인</th>
                        <th className="py-3 px-5 font-semibold">역할</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-xs">
                      <tr>
                        <td className="py-3 px-5"><span className="bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded px-2 py-0.5 text-[12px] font-bold">UPSTREAM</span> <span className="text-white font-semibold ml-2">K-water 통합 인증 시스템</span></td>
                        <td className="py-3 px-5"><code className="text-slate-400 font-mono">(별도)</code></td>
                        <td className="py-3 px-5 text-slate-400">1차 사용자 인증 + 암호화 페이로드 발급</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5"><span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-[12px] font-bold">IDP HUB</span> <span className="text-white font-semibold ml-2">디지털플랫폼 통합인증 서버</span></td>
                        <td className="py-3 px-5"><code className="text-emerald-400 font-mono">auth.kwater.com</code></td>
                        <td className="py-3 px-5 text-slate-400">SSO 세션 발급/관리 · 포털별 토큰 교환 · SLO 브로드캐스트</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5"><span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded px-2 py-0.5 text-[12px] font-bold">MASTER</span> <span className="text-white font-semibold ml-2">클라우드 관리 포털 (CMP)</span></td>
                        <td className="py-3 px-5"><code className="text-slate-400 font-mono">cmp.kwater.com</code></td>
                        <td className="py-3 px-5 text-slate-400">K-water 페이로드 최초 수신 · 디지털플랫폼 진입점</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5"><span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded px-2 py-0.5 text-[12px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">데이터허브 포털</span></td>
                        <td className="py-3 px-5"><code className="text-slate-400 font-mono">datahub.kwater.com</code></td>
                        <td className="py-3 px-5 text-slate-400">데이터셋·테이블 조회 · 데이터허브 전용 scope</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5"><span className="bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded px-2 py-0.5 text-[12px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">생성형 AI 포털</span></td>
                        <td className="py-3 px-5"><code className="text-slate-400 font-mono">genai.kwater.com</code></td>
                        <td className="py-3 px-5 text-slate-400">LLM 호출 · 토큰 사용량 관리</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-5"><span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded px-2 py-0.5 text-[12px] font-bold">SUB</span> <span className="text-white font-semibold ml-2">SaaS 포털</span></td>
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
                  <button onClick={() => handleCopy('https://auth.kwater.com/.well-known/openid-configuration', 'oidc-disc')} className="text-[13px] text-slate-400 hover:text-white flex items-center gap-1">
                    <Copy size={11} /> Discovery URL 복사
                  </button>
                </div>
                <div className="p-6 divide-y divide-slate-800/60">
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm text-slate-400 font-medium">Issuer (발행처)</span>
                    <code className="text-xs bg-slate-950 text-emerald-400 px-3 py-1 rounded-md border border-slate-800">https://auth.kwater.com/oauth2/v1</code>
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
                    <code className="text-xs bg-slate-950 text-indigo-300 px-3 py-1 rounded-md border border-slate-800">/oauth2/v1/jwks</code>
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
                    <p className="text-[13px] text-slate-400">3계층 토폴로지 + Silent SSO 상세 동작</p>
                  </button>
                  <button onClick={() => setActiveTab('sequence')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-white">3. 데이터 흐름 시퀀스</span>
                      <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[13px] text-slate-400">12단계 · 4페이즈 시퀀스 다이어그램</p>
                  </button>
                  <button onClick={() => setActiveTab('flow')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowRightLeft size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-white">4. 상세 연동 시뮬레이터</span>
                      <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[13px] text-slate-400">단계별 페이로드·브라우저 상태·사용자 시점</p>
                  </button>
                  <button onClick={() => setActiveTab('tokens')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <Key size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-white">5. 토큰 라이프사이클</span>
                      <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[13px] text-slate-400">JWT 분해 · RTR · 저장 위치 · 위협 매핑</p>
                  </button>
                  <button onClick={() => setActiveTab('logout')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <LogOut size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-white">6. 통합 로그아웃 (SLO)</span>
                      <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[13px] text-slate-400">하위 포털 + 상위 K-water 로그아웃 연계</p>
                  </button>
                  <button onClick={() => setActiveTab('code')} className="text-left bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 transition group">
                    <div className="flex items-center gap-2 mb-1">
                      <Code2 size={14} className="text-indigo-400" />
                      <span className="text-sm font-bold text-white">구현 예제 코드</span>
                      <ChevronRight size={12} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition" />
                    </div>
                    <p className="text-[13px] text-slate-400">React Axios Interceptor + Spring Boot 3 · OAuth2 Resource Server</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. MULTI-PORTAL SSO ARCHITECTURE */}
          {activeTab === 'multi-sso' && (
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

                {/* Tier 2: Inogrid Auth Server (Hub) */}
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
                            <strong className="text-white">쿠키 자동 전송</strong> — 브라우저가 <code className="text-indigo-300 text-xs">auth.kwater.com</code> 도메인으로 요청하므로 Phase 1에서 발급된 <code className="text-indigo-300 text-xs">innogrid_sso_session</code> HttpOnly 쿠키가 자동 동봉됩니다.
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
                      <CodeBlock language="http" code={`GET https://auth.kwater.com/oauth2/v1/authorize
  ?response_type=code
  &client_id=datahub-portal-id
  &redirect_uri=https://datahub.kwater.com/callback
  &scope=openid profile datahub:read
  &state=sub_random_state_4410
  &prompt=none           ← 핵심: UI 노출 금지`} />
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
          )}

          {/* 3. DETAILED FLOW SIMULATOR */}
          {activeTab === 'flow' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">통합 & 하위 포털 연동 상세 추적</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  브라우저 로컬 데이터, 토큰 상태 및 백그라운드 교환 처리를 각 단계별 데이터 스냅샷을 통해 입체적으로 분석합니다.
                </p>
              </div>

              <div className="bg-indigo-500/5 border border-indigo-500/30 rounded-xl px-4 py-3 flex items-start gap-2">
                <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  본 시뮬레이터는 핵심 흐름만 <strong className="text-white">6개 단계</strong>로 단순화하여 페이로드·상태 변화를 추적합니다. 토큰 갱신(RTR)·사용자 로그아웃 트리거 등을 포함한 <strong className="text-white">전체 12단계 흐름</strong>은 <button onClick={() => setActiveTab('sequence')} className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">3. 데이터 흐름 애니메이션</button> 탭의 시퀀스 다이어그램을 참고하세요.
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
                      <span className="text-[12px] font-bold tracking-wider uppercase mb-1.5">Step {idx + 1}</span>
                      <span className="text-[13px] font-semibold line-clamp-2 leading-relaxed text-slate-300">{step.title}</span>
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
                        <span className="self-start md:self-auto text-[12px] font-mono font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
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
                          <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-emerald-300">User View · 사용자가 보는 화면</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{simulationSteps[simStep].userView}</p>
                      </div>
                    )}

                    {simulationSteps[simStep].purpose && (
                      <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="text-indigo-400" size={16} />
                          <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-indigo-300">Why · 이 단계가 필요한 이유</span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{simulationSteps[simStep].purpose}</p>
                      </div>
                    )}

                    {simulationSteps[simStep].warning && (
                      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="text-amber-400" size={16} />
                          <span className="text-[12px] font-mono font-bold uppercase tracking-widest text-amber-300">Pitfall · 자주 빠지는 함정</span>
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
                            <div className="text-[12px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">sessionStorage (OIDC State / CSRF 방지)</div>
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
                            <div className="text-[12px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">JS In-Memory State (Access Token)</div>
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono flex justify-between gap-2">
                              <span className="text-emerald-400">accessToken:</span>
                              <span className="text-slate-400 truncate max-w-[200px]" title={simulationSteps[simStep].browserState.memory.accessToken}>
                                {simulationSteps[simStep].browserState.memory.accessToken}
                              </span>
                            </div>
                          </div>

                          {/* HttpOnly Cookies */}
                          <div>
                            <div className="text-[12px] font-mono font-semibold text-slate-500 uppercase mb-1.5 tracking-wider">HttpOnly Cookies (IdP SSO Session)</div>
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
                            <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">SSO 통합 인증 세션 (IdP)</div>
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-indigo-300 text-[12px] leading-relaxed break-all">{simulationSteps[simStep].serverState.authServer}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">백엔드 API 리소스 서버 인가</div>
                            <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg font-mono text-emerald-300 text-[12px] leading-relaxed break-all">{simulationSteps[simStep].serverState.resourceServer}</div>
                          </div>
                        </div>
                      </div>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* 4. SEQUENCE FLOW STATIC DIAGRAM TAB */}
          {activeTab === 'sequence' && (
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
          )}

          {/* 5. TOKENS TAB */}
          {activeTab === 'tokens' && (
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
          )}

          {/* 6. LOGOUT TAB */}
          {activeTab === 'logout' && (
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
                    code={`GET https://auth.kwater.com/oauth2/v1/logout?id_token_hint=eyJhbGciOiJSUzI1NiIs...&post_logout_redirect_uri=https://cmp.kwater.com/login&state=secure_logout_state`} />
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
                          <td className="py-2 px-3 font-mono text-purple-300">SAML SLO</td>
                          <td className="py-2 px-3 text-slate-400">K-water IdP → 우리 SP SLO endpoint (LogoutRequest)</td>
                          <td className="py-2 px-3 text-emerald-400 font-semibold">높음</td>
                          <td className="py-2 px-3 text-slate-400">K-water 페이로드가 SAML Assertion 기반인 경우</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Back-channel example */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[12px] font-mono px-2 py-0.5 rounded">RECOMMENDED</span>
                      Back-Channel Logout 수신 엔드포인트 예시
                    </h4>
                    <CodeBlock language="http" code={`POST https://auth.kwater.com/oauth2/v1/kwater/backchannel-logout
Content-Type: application/x-www-form-urlencoded

logout_token=eyJhbGciOiJSUzI1NiJ9.<JWT signed by K-water>`} />
                    <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                      <code className="text-emerald-300">logout_token</code> 검증 필수 항목: <code className="text-slate-300">iss</code>=K-water issuer · <code className="text-slate-300">aud</code>=우리 client_id · <code className="text-slate-300">iat</code> 신선도 · <code className="text-slate-300">jti</code> 재사용 차단 · <code className="text-slate-300">events</code>에 <code className="text-slate-300">http://schemas.openid.net/event/backchannel-logout</code> 포함 · <code className="text-slate-300">nonce</code> 부재 · <code className="text-slate-300">sub</code> 또는 <code className="text-slate-300">sid</code>로 세션 식별 (RFC 8417 §2.6).
                    </p>
                  </div>

                  {/* K-water request checklist */}
                  <div className="bg-sky-950/30 border border-sky-500/30 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <span className="bg-sky-500/20 text-sky-300 text-[12px] font-mono px-2 py-0.5 rounded">CHECKLIST</span>
                      K-water에 정식 요청할 항목
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>Back-Channel Logout 지원 여부 확인</span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>우리 측 URL 등록 요청: <code className="text-sky-300">https://auth.kwater.com/oauth2/v1/kwater/backchannel-logout</code></span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>K-water Issuer URL 및 JWKS URI 공유 (logout_token 서명 검증용)</span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>우리에게 발급될 <code className="text-sky-300">client_id</code> (RP 등록)</span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span><code className="text-sky-300">sub</code> claim 형식 및 디지털플랫폼 user_id 매핑 정책</span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>(Back-channel 미지원시) Front-channel iframe 방식 협의</span></li>
                      <li className="flex gap-2"><Check className="shrink-0 text-emerald-400 mt-0.5" size={14} /><span>(SAML 기반이면) SP SLO Metadata 등록 + 인증서 교환</span></li>
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
          )}

          {/* 7. API SPEC TAB */}
          {activeTab === 'api' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">인증 API 엔드포인트 세부 명세</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  디지털플랫폼 통합인증 서버가 노출하는 OIDC 표준 엔드포인트 + K-water 연동 전용 엔드포인트 + 하위 포털 백채널 로그아웃 수신 엔드포인트의 전체 명세입니다.
                </p>
              </div>

              {/* Endpoint summary table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-2">
                  <Terminal className="text-indigo-400" size={18} />
                  <h3 className="font-bold text-white text-base">엔드포인트 개요</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 uppercase">
                        <th className="py-2.5 px-5">Method</th>
                        <th className="py-2.5 px-5">Path</th>
                        <th className="py-2.5 px-5">분류</th>
                        <th className="py-2.5 px-5">용도</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/.well-known/openid-configuration</td><td className="py-2 px-5 text-slate-400">Discovery</td><td className="py-2 px-5 text-slate-400">메타데이터·엔드포인트·지원 알고리즘 자동 노출</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/jwks</td><td className="py-2 px-5 text-slate-400">Discovery</td><td className="py-2 px-5 text-slate-400">JWT 서명 검증용 공개 키 집합</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/authorize</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">사용자 인가 요청 (front-channel)</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/token</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">인가 코드 ↔ 토큰 교환 · Refresh Token 갱신</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/userinfo</td><td className="py-2 px-5 text-slate-400">OIDC Core</td><td className="py-2 px-5 text-slate-400">Access Token으로 사용자 프로필 조회</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/logout</td><td className="py-2 px-5 text-slate-400">RP-Initiated Logout</td><td className="py-2 px-5 text-slate-400">사용자 발화 통합 로그아웃 시작점</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/introspect</td><td className="py-2 px-5 text-slate-400">RFC 7662</td><td className="py-2 px-5 text-slate-400">토큰 유효성/메타 정보 조회 (서버 간)</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/revoke</td><td className="py-2 px-5 text-slate-400">RFC 7009</td><td className="py-2 px-5 text-slate-400">개별 토큰 즉시 폐기</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-emerald-500/10 text-emerald-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">GET</span></td><td className="py-2 px-5 font-mono">/oauth2/kwater/callback</td><td className="py-2 px-5 text-slate-400">K-water 연동</td><td className="py-2 px-5 text-slate-400">K-water 암호화 페이로드 수신·복호화·SSO 발급</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">POST</span></td><td className="py-2 px-5 font-mono">/oauth2/v1/kwater/backchannel-logout</td><td className="py-2 px-5 text-slate-400">RFC 8417 (수신)</td><td className="py-2 px-5 text-slate-400">K-water가 호출 — 상위 SLO 수신</td></tr>
                      <tr><td className="py-2 px-5"><span className="bg-indigo-500/10 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded text-[12px]">POST</span></td><td className="py-2 px-5 font-mono">{`{portal}/oauth2/v1/backchannel-logout`}</td><td className="py-2 px-5 text-slate-400">RFC 8417 (송신)</td><td className="py-2 px-5 text-slate-400">IdP가 각 포털 백엔드로 호출 — 하위 SLO 전파</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ─── Discovery & Keys ─── */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-400 rounded"></span>
                  Discovery & Keys
                </h3>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/.well-known/openid-configuration</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">OIDC Discovery 표준 문서. 클라이언트·리소스 서버가 모든 엔드포인트·지원 알고리즘·JWKS URI를 자동 발견하도록 합니다.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK · 일부 발췌)</div>
                    <CodeBlock language="json" code={`{
  "issuer": "https://auth.kwater.com/oauth2/v1",
  "authorization_endpoint": "https://auth.kwater.com/oauth2/v1/authorize",
  "token_endpoint": "https://auth.kwater.com/oauth2/v1/token",
  "userinfo_endpoint": "https://auth.kwater.com/oauth2/v1/userinfo",
  "jwks_uri": "https://auth.kwater.com/oauth2/v1/jwks",
  "end_session_endpoint": "https://auth.kwater.com/oauth2/v1/logout",
  "introspection_endpoint": "https://auth.kwater.com/oauth2/v1/introspect",
  "revocation_endpoint": "https://auth.kwater.com/oauth2/v1/revoke",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code", "refresh_token"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "backchannel_logout_supported": true,
  "backchannel_logout_session_supported": true
}`} />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/jwks (서명 검증용 공개 키 목록)</h4>
                  </div>
                  <div className="p-6 space-y-4 text-sm">
                    <p className="text-slate-300 leading-relaxed">
                      IdP의 <strong className="text-white">공개 도장 목록</strong>입니다. 리소스 서버는 토큰의 서명이 진짜 IdP가 찍은 것인지 이 공개키로 확인합니다.
                    </p>

                    {/* Three-part friendly explanation */}
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div>
                        <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-emerald-300 mb-1">① 공개 키란?</div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          JWT(Access Token)는 IdP의 <strong className="text-slate-200">비공개 키(private key)</strong>로 서명되어 있습니다. 리소스 서버가 그 서명이 진짜인지 확인하려면 짝이 되는 <strong className="text-slate-200">공개 키(public key)</strong>가 필요한데, 그 공개 키들을 모아놓은 게 JWKS(JSON Web Key Set)입니다.
                        </p>
                      </div>

                      <div>
                        <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-indigo-300 mb-1">② TTL 1시간 캐싱</div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          매 API 호출마다 JWKS를 IdP에 묻으면 트래픽이 폭주합니다. 그래서 한 번 받은 키들을 메모리(또는 Redis)에 1시간 정도 저장해두고 재사용합니다. 1시간 후 새로 가져오면 그동안 회전된 키도 자연스럽게 반영됩니다.
                        </p>
                      </div>

                      <div>
                        <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-amber-300 mb-1">③ <code className="text-amber-300">kid</code> = key ID (어느 키로 서명했는지 표시)</div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">
                          IdP는 보안을 위해 서명용 키를 주기적으로 교체(<strong className="text-slate-200">key rotation</strong>)합니다. 단, 바꾸자마자 기존 토큰을 무효화하면 사용자들이 갑자기 로그아웃되므로 <strong className="text-slate-200">옛 키 + 새 키를 잠시 같이</strong> JWKS에 둡니다. 어느 키로 서명한 토큰인지 알려주는 게 JWT 헤더의 <code className="text-amber-300">kid</code> 값입니다.
                        </p>
                        <CodeBlock language="json" fontSize="0.72rem" code={`JWT Header:  { "alg": "RS256", "kid": "key-2026-q2" }
                                       ↑ "이 토큰은 이 키로 서명함"

JWKS 응답에서 같은 kid를 찾아 그 공개키로 검증`} />
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
                    <CodeBlock language="json" code={`{
  "keys": [
    {
      "kty": "RSA",
      "kid": "key-2026-q1",
      "use": "sig",
      "alg": "RS256",
      "n": "<modulus base64url>",
      "e": "AQAB",
      "_comment": "이전 키 — 잠시 유지하여 옛 토큰 검증"
    },
    {
      "kty": "RSA",
      "kid": "key-2026-q2",
      "use": "sig",
      "alg": "RS256",
      "n": "<modulus base64url>",
      "e": "AQAB",
      "_comment": "현재 사용 중인 키"
    }
  ]
}`} />
                  </div>
                </div>
              </div>

              {/* ─── OAuth/OIDC 핵심 흐름 ─── */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1 h-4 bg-indigo-400 rounded"></span>
                  OAuth/OIDC 핵심 흐름
                </h3>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/authorize (사용자 인가 요청)</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">사용자를 SSO 통합 로그인 화면으로 유도하거나, 하위 포털에서 Silent 인증을 요청하기 위한 관문 엔드포인트입니다.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Query Parameters</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 px-3 font-semibold">파라미터명</th>
                            <th className="py-2 px-3 font-semibold">필수 여부</th>
                            <th className="py-2 px-3 font-semibold">타입</th>
                            <th className="py-2 px-3 font-semibold">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          <tr><td className="py-2 px-3 font-mono text-white">response_type</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">반드시 <code className="text-slate-300">code</code></td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">요청 포털 고유 식별자</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">redirect_uri</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">인가 코드를 수신할 콜백 주소 (사전 등록 필수)</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">scope</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">최소 <code className="text-slate-300">openid</code> 포함, 공백 구분</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">CSRF 방지 일회용 무작위 값</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">prompt</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">none</code> 사용 시 Silent SSO</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">nonce</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">Replay 방지용 — ID Token에 그대로 반환</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">code_challenge</td><td className="py-2 px-3 text-slate-400">Optional (PKCE)</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">SPA·모바일 등 공용 클라이언트에서 권장. <code className="text-slate-300">code_verifier</code>를 SHA-256 + base64url로 인코딩한 값</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">code_challenge_method</td><td className="py-2 px-3 text-amber-400">PKCE 시 필수</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400">반드시 <code className="text-slate-300">S256</code>. <code className="text-slate-300">plain</code>은 보안상 사용 금지</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">response_mode</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3">String</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">query</code> (기본) / <code className="text-slate-300">fragment</code> / <code className="text-slate-300">form_post</code></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/token (토큰 발급 · 갱신)</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">인가 코드를 Access/Refresh Token으로 교환하거나, Refresh Token으로 새 토큰을 갱신(RTR)합니다. Confidential client는 <code className="text-indigo-300">client_secret</code> 필수, 공용 client는 PKCE 사용.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Request Body (application/x-www-form-urlencoded)</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 px-3 font-semibold">파라미터명</th>
                            <th className="py-2 px-3 font-semibold">필수 여부</th>
                            <th className="py-2 px-3 font-semibold">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          <tr><td className="py-2 px-3 font-mono text-white">grant_type</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">authorization_code</code> 또는 <code className="text-slate-300">refresh_token</code></td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">code</td><td className="py-2 px-3 text-amber-400">Code 교환 시</td><td className="py-2 px-3 text-slate-400">/authorize에서 받은 일회용 인가 코드</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">refresh_token</td><td className="py-2 px-3 text-amber-400">갱신 시</td><td className="py-2 px-3 text-slate-400">HttpOnly 쿠키 또는 본문 어느 쪽으로든 가능</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">redirect_uri</td><td className="py-2 px-3 text-amber-400">Code 교환 시</td><td className="py-2 px-3 text-slate-400">/authorize에서 사용한 값과 정확히 일치</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">포털 식별자</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">client_secret</td><td className="py-2 px-3 text-amber-400">Confidential</td><td className="py-2 px-3 text-slate-400">백엔드 환경변수에서만 주입 (BFF·서버)</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">code_verifier</td><td className="py-2 px-3 text-amber-400">PKCE</td><td className="py-2 px-3 text-slate-400">/authorize에 보낸 challenge의 원본</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
                    <CodeBlock language="json" code={`{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "rfr_771239ab8c19ef",
  "id_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "openid profile datahub:read"
}`} />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/userinfo (사용자 프로필 조회)</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">Access Token으로 인증된 사용자의 프로필 정보를 반환합니다. <code className="text-emerald-300">Authorization: Bearer ...</code> 헤더 필수.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK)</div>
                    <CodeBlock language="json" code={`{
  "sub": "kwater_user_1234",
  "name": "홍길동",
  "email": "hong@example.com",
  "department": "수자원관리본부",
  "role": "ADMIN",
  "kwater_employee_id": "K012345"
}`} />
                  </div>
                </div>
              </div>

              {/* ─── K-water 연동 ─── */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1 h-4 bg-sky-400 rounded"></span>
                  K-water 연동 (Upstream)
                </h3>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/kwater/callback (K-water 페이로드 수신)</h4>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">K-water 인증 시스템에서 암호화 페이로드(JWE/SAML)를 수신·복호화하여 디지털플랫폼 통합 SSO 세션을 생성합니다.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Query Parameters</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 px-3 font-semibold">파라미터명</th>
                            <th className="py-2 px-3 font-semibold">필수 여부</th>
                            <th className="py-2 px-3 font-semibold">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          <tr><td className="py-2 px-3 font-mono text-white">kwater_enc_payload</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">K-water가 발급한 암호화 사용자 정보 토큰 (JWE/SAML Assertion)</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">CSRF 방지 — 리다이렉트 시작 시 저장해둔 값과 일치 검증</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/kwater/backchannel-logout (K-water 로그아웃 수신)</h4>
                  </div>
                  <div className="p-6 space-y-4 text-sm">
                    <p className="text-slate-400 leading-relaxed">K-water 측에서 사용자가 로그아웃하면 K-water가 이 엔드포인트로 <code className="text-sky-300">logout_token</code>(JWT)을 POST합니다. 디지털플랫폼 통합인증 서버는 이를 검증한 뒤 SSO 세션을 만료시키고, 다시 하위 4개 포털로 백채널 로그아웃을 연쇄 전파합니다.</p>

                    <div>
                      <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mb-1">Request Body (application/x-www-form-urlencoded)</div>
                      <CodeBlock language="bash" code={`logout_token=<JWT signed by K-water, RFC 8417 §2.6>`} />
                    </div>

                    <div className="bg-slate-950/60 border border-sky-500/30 rounded-xl p-4">
                      <div className="text-[12px] font-mono font-bold uppercase tracking-widest text-sky-300 mb-2">logout_token 검증 항목 (RFC 8417 §2.6)</div>
                      <p className="text-[13px] text-slate-400 leading-relaxed mb-3">
                        K-water가 보낸 JWT 안의 클레임들을 한 줄 한 줄 확인하여 — <strong className="text-white">정말 K-water가 보낸 것인지 + 우리에게 보낸 것인지 + 변조·재사용·위장이 없는지</strong>를 검증합니다.
                      </p>
                      <ul className="space-y-2 text-[13px] text-slate-300">
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">typ</code>
                          <span>JWT 헤더가 <code className="text-slate-300">&quot;logout+jwt&quot;</code> — 일반 ID Token으로 위장된 공격 차단</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">iss</code>
                          <span>발행자가 <strong className="text-white">K-water issuer URL과 정확히 일치</strong> (예: <code className="text-slate-300">https://auth.kwater.go.kr/auth</code>)</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">aud</code>
                          <span>수신자가 <strong className="text-white">우리 client_id</strong> — 다른 RP에게 보낸 토큰을 우리가 받으면 거부</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">iat</code>
                          <span>발행 시각이 <strong className="text-white">최근 5분 이내</strong> (서버 간 clock skew ±30초 허용) — 오래된 토큰 재생(replay) 차단</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">jti</code>
                          <span>JWT 고유 ID — 이미 처리한 jti는 재사용 차단 (Caffeine 같은 TTL 캐시 권장)</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">events</code>
                          <span>{`{ "http://schemas.openid.net/event/backchannel-logout": {} }`} 가 들어있어야 함 — 로그아웃 이벤트임을 명시</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-rose-300 font-mono line-through">nonce</code>
                          <span><strong className="text-rose-300">절대 있어선 안 됨</strong> — RFC 8417 §2.6 명시. nonce가 있으면 ID Token 위장 공격이므로 거부</span>
                        </li>
                        <li className="flex gap-2">
                          <code className="shrink-0 text-sky-300 font-mono">sub / sid</code>
                          <span>둘 중 최소 하나는 있어야 — 누구 세션을 끊을지 식별. <code className="text-slate-300">sub</code>는 사용자, <code className="text-slate-300">sid</code>는 특정 세션 ID</span>
                        </li>
                      </ul>
                      <p className="text-[12px] text-slate-500 mt-3 italic">한 항목이라도 실패하면 <span className="text-rose-300">400 Bad Request</span> 반환. 검증 통과 시 해당 sub/sid 세션을 폐기하고 <span className="text-emerald-300">200 OK</span> + <code className="text-slate-300">Cache-Control: no-store</code>.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── 세션 관리 ─── */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1 h-4 bg-rose-400 rounded"></span>
                  세션 · 토큰 관리
                </h3>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-emerald-600/10 text-emerald-400 font-mono text-xs font-bold px-2 py-1 rounded border border-emerald-500/20">GET</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/logout (RP-Initiated Logout)</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">사용자가 임의 포털에서 로그아웃 클릭 시 브라우저가 이동하는 엔드포인트. IdP는 중앙 SSO 쿠키를 만료시키고, 등록된 모든 클라이언트의 <code className="text-emerald-300">backchannel_logout_uri</code>로 logout_token JWT를 POST 푸시합니다.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Query Parameters</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 px-3 font-semibold">파라미터명</th>
                            <th className="py-2 px-3 font-semibold">필수 여부</th>
                            <th className="py-2 px-3 font-semibold">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          <tr><td className="py-2 px-3 font-mono text-white">id_token_hint</td><td className="py-2 px-3 text-emerald-400">Recommended</td><td className="py-2 px-3 text-slate-400">로그인 시 발급된 ID Token. 사용자 식별 + 요청 무결성 확인용. 누락 시 client_id로 대체 가능</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">client_id</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">id_token_hint</code>가 없을 때 클라이언트 식별 — post_logout_redirect_uri 화이트리스트 검증에 사용</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">post_logout_redirect_uri</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">로그아웃 완료 후 이동할 URL. 사전 등록 필수</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">state</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">CSRF 방지 — post_logout_redirect_uri 응답에 그대로 반환</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">logout_hint</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">사용자 선택 화면 노출이 필요한 경우 사용자 식별 힌트</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">ui_locales</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400">로그아웃 확인 화면 언어 (BCP47), 예: <code className="text-slate-300">ko-KR en</code></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/introspect (토큰 검증 · RFC 7662)</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">리소스 서버가 Access Token의 유효성과 메타 정보를 IdP에 직접 묻는 엔드포인트. JWT 자체검증을 못 하거나 폐기 여부까지 확인하고 싶을 때 사용. <strong className="text-white">Confidential client만 호출 가능</strong> (Basic Auth 또는 client_id/secret 필수).</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Request Body (application/x-www-form-urlencoded)</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse text-slate-300">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500">
                            <th className="py-2 px-3 font-semibold">파라미터명</th>
                            <th className="py-2 px-3 font-semibold">필수 여부</th>
                            <th className="py-2 px-3 font-semibold">설명</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                          <tr><td className="py-2 px-3 font-mono text-white">token</td><td className="py-2 px-3 text-rose-400 font-semibold">Required</td><td className="py-2 px-3 text-slate-400">검증할 Access Token 또는 Refresh Token</td></tr>
                          <tr><td className="py-2 px-3 font-mono text-white">token_type_hint</td><td className="py-2 px-3 text-slate-400">Optional</td><td className="py-2 px-3 text-slate-400"><code className="text-slate-300">access_token</code> 또는 <code className="text-slate-300">refresh_token</code> — 서버 lookup 최적화 힌트</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Response (200 OK · 활성 토큰)</div>
                    <CodeBlock language="json" code={`{
  "active": true,
  "scope": "openid profile datahub:read",
  "client_id": "datahub-portal-id",
  "username": "kwater_user_1234",
  "exp": 1716985593,
  "iat": 1716981993,
  "sub": "kwater_user_1234"
}`} />
                    <p className="text-[13px] text-slate-400">폐기/만료된 토큰은 <code className="text-rose-300">{`{ "active": false }`}</code>만 반환 (토큰 열거 방지).</p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="bg-slate-950/80 px-6 py-4 border-b border-slate-800 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
                    <h4 className="font-bold text-white text-sm">/oauth2/v1/revoke (토큰 폐기 · RFC 7009)</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">특정 Access Token 또는 Refresh Token을 즉시 무효화합니다. 사용자가 명시적으로 "이 기기에서 로그아웃"을 누르거나, 도난 감지 시 사용.</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Request Body</div>
                    <CodeBlock language="bash" code={`token=<폐기할 토큰>
token_type_hint=refresh_token   # 또는 access_token
client_id=cmp-portal
client_secret=<...>`} />
                    <p className="text-[13px] text-slate-400 leading-relaxed">응답:
                      <span className="text-emerald-300"> 200 OK</span> — 폐기 성공 또는 알 수 없는 토큰 (토큰 열거 방지 차원에서 동일 처리, 본문 없음) ·
                      <span className="text-amber-300"> 400</span> — <code className="text-slate-300">invalid_request</code> 등 요청 자체 오류 ·
                      <span className="text-rose-300"> 401</span> — 클라이언트 인증 실패
                    </p>
                  </div>
                </div>
              </div>

              {/* ─── 백채널 로그아웃 송신 ─── */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-300 tracking-wider uppercase flex items-center gap-2">
                  <span className="w-1 h-4 bg-purple-400 rounded"></span>
                  백채널 로그아웃 송신 (하위 포털 측 구현)
                </h3>

                <div className="bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden">
                  <div className="bg-purple-950/30 px-6 py-4 border-b border-purple-500/20 flex items-center gap-3">
                    <span className="bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold px-2 py-1 rounded border border-indigo-500/20">POST</span>
                    <h4 className="font-bold text-white text-sm">{`{portal}/oauth2/v1/backchannel-logout`}</h4>
                  </div>
                  <div className="p-6 space-y-3 text-sm">
                    <p className="text-slate-400">디지털플랫폼 통합인증 서버가 SLO 시 각 하위 포털 백엔드로 호출하는 엔드포인트입니다. <strong className="text-white">각 포털이 구현하여 IdP에 등록</strong>합니다 (예: <code className="text-purple-300">https://api.datahub.kwater.com/oauth2/v1/backchannel-logout</code>).</p>
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-2 mb-1">Request Body</div>
                    <CodeBlock language="bash" code={`logout_token=<JWT signed by IdP, RFC 8417>`} />
                    <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-3 mb-1">필수 검증 (RFC 8417 §2.6)</div>
                    <ul className="text-[13px] text-slate-300 leading-relaxed list-disc list-inside space-y-0.5">
                      <li>JWT 헤더 <code className="text-purple-300">typ=&quot;logout+jwt&quot;</code> — ID Token 위장 차단</li>
                      <li>서명 검증 (IdP JWKS 사용)</li>
                      <li><code className="text-purple-300">iss</code>=IdP issuer · <code className="text-purple-300">aud</code>=우리 client_id · <code className="text-purple-300">iat</code> 신선도 (±클럭 스큐)</li>
                      <li><code className="text-purple-300">jti</code> 재사용 차단 (TTL 캐시 권장)</li>
                      <li><code className="text-purple-300">events</code>에 <code className="text-slate-300">http://schemas.openid.net/event/backchannel-logout</code> 포함</li>
                      <li><code className="text-purple-300">nonce</code> 부재 — 있으면 거부</li>
                      <li><code className="text-purple-300">sub</code> 또는 <code className="text-purple-300">sid</code> 중 최소 하나 존재</li>
                    </ul>
                    <p className="text-[13px] text-slate-400 leading-relaxed mt-2">응답:
                      <span className="text-emerald-300"> 200 OK</span> +
                      <code className="text-purple-300">Cache-Control: no-store</code> (RFC 8417 §2.7) · 빈 본문.
                      검증 실패 시 <span className="text-rose-300"> 400</span>. IdP가 재시도 큐에 적재.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. CODE EXAMPLE TAB */}
          {activeTab === 'code' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">프레임워크 연동 구현 가이드</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  프론트엔드(React)와 백엔드(Spring Boot 3)에서 자주 쓰는 연동 패턴을 단계별 스니펫으로 정리했습니다. 각 스니펫은 복사해 바로 적용할 수 있는 골격 코드입니다.
                </p>
              </div>

              {/* Language Selector Tabs */}
              <div className="flex border-b border-slate-800">
                <button
                  onClick={() => setCodeLang('react')}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${codeLang === 'react' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  Frontend · React
                </button>
                <button
                  onClick={() => setCodeLang('spring')}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${codeLang === 'spring' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  Backend · Spring Boot 3
                </button>
              </div>

              {/* React Snippets */}
              {codeLang === 'react' && (
                <div className="space-y-6">
                  {[
                    { id: 'react-login', title: '1) 로그인 시작 — /authorize 리다이렉트 (PKCE 포함)', desc: '사용자가 "로그인" 버튼을 누르면 IdP /authorize로 보내는 헬퍼. state·nonce·PKCE code_verifier 생성·저장 + code_challenge S256으로 전송.', code: reactLoginCode },
                    { id: 'react-callback', title: '2) 콜백 처리 — code → 백엔드 교환', desc: 'OAuth 콜백 URL(/callback)에서 code 추출. state 검증, Silent SSO 에러 폴백, PKCE verifier 함께 백엔드 전달.', code: reactCallbackCode },
                    { id: 'react-axios', title: '3) Axios 인터셉터 — 401 자동 갱신', desc: '401 응답 시 토큰 자동 갱신 후 원 요청 재시도. 중복 갱신 방지 + 갱신 실패 시 큐 reject로 promise leak 차단.', code: reactCode },
                    { id: 'react-logout', title: '4) 로그아웃 — RP-Initiated Logout', desc: 'BFF 백엔드 세션 정리 → IdP /logout 리다이렉트. id_token_hint 또는 client_id 첨부.', code: reactLogoutCode },
                  ].map(s => (
                    <CodeSnippetCard key={s.id} snippet={s} language="jsx"
                      copiedId={copiedId} onCopy={handleCopy} />
                  ))}
                </div>
              )}

              {/* Spring Snippets */}
              {codeLang === 'spring' && (
                <div className="space-y-6">
                  {[
                    { id: 'spring-security', title: '1) Security 설정 — JWT Resource Server', desc: 'IdP JWKS로 Bearer 토큰을 자동 검증. K-water 페이로드 복호화 필터를 빈으로 주입, CSRF는 콜백/백채널 경로만 제외.', code: springCode },
                    { id: 'spring-kwater-filter', title: '2) K-water 페이로드 복호화 필터', desc: 'JWE 복호화 → SSO 세션 발급. ResponseCookie로 SameSite 명시, CMP 콜백 리다이렉트에 state 동봉.', code: springKwaterFilterCode },
                    { id: 'spring-bff-callback', title: '3) BFF 콜백 컨트롤러 — code↔token 교환', desc: 'MultiValueMap으로 form 인코딩, PKCE code_verifier 함께 전달, id_token 포함 응답 매핑, RestClient 에러 처리.', code: springBffCallbackCode },
                    { id: 'spring-backchannel', title: '4) 백채널 로그아웃 수신 엔드포인트', desc: 'RFC 8417 §2.6 전체 검증: typ=logout+jwt · iss · aud · iat(±스큐) · jti(Caffeine TTL) · events · nonce 부재 · sub/sid. Cache-Control: no-store 응답.', code: springBackchannelCode },
                  ].map(s => (
                    <CodeSnippetCard key={s.id} snippet={s} language="java"
                      copiedId={copiedId} onCopy={handleCopy} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 페이지 하단 이전/다음 네비게이션 — 모든 탭 공통 */}
          <PageNav activeTab={activeTab} onChange={setActiveTab} />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/60 p-6 text-center text-xs text-slate-500">
        <p>© 2026 Enterprise SSO Auth Portal. All rights reserved. 본 인증 플랫폼은 OAuth 2.1 & OpenID Connect 표준 사양을 완벽하게 지원합니다.</p>
      </footer>
    </div>
  );
}

// 탭 순서 — 사이드바·이전/다음 네비게이션 공통 사용
const TAB_ORDER = [
  { id: 'overview',  label: '1. 연동 개요' },
  { id: 'multi-sso', label: '2. 통합 & 하위 포털 SSO' },
  { id: 'sequence',  label: '3. 데이터 흐름 애니메이션' },
  { id: 'flow',      label: '4. 상세 연동 시뮬레이터' },
  { id: 'tokens',    label: '5. 토큰 발급 & 갱신 (RTR)' },
  { id: 'logout',    label: '6. 통합 로그아웃 (SLO)' },
  { id: 'api',       label: 'Endpoints Spec' },
  { id: 'code',      label: '구현 예제 코드' },
];

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
    <div className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3">
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

// 인라인 구문 강조 블록 — 짧은 예시(HTTP·JSON·form-body 등)에 사용
function CodeBlock({ code, language = 'http', fontSize = '0.78rem', maxHeight }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '0.875rem 1rem',
        background: 'rgb(2 6 23)',
        fontSize,
        lineHeight: '1.65',
        border: '1px solid rgb(30 41 59)',
        borderRadius: '0.5rem',
        maxHeight,
        overflow: 'auto',
      }}
      codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' } }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

// 구문 강조 + 복사 버튼이 있는 코드 카드 — React/Spring 공통 사용
function CodeSnippetCard({ snippet, language, copiedId, onCopy }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Code2 className="text-indigo-400" size={16} />
            {snippet.title}
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{snippet.desc}</p>
        </div>
        <button
          onClick={() => onCopy(snippet.code, snippet.id)}
          className="shrink-0 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
        >
          {copiedId === snippet.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>복사</span>
        </button>
      </div>
      <div className="max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'rgb(2 6 23 / 0.6)',
            fontSize: '0.78rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace' } }}
        >
          {snippet.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// React Example Source Code String
const reactCode = `import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;        // 'datahub-portal-id' 등
const IDP_BASE = import.meta.env.VITE_IDP_BASE;          // 'https://auth.kwater.com'

// 액세스 토큰을 클라이언트 내 메모리 영역에만 안전하게 적재
let memoryAccessToken = "";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,                // 예: 'https://api.datahub.kwater.com/v1'
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,                                 // HttpOnly Refresh Token 쿠키 자동 동봉
});

// 1. 요청 인터셉터: API 송출 직전 헤더에 Access Token 탑재
api.interceptors.request.use((config) => {
  if (memoryAccessToken && config.headers) {
    config.headers.Authorization = \`Bearer \${memoryAccessToken}\`;
  }
  return config;
}, (error) => Promise.reject(error));

// 중복 토큰 갱신 요청을 막기 위한 동시성 변수
let isRefreshing = false;
let refreshSubscribers = [];

// 갱신 성공 시 큐 처리
const resolveQueue = (token) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

// 갱신 실패 시 큐의 모든 promise를 reject — promise leak 방지
const rejectQueue = (err) => {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
};

// 2. 응답 인터셉터: 401 Unauthorized 발생 시 자동으로 토큰 리프레시 트리거
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;
    if (response?.status !== 401 || originalRequest._retry) return Promise.reject(error);

    if (isRefreshing) {
      // 진행 중인 갱신이 끝나면 원 요청을 재시도. 실패하면 같이 실패한다.
      return new Promise((resolve, reject) => {
        refreshSubscribers.push({
          resolve: (token) => {
            originalRequest.headers.Authorization = \`Bearer \${token}\`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // refresh_token 값은 HttpOnly 쿠키로 전달되므로 본문에 포함하지 않음.
      const refreshResponse = await axios.post(
        \`\${IDP_BASE}/oauth2/v1/token\`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: CLIENT_ID,
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          withCredentials: true,
        }
      );

      const newAccessToken = refreshResponse.data.access_token;
      memoryAccessToken = newAccessToken;
      isRefreshing = false;
      resolveQueue(newAccessToken);

      originalRequest.headers.Authorization = \`Bearer \${newAccessToken}\`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      memoryAccessToken = "";
      rejectQueue(refreshError);   // 큐에 쌓인 모든 동시 요청도 같이 reject

      // Silent SSO 시도 — SSO 쿠키가 유효하면 자동 회복
      const redirectUri = encodeURIComponent(window.location.origin + '/callback');
      window.location.href =
        \`\${IDP_BASE}/oauth2/v1/authorize?response_type=code\` +
        \`&client_id=\${CLIENT_ID}\` +
        \`&redirect_uri=\${redirectUri}\` +
        \`&scope=openid%20profile&prompt=none\`;

      return Promise.reject(refreshError);
    }
  }
);`;

// Spring Boot Example Source Code String
const springCode = `package com.example.resourceserver.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import com.example.filter.KWaterPayloadDecryptionFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 커스텀 필터는 Spring이 관리하는 빈으로 주입받는다. (인자 주입 OK)
    private final KWaterPayloadDecryptionFilter kwaterFilter;

    @Value("\${idp.jwks-uri}")               // application.yml — https://auth.kwater.com/oauth2/v1/jwks
    private String jwksUri;

    public SecurityConfig(KWaterPayloadDecryptionFilter kwaterFilter) {
        this.kwaterFilter = kwaterFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. JWT만 신뢰하는 Stateless API (포털 백엔드가 세션 쿠키를 별도 운영하는 경우엔 IF_REQUIRED)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 2. 세션 쿠키가 있는 BFF 경로엔 CSRF가 필요. 콜백/공개 API는 제외.
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/oauth2/kwater/callback", "/oauth2/v1/backchannel-logout", "/api/public/**")
            )

            // 3. K-water 암호화 페이로드 복호화 및 통합 SSO 쿠키 발급용 커스텀 필터 등록
            //    (생성자 의존성이 있으므로 빈으로 주입받은 인스턴스를 사용)
            .addFilterBefore(kwaterFilter, UsernamePasswordAuthenticationFilter.class)

            // 4. 리소스별 접근 제어 설정 (K-water 콜백·백채널 로그아웃은 인증 우회)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/public/**",
                                 "/oauth2/kwater/callback",
                                 "/oauth2/v1/backchannel-logout").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )

            // 5. JWT Resource Server — IdP JWKS로 자동 검증 (캐싱 + 키 회전 대응 자동)
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwkSetUri(jwksUri))
            );

        return http.build();
    }
}`;

// React: 1) Login - /authorize 리다이렉트
const reactLoginCode = `// auth.js — 로그인 시작 헬퍼 (PKCE 포함)
const IDP_AUTHORIZE = 'https://auth.kwater.com/oauth2/v1/authorize';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;          // 예: 'datahub-portal-id'
const REDIRECT_URI = window.location.origin + '/callback';

// PKCE code_verifier → code_challenge (S256) 생성
async function pkce() {
  const verifier = crypto.randomUUID() + crypto.randomUUID();   // 충분히 긴 무작위 문자열
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier),
  );
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');  // base64url
  return { verifier, challenge };
}

export async function startLogin({ scope = 'openid profile', silent = false } = {}) {
  const state = crypto.randomUUID();                          // CSRF 방지
  const nonce = crypto.randomUUID();                          // ID Token replay 방지
  const { verifier, challenge } = await pkce();

  sessionStorage.setItem('oidc_state', state);
  sessionStorage.setItem('oidc_nonce', nonce);
  sessionStorage.setItem('pkce_verifier', verifier);          // 콜백 후 /token 교환 시 필요

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope,
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',                            // PKCE 필수
  });
  if (silent) params.append('prompt', 'none');                // 하위 포털 Silent SSO

  window.location.href = \`\${IDP_AUTHORIZE}?\${params}\`;
}

// 사용 예:
//   <button onClick={() => startLogin()}>로그인</button>
//   <button onClick={() => startLogin({ silent: true })}>무중단 로그인 시도</button>`;

// React: 2) Callback - code → 백엔드 교환
const reactCallbackCode = `// CallbackPage.jsx — IdP가 리다이렉트로 보낸 code를 처리
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Silent SSO 실패 시 일반 로그인 흐름으로 폴백할 에러 코드들
const RECOVERABLE_ERRORS = new Set([
  'login_required',
  'interaction_required',
  'consent_required',
  'account_selection_required',
]);

export function CallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const err = params.get('error');

    // 1) Silent SSO 실패 — 일반 로그인 흐름으로 폴백
    if (err && RECOVERABLE_ERRORS.has(err)) {
      window.location.href = '/login';
      return;
    }
    if (err) {
      setError(\`\${err}: \${params.get('error_description') || ''}\`);
      return;
    }

    // 2) state 일치 검증 (CSRF 방어)
    const savedState = sessionStorage.getItem('oidc_state');
    const verifier = sessionStorage.getItem('pkce_verifier');
    sessionStorage.removeItem('oidc_state');
    sessionStorage.removeItem('pkce_verifier');
    if (!savedState || savedState !== state) {
      setError('state mismatch — possible CSRF attack');
      return;
    }

    // 3) BFF 패턴: 백엔드가 code + code_verifier 로 /token 교환 후 세션 쿠키 발급
    axios.post('/api/auth/exchange',
      { code, code_verifier: verifier },
      { withCredentials: true })
      .then(() => navigate('/dashboard'))
      .catch(e => setError(e.response?.data?.message || e.message));
  }, [navigate]);

  if (error) return <div>로그인 실패: {error}</div>;
  return <div>로그인 처리 중...</div>;
}`;

// React: 4) Logout - RP-Initiated
const reactLogoutCode = `// LogoutButton.jsx — 디지털플랫폼 통합 로그아웃 시작
const IDP_LOGOUT = 'https://auth.kwater.com/oauth2/v1/logout';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

export async function logout() {
  // 1) BFF 백엔드에 먼저 알려 서버 세션·Refresh Token 정리
  //    (백엔드가 응답 시 id_token_hint를 반환해주면 IdP /logout 정확도가 높아짐)
  let idTokenHint = null;
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      idTokenHint = body.id_token_hint || null;
    }
  } catch { /* IdP 로그아웃은 어떤 경우든 계속 진행 */ }

  // 2) IdP /logout으로 이동 → 중앙 SSO 쿠키 만료 + 모든 포털 백채널 푸시
  const params = new URLSearchParams({
    post_logout_redirect_uri: window.location.origin + '/login',
    state: crypto.randomUUID(),
  });
  // id_token_hint 또는 client_id 중 하나는 보내는 것이 권장됨
  if (idTokenHint) params.append('id_token_hint', idTokenHint);
  else             params.append('client_id', CLIENT_ID);

  window.location.href = \`\${IDP_LOGOUT}?\${params}\`;
}

// 사용: <button onClick={logout}>로그아웃</button>`;

// Spring: 2) K-water 페이로드 복호화 필터
const springKwaterFilterCode = `package com.example.auth.filter;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UriComponentsBuilder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import com.nimbusds.jwt.*;
import com.nimbusds.jose.crypto.RSADecrypter;

// /oauth2/kwater/callback 진입 시 K-water 페이로드를 복호화하여
// 디지털플랫폼 자체 SSO 세션을 발급한다.
//
// 사전 흐름: 디지털플랫폼이 사용자를 K-water로 보낼 때
//            HttpSession 에 'kwater_state' 와 'kwater_return' 을 미리 저장해두어야 한다.
@Component
public class KWaterPayloadDecryptionFilter extends OncePerRequestFilter {

    private final RSADecrypter decrypter;        // K-water가 우리 공개키로 암호화 → 우리 비공개키로 복호화
    private final SsoSessionService ssoSessions;

    public KWaterPayloadDecryptionFilter(RSADecrypter d, SsoSessionService s) {
        this.decrypter = d; this.ssoSessions = s;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws Exception {
        if (!"/oauth2/kwater/callback".equals(req.getRequestURI())) {
            chain.doFilter(req, res); return;
        }

        String encPayload = req.getParameter("kwater_enc_payload");
        String state = req.getParameter("state");

        // 1) state 검증 (앞서 K-water로 리다이렉트 보낼 때 저장해둔 값과 일치 확인)
        HttpSession session = req.getSession(false);
        String savedState  = session == null ? null : (String) session.getAttribute("kwater_state");
        String returnState = session == null ? null : (String) session.getAttribute("kwater_return_state");
        if (savedState == null || !savedState.equals(state)) {
            res.sendError(400, "Invalid state"); return;
        }
        session.removeAttribute("kwater_state");                              // 일회용 소비

        // 2) JWE 복호화 — K-water가 우리 공개키로 암호화한 사용자 정보
        EncryptedJWT jwt = EncryptedJWT.parse(encPayload);
        jwt.decrypt(decrypter);
        JWTClaimsSet claims = jwt.getJWTClaimsSet();

        String userId = claims.getStringClaim("user_id");
        String dept   = claims.getStringClaim("department");
        String role   = claims.getStringClaim("role");

        // 3) 디지털플랫폼 자체 SSO 세션 생성
        String sessionId = ssoSessions.create(userId, dept, role);

        // 4) HttpOnly + Secure + SameSite=Lax 쿠키 발급
        //    Servlet 5의 Cookie API엔 setSameSite가 없어 ResponseCookie 사용 (Set-Cookie 헤더 직접 작성)
        ResponseCookie cookie = ResponseCookie.from("innogrid_sso_session", sessionId)
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")              // 외부 사이트 iframe Silent SSO 필요 시 "None"
            .path("/")
            .maxAge(Duration.ofHours(1))
            .build();
        res.addHeader("Set-Cookie", cookie.toString());

        // 5) CMP 콜백으로 리다이렉트 — code + state 모두 동봉 (OIDC 표준)
        String code = ssoSessions.issueAuthCode(sessionId);
        String url = UriComponentsBuilder
            .fromUriString("https://cmp.kwater.com/callback")
            .queryParam("code",  URLEncoder.encode(code, StandardCharsets.UTF_8))
            .queryParam("state", URLEncoder.encode(returnState, StandardCharsets.UTF_8))
            .toUriString();
        res.sendRedirect(url);
    }
}`;

// Spring: 3) BFF 콜백 - code↔token 교환
const springBffCallbackCode = `package com.example.portal.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import jakarta.servlet.http.HttpServletResponse;

// 프론트가 받은 인가 코드를 백엔드가 받아 IdP /token과 교환하는 BFF 패턴.
// 발급된 Access/Refresh/ID Token은 서버 세션 스토어(Redis 등)에 저장하고,
// 브라우저엔 세션 ID만 HttpOnly 쿠키로 발급한다 → XSS 토큰 탈취 차단.
@RestController
@RequestMapping("/api/auth")
public class AuthExchangeController {

    private final RestClient idp = RestClient.create("https://auth.kwater.com");
    private final TokenSessionStore store;

    @Value("\${idp.client-id}")      private String clientId;
    @Value("\${idp.client-secret}")  private String clientSecret;    // 환경변수/Vault 경유 주입
    @Value("\${idp.redirect-uri}")   private String redirectUri;

    public AuthExchangeController(TokenSessionStore s) { this.store = s; }

    @PostMapping("/exchange")
    public ResponseEntity<Void> exchange(@RequestBody ExchangeReq req) {
        // 1) form 파라미터를 MultiValueMap으로 구성 — Spring이 자동으로 URL 인코딩
        MultiValueMap<String,String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("code", req.code());
        form.add("redirect_uri", redirectUri);
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        if (req.code_verifier() != null) form.add("code_verifier", req.code_verifier());  // PKCE

        // 2) IdP /token 호출 (백채널)
        TokenRes token;
        try {
            token = idp.post()
                .uri("/oauth2/v1/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenRes.class);
        } catch (RestClientResponseException e) {
            // IdP 측 에러는 사용자에게 일반 에러로 표시 (상세 내용은 서버 로그에만)
            log.error("token exchange failed: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3) 토큰을 서버 세션에 저장 — 브라우저엔 노출 안 함
        String sessionId = store.save(
            token.access_token(),
            token.refresh_token(),
            token.id_token(),                     // RP-Initiated Logout 시 id_token_hint로 사용
            token.expires_in()
        );

        // 4) HttpOnly 세션 쿠키만 응답
        ResponseCookie cookie = ResponseCookie.from("portal_sid", sessionId)
            .httpOnly(true).secure(true).sameSite("Lax").path("/")
            .maxAge(java.time.Duration.ofDays(1))
            .build();
        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }

    record ExchangeReq(String code, String code_verifier) {}
    record TokenRes(String access_token, String refresh_token, String id_token,
                    String token_type, int expires_in, String scope) {}
}`;

// Spring: 4) Back-channel logout endpoint
const springBackchannelCode = `package com.example.portal.auth;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.nimbusds.jwt.*;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.proc.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import java.time.Duration;
import java.util.Map;

// IdP가 SLO 시 호출하는 엔드포인트.
// logout_token(JWT)을 RFC 8417 §2.6 규칙대로 검증하고,
// 해당 sub/sid의 세션과 Refresh Token을 폐기한다.
@RestController
public class BackchannelLogoutController {

    private final JWTProcessor<SecurityContext> jwtProcessor;   // JWKS 자동 캐싱 (Bean으로 주입)
    private final TokenSessionStore store;

    // jti 재사용 차단 — TTL 캐시 (WeakHashMap은 String key를 GC하지 못해 사용 금지)
    private final Cache<String, Boolean> seenJti = Caffeine.newBuilder()
        .expireAfterWrite(Duration.ofMinutes(10))
        .maximumSize(100_000)
        .build();

    private static final String EXPECTED_TYP = "logout+jwt";          // RFC 8417 §2.6: typ 헤더 필수
    private static final long CLOCK_SKEW_SEC = 30;                    // 서버 간 시계 오차 허용

    @Value("\${idp.issuer}")     private String expectedIssuer;       // 'https://auth.kwater.com/oauth2/v1'
    @Value("\${idp.client-id}")  private String expectedAudience;     // 우리 client_id

    public BackchannelLogoutController(JWTProcessor<SecurityContext> p, TokenSessionStore s) {
        this.jwtProcessor = p; this.store = s;
    }

    @PostMapping(value = "/oauth2/v1/backchannel-logout",
                 consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<Void> handle(@RequestParam("logout_token") String token) {
        try {
            // 0) JWT 파싱 후 서명 + 표준 claim 검증 (jwtProcessor가 JWKS로 자동 검증)
            SignedJWT jwt = SignedJWT.parse(token);

            // 1) typ 헤더 검증 — 'logout+jwt' 가 아니면 ID Token으로 위장된 공격
            JOSEObjectType typ = jwt.getHeader().getType();
            if (typ == null || !EXPECTED_TYP.equals(typ.getType())) return bad();

            JWTClaimsSet claims = jwtProcessor.process(jwt, null);

            // 2) iss · aud
            if (!expectedIssuer.equals(claims.getIssuer())) return bad();
            if (claims.getAudience() == null
                || !claims.getAudience().contains(expectedAudience)) return bad();

            // 3) iat 신선도 (±30초 clock skew 허용, 5분 이내)
            if (claims.getIssueTime() == null) return bad();
            long iat = claims.getIssueTime().getTime() / 1000;
            long now = System.currentTimeMillis() / 1000;
            if (Math.abs(now - iat) > 300 + CLOCK_SKEW_SEC) return bad();

            // 4) jti 재사용 차단
            String jti = claims.getJWTID();
            if (jti == null) return bad();
            if (seenJti.asMap().putIfAbsent(jti, Boolean.TRUE) != null) return bad();

            // 5) events 클레임 검증
            Map<String, Object> events = claims.getJSONObjectClaim("events");
            if (events == null
                || !events.containsKey("http://schemas.openid.net/event/backchannel-logout"))
                return bad();

            // 6) nonce 부재 검증 (RFC 8417 §2.6: nonce MUST NOT be present)
            if (claims.getClaim("nonce") != null) return bad();

            // 7) sub 또는 sid로 세션 폐기 (둘 다 없으면 무효)
            String sub = claims.getSubject();
            String sid = claims.getStringClaim("sid");
            if (sid != null)      store.revokeBySid(sid);
            else if (sub != null) store.revokeBySub(sub);
            else return bad();

            // 8) Cache-Control: no-store 응답 헤더 (RFC 8417 §2.7)
            return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .build();

        } catch (Exception e) {
            // 상세 사유는 서버 로그에만, 클라이언트엔 일률 400
            return bad();
        }
    }

    private ResponseEntity<Void> bad() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .cacheControl(CacheControl.noStore())
            .build();
    }
}`;
