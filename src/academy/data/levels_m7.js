export const levelsM7 = [
  {
    id: 38,
    module: 7,
    moduleTitle: 'React Fundamentals',
    category: 'React',
    title: 'What JSX Actually Is',
    topic: 'JSX syntax and transpilation',
    concept: `## What JSX Actually Is

JSX looks like HTML inside JavaScript, but it is not HTML. It is syntactic sugar that Babel transpiles into plain JavaScript function calls.

\`\`\`jsx
// What you write
const el = <h1 className="title">Hello</h1>;

// What Babel compiles it to
const el = React.createElement("h1", { className: "title" }, "Hello");
\`\`\`

### Key JSX Rules

**1. One root element** — every component must return a single root. Wrap siblings in a \`<div>\` or empty fragment \`<></>\`.

\`\`\`jsx
// Wrong
return <h1>Title</h1><p>Subtitle</p>;

// Right
return (
  <>
    <h1>Title</h1>
    <p>Subtitle</p>
  </>
);
\`\`\`

**2. \`className\` not \`class\`** — \`class\` is a reserved JS keyword.

\`\`\`jsx
<div className="container">...</div>
\`\`\`

**3. \`htmlFor\` not \`for\`** — same reason.

\`\`\`jsx
<label htmlFor="email">Email</label>
\`\`\`

**4. Self-closing tags** — all tags must close.

\`\`\`jsx
<img src="..." alt="..." />
<input type="text" />
\`\`\`

**5. JavaScript expressions in \`{}\`** — use curly braces for any JS expression.

\`\`\`jsx
const name = "Alice";
return <p>Hello, {name}!</p>;
return <p>{2 + 2}</p>;
return <p>{isLoggedIn ? "Welcome" : "Please log in"}</p>;
\`\`\`

Statements (if, for) do not go inside \`{}\` — only expressions do.`,
    annotatedExample: {
      language: 'jsx',
      code: `// JSX is just JavaScript — this file is .jsx
import React from 'react';

function Greeting() {
  const user = "Alice";                         // plain JS variable
  const isLoggedIn = true;

  // parentheses let us write multi-line JSX
  return (
    <div className="greeting">                  {/* className, not class */}
      <h1>Hello, {user}!</h1>                  {/* {} evaluates JS expression */}
      <p>
        {isLoggedIn                             {/* ternary inside {} */}
          ? "You are logged in."
          : "Please log in."}
      </p>
      <img src="/avatar.png" alt="avatar" />   {/* self-closing tag */}
      <label htmlFor="name">Name</label>        {/* htmlFor, not for */}
      <input id="name" type="text" />
    </div>
  );
}

export default Greeting;`,
      annotations: [
        { line: 6, note: 'Regular JS variable — used inside JSX via {}' },
        { line: 10, note: 'className replaces HTML class attribute' },
        { line: 11, note: 'Curly braces evaluate any JS expression' },
        { line: 13, note: 'Ternary operator is an expression — valid inside {}' },
        { line: 18, note: 'All JSX tags must be self-closing or have a closing tag' },
        { line: 19, note: 'htmlFor replaces HTML for attribute' },
      ],
    },
    guided: {
      instructions: 'Fix the broken JSX so it renders correctly.',
      starterCode: `function Card() {
  const title = "My Card";
  const count = 42;

  return (
    // Fix 1: wrap both elements in a fragment <>...</>
    <h2 class="card-title">{title}</h2>
    <p>Count: {count}</p>
  );
}`,
      solution: `function Card() {
  const title = "My Card";
  const count = 42;

  return (
    <>
      <h2 className="card-title">{title}</h2>
      <p>Count: {count}</p>
    </>
  );
}`,
      evalChecks: [
        {
          id: 'fragment',
          description: 'Wraps content in a fragment or single root',
          test: code => /<>[\s\S]*<\/>/.test(code) || /<React\.Fragment>[\s\S]*<\/React\.Fragment>/.test(code),
          points: 35,
          failFeedback: 'Wrap both elements in a React fragment: <>...</>',
        },
        {
          id: 'classname',
          description: 'Uses className instead of class',
          test: code => /className=/.test(code) && !/\bclass=/.test(code),
          points: 35,
          failFeedback: 'Replace class= with className= in JSX',
        },
        {
          id: 'expressions',
          description: 'Uses {} for JS expressions',
          test: code => /\{title\}/.test(code) && /\{count\}/.test(code),
          points: 30,
          failFeedback: 'Use {title} and {count} inside JSX to render variables',
        },
      ],
    },
    challenge: {
      instructions: `Write a JSX component called \`ProfileCard\` that renders:
- An \`<article>\` as the root element
- An \`<h2>\` with className "name" showing variable \`name\`
- A \`<p>\` showing variable \`role\`
- An \`<img>\` tag with src="/profile.png", alt="profile photo" (self-closing)
- A \`<label>\` with htmlFor "bio" containing text "Bio"
- An \`<input>\` with id="bio" type="text"

Define \`name = "Sam"\` and \`role = "Developer"\` as variables inside the function.`,
      evalChecks: [
        {
          id: 'function',
          description: 'Defines ProfileCard function component',
          test: code => /function\s+ProfileCard\s*\(/.test(code) || /const\s+ProfileCard\s*=\s*(?:\(|function)/.test(code),
          points: 10,
          failFeedback: 'Define a function component named ProfileCard',
        },
        {
          id: 'variables',
          description: 'Defines name and role variables',
          test: code => /const\s+name\s*=\s*["']Sam["']/.test(code) && /const\s+role\s*=\s*["']Developer["']/.test(code),
          points: 15,
          failFeedback: 'Define: const name = "Sam" and const role = "Developer" inside the component',
        },
        {
          id: 'root',
          description: 'Uses <article> as root element',
          test: code => /<article[\s>]/.test(code) && /<\/article>/.test(code),
          points: 10,
          failFeedback: 'Wrap everything in an <article> element',
        },
        {
          id: 'h2',
          description: 'h2 with className="name" showing {name}',
          test: code => /<h2\s+className=["']name["'][\s\S]*?\{name\}/.test(code) || /<h2[\s\S]*?className=["']name["'][\s\S]*?\{name\}/.test(code),
          points: 15,
          failFeedback: '<h2 className="name">{name}</h2>',
        },
        {
          id: 'role',
          description: 'Paragraph showing {role}',
          test: code => /<p>[\s\S]*?\{role\}[\s\S]*?<\/p>/.test(code),
          points: 15,
          failFeedback: '<p>{role}</p>',
        },
        {
          id: 'img',
          description: 'Self-closing img with correct src and alt',
          test: code => /<img[\s\S]*?src=["']\/profile\.png["'][\s\S]*?alt=["']profile photo["'][\s\S]*?\/>/.test(code) || /<img[\s\S]*?alt=["']profile photo["'][\s\S]*?src=["']\/profile\.png["'][\s\S]*?\/>/.test(code),
          points: 15,
          failFeedback: '<img src="/profile.png" alt="profile photo" />',
        },
        {
          id: 'htmlfor',
          description: 'Uses htmlFor on label',
          test: code => /htmlFor=["']bio["']/.test(code),
          points: 10,
          failFeedback: 'Use htmlFor="bio" on the <label> element',
        },
        {
          id: 'input',
          description: 'Input with id="bio" type="text"',
          test: code => /<input[\s\S]*?id=["']bio["'][\s\S]*?type=["']text["'][\s\S]*?\/>/.test(code) || /<input[\s\S]*?type=["']text["'][\s\S]*?id=["']bio["'][\s\S]*?\/>/.test(code),
          points: 10,
          failFeedback: '<input id="bio" type="text" />',
        },
      ],
    },
    hints: [
      'JSX must have one root element — use <article> or <>',
      'HTML class → JSX className',
      'HTML for → JSX htmlFor',
      'All tags must close: <img /> not <img>',
      'Variables go inside {}: <h2>{name}</h2>',
    ],
    docs: [
      { label: 'JSX in Depth', url: 'https://react.dev/learn/writing-markup-with-jsx' },
      { label: 'JavaScript in JSX', url: 'https://react.dev/learn/javascript-in-jsx-with-curly-braces' },
    ],
    prerequisite: 37,
  },

  {
    id: 39,
    module: 7,
    moduleTitle: 'React Fundamentals',
    category: 'React',
    title: 'Function Components & Props',
    topic: 'Defining components, passing and receiving props',
    concept: `## Function Components & Props

A React component is a JavaScript function that returns JSX. Props are the component's inputs — passed as attributes in JSX, received as an object parameter.

\`\`\`jsx
// Defining a component
function Button({ label, onClick }) {    // destructure props directly
  return <button onClick={onClick}>{label}</button>;
}

// Using it
<Button label="Save" onClick={handleSave} />
\`\`\`

### Props Rules

- Props are **read-only** — never mutate them inside the component
- Any JS value can be a prop: string, number, boolean, array, object, function
- Boolean props: \`<Input disabled />\` is shorthand for \`disabled={true}\`
- Default props: use default parameter syntax

\`\`\`jsx
function Avatar({ src, size = 48, alt = "avatar" }) {
  return <img src={src} width={size} height={size} alt={alt} />;
}
\`\`\`

### The \`children\` Prop

Anything placed between component tags becomes \`props.children\`:

\`\`\`jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="Info">
  <p>This is the card body.</p>   {/* becomes children */}
</Card>
\`\`\`

### Component Naming

Components must start with a capital letter. Lowercase names are treated as HTML tags.

\`\`\`jsx
<div />      // HTML div element
<Div />      // React component named Div
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `// Badge.jsx
function Badge({ text, color = "blue", size = "md" }) {   // defaults in destructure
  const styles = {
    backgroundColor: color,
    padding: size === "sm" ? "2px 6px" : "4px 12px",      // ternary on prop
    borderRadius: "999px",
    color: "white",
  };

  return <span style={styles}>{text}</span>;               // {} around style object
}

// UserCard.jsx
function UserCard({ name, role, children }) {              // children prop
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <Badge text={role} color="green" />                  {/* component used as child */}
      <div className="extra">{children}</div>              {/* render children slot */}
    </div>
  );
}

// App.jsx
function App() {
  return (
    <UserCard name="Alice" role="Developer">
      <p>This appears in the children slot.</p>            {/* becomes children */}
    </UserCard>
  );
}`,
      annotations: [
        { line: 2, note: 'Destructure props with defaults directly in the parameter list' },
        { line: 4, note: 'Props used in JS expressions — ternary for conditional style' },
        { line: 13, note: 'Pass style object via double curly: outer {} = expression, inner {} = object' },
        { line: 17, note: 'children is a special prop — receives anything between opening/closing tags' },
        { line: 21, note: 'Badge is used as a child — props passed as attributes' },
        { line: 22, note: 'Render the children slot just like any other prop' },
      ],
    },
    guided: {
      instructions: 'Complete the Pill component and use it correctly.',
      starterCode: `// Complete this component
function Pill({ label, _____ = "gray" }) {      // add a 'color' prop with default "gray"
  return (
    <span style={{ background: _____, padding: "2px 8px" }}>
      {_____}                                    // render label
    </span>
  );
}

// Use Pill below — pass label="Success" and color="green"
function App() {
  return (
    <div>
      <Pill _____ />
    </div>
  );
}`,
      solution: `function Pill({ label, color = "gray" }) {
  return (
    <span style={{ background: color, padding: "2px 8px" }}>
      {label}
    </span>
  );
}

function App() {
  return (
    <div>
      <Pill label="Success" color="green" />
    </div>
  );
}`,
      evalChecks: [
        {
          id: 'color_default',
          description: 'color prop with default "gray"',
          test: code => /color\s*=\s*["']gray["']/.test(code),
          points: 30,
          failFeedback: 'Destructure: { label, color = "gray" }',
        },
        {
          id: 'render_label',
          description: 'Renders {label} in the span',
          test: code => /\{label\}/.test(code),
          points: 35,
          failFeedback: 'Use {label} inside the <span> to display the label',
        },
        {
          id: 'usage',
          description: 'Passes label and color to Pill',
          test: code => /label=["']Success["']/.test(code) && /color=["']green["']/.test(code),
          points: 35,
          failFeedback: '<Pill label="Success" color="green" />',
        },
      ],
    },
    challenge: {
      instructions: `Build two components:

**1. \`StatItem\`** — accepts props: \`label\` (string), \`value\` (number), \`unit\` (string, default \`""\`)
- Returns a \`<div className="stat-item">\`
- Inside: \`<span className="stat-label">\` showing label, then \`<strong className="stat-value">\` showing value, then \`<em>\` showing unit

**2. \`StatsPanel\`** — accepts \`title\` (string) and \`children\`
- Returns \`<section className="stats-panel">\`
- Inside: \`<h2>\` showing title, then a \`<div className="stats-grid">\` rendering children

**Usage (write this in App):**
\`\`\`jsx
<StatsPanel title="Course Stats">
  <StatItem label="Levels" value={52} />
  <StatItem label="Duration" value={8} unit="weeks" />
</StatsPanel>
\`\`\``,
      evalChecks: [
        {
          id: 'stat_item_fn',
          description: 'StatItem function defined',
          test: code => /function\s+StatItem\s*\(/.test(code) || /const\s+StatItem\s*=/.test(code),
          points: 10,
          failFeedback: 'Define a function component named StatItem',
        },
        {
          id: 'stat_item_props',
          description: 'StatItem accepts label, value, unit with default',
          test: code => /StatItem[\s\S]*?label[\s\S]*?value/.test(code) && /unit\s*=\s*["']["']/.test(code),
          points: 15,
          failFeedback: 'Destructure { label, value, unit = "" } in StatItem',
        },
        {
          id: 'stat_item_jsx',
          description: 'StatItem renders stat-item div with correct children',
          test: code => /className=["']stat-item["']/.test(code) && /className=["']stat-label["']/.test(code) && /className=["']stat-value["']/.test(code),
          points: 15,
          failFeedback: 'Render <div className="stat-item"> with stat-label and stat-value spans/elements',
        },
        {
          id: 'stats_panel_fn',
          description: 'StatsPanel function defined',
          test: code => /function\s+StatsPanel\s*\(/.test(code) || /const\s+StatsPanel\s*=/.test(code),
          points: 10,
          failFeedback: 'Define a function component named StatsPanel',
        },
        {
          id: 'stats_panel_children',
          description: 'StatsPanel accepts and renders children',
          test: code => /StatsPanel[\s\S]*?children/.test(code) && /\{children\}/.test(code),
          points: 15,
          failFeedback: 'Accept children prop and render {children} inside StatsPanel',
        },
        {
          id: 'stats_panel_jsx',
          description: 'StatsPanel renders section with stats-panel and stats-grid',
          test: code => /className=["']stats-panel["']/.test(code) && /className=["']stats-grid["']/.test(code),
          points: 15,
          failFeedback: 'StatsPanel: <section className="stats-panel"><h2>{title}</h2><div className="stats-grid">{children}</div></section>',
        },
        {
          id: 'usage_app',
          description: 'Uses StatsPanel wrapping two StatItem components',
          test: code => /<StatsPanel[\s\S]*?<StatItem[\s\S]*?<StatItem/.test(code),
          points: 20,
          failFeedback: 'In App, use <StatsPanel> containing two <StatItem /> components',
        },
      ],
    },
    hints: [
      'Destructure props in the function signature: function Comp({ a, b })',
      'Default props: function Comp({ unit = "" })',
      'children is just another prop — destructure it or use props.children',
      'Use <StatsPanel>...</StatsPanel> syntax to pass children',
      'Component names must be CapitalCase',
    ],
    docs: [
      { label: 'Components and Props', url: 'https://react.dev/learn/passing-props-to-a-component' },
      { label: 'Your First Component', url: 'https://react.dev/learn/your-first-component' },
    ],
    prerequisite: 38,
  },

  {
    id: 40,
    module: 7,
    moduleTitle: 'React Fundamentals',
    category: 'React',
    title: 'The Component Tree',
    topic: 'Component composition, lifting state, data flow',
    concept: `## The Component Tree

React apps are trees of components. Data flows **down** via props. Events flow **up** via callback props.

\`\`\`
App
├── Header
│   └── Nav
└── Main
    ├── Sidebar
    └── Feed
        └── PostCard (× many)
\`\`\`

### One-Way Data Flow

\`\`\`jsx
// Data flows DOWN via props
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} onIncrement={() => setCount(c => c + 1)} />;
}

// Events flow UP via callback props
function Child({ count, onIncrement }) {
  return (
    <div>
      <p>{count}</p>
      <button onClick={onIncrement}>+</button>
    </div>
  );
}
\`\`\`

### Lifting State Up

When two siblings need to share data, move state to their common ancestor:

\`\`\`jsx
function SearchPage() {
  const [query, setQuery] = useState('');      // lifted to parent

  return (
    <>
      <SearchBar query={query} onChange={setQuery} />
      <Results query={query} />                 // both read same state
    </>
  );
}
\`\`\`

### Composition vs Configuration

Prefer composition (children) over deeply nested prop passing:

\`\`\`jsx
// Instead of: <Layout sidebar={<Sidebar />} main={<Feed />} />
// Use named slot props:
function Layout({ sidebar, main }) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{main}</main>
    </div>
  );
}
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState } from 'react';

// Leaf component — receives data and callbacks via props
function ScoreDisplay({ score, onReset }) {
  return (
    <div>
      <p>Score: {score}</p>
      <button onClick={onReset}>Reset</button>          {/* calls parent callback */}
    </div>
  );
}

// Leaf component — receives callback, fires it on interaction
function ScoreControls({ onAdd, onSubtract }) {
  return (
    <div>
      <button onClick={onAdd}>+10</button>
      <button onClick={onSubtract}>-10</button>
    </div>
  );
}

// Parent owns state — passes data down, receives events up
function ScoreBoard() {
  const [score, setScore] = useState(0);               // state lives here

  return (
    <div className="scoreboard">
      <ScoreDisplay
        score={score}                                  {/* data flows down */}
        onReset={() => setScore(0)}                    {/* callback flows down */}
      />
      <ScoreControls
        onAdd={() => setScore(s => s + 10)}            {/* events bubble up via callback */}
        onSubtract={() => setScore(s => s - 10)}
      />
    </div>
  );
}`,
      annotations: [
        { line: 3, note: 'Leaf components are pure — they only display and emit events' },
        { line: 7, note: 'onClick calls the parent-provided callback — event flows up' },
        { line: 12, note: 'Multiple callback props are normal — one per action' },
        { line: 22, note: 'State lives in the closest common ancestor of all consumers' },
        { line: 25, note: 'State value passed as prop — child reads but never mutates it' },
        { line: 26, note: 'Callback to mutate state — child calls it, parent handles it' },
      ],
    },
    guided: {
      instructions: 'Complete the component tree so Counter works correctly.',
      starterCode: `import { useState } from 'react';

function Display({ _____ }) {                   // accept 'count' prop
  return <p>Count: {_____}</p>;                 // render count
}

function Controls({ onUp, _____ }) {            // accept onDown callback
  return (
    <>
      <button onClick={onUp}>Up</button>
      <button onClick={_____}>Down</button>     // wire onDown
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Display _____ />                         // pass count
      <Controls
        onUp={() => setCount(c => c + 1)}
        _____ />                                // pass onDown callback
    </div>
  );
}`,
      solution: `import { useState } from 'react';

function Display({ count }) {
  return <p>Count: {count}</p>;
}

function Controls({ onUp, onDown }) {
  return (
    <>
      <button onClick={onUp}>Up</button>
      <button onClick={onDown}>Down</button>
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Display count={count} />
      <Controls
        onUp={() => setCount(c => c + 1)}
        onDown={() => setCount(c => c - 1)} />
    </div>
  );
}`,
      evalChecks: [
        {
          id: 'display_prop',
          description: 'Display accepts and renders count',
          test: code => /Display[\s\S]*?\{\s*count\s*\}/.test(code) && /\{count\}/.test(code),
          points: 30,
          failFeedback: 'function Display({ count }) { return <p>Count: {count}</p>; }',
        },
        {
          id: 'controls_callback',
          description: 'Controls accepts onDown and wires it to button',
          test: code => /Controls[\s\S]*?onDown/.test(code) && /onClick=\{onDown\}/.test(code),
          points: 35,
          failFeedback: 'function Controls({ onUp, onDown }) — then <button onClick={onDown}>',
        },
        {
          id: 'usage',
          description: 'Counter passes count to Display and onDown to Controls',
          test: code => /Display[\s\S]*?count=\{count\}/.test(code) && /onDown=/.test(code),
          points: 35,
          failFeedback: '<Display count={count} /> and <Controls ... onDown={() => setCount(c => c - 1)} />',
        },
      ],
    },
    challenge: {
      instructions: `Build a temperature converter with this component tree:

**\`TempInput\`** — props: \`label\`, \`value\`, \`onChange\`
- Renders \`<label>\` with the label text and an \`<input type="number">\` whose value and onChange are wired to props

**\`TempResult\`** — props: \`celsius\`, \`fahrenheit\`
- Renders a \`<p>\` showing: \`"{celsius}°C = {fahrenheit}°F"\`

**\`TempConverter\`** — owns all state
- State: \`celsius\` (number, start 0)
- Compute \`fahrenheit\` as \`Math.round(celsius * 9/5 + 32)\`
- Renders \`TempInput\` with label="Celsius" wired to celsius state
- Renders \`TempResult\` with both values`,
      evalChecks: [
        {
          id: 'temp_input',
          description: 'TempInput component defined with label, value, onChange',
          test: code => /function\s+TempInput|const\s+TempInput/.test(code) && /label[\s\S]*?value[\s\S]*?onChange|onChange[\s\S]*?label/.test(code),
          points: 15,
          failFeedback: 'Define TempInput accepting { label, value, onChange }',
        },
        {
          id: 'temp_input_wired',
          description: 'TempInput renders input with value and onChange',
          test: code => /value=\{value\}/.test(code) && /onChange/.test(code),
          points: 15,
          failFeedback: '<input type="number" value={value} onChange={...} />',
        },
        {
          id: 'temp_result',
          description: 'TempResult component with celsius and fahrenheit props',
          test: code => /function\s+TempResult|const\s+TempResult/.test(code) && /celsius/.test(code) && /fahrenheit/.test(code),
          points: 15,
          failFeedback: 'Define TempResult accepting { celsius, fahrenheit }',
        },
        {
          id: 'temp_result_render',
          description: 'TempResult renders both values in paragraph',
          test: code => /\{celsius\}/.test(code) && /\{fahrenheit\}/.test(code) && /<p>/.test(code),
          points: 15,
          failFeedback: '<p>{celsius}°C = {fahrenheit}°F</p>',
        },
        {
          id: 'state',
          description: 'TempConverter uses useState for celsius',
          test: code => /useState\s*\(\s*0\s*\)/.test(code),
          points: 15,
          failFeedback: 'const [celsius, setCelsius] = useState(0) in TempConverter',
        },
        {
          id: 'formula',
          description: 'Fahrenheit computed with correct formula',
          test: code => /celsius\s*\*\s*9\s*\/\s*5\s*\+\s*32/.test(code) || /celsius\s*\*\s*\(9\s*\/\s*5\)\s*\+\s*32/.test(code),
          points: 15,
          failFeedback: 'const fahrenheit = Math.round(celsius * 9/5 + 32)',
        },
        {
          id: 'composition',
          description: 'Uses TempInput and TempResult inside TempConverter',
          test: code => /<TempInput/.test(code) && /<TempResult/.test(code),
          points: 10,
          failFeedback: 'Render both <TempInput> and <TempResult> inside TempConverter',
        },
      ],
    },
    hints: [
      'State lives in the nearest common ancestor',
      'Child changes state by calling a callback prop passed from parent',
      'Pass the setter directly: onChange={setCelsius} — or wrap: onChange={e => setCelsius(Number(e.target.value))}',
      'Derived values (fahrenheit) are computed from state — not stored in state',
    ],
    docs: [
      { label: 'Sharing State Between Components', url: 'https://react.dev/learn/sharing-state-between-components' },
      { label: 'Thinking in React', url: 'https://react.dev/learn/thinking-in-react' },
    ],
    prerequisite: 39,
  },

  {
    id: 41,
    module: 7,
    moduleTitle: 'React Fundamentals',
    category: 'React',
    title: 'Conditional Rendering',
    topic: 'if/else, ternary, &&, early return',
    concept: `## Conditional Rendering

React renders different UI based on conditions using standard JavaScript.

### Ternary Operator (condition ? a : b)
Best when you need one of two elements:

\`\`\`jsx
function Status({ isOnline }) {
  return (
    <span>{isOnline ? "Online" : "Offline"}</span>
  );
}
\`\`\`

### && Short-Circuit
Best when you want to render *something or nothing*:

\`\`\`jsx
function Notification({ count }) {
  return (
    <div>
      {count > 0 && <Badge count={count} />}   {/* renders only if count > 0 */}
    </div>
  );
}
\`\`\`

**Gotcha:** \`{0 && <X />}\` renders \`0\`, not nothing. Use \`{count > 0 && <X />}\`.

### if/else Before Return
Best for complex conditions:

\`\`\`jsx
function AuthContent({ user, loading }) {
  if (loading) return <Spinner />;
  if (!user) return <LoginForm />;
  return <Dashboard user={user} />;
}
\`\`\`

### Returning null
Returning \`null\` renders nothing without removing the component from the tree:

\`\`\`jsx
function ErrorBanner({ error }) {
  if (!error) return null;
  return <div className="error">{error}</div>;
}
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `function ProfilePage({ user, loading, error }) {
  // Early returns — simplest when guards are needed
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!user) {
    return null;                                         // render nothing
  }

  // Main render — all guards passed
  return (
    <div className="profile">
      <h1>{user.name}</h1>

      {/* ternary: one or the other */}
      <p>{user.isAdmin ? "Administrator" : "Member"}</p>

      {/* && : show only when condition true */}
      {user.unreadCount > 0 && (
        <span className="badge">{user.unreadCount} new</span>
      )}

      {/* nested ternary — acceptable for simple cases */}
      <p className={
        user.score >= 90 ? "gold" :
        user.score >= 70 ? "silver" :
        "bronze"
      }>
        {user.score} pts
      </p>
    </div>
  );
}`,
      annotations: [
        { line: 3, note: 'Early return pattern — guard clauses before main render' },
        { line: 7, note: 'Return JSX directly — no need for else when returning early' },
        { line: 11, note: 'null renders nothing — component stays mounted' },
        { line: 19, note: 'Ternary for mutual exclusion: admin vs member label' },
        { line: 22, note: '&& renders Badge only when unreadCount > 0 (avoid 0 && issue)' },
        { line: 26, note: 'Chained ternary for 3-way condition — keep it flat and readable' },
      ],
    },
    guided: {
      instructions: 'Complete the conditional rendering logic in TemperatureWarning.',
      starterCode: `function TemperatureWarning({ temp }) {
  // If temp > 35: return a <p> with className "hot" saying "Too hot!"
  if (_____ > 35) {
    return _____;
  }

  // If temp < 5: return a <p> with className "cold" saying "Too cold!"
  if (_____) {
    return <p className="cold">Too cold!</p>;
  }

  // Otherwise render a <p> saying "Comfortable"
  // Use && to also show a <span>✓</span> after the text
  return (
    <p>
      Comfortable {_____ && <span>✓</span>}
    </p>
  );
}`,
      solution: `function TemperatureWarning({ temp }) {
  if (temp > 35) {
    return <p className="hot">Too hot!</p>;
  }

  if (temp < 5) {
    return <p className="cold">Too cold!</p>;
  }

  return (
    <p>
      Comfortable {true && <span>✓</span>}
    </p>
  );
}`,
      evalChecks: [
        {
          id: 'hot_guard',
          description: 'Returns hot paragraph when temp > 35',
          test: code => /temp\s*>\s*35/.test(code) && /className=["']hot["']/.test(code),
          points: 35,
          failFeedback: 'if (temp > 35) { return <p className="hot">Too hot!</p>; }',
        },
        {
          id: 'cold_guard',
          description: 'Returns cold paragraph when temp < 5',
          test: code => /temp\s*<\s*5/.test(code) && /className=["']cold["']/.test(code),
          points: 35,
          failFeedback: 'if (temp < 5) { return <p className="cold">Too cold!</p>; }',
        },
        {
          id: 'and_operator',
          description: 'Uses && to conditionally render checkmark',
          test: code => /&&\s*<span>/.test(code) || /&&\s*\(\s*<span>/.test(code),
          points: 30,
          failFeedback: 'Use {someCondition && <span>✓</span>} for conditional render',
        },
      ],
    },
    challenge: {
      instructions: `Build an \`AuthGate\` component with these props: \`isLoading\` (bool), \`isLoggedIn\` (bool), \`username\` (string), \`role\` (string: "admin" | "user")

Render logic (in order):
1. If \`isLoading\` is true — return \`<div className="loading">Loading...</div>\`
2. If not \`isLoggedIn\` — return \`<div className="login-prompt">Please log in</div>\`
3. Otherwise return a \`<div className="dashboard">\` containing:
   - \`<h1>\` saying \`"Welcome, {username}"\`
   - \`<p>\` saying \`"Role: Admin"\` if role is "admin", else \`"Role: User"\`
   - A \`<button className="admin-btn">\` with text "Admin Panel" — render this **only if** role === "admin" (use &&)
   - A \`<p className="status">\` with text "Active" — always shown`,
      evalChecks: [
        {
          id: 'loading_guard',
          description: 'Returns loading div when isLoading is true',
          test: code => /isLoading[\s\S]*?return[\s\S]*?loading/.test(code) || /isLoading\s*\)[\s\S]*?Loading/.test(code),
          points: 15,
          failFeedback: 'if (isLoading) return <div className="loading">Loading...</div>',
        },
        {
          id: 'auth_guard',
          description: 'Returns login prompt when not logged in',
          test: code => /!isLoggedIn[\s\S]*?login-prompt|isLoggedIn[\s\S]*?false[\s\S]*?login/.test(code) || /!isLoggedIn[\s\S]*?return/.test(code),
          points: 15,
          failFeedback: 'if (!isLoggedIn) return <div className="login-prompt">Please log in</div>',
        },
        {
          id: 'welcome',
          description: 'Renders welcome h1 with username',
          test: code => /<h1>[\s\S]*?\{username\}[\s\S]*?<\/h1>/.test(code),
          points: 15,
          failFeedback: '<h1>Welcome, {username}</h1>',
        },
        {
          id: 'role_ternary',
          description: 'Shows role label using ternary',
          test: code => /role\s*===?\s*["']admin["'][\s\S]*?Admin[\s\S]*?User|["']admin["']\s*===?\s*role[\s\S]*?Admin/.test(code),
          points: 20,
          failFeedback: '<p>{role === "admin" ? "Role: Admin" : "Role: User"}</p>',
        },
        {
          id: 'admin_btn',
          description: 'Renders admin button only when role === "admin"',
          test: code => /role\s*===?\s*["']admin["']\s*&&[\s\S]*?admin-btn|admin-btn[\s\S]*?role\s*===?\s*["']admin["']\s*&&/.test(code),
          points: 20,
          failFeedback: '{role === "admin" && <button className="admin-btn">Admin Panel</button>}',
        },
        {
          id: 'status',
          description: 'Renders status paragraph',
          test: code => /status["'][\s\S]*?Active|Active[\s\S]*?status/.test(code),
          points: 15,
          failFeedback: '<p className="status">Active</p>',
        },
      ],
    },
    hints: [
      'Use early returns for guard clauses — no else needed',
      '&& renders nothing when condition is false (falsy)',
      'Avoid 0 && ... — use count > 0 && ...',
      'Ternary for two choices, && for show/hide',
      'return null renders nothing but keeps component mounted',
    ],
    docs: [
      { label: 'Conditional Rendering', url: 'https://react.dev/learn/conditional-rendering' },
    ],
    prerequisite: 40,
  },

  {
    id: 42,
    module: 7,
    moduleTitle: 'React Fundamentals',
    category: 'React',
    title: 'Lists and the key Prop',
    topic: 'Array.map(), key prop, rendering lists',
    concept: `## Lists and the key Prop

Render lists by mapping arrays to JSX. Each element needs a unique \`key\` prop so React can efficiently update the DOM.

\`\`\`jsx
const fruits = ['Apple', 'Banana', 'Cherry'];

function FruitList() {
  return (
    <ul>
      {fruits.map(fruit => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  );
}
\`\`\`

### The key Prop Rules

- **Required** on the outermost element of each list item
- Must be **unique among siblings** (not globally)
- Must be **stable** — same item same key across renders
- Use IDs from your data: \`key={item.id}\`
- Index as key is a last resort — causes bugs with reordering

\`\`\`jsx
// Good — stable unique ID from data
{items.map(item => <Card key={item.id} {...item} />)}

// Bad — index changes on reorder/filter
{items.map((item, index) => <Card key={index} {...item} />)}
\`\`\`

### Filtering and Sorting Before Rendering

\`\`\`jsx
function ActiveUsers({ users }) {
  const activeUsers = users
    .filter(u => u.isActive)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul>
      {activeUsers.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Fragment as List Item Root

When the list item needs multiple elements without a wrapper div:

\`\`\`jsx
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </React.Fragment>
))}
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `const modules = [
  { id: 1, title: "Django Foundations", levels: 8, complete: true },
  { id: 2, title: "ORM", levels: 6, complete: true },
  { id: 3, title: "Serializers", levels: 6, complete: false },
  { id: 4, title: "DRF Views", levels: 8, complete: false },
];

function ModuleCard({ title, levels, complete }) {    // props destructured
  return (
    <div className={\`module-card \${complete ? 'done' : ''}\`}>
      <h3>{title}</h3>
      <p>{levels} levels</p>
      {complete && <span className="badge">✓ Done</span>}
    </div>
  );
}

function ModuleList() {
  const incomplete = modules.filter(m => !m.complete);  // derive before render

  return (
    <section>
      <h2>Remaining Modules ({incomplete.length})</h2>
      <div className="grid">
        {incomplete.map(mod => (                          // .map over filtered array
          <ModuleCard                                     // component, not <div>
            key={mod.id}                                  // key on outermost element
            title={mod.title}
            levels={mod.levels}
            complete={mod.complete}
          />
        ))}
      </div>
    </section>
  );
}`,
      annotations: [
        { line: 8, note: 'Destructure props — cleaner than props.title etc.' },
        { line: 10, note: 'Template literal for conditional class — backtick string' },
        { line: 19, note: 'Filter before render — derive the list you need' },
        { line: 24, note: '.map returns JSX array — wrap in a container' },
        { line: 25, note: 'Component as list item — not just <div>' },
        { line: 26, note: 'key on the outermost element returned by map' },
      ],
    },
    guided: {
      instructions: 'Complete the StudentList component to render a list of students.',
      starterCode: `const students = [
  { id: 1, name: "Alice", grade: 85 },
  { id: 2, name: "Bob", grade: 62 },
  { id: 3, name: "Carol", grade: 91 },
];

function StudentList() {
  // Filter to passing students (grade >= 70)
  const passing = students._____(s => s.grade >= 70);

  return (
    <ul>
      {passing._____(student => (
        <li _____={student.id}>   // add key prop
          {student.name} — {student.grade}%
          {student.grade >= 90 _____ <strong> Honours</strong>}
        </li>
      ))}
    </ul>
  );
}`,
      solution: `const students = [
  { id: 1, name: "Alice", grade: 85 },
  { id: 2, name: "Bob", grade: 62 },
  { id: 3, name: "Carol", grade: 91 },
];

function StudentList() {
  const passing = students.filter(s => s.grade >= 70);

  return (
    <ul>
      {passing.map(student => (
        <li key={student.id}>
          {student.name} — {student.grade}%
          {student.grade >= 90 && <strong> Honours</strong>}
        </li>
      ))}
    </ul>
  );
}`,
      evalChecks: [
        {
          id: 'filter',
          description: 'Filters students by grade >= 70',
          test: code => /\.filter\s*\(\s*s\s*=>\s*s\.grade\s*>=\s*70/.test(code) || /\.filter\s*\(student\s*=>\s*student\.grade\s*>=\s*70/.test(code),
          points: 30,
          failFeedback: 'students.filter(s => s.grade >= 70)',
        },
        {
          id: 'map',
          description: 'Uses .map() to render list items',
          test: code => /\.map\s*\(\s*student/.test(code) || /\.map\s*\(\s*s\s*=>/.test(code),
          points: 30,
          failFeedback: 'passing.map(student => <li key={...}>...</li>)',
        },
        {
          id: 'key',
          description: 'key prop uses student.id',
          test: code => /key=\{student\.id\}/.test(code) || /key=\{s\.id\}/.test(code),
          points: 20,
          failFeedback: '<li key={student.id}>',
        },
        {
          id: 'honours',
          description: 'Conditionally renders Honours with &&',
          test: code => /grade\s*>=\s*90\s*&&/.test(code),
          points: 20,
          failFeedback: '{student.grade >= 90 && <strong> Honours</strong>}',
        },
      ],
    },
    challenge: {
      instructions: `Build a \`TaskBoard\` component.

Given this data (define it in your component file):
\`\`\`js
const tasks = [
  { id: 1, title: "Set up Django project", priority: "high", done: true },
  { id: 2, title: "Create models", priority: "high", done: false },
  { id: 3, title: "Write serializers", priority: "medium", done: false },
  { id: 4, title: "Build views", priority: "low", done: false },
  { id: 5, title: "Configure URLs", priority: "medium", done: true },
];
\`\`\`

Build:

**\`TaskItem\`** — props: \`title\`, \`priority\`, \`done\`
- Renders \`<li className="task-item">\`
- Inside: \`<span className="title">\` with title
- \`<span className={"priority " + priority}>\` with priority text
- If done: render \`<span className="done-badge">Done</span>\` using &&

**\`TaskBoard\`** — no props
- Derive two lists from \`tasks\`:
  - \`pending\`: tasks where done is false, sorted by title alphabetically
  - \`completed\`: tasks where done is true
- Renders a \`<div className="task-board">\` with two sections:
  - \`<section>\` with \`<h2>Pending ({pending.length})</h2>\` and a \`<ul>\` mapping pending tasks using TaskItem (key=task.id)
  - \`<section>\` with \`<h2>Completed ({completed.length})</h2>\` and a \`<ul>\` mapping completed tasks using TaskItem (key=task.id)`,
      evalChecks: [
        {
          id: 'task_item',
          description: 'TaskItem component defined',
          test: code => /function\s+TaskItem|const\s+TaskItem/.test(code),
          points: 10,
          failFeedback: 'Define a TaskItem function component',
        },
        {
          id: 'task_item_props',
          description: 'TaskItem renders title, priority, done badge',
          test: code => /\{title\}/.test(code) && /\{priority\}/.test(code) && /done[\s\S]*?&&/.test(code),
          points: 15,
          failFeedback: 'TaskItem: render {title}, {priority}, and {done && <span>Done</span>}',
        },
        {
          id: 'task_board',
          description: 'TaskBoard component defined',
          test: code => /function\s+TaskBoard|const\s+TaskBoard/.test(code),
          points: 10,
          failFeedback: 'Define a TaskBoard function component',
        },
        {
          id: 'pending_filter',
          description: 'Filters pending tasks (done === false)',
          test: code => /filter[\s\S]*?!.*?done|filter[\s\S]*?done\s*===?\s*false/.test(code),
          points: 15,
          failFeedback: 'const pending = tasks.filter(t => !t.done)',
        },
        {
          id: 'sort',
          description: 'Sorts pending tasks alphabetically',
          test: code => /\.sort\s*\([\s\S]*?localeCompare/.test(code),
          points: 15,
          failFeedback: '.sort((a, b) => a.title.localeCompare(b.title))',
        },
        {
          id: 'completed_filter',
          description: 'Filters completed tasks (done === true)',
          test: code => /filter[\s\S]*?\.done\s*===?\s*true|filter[\s\S]*?t\.done(?!\s*===?\s*false)/.test(code),
          points: 10,
          failFeedback: 'const completed = tasks.filter(t => t.done)',
        },
        {
          id: 'keys',
          description: 'Uses task.id as key in both lists',
          test: code => (code.match(/key=\{task\.id\}|key=\{t\.id\}/g) || []).length >= 2,
          points: 15,
          failFeedback: 'Use key={task.id} in both .map() calls',
        },
        {
          id: 'two_sections',
          description: 'Renders two sections with pending and completed',
          test: code => /pending\.length/.test(code) && /completed\.length/.test(code),
          points: 10,
          failFeedback: 'Two <section> elements: one for pending, one for completed, each showing count',
        },
      ],
    },
    hints: [
      'key must be on the outermost element returned by .map()',
      'Use item.id for key — not array index',
      'Filter and sort before .map() for cleaner code',
      '.sort() mutates the array — use [...tasks].sort() if needed to avoid mutation',
      'localeCompare for alphabetical sort: a.title.localeCompare(b.title)',
    ],
    docs: [
      { label: 'Rendering Lists', url: 'https://react.dev/learn/rendering-lists' },
      { label: 'List and Keys', url: 'https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key' },
    ],
    prerequisite: 41,
  },
];
