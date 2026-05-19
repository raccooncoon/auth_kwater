import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ code, language = 'http', fontSize = '0.78rem', maxHeight }) {
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
