// 의존성 없는 경량 Markdown → HTML 변환기.
// SpecDoc 문서에 사용된 모든 패턴을 지원: 헤더(1~4) · 표 · 코드블록 · 인라인 코드 · 굵게 · 링크 · 리스트 · HR · 인용

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatInline(text) {
  // 순서 중요: 코드 먼저 → 굵게 → 링크
  // 코드 내부는 escape, 그 외엔 inline 포맷 적용
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, code) => {
    codes.push(escapeHtml(code));
    return `CODE${codes.length - 1}`;
  });
  s = s
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  s = s.replace(/CODE(\d+)/g, (_, i) => `<code>${codes[Number(i)]}</code>`);
  return s;
}

function renderTable(lines) {
  // 구분선 (|---|---|) 제거
  const filtered = lines.filter((l) => !/^\|[\s\-:|]+\|$/.test(l));
  if (filtered.length === 0) return '';
  const parseRow = (line) => line.split('|').slice(1, -1).map((c) => c.trim());
  const header = filtered[0];
  const rows = filtered.slice(1);
  let html = '<table><thead><tr>';
  html += parseRow(header).map((c) => `<th>${formatInline(c)}</th>`).join('');
  html += '</tr></thead><tbody>';
  for (const row of rows) {
    html += '<tr>' + parseRow(row).map((c) => `<td>${formatInline(c)}</td>`).join('') + '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

export function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 코드 블록
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      html += `<pre class="lang-${lang || 'plain'}"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>\n`;
      continue;
    }

    // 헤더 (h1 ~ h4)
    const hMatch = line.match(/^(#{1,4}) (.+)$/);
    if (hMatch) {
      const level = hMatch[1].length;
      html += `<h${level}>${formatInline(hMatch[2])}</h${level}>\n`;
      i++;
      continue;
    }

    // HR
    if (/^---+$/.test(line.trim())) {
      html += '<hr/>\n';
      i++;
      continue;
    }

    // 인용 (>)
    if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      html += `<blockquote>${formatInline(quoteLines.join(' '))}</blockquote>\n`;
      continue;
    }

    // 표
    if (line.startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      html += renderTable(tableLines) + '\n';
      continue;
    }

    // 불릿 리스트 (- 또는 *)
    if (/^[-*] /.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      html += '<ul>' + items.map((it) => `<li>${formatInline(it)}</li>`).join('') + '</ul>\n';
      continue;
    }

    // 번호 리스트
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      html += '<ol>' + items.map((it) => `<li>${formatInline(it)}</li>`).join('') + '</ol>\n';
      continue;
    }

    // 빈 줄
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 단락
    const paraLines = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^[#>|`]/.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    html += `<p>${formatInline(paraLines.join(' '))}</p>\n`;
  }

  return html;
}

// 인쇄(PDF 저장)용 완전한 HTML 페이지 생성
export function buildPrintableHtml(md, { title = '문서' } = {}) {
  const body = mdToHtml(md);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 18mm 16mm; }

  * { box-sizing: border-box; }

  body {
    font-family: 'Noto Sans KR', system-ui, -apple-system, 'Apple SD Gothic Neo', sans-serif;
    color: #1a1a1a;
    line-height: 1.7;
    max-width: 880px;
    margin: 0 auto;
    padding: 32px 24px 64px;
    font-size: 11pt;
    background: #fff;
  }

  h1 {
    font-size: 24pt;
    font-weight: 800;
    color: #0d2540;
    border-bottom: 3px solid #0d2540;
    padding-bottom: 10px;
    margin: 36px 0 24px;
    letter-spacing: -0.02em;
  }
  h2 {
    font-size: 17pt;
    font-weight: 700;
    color: #0d2540;
    border-left: 5px solid #2563eb;
    padding-left: 12px;
    margin: 40px 0 18px;
    page-break-before: always;
    page-break-after: avoid;
  }
  h2:first-of-type { page-break-before: avoid; }
  h3 {
    font-size: 13pt;
    font-weight: 700;
    color: #1f3a5f;
    margin: 28px 0 12px;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11.5pt;
    font-weight: 700;
    color: #2a4a72;
    margin: 20px 0 8px;
    page-break-after: avoid;
  }

  p { margin: 10px 0; }

  code {
    font-family: 'JetBrains Mono', 'D2Coding', 'Consolas', monospace;
    background: #f0f4f8;
    color: #b3104b;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 90%;
  }
  pre {
    background: #f7f9fb;
    border: 1px solid #e1e7ef;
    border-radius: 6px;
    padding: 12px 16px;
    overflow-x: auto;
    margin: 14px 0;
    page-break-inside: avoid;
  }
  pre code {
    background: transparent;
    color: #1a1a1a;
    padding: 0;
    font-size: 9.5pt;
    line-height: 1.5;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 14px 0;
    font-size: 10pt;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #cbd5e0;
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #edf2f7;
    font-weight: 700;
    color: #1a202c;
  }
  tr:nth-child(even) td { background: #f7fafc; }

  ul, ol { padding-left: 24px; margin: 10px 0; }
  li { margin: 4px 0; }

  hr { border: none; border-top: 1px solid #cbd5e0; margin: 28px 0; }

  blockquote {
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    padding: 12px 16px;
    margin: 14px 0;
    border-radius: 0 6px 6px 0;
    color: #78350f;
  }
  blockquote strong { color: #92400e; }

  a { color: #2563eb; text-decoration: none; }
  strong { font-weight: 700; color: #0d2540; }

  .toc-block { background: #f7fafc; border: 1px solid #e1e7ef; border-radius: 6px; padding: 16px 20px; margin: 20px 0; }

  @media print {
    body { max-width: none; padding: 0; }
    pre { white-space: pre-wrap; word-break: break-all; }
    a { color: #1a1a1a; }
  }

  @media screen {
    body { box-shadow: 0 0 20px rgba(0,0,0,0.08); margin: 32px auto; }
  }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

// PDF 저장(브라우저 인쇄 다이얼로그) 트리거
export function openPdfPreview(md, options = {}) {
  const html = buildPrintableHtml(md, options);
  const win = window.open('', '_blank');
  if (!win) {
    alert('팝업이 차단되었습니다. 팝업 차단을 해제한 뒤 다시 시도해주세요.');
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  // 폰트·이미지 로드 후 인쇄 다이얼로그 자동 호출
  win.addEventListener('load', () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 600);
  });
}
