import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeStyle = {
  borderRadius: '8px',
  fontSize: '0.82rem',
  margin: 0,
};

function CodeBlock({ language, children }) {
  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', borderRadius: '8px' }}>
      <SyntaxHighlighter
        language={language || 'python'}
        style={oneDark}
        customStyle={codeStyle}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function AnnotatedExample({ example }) {
  if (!example) return null;
  return (
    <div className="annotated-example">
      <h3>Annotated Example</h3>
      <CodeBlock language={example.language || 'python'}>
        {example.code}
      </CodeBlock>
      {example.annotations?.length > 0 && (
        <ul className="annotation-list">
          {example.annotations.map((ann, i) => (
            <li key={i} className="annotation-item">
              <span className="annotation-line-num">L{ann.line}</span>
              <span className="annotation-note">{ann.note}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PhaseReader({ level }) {
  return (
    <div className="phase-reader">
      <div className="phase-reader-header">
        <h2>Concept: {level.topic}</h2>
      </div>
      <div className="phase-reader-body">
        <div className="concept-markdown">
          <ReactMarkdown
            components={{
              pre({ children }) {
                return <>{children}</>;
              },
              code({ inline, className, children }) {
                const lang = (className || '').replace('language-', '');
                if (inline) return <code>{children}</code>;
                const code = Array.isArray(children)
                  ? children.join('')
                  : String(children);
                return (
                  <CodeBlock language={lang}>
                    {code.replace(/\n$/, '')}
                  </CodeBlock>
                );
              },
            }}
          >
            {level.concept}
          </ReactMarkdown>
        </div>
        <AnnotatedExample example={level.annotatedExample} />
      </div>
    </div>
  );
}
