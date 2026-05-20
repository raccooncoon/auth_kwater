export const simulationSteps = [
  {
    shortTitle: "K-water 인증 + 페이로드 수신",
    title: "1단계: K-water 통합 인증 시스템 연동 및 암호화 데이터 수신 (시퀀스 1~3 대응)",
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
        kwater_enc_payload: "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkEyNTZHQ00ifQ.OKOawW...[Fasoo 암호화 페이로드]",
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
    shortTitle: "통합 SSO 세션 수립",
    title: "2단계: 암호화 페이로드 복호화 및 통합 SSO 세션 수립 (시퀀스 4 대응)",
    sender: "디지털플랫폼 통합인증 서버",
    receiver: "Browser (Set-Cookie)",
    phase: "Decryption & Session Creation",
    desc: "디지털플랫폼 통합인증 서버는 수신한 K-water 암호화 데이터를 복호화하여 사용자 아이디와 권한 정보를 추출합니다. 검증 성공 시 디지털플랫폼 생태계 전반에서 유효한 '디지털플랫폼 SSO 통합 세션 쿠키'를 브라우저에 발급하고, CMP 콜백 URL로 인가 코드를 포함한 302 리다이렉트를 응답합니다.",
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
        "Set-Cookie": "dp_sso_session=dp_sess_892347a8f; Domain=auth.kwater.com; Secure; HttpOnly; SameSite=Lax",
        "Location": "https://cmp.kwater.com/callback?code=dp_auth_code_7718&state=..."
      }
    },
    browserState: {
      sessionStorage: {
        kwater_auth_state: "Consumed (Cleared)"
      },
      memory: { accessToken: "Null" },
      cookies: { "auth.kwater.com": "dp_sso_session=dp_sess_892347a8f (HttpOnly)" }
    },
    serverState: {
      authServer: "Active (Session: dp_sess_892347a8f, User: kwater_user_1234)",
      resourceServer: "토큰 인증 필요"
    }
  },
  {
    shortTitle: "CMP 토큰 교환 + BFF 쿠키",
    title: "3단계: CMP 백엔드 토큰 교환 + BFF 세션 쿠키 발급 (시퀀스 5~7 대응)",
    sender: "CMP Backend",
    receiver: "디지털플랫폼 통합인증 서버 + Browser",
    phase: "Back-channel Token Exchange + BFF Cookie",
    desc: "브라우저는 콜백 URL에서 추출한 인가 코드를 CMP 백엔드(POST /api/auth/exchange)로 전달합니다. CMP 백엔드는 이를 IdP /token으로 백채널 교환하여 Access/Refresh/ID Token을 받고(시퀀스 7), 토큰은 서버 세션 스토어에 저장한 뒤 브라우저에는 별도의 BFF 세션 쿠키(cmp_session)만 Set-Cookie로 내려줍니다.",
    userView: "사용자는 CMP 대시보드를 마주합니다. 별도 로그인 절차 없이 자기 권한(예: 수자원관리본부 ADMIN)에 맞는 메뉴와 자원 목록이 자동으로 펼쳐져 보입니다. 토큰 교환은 백그라운드에서 일어나고, 사용자 브라우저는 JWT 토큰 자체를 절대 보지 못합니다.",
    purpose: "BFF 패턴의 핵심: Access/Refresh Token은 백엔드 메모리에만 머무르고, 브라우저는 의미를 알 수 없는 불투명(opaque) 세션 ID만 보유합니다. 이렇게 분리하면 XSS가 발생해도 JS는 토큰에 접근할 수 없으며, 모든 API 호출은 백엔드 프록시를 통해 토큰이 자동 첨부되어 나갑니다.",
    warning: "client_secret이 프론트엔드 JS 번들에 노출되면 토큰 위조가 가능해집니다. 반드시 백엔드 환경변수(또는 KMS/Vault)에서만 주입하세요. cmp_session 쿠키는 HttpOnly · Secure · SameSite=Lax 필수이며, IdP의 SSO 쿠키와는 도메인·발급자·용도가 완전히 분리된 별개 쿠키입니다.",
    payload: {
      step1_browser_to_backend: "POST https://cmp.kwater.com/api/auth/exchange  body: { code: 'dp_auth_code_7718', state: '...' }",
      step2_backend_to_idp_request: "POST https://auth.kwater.com/oauth2/v1/token",
      step2_request_body: {
        grant_type: "authorization_code",
        code: "dp_auth_code_7718",
        redirect_uri: "https://cmp.kwater.com/callback",
        client_id: "cmp-portal",
        client_secret: "[Confidential Client 시크릿, 백엔드 환경 변수에서만 주입]",
        code_verifier: "[PKCE verifier]"
      },
      step3_idp_to_backend_response: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5cCI... [CMP용 Access Token, 백엔드 메모리에만 저장]",
        refresh_token: "rfr_master_771239ab8c19ef",
        id_token: "eyJhbGciOiJSUzI1NiI... [ID Token]",
        token_type: "Bearer",
        expires_in: 3600
      },
      step4_backend_to_browser_response: {
        responseHeaders: {
          "Set-Cookie": "cmp_session=opaque_sess_abc123; Path=/; Secure; HttpOnly; SameSite=Lax"
        },
        body: { ok: true }
      }
    },
    browserState: {
      sessionStorage: {},
      memory: { accessToken: "Null (BFF: 토큰은 백엔드 세션 스토어에만 보관)" },
      cookies: {
        "auth.kwater.com": "dp_sso_session=dp_sess_892347a8f (IdP SSO 쿠키)",
        "cmp.kwater.com": "cmp_session=opaque_sess_abc123 (BFF 세션 쿠키 · HttpOnly)"
      }
    },
    serverState: {
      authServer: "Active Session & Issued Tokens (Client: cmp-portal)",
      resourceServer: "CMP 백엔드 세션 스토어: {sess: opaque_sess_abc123 → AT/RT/IDT} 매핑 저장"
    }
  },
  {
    shortTitle: "하위 포털 Silent SSO 요청",
    title: "4단계: 데이터허브 등 하위 포털 무상호작용 인가 (Silent SSO, 시퀀스 8~10 대응)",
    sender: "Browser (데이터허브/생성형 AI/SaaS)",
    receiver: "디지털플랫폼 통합인증 서버",
    phase: "Cross-Origin Silent Navigation",
    desc: "사용자가 하위 서비스 포털(예: 데이터허브)로 접속합니다. 데이터허브 프론트엔드는 토큰이 없음을 파악하고, 사용자 개입을 없애기 위해 'prompt=none' 파라미터를 추가하여 디지털플랫폼 통합인증 서버로 리다이렉트합니다. IdP는 SSO 쿠키를 확인해 인가 코드 콜백을 응답하고, 브라우저는 다시 자기 백엔드로 코드를 전달합니다.",
    userView: "사용자가 CMP 메뉴에서 '데이터허브'를 클릭합니다. 새 탭이나 같은 탭에서 데이터허브 도메인으로 이동하지만 — 로그인 폼은 절대 보이지 않습니다. 짧은 페이지 깜빡임만 있고 데이터허브 메인이 떠 있습니다. 사용자는 \"같은 서비스 안에서 이동했다\"고 느낍니다.",
    purpose: "각 하위 포털은 독립 client_id를 갖고 자기만의 토큰을 받아야 합니다 (포털별 스코프 분리). 하지만 \"또 로그인하세요\"는 SSO 경험을 깨므로, OIDC 표준의 prompt=none 옵션으로 \"UI 없이 백그라운드에서만 인증해줘\"라고 인증 서버에 요청합니다. SSO 쿠키가 유효하면 인증 서버가 즉시 인가 코드만 발급합니다.",
    warning: "prompt=none 요청에 state가 빠지면 CSRF로 다른 사용자의 토큰을 갈취당할 수 있습니다. 또한 SSO 쿠키가 만료된 상태라면 login_required 에러가 돌아오는데, 이 경우 즉시 일반 로그인 흐름(prompt 없음)으로 폴백하는 처리를 반드시 구현해야 합니다.",
    payload: {
      step1_browser_to_idp_request: "GET https://auth.kwater.com/oauth2/v1/authorize",
      step1_query_params: {
        response_type: "code",
        client_id: "datahub-portal-id",
        redirect_uri: "https://datahub.kwater.com/callback",
        scope: "openid profile datahub:read",
        state: "sub_random_state_4410",
        code_challenge: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
        code_challenge_method: "S256",
        prompt: "none"
      },
      step2_idp_to_browser_redirect: "302 REDIRECT https://datahub.kwater.com/callback?code=datahub_code_9918&state=sub_random_state_4410",
      step3_browser_to_backend: "POST https://datahub.kwater.com/api/auth/exchange  body: { code: 'datahub_code_9918', state: 'sub_random_state_4410' }"
    },
    browserState: {
      sessionStorage: {
        auth_state: "sub_random_state_4410"
      },
      memory: { accessToken: "Null (하위 포털 기준 토큰 부재)" },
      cookies: {
        "auth.kwater.com": "dp_sso_session=dp_sess_892347a8f (이전 로그인 유지 중)",
        "cmp.kwater.com": "cmp_session=opaque_sess_abc123 (CMP에서만 유효)"
      }
    },
    serverState: {
      authServer: "SSO 세션 유효함 확인완료 (ID: dp_sess_892347a8f)",
      resourceServer: "토큰 대기"
    }
  },
  {
    shortTitle: "하위 포털 토큰 교환 + BFF 쿠키",
    title: "5단계: 하위 포털 토큰 교환 + BFF 세션 쿠키 발급 (시퀀스 11~12 대응)",
    sender: "데이터허브 Backend",
    receiver: "디지털플랫폼 통합인증 서버 + Browser",
    phase: "Silent SSO Completion + BFF Cookie",
    desc: "데이터허브 백엔드가 (Step 4의 인가 코드를 받은 직후) IdP /token으로 백채널 교환해 데이터허브 전용 토큰을 받고(시퀀스 12), 토큰은 자기 세션 스토어에 저장한 뒤 브라우저에는 datahub_session 세션 쿠키만 내려줍니다. CMP의 cmp_session과는 도메인이 달라 완전히 분리된 별개 세션입니다.",
    userView: "데이터허브 화면이 완전히 로드되고, 사용자는 자기 권한 범위 내의 데이터셋·테이블만 목록에서 볼 수 있습니다. CMP 토큰과는 완전히 분리되어 있으므로, CMP에서 만료가 일어나도 데이터허브 세션은 독립적으로 유지됩니다.",
    purpose: "각 포털별로 토큰을 따로 발급하면 (1) 한 포털 토큰이 유출되어도 다른 포털은 안전하고, (2) 포털마다 서로 다른 scope/role을 분리 관리할 수 있고, (3) 로그·감사·과금을 포털 단위로 정확히 집계할 수 있습니다. 같은 사용자라도 \"누가 어느 포털에서 무엇을 했는지\"가 명확해집니다.",
    warning: "여러 포털 탭이 동시에 열리면 토큰 발급 요청이 병렬로 발생할 수 있습니다. 인증 서버는 각 client_id별로 독립 세션 카운터·rate limit을 둬야 하며, 데이터허브 백엔드도 발급된 Refresh Token을 자기 세션 스토어에 저장할 때 동시성 충돌을 막아야 합니다.",
    payload: {
      step1_backend_to_idp_request: "POST https://auth.kwater.com/oauth2/v1/token",
      step1_request_body: {
        grant_type: "authorization_code",
        code: "datahub_code_9918",
        redirect_uri: "https://datahub.kwater.com/callback",
        client_id: "datahub-portal-id",
        client_secret: "[Datahub Confidential Client 시크릿]",
        code_verifier: "[PKCE verifier — Step 4 code_challenge와 매칭]"
      },
      step2_idp_to_backend_response: {
        access_token: "eyJhbGciOiJSUzI1NiIsInR5c... [데이터허브 전용 토큰, 백엔드 메모리에만]",
        refresh_token: "rfr_datahub_995512bc8",
        id_token: "eyJhbGciOiJSUzI1NiI... [ID Token]",
        token_type: "Bearer",
        expires_in: 3600
      },
      step3_backend_to_browser_response: {
        responseHeaders: {
          "Set-Cookie": "datahub_session=opaque_sess_xyz789; Path=/; Secure; HttpOnly; SameSite=Lax"
        },
        body: { ok: true }
      }
    },
    browserState: {
      sessionStorage: {},
      memory: { accessToken: "Null (BFF: 데이터허브 백엔드에만 보관)" },
      cookies: {
        "auth.kwater.com": "dp_sso_session=dp_sess_892347a8f (IdP SSO 쿠키)",
        "cmp.kwater.com": "cmp_session=opaque_sess_abc123",
        "datahub.kwater.com": "datahub_session=opaque_sess_xyz789 (신규 BFF 세션 쿠키)"
      }
    },
    serverState: {
      authServer: "SSO 활성 세션 유지 중 및 데이터허브 클라이언트 인가 완료",
      resourceServer: "데이터허브 백엔드 세션 스토어: {sess: opaque_sess_xyz789 → AT/RT/IDT} 매핑 저장"
    }
  },
  {
    shortTitle: "통합 단일 로그아웃 (SLO)",
    title: "6단계: 디지털플랫폼 생태계 통합 단일 로그아웃 (SLO, 시퀀스 16~17 대응)",
    sender: "임의 포털 (CMP/데이터허브 등)",
    receiver: "디지털플랫폼 통합인증 서버 ➜ 하위 포털들",
    phase: "Global Revocation",
    desc: "포털 중 한 곳에서 로그아웃 시, 디지털플랫폼 통합인증 서버는 중앙 SSO 세션을 만료시키고, 데이터허브, 생성형 AI, SaaS 포털 등의 백엔드 로그아웃 엔드포인트(Back-channel)로 로그아웃 토큰을 밀어넣어 전사 동시 로그아웃을 완수합니다.",
    userView: "사용자가 어떤 포털에서든 '로그아웃'을 한 번 누르면, 다른 탭에 열려 있던 모든 디지털플랫폼 포털도 거의 동시에 로그아웃됩니다. 새로 고침하거나 다음 API 호출을 보내는 순간 로그인 화면으로 튕깁니다 — 한 곳에서 끄면 모든 곳이 꺼지는 SSO의 마지막 약속입니다.",
    purpose: "토큰만 무효화하는 것으로는 부족합니다. 브라우저에 남은 SSO 쿠키 때문에 사용자가 다른 포털을 열면 Silent SSO로 즉시 다시 토큰을 받아버리기 때문입니다. 중앙 SSO 쿠키 파기 + 백채널로 각 포털 세션 강제 종료 두 가지가 동시에 일어나야 진정한 \"전사 로그아웃\"이 완성됩니다.",
    warning: "백채널 로그아웃 푸시는 네트워크 실패·포털 일시 장애 등으로 누락될 수 있습니다. 비동기 재시도 큐와 멱등성 보장(jti 기반 중복 차단)이 필수이며, 끝내 실패한 포털은 짧은 토큰 TTL과 인트로스펙션으로 최종 정리해야 합니다.",
    payload: {
      logout_trigger: "GET https://auth.kwater.com/oauth2/v1/logout?id_token_hint=...",
      backchannel_push_to_cmp:     "POST https://cmp.kwater.com/oauth2/v1/backchannel-logout",
      backchannel_push_to_datahub: "POST https://datahub.kwater.com/oauth2/v1/backchannel-logout",
      backchannel_push_to_genai:   "POST https://genai.kwater.com/oauth2/v1/backchannel-logout",
      backchannel_push_to_saas:    "POST https://saas.kwater.com/oauth2/v1/backchannel-logout",
      backchannel_payload: {
        logout_token: "eyJhbGciOiJSUzI1NiJ9.eyJldmVudHMiOnsiaHR0cDovL3NjaGVtYXMub3BlbmlkLm5ldC9ldmVudC9iYWNrY2hhbm5lbC1sb2dvdXQiOnt9fX0... [서명된 로그아웃 토큰 · OIDC Back-Channel Logout 1.0 (RFC 8417 SET 위)]"
      }
    },
    browserState: {
      sessionStorage: {},
      memory: { accessToken: "Null (메모리 완전 소거)" },
      cookies: {
        "auth.kwater.com": "Expired (dp_sso_session=; Expires=Thu, 01 Jan 1970 00:00:00 GMT)",
        "cmp.kwater.com": "Expired (cmp_session=; 백엔드 세션 폐기)",
        "datahub.kwater.com": "Expired (datahub_session=; 백엔드 세션 폐기)"
      }
    },
    serverState: {
      authServer: "Inactive (All Sessions Revoked)",
      resourceServer: "모든 포털 API 요청 반려 (401 Unauthorized)"
    }
  }
];
