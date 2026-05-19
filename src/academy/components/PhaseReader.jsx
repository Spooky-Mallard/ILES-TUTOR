import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeStyle = {
  borderRadius: '8px',
  fontSize: '0.82rem',
  margin: 0,
  whiteSpace: 'pre-wrap',
  wordBreak: 'normal',
  overflowWrap: 'break-word',
  overflowX: 'hidden',
};

const inlineCodeStyle = {
  borderRadius: '6px',
  fontSize: '0.82rem',
  whiteSpace: 'pre-wrap',
  wordBreak: 'normal',
  overflowWrap: 'break-word',
  overflowX: 'hidden',
};

function CodeBlock({ language, children, showLineNumbers = false }) {
  return (
    <SyntaxHighlighter
      language={language || 'python'}
      style={oneDark}
      showLineNumbers={showLineNumbers}
      customStyle={showLineNumbers ? codeStyle : inlineCodeStyle}
      wrapLines
      wrapLongLines={false}
      codeTagProps={{ style: { whiteSpace: 'pre-wrap' } }}
    >
      {children}
    </SyntaxHighlighter>
  );
}

function AnnotatedExample({ example }) {
  if (!example) return null;
  return (
    <div className="annotated-example">
      <h3>Annotated Example</h3>
      <CodeBlock language={example.language || 'python'} showLineNumbers>
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
              code({ inline, className, children }) {
                const lang = (className || '').replace('language-', '');
                if (inline) return <code>{children}</code>;
                return (
                  <CodeBlock language={lang}>
                    {String(children).replace(/\n$/, '')}
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
