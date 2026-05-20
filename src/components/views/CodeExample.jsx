import React, { useState } from 'react';
import { Code2, Check, Copy, Info } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeSnippetCard({ snippet, language, copiedId, onCopy }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-slate-200 flex items-center gap-2 flex-wrap">
            <Code2 className="text-indigo-400 shrink-0" size={16} />
            <span>{snippet.title}</span>
            {snippet.badge && (
              <span className={`text-[12px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded ${snippet.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                {snippet.badge}
              </span>
            )}
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
  baseURL: import.meta.env.VITE_API_BASE,                // 예: 'https://datahub.kwater.com/api/v1' (BFF) — SPA 패턴은 별도 리소스 서버 도메인
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

    @Value("\${idp.jwks-uri}")               // application.yml — https://auth.kwater.com/.well-known/jwks.json
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
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');  // base64url
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
// React: 3-BFF) Axios 인터셉터 (BFF) — 백엔드 경유 + 401 자동 갱신
const reactAxiosBffCode = `import axios from 'axios';

// BFF 패턴: 프론트는 토큰을 모름. 모든 요청을 자기 백엔드(/api) 경유로 보내고,
// 백엔드가 세션 스토어에서 Access Token을 꺼내 IdP/리소스 서버로 보낸다.
export const api = axios.create({
  baseURL: '/api',           // ← 자기 백엔드 경유. IdP에 직접 가지 않음
  withCredentials: true,     // portal_sid 세션 쿠키 자동 동봉
});

// 401 응답 시 백엔드의 갱신 엔드포인트 호출 후 원 요청 재시도
let refreshing = null;       // 동시 401에 대해 단일 refresh 호출만 진행

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retry) return Promise.reject(error);
    config._retry = true;

    try {
      // 진행 중인 갱신이 있으면 같이 기다림 (중복 호출 방지)
      refreshing = refreshing || axios.post('/api/auth/refresh', null, {
        withCredentials: true,
      });
      await refreshing;
      refreshing = null;

      // 백엔드가 세션의 토큰을 자동 갱신·새 portal_sid 쿠키도 갱신했으니
      // 원 요청을 그대로 재시도 — 백엔드가 새 Access Token을 자동으로 첨부
      return api(config);
    } catch (refreshError) {
      refreshing = null;
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

// 사용 예:
//   const { data } = await api.get('/datahub/datasets');   // → /api/datahub/datasets
//   백엔드가 /api/datahub/datasets 핸들러에서 세션의 Access Token으로
//   리소스 서버 호출하고 응답을 그대로 전달.`;

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
        ResponseCookie cookie = ResponseCookie.from("dp_sso_session", sessionId)
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
// logout_token(JWT)을 OIDC BCL 1.0 §2.4 (RFC 8417 SET) 규칙대로 검증하고,
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

    private static final String EXPECTED_TYP = "logout+jwt";          // OIDC BCL 1.0 §2.4 (RFC 8417 SET): typ 헤더 필수
    private static final long CLOCK_SKEW_SEC = 30;                    // 서버 간 시계 오차 허용

    @Value("\${idp.issuer}")     private String expectedIssuer;       // 'https://auth.kwater.com'
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

            // 6) nonce 부재 검증 (OIDC BCL 1.0 §2.4 (RFC 8417 SET): nonce MUST NOT be present)
            if (claims.getClaim("nonce") != null) return bad();

            // 7) sub 또는 sid로 세션 폐기 (둘 다 없으면 무효)
            String sub = claims.getSubject();
            String sid = claims.getStringClaim("sid");
            if (sid != null)      store.revokeBySid(sid);
            else if (sub != null) store.revokeBySub(sub);
            else return bad();

            // 8) Cache-Control: no-store 응답 헤더 (OIDC BCL 1.0 §2.8 (Cache-Control))
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

export default function CodeExample({ handleCopy, copiedId }) {
  const [codeLang, setCodeLang] = useState('react');

  return (
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
          {/* BFF/SPA 안내 */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-start gap-2 text-[15px] text-slate-300 leading-relaxed">
            <Info className="text-indigo-400 shrink-0 mt-0.5" size={16} />
            <div>
              본 가이드는 <strong className="text-emerald-300">BFF 패턴(권장)</strong>을 기본으로 합니다 — 토큰은 백엔드에 보관, 브라우저엔 세션 쿠키만.
              백엔드를 둘 수 없는 환경에서는 마지막의 <strong className="text-amber-300">SPA 대안 스니펫</strong>을 참고하세요.
            </div>
          </div>
          {[
            { id: 'react-login', title: '1) 로그인 시작 — /authorize 리다이렉트 (PKCE 포함)', desc: 'BFF·SPA 공통. 사용자가 "로그인" 버튼을 누르면 IdP /authorize로 보내는 헬퍼. state·nonce·PKCE code_verifier 생성·저장 + code_challenge S256으로 전송.', code: reactLoginCode, badge: 'COMMON', badgeColor: 'bg-slate-700 text-slate-200' },
            { id: 'react-callback', title: '2) 콜백 처리 — code → 백엔드 교환', desc: '🥇 BFF 패턴. 콜백 URL에서 code 추출 후 백엔드 /api/auth/exchange로 전달 → 백엔드가 IdP /token과 교환하고 portal_sid 쿠키 발급. state 검증·PKCE verifier 함께 전달.', code: reactCallbackCode, badge: 'BFF', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'react-axios-bff', title: '3) Axios 인터셉터 — 백엔드 경유 + 401 자동 갱신', desc: '🥇 BFF 패턴. 프론트는 토큰을 보유하지 않음. 모든 요청은 자기 백엔드(/api) 경유, 401 시 백엔드의 /api/auth/refresh 호출. memoryAccessToken 변수 없음 — 백엔드가 자동으로 Authorization 헤더 첨부.', code: reactAxiosBffCode, badge: 'BFF', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'react-logout', title: '4) 로그아웃 — RP-Initiated Logout', desc: '🥇 BFF 패턴. /api/auth/logout으로 백엔드 세션 정리 후 IdP /logout 리다이렉트. id_token_hint 또는 client_id 첨부.', code: reactLogoutCode, badge: 'BFF', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
            { id: 'react-axios-spa', title: '5) [대안] Axios 인터셉터 (SPA) — 메모리 AT + HttpOnly RT 쿠키', desc: '🥈 SPA 패턴 (백엔드 못 둘 때만 사용). memoryAccessToken을 JS 메모리에 보유, IdP /token에 프론트가 직접 갱신 요청. RTR + CSP 필수. 토큰 탭 "SPA 환경 저장 전략" 섹션 참조.', code: reactCode, badge: 'SPA', badgeColor: 'bg-amber-500/20 text-amber-300' },
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
            { id: 'spring-backchannel', title: '4) 백채널 로그아웃 수신 엔드포인트', desc: 'OIDC BCL 1.0 §2.4 (RFC 8417 SET) 전체 검증: typ=logout+jwt · iss · aud · iat(±스큐) · jti(Caffeine TTL) · events · nonce 부재 · sub/sid. Cache-Control: no-store 응답.', code: springBackchannelCode },
          ].map(s => (
            <CodeSnippetCard key={s.id} snippet={s} language="java"
              copiedId={copiedId} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  );
}
