export const levelsM9 = [
  {
    id: 48,
    module: 9,
    moduleTitle: 'React Router & Context',
    category: 'React',
    title: 'Routes and Links',
    topic: 'BrowserRouter, Route, Link, NavLink',
    concept: `## Routes and Links

React Router v6 enables client-side navigation — the URL changes without a full page reload.

### Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Route vs Link

- \`<Link to="/">\` — renders an \`<a>\` tag that navigates without reload
- \`<NavLink to="/">\` — like Link but adds \`active\` class when route matches
- \`<Route path="/x" element={<X />}>\` — renders element when path matches
- \`path="*"\` — wildcard, matches anything not matched above

### NavLink with activeClassName

\`\`\`jsx
<NavLink
  to="/dashboard"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  Dashboard
</NavLink>
\`\`\`

### Nested Routes

\`\`\`jsx
<Route path="/issues" element={<IssuesLayout />}>
  <Route index element={<IssueList />} />           {/* /issues */}
  <Route path=":id" element={<IssueDetail />} />   {/* /issues/5 */}
</Route>
\`\`\`

The parent layout renders \`<Outlet />\` where children appear.`,
    annotatedExample: {
      language: 'jsx',
      code: `import { BrowserRouter, Routes, Route, Link, NavLink, Outlet } from 'react-router-dom';

// Pages
function Home() { return <h1>Home Page</h1>; }
function Projects() { return <h1>Projects</h1>; }
function ProjectDetail() { return <h1>Project Detail</h1>; }
function NotFound() { return <h1>404 — Page Not Found</h1>; }

// Layout with nav — renders Outlet for child routes
function AppLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Home                                      // 'end' prevents / matching all routes
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          Projects
        </NavLink>
      </nav>
      <main>
        <Outlet />                                  {/* child routes render here */}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>   {/* layout wraps children */}
          <Route index element={<Home />} />        {/* matches exactly / */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}`,
      annotations: [
        { line: 10, note: 'Layout component — always visible, renders Outlet for child content' },
        { line: 12, note: 'NavLink: className function receives { isActive } — apply styles conditionally' },
        { line: 13, note: '"end" prop: only active when path matches exactly, not prefix' },
        { line: 19, note: 'Outlet renders whatever child route matched — the slot for children' },
        { line: 24, note: 'Nest routes inside layout route — all children inherit the layout' },
        { line: 25, note: '"index" route matches the parent path exactly (no extra segment)' },
        { line: 27, note: ':id is a URL parameter — read with useParams in ProjectDetail' },
        { line: 28, note: 'path="*" — catch-all, always last, renders 404' },
      ],
    },
    guided: {
      instructions: 'Complete the App component with proper routing.',
      starterCode: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() { return <h2>Welcome Home</h2>; }
function About() { return <h2>About Us</h2>; }
function Contact() { return <h2>Contact</h2>; }

function App() {
  return (
    <_____>                                   {/* wrap in BrowserRouter */}
      <nav>
        <Link _____="/">Home</Link>            {/* to prop */}
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<_____/>} />          {/* Home */}
        <Route path="/about" element={<About />} />
        <Route _____ element={<Contact />} />           {/* path="/contact" */}
      </Routes>
    </BrowserRouter>
  );
}`,
      solution: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() { return <h2>Welcome Home</h2>; }
function About() { return <h2>About Us</h2>; }
function Contact() { return <h2>Contact</h2>; }

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}`,
      evalChecks: [
        {
          id: 'browser_router',
          description: 'Wraps app in BrowserRouter',
          test: code => /<BrowserRouter>/.test(code),
          points: 30,
          failFeedback: 'Wrap the entire return in <BrowserRouter>...</BrowserRouter>',
        },
        {
          id: 'link_to',
          description: 'Link has to="/" prop',
          test: code => /Link\s+to=["']\/["']/.test(code),
          points: 30,
          failFeedback: '<Link to="/">Home</Link>',
        },
        {
          id: 'three_routes',
          description: 'Three Route elements defined',
          test: code => (code.match(/<Route\b/g) || []).length >= 3,
          points: 40,
          failFeedback: 'Define three <Route> elements: /, /about, /contact',
        },
      ],
    },
    challenge: {
      instructions: `Build a mini app with three pages using nested routing and a shared layout.

**Pages:**
- \`HomePage\` — renders \`<h1>Academy Home</h1>\` and a \`<Link to="/modules">\` saying "View Modules"
- \`ModuleListPage\` — renders \`<h1>Modules</h1>\` and a list of 3 \`<Link>\` elements going to /modules/1, /modules/2, /modules/3 (text: "Module 1", etc.)
- \`ModuleDetailPage\` — reads id from URL params via \`useParams\`, renders \`<h1>Module {id}</h1>\`

**Layout (\`AppLayout\`):**
- Renders a \`<header>\` with \`<nav>\` containing NavLinks to "/" and "/modules"
- NavLinks get className "active" when isActive (use NavLink className function)
- Renders \`<main>\` with \`<Outlet />\`

**Routing (in App):**
- BrowserRouter wrapping everything
- AppLayout as the root route "/"
- index route → HomePage
- "/modules" → ModuleListPage
- "/modules/:id" → ModuleDetailPage`,
      evalChecks: [
        {
          id: 'layout',
          description: 'AppLayout with header/nav and Outlet',
          test: code => /Outlet/.test(code) && /<header/.test(code),
          points: 15,
          failFeedback: 'AppLayout: <header><nav>...</nav></header><main><Outlet /></main>',
        },
        {
          id: 'navlink',
          description: 'NavLink with isActive className function',
          test: code => /NavLink/.test(code) && /isActive/.test(code),
          points: 15,
          failFeedback: '<NavLink className={({ isActive }) => isActive ? "active" : ""}>',
        },
        {
          id: 'nested_routes',
          description: 'Nested routes with AppLayout as parent',
          test: code => /Route[\s\S]*?AppLayout[\s\S]*?Route[\s\S]*?index/.test(code),
          points: 15,
          failFeedback: '<Route path="/" element={<AppLayout />}> with child <Route index element={<HomePage />} />',
        },
        {
          id: 'modules_route',
          description: 'Route for /modules and /modules/:id',
          test: code => /path=["']\/modules["']/.test(code) && /path=["']\/modules\/:id["']/.test(code),
          points: 15,
          failFeedback: '<Route path="/modules" .../> and <Route path="/modules/:id" .../>',
        },
        {
          id: 'use_params',
          description: 'ModuleDetailPage uses useParams',
          test: code => /useParams/.test(code) && /\bid\b/.test(code),
          points: 20,
          failFeedback: 'const { id } = useParams(); in ModuleDetailPage',
        },
        {
          id: 'links',
          description: 'ModuleListPage has links to /modules/1, /modules/2, /modules/3',
          test: code => /\/modules\/1/.test(code) && /\/modules\/2/.test(code) && /\/modules\/3/.test(code),
          points: 20,
          failFeedback: 'Three <Link to="/modules/1"> elements in ModuleListPage',
        },
      ],
    },
    hints: [
      'BrowserRouter must wrap the entire app',
      'NavLink className: ({isActive}) => isActive ? "active" : ""',
      '"end" prop on NavLink to="/" prevents it matching all routes',
      'Outlet renders the matched child route inside the layout',
      'index route matches the parent path exactly',
    ],
    docs: [
      { label: 'React Router v6', url: 'https://reactrouter.com/en/main/start/tutorial' },
      { label: 'Route Components', url: 'https://reactrouter.com/en/main/components/routes' },
    ],
    prerequisite: 47,
  },

  {
    id: 49,
    module: 9,
    moduleTitle: 'React Router & Context',
    category: 'React',
    title: 'useParams and useNavigate',
    topic: 'URL parameters, programmatic navigation',
    concept: `## useParams and useNavigate

### useParams — Reading URL Parameters

\`\`\`jsx
// Route defined as:
<Route path="/issues/:id" element={<IssueDetail />} />

// Inside IssueDetail:
import { useParams } from 'react-router-dom';

function IssueDetail() {
  const { id } = useParams();    // id matches :id in the path
  // fetch data using id
}
\`\`\`

Multiple params:

\`\`\`jsx
<Route path="/projects/:projectId/issues/:issueId" element={<Issue />} />

function Issue() {
  const { projectId, issueId } = useParams();
}
\`\`\`

### useNavigate — Programmatic Navigation

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // after login...
    navigate('/dashboard');           // go to new page
    navigate(-1);                     // go back (like browser back button)
    navigate('/home', { replace: true });  // replace history entry
  }
}
\`\`\`

### useSearchParams — Query String

\`\`\`jsx
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <input
      value={query}
      onChange={e => setSearchParams({ q: e.target.value })}
    />
  );
}
// URL becomes: /search?q=django
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const posts = [
  { id: 1, title: "Django Setup", body: "Install Django with pip..." },
  { id: 2, title: "ORM Basics", body: "Use objects.all() to query..." },
  { id: 3, title: "DRF Views", body: "APIView gives you full control..." },
];

function PostDetail() {
  const { id } = useParams();                        // read :id from URL
  const navigate = useNavigate();
  const post = posts.find(p => p.id === Number(id)); // id is always a string — parse

  function handleDelete() {
    // perform delete...
    navigate('/posts');                              // redirect after action
  }

  function handleBack() {
    navigate(-1);                                    // browser back button behaviour
  }

  if (!post) {
    return (
      <div>
        <p>Post {id} not found.</p>
        <Link to="/posts">Back to list</Link>
      </div>
    );
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <button onClick={handleBack}>← Back</button>
      <button onClick={handleDelete} className="danger">Delete</button>
    </article>
  );
}`,
      annotations: [
        { line: 10, note: 'useParams returns an object — destructure the param name matching :id' },
        { line: 11, note: 'useNavigate returns a function — call it to navigate' },
        { line: 12, note: 'URL params are ALWAYS strings — use Number() to compare with numeric IDs' },
        { line: 14, note: 'Redirect after action — navigate away from current page' },
        { line: 18, note: 'navigate(-1) is equivalent to window.history.back()' },
        { line: 21, note: 'Handle missing data — not-found guard before main render' },
      ],
    },
    guided: {
      instructions: 'Complete UserDetail to read the id param and navigate back.',
      starterCode: `import { _____ } from 'react-router-dom';   // import useParams, useNavigate

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

function UserDetail() {
  const { _____ } = useParams();                      // destructure id
  const navigate = _____;                             // call useNavigate
  const user = users.find(u => u.id === _____(id));   // Number(id)

  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => _____(_____)}>            // navigate(-1)
        Back
      </button>
    </div>
  );
}`,
      solution: `import { useParams, useNavigate } from 'react-router-dom';

const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.id === Number(id));

  if (!user) return <p>User not found</p>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}`,
      evalChecks: [
        {
          id: 'use_params',
          description: 'Imports and uses useParams to get id',
          test: code => /useParams/.test(code) && /const\s*\{\s*id\s*\}\s*=\s*useParams/.test(code),
          points: 35,
          failFeedback: 'const { id } = useParams();',
        },
        {
          id: 'number_id',
          description: 'Parses id with Number()',
          test: code => /Number\s*\(\s*id\s*\)/.test(code),
          points: 30,
          failFeedback: 'users.find(u => u.id === Number(id)) — URL params are strings',
        },
        {
          id: 'navigate_back',
          description: 'navigate(-1) wired to Back button',
          test: code => /navigate\s*\(\s*-1\s*\)/.test(code),
          points: 35,
          failFeedback: 'onClick={() => navigate(-1)} on the Back button',
        },
      ],
    },
    challenge: {
      instructions: `Build an issue tracker with list and detail views.

**Data (define at top of file):**
\`\`\`js
const issues = [
  { id: 1, title: "Login page broken", status: "open", priority: "high", description: "The login form submits but does nothing." },
  { id: 2, title: "Slow API response", status: "closed", priority: "medium", description: "List endpoint takes 3s to respond." },
  { id: 3, title: "Missing validation", status: "open", priority: "low", description: "The registration form accepts empty names." },
];
\`\`\`

**\`IssueList\` component (path: "/issues"):**
- Renders \`<h1>Issues</h1>\`
- Maps issues to \`<li key={issue.id}>\` each containing:
  - \`<Link to={\`/issues/\${issue.id}\`}>{issue.title}</Link>\`
  - A \`<span className={\`status \${issue.status}\`}>{issue.status}</span>\`

**\`IssueDetail\` component (path: "/issues/:id"):**
- Reads \`id\` from useParams (parse to Number)
- Finds issue by id — if not found, show \`<p>Issue not found</p>\` and a button with navigate(-1)
- If found, render:
  - \`<h1>{issue.title}</h1>\`
  - \`<p className="priority">Priority: {issue.priority}</p>\`
  - \`<p className="status">{issue.status}</p>\`
  - \`<p>{issue.description}</p>\`
  - Back button: navigate(-1)
  - "View All" button: navigate('/issues')

**Routing in App:** BrowserRouter, Routes with /issues and /issues/:id`,
      evalChecks: [
        {
          id: 'issue_list',
          description: 'IssueList renders issues with Links',
          test: code => /IssueList/.test(code) && /Link[\s\S]*?\/issues\/\$\{/.test(code),
          points: 15,
          failFeedback: 'IssueList: issues.map with <Link to={`/issues/${issue.id}`}>',
        },
        {
          id: 'status_span',
          description: 'Status span with dynamic className',
          test: code => /status\s*\$\{issue\.status\}|`status \${/.test(code),
          points: 10,
          failFeedback: '<span className={`status ${issue.status}`}>{issue.status}</span>',
        },
        {
          id: 'use_params_detail',
          description: 'IssueDetail reads id from useParams',
          test: code => /useParams/.test(code) && /Number\s*\(\s*id\s*\)/.test(code),
          points: 15,
          failFeedback: 'const { id } = useParams(); const issue = issues.find(i => i.id === Number(id));',
        },
        {
          id: 'not_found',
          description: 'Handles not-found case with navigate(-1)',
          test: code => /Issue not found|not found/i.test(code) && /navigate\s*\(\s*-1\s*\)/.test(code),
          points: 15,
          failFeedback: 'if (!issue) return <div><p>Issue not found</p><button onClick={() => navigate(-1)}>Back</button></div>',
        },
        {
          id: 'detail_render',
          description: 'Renders title, priority, status, description',
          test: code => /issue\.title/.test(code) && /issue\.priority/.test(code) && /issue\.description/.test(code),
          points: 15,
          failFeedback: 'Render issue.title, issue.priority, issue.status, issue.description',
        },
        {
          id: 'nav_buttons',
          description: 'Back (navigate -1) and View All (navigate /issues) buttons',
          test: code => /navigate\s*\(\s*-1\s*\)/.test(code) && /navigate\s*\(\s*['"]\/issues['"]/.test(code),
          points: 15,
          failFeedback: 'Two buttons: navigate(-1) for back, navigate("/issues") for view all',
        },
        {
          id: 'routes',
          description: 'Routes defined for /issues and /issues/:id',
          test: code => /path=["']\/issues["']/.test(code) && /path=["']\/issues\/:id["']/.test(code),
          points: 15,
          failFeedback: '<Route path="/issues" element={<IssueList />} /> and <Route path="/issues/:id" element={<IssueDetail />} />',
        },
      ],
    },
    hints: [
      'URL params are always strings — parse with Number() before comparing to numeric IDs',
      'navigate(-1) = browser back button',
      'navigate("/path", { replace: true }) replaces current history entry',
      'useParams works inside any component rendered by a matching Route',
    ],
    docs: [
      { label: 'useParams', url: 'https://reactrouter.com/en/main/hooks/use-params' },
      { label: 'useNavigate', url: 'https://reactrouter.com/en/main/hooks/use-navigate' },
    ],
    prerequisite: 48,
  },

  {
    id: 50,
    module: 9,
    moduleTitle: 'React Router & Context',
    category: 'React',
    title: 'Context API',
    topic: 'createContext, useContext, Provider',
    concept: `## Context API

Context solves "prop drilling" — passing data through many layers of components that don't use it themselves.

### Creating and Using Context

\`\`\`jsx
// 1. Create context
const ThemeContext = createContext('light');   // default value

// 2. Provide value
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

// 3. Consume anywhere in the tree
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button className={theme} onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Toggle
    </button>
  );
}
\`\`\`

### Custom Context Hook Pattern

Wrapping context in a custom hook makes the API cleaner:

\`\`\`jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(userData) { setUser(userData); }
  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
\`\`\`

### When to Use Context

Context is for **global** data: auth, theme, language, cart. For local shared state between a few siblings, lift state instead.`,
    annotatedExample: {
      language: 'jsx',
      code: `import { createContext, useContext, useState } from 'react';

// Context module (NotificationContext.jsx)
const NotificationContext = createContext(null);    // null default = enforce Provider

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  function addNotification(message, type = 'info') {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 3000);  // auto-dismiss after 3s
  }

  function removeNotification(id) {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {                 // custom hook wraps useContext
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider');
  return ctx;
}

// Toast UI component — reads context directly
function ToastList() {
  const { notifications, removeNotification } = useNotifications();
  return (
    <div className="toast-list">
      {notifications.map(n => (
        <div key={n.id} className={\`toast \${n.type}\`}>
          {n.message}
          <button onClick={() => removeNotification(n.id)}>✕</button>
        </div>
      ))}
    </div>
  );
}

// Deeply nested component — no prop drilling needed
function SubmitButton() {
  const { addNotification } = useNotifications();
  return (
    <button onClick={() => addNotification('Saved!', 'success')}>Save</button>
  );
}`,
      annotations: [
        { line: 3, note: 'null default forces use inside Provider — catches mistakes early' },
        { line: 4, note: 'Provider component owns the state and exposes an API' },
        { line: 8, note: 'Action function defined alongside state — encapsulated in Provider' },
        { line: 17, note: 'Provider value object: state + action functions' },
        { line: 22, note: 'Custom hook throws if used outside Provider — clear error message' },
        { line: 28, note: 'Deep component reads context without any prop drilling' },
        { line: 39, note: 'Any component anywhere in the tree can call addNotification' },
      ],
    },
    guided: {
      instructions: 'Complete the ThemeContext setup and useTheme hook.',
      starterCode: `import { createContext, useContext, useState } from 'react';

const ThemeContext = _____(null);    // createContext

export function ThemeProvider({ _____ }) {    // children
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext._____ value={{ theme, toggleTheme }}>   // .Provider
      {_____}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = _____(ThemeContext);   // useContext
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

// Use it
function ThemedButton() {
  const { theme, toggleTheme } = _____;   // useTheme()
  return (
    <button className={theme} onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}`,
      solution: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  function toggleTheme() {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={theme} onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}`,
      evalChecks: [
        {
          id: 'create_context',
          description: 'Creates context with createContext',
          test: code => /createContext\s*\(\s*null\s*\)/.test(code),
          points: 25,
          failFeedback: 'const ThemeContext = createContext(null)',
        },
        {
          id: 'provider',
          description: 'ThemeContext.Provider wraps children with value',
          test: code => /ThemeContext\.Provider/.test(code) && /value=\{/.test(code) && /\{children\}/.test(code),
          points: 35,
          failFeedback: '<ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>',
        },
        {
          id: 'use_context',
          description: 'useTheme calls useContext(ThemeContext)',
          test: code => /useContext\s*\(\s*ThemeContext\s*\)/.test(code),
          points: 25,
          failFeedback: 'const ctx = useContext(ThemeContext)',
        },
        {
          id: 'usage',
          description: 'ThemedButton uses useTheme()',
          test: code => /useTheme\s*\(\s*\)/.test(code) && /\{\s*theme[\s\S]*?toggleTheme\s*\}/.test(code),
          points: 15,
          failFeedback: 'const { theme, toggleTheme } = useTheme()',
        },
      ],
    },
    challenge: {
      instructions: `Build a complete \`CartContext\` system for a shopping cart.

**Context file (write everything together):**

**\`CartContext\`** — createContext(null)

**\`CartProvider\`** — manages state:
- \`items\` state: array of \`{ id, name, price, qty }\`
- Functions:
  - \`addItem(product)\` — if item with same id exists, increment qty; else add \`{ ...product, qty: 1 }\`
  - \`removeItem(id)\` — filter out item
  - \`updateQty(id, qty)\` — set qty for item (if qty < 1, remove it)
  - \`clearCart()\` — set items to []
  - \`total\` — computed number: sum of price × qty (derive, not state)
  - \`itemCount\` — computed number: sum of all qtys
- Provide all of these via context value

**\`useCart\`** custom hook — wraps useContext, throws if outside provider

**\`CartWidget\`** component — uses useCart:
- Shows \`<p>{itemCount} items — \${total.toFixed(2)}</p>\`
- If items > 0, shows \`<ul>\` mapping items: \`<li key={id}>{name} × {qty} — \${(price * qty).toFixed(2)}</li>\` with a Remove button
- A "Clear Cart" button

**\`AddToCartButton\`** — prop: \`product\` object — uses useCart to call addItem on click`,
      evalChecks: [
        {
          id: 'context',
          description: 'CartContext created with createContext',
          test: code => /CartContext\s*=\s*createContext/.test(code),
          points: 8,
          failFeedback: 'const CartContext = createContext(null)',
        },
        {
          id: 'add_item',
          description: 'addItem increments qty if exists else adds',
          test: code => /addItem[\s\S]*?find[\s\S]*?id|addItem[\s\S]*?id\s*===/.test(code),
          points: 15,
          failFeedback: 'addItem: find existing item by id, if found increment qty, else add with qty:1',
        },
        {
          id: 'remove_item',
          description: 'removeItem uses filter',
          test: code => /removeItem[\s\S]*?filter|filter[\s\S]*?removeItem/.test(code),
          points: 10,
          failFeedback: 'removeItem: setItems(prev => prev.filter(i => i.id !== id))',
        },
        {
          id: 'update_qty',
          description: 'updateQty removes if qty < 1',
          test: code => /updateQty[\s\S]*?qty\s*<\s*1/.test(code),
          points: 10,
          failFeedback: 'updateQty: if qty < 1, remove item; else update qty with map',
        },
        {
          id: 'computed',
          description: 'total and itemCount derived during render',
          test: code => /total[\s\S]*?reduce|reduce[\s\S]*?total/.test(code) && /itemCount[\s\S]*?reduce|reduce[\s\S]*?itemCount/.test(code),
          points: 12,
          failFeedback: 'const total = items.reduce((s, i) => s + i.price * i.qty, 0); const itemCount = items.reduce((s, i) => s + i.qty, 0)',
        },
        {
          id: 'use_cart',
          description: 'useCart custom hook defined',
          test: code => /function\s+useCart/.test(code) && /useContext\s*\(\s*CartContext\s*\)/.test(code),
          points: 10,
          failFeedback: 'function useCart() { const ctx = useContext(CartContext); if (!ctx) throw ...; return ctx; }',
        },
        {
          id: 'cart_widget',
          description: 'CartWidget renders item count, total, list, clear button',
          test: code => /CartWidget/.test(code) && /itemCount/.test(code) && /clearCart/.test(code),
          points: 15,
          failFeedback: 'CartWidget: show itemCount, total, mapped items with remove, and clearCart button',
        },
        {
          id: 'add_button',
          description: 'AddToCartButton calls addItem on click',
          test: code => /AddToCartButton/.test(code) && /addItem/.test(code) && /onClick/.test(code),
          points: 10,
          failFeedback: 'AddToCartButton: onClick={() => addItem(product)}',
        },
        {
          id: 'provider_value',
          description: 'CartProvider value includes all functions and computed values',
          test: code => /CartContext\.Provider[\s\S]*?value=/.test(code) && /addItem[\s\S]*?removeItem/.test(code),
          points: 10,
          failFeedback: '<CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, itemCount }}>',
        },
      ],
    },
    hints: [
      'Context value can be any JS value — objects with state + functions are common',
      'Provider wraps children — put it high in the tree (App level)',
      'useContext returns the current Provider value',
      'Custom hook throw: if (!ctx) throw new Error("must be inside Provider")',
      'Derive total/count in render — not stored as separate state',
    ],
    docs: [
      { label: 'createContext', url: 'https://react.dev/reference/react/createContext' },
      { label: 'useContext', url: 'https://react.dev/reference/react/useContext' },
      { label: 'Passing Data Deeply with Context', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
    ],
    prerequisite: 49,
  },

  {
    id: 51,
    module: 9,
    moduleTitle: 'React Router & Context',
    category: 'React',
    title: 'Protected Routes',
    topic: 'Auth context, route guards, redirect',
    concept: `## Protected Routes

A protected route redirects unauthenticated users to the login page.

### Pattern Using Navigate

\`\`\`jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;   // render child routes when authenticated
}

// In routing:
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/profile" element={<Profile />} />
</Route>
\`\`\`

\`replace\` prevents the protected page from appearing in browser history (so back button doesn't loop).

### Redirecting After Login

\`\`\`jsx
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  async function handleLogin(credentials) {
    await login(credentials);
    navigate(from, { replace: true });  // go back to where they were
  }
}
\`\`\`

### useLocation for State Passing

\`\`\`jsx
// In ProtectedRoute — pass current location to login redirect
if (!user) {
  return <Navigate to="/login" state={{ from: location }} replace />;
}
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { createContext, useContext, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

// --- Auth Context ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // null = not logged in

  function login(username) {
    setUser({ username, role: 'student' }); // simplified — real: API call
  }
  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}

// --- Protected Route Guard ---
function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();                      // current path

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}                     // pass current location
        replace                                        // don't add to history
      />
    );
  }

  return <Outlet />;                                   // render child routes
}

// --- Login Page ---
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';  // where to go after

  function handleLogin(e) {
    e.preventDefault();
    login('alice');
    navigate(from, { replace: true });                 // redirect to original destination
  }

  return (
    <form onSubmit={handleLogin}>
      <button type="submit">Log in as Alice</button>
    </form>
  );
}`,
      annotations: [
        { line: 7, note: 'null means unauthenticated — Provider owns the auth state' },
        { line: 27, note: 'RequireAuth is a layout route — wraps protected routes' },
        { line: 29, note: 'useLocation gives current URL — used to redirect back after login' },
        { line: 30, note: 'Navigate replaces current render — user sees login page' },
        { line: 33, note: 'state passes data to next route — from tells login where to return' },
        { line: 34, note: 'replace=true: login page won\'t be in history (no back-to-login loop)' },
        { line: 47, note: 'Optional chaining: state?.from?.pathname — safe if state is absent' },
        { line: 51, note: 'replace: true — replace history so back doesn\'t return to protected page' },
      ],
    },
    guided: {
      instructions: 'Complete the RequireAuth component.',
      starterCode: `import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RequireAuth() {
  const { user } = _____;   // useAuth()
  const location = _____;   // useLocation()

  if (!_____) {             // if no user
    return (
      <Navigate
        to="/login"
        state={{ from: _____ }}   // pass location
        _____                     // replace prop
      />
    );
  }

  return _____;   // <Outlet />
}`,
      solution: `import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}`,
      evalChecks: [
        {
          id: 'use_auth',
          description: 'Calls useAuth() to get user',
          test: code => /useAuth\s*\(\s*\)/.test(code) && /user/.test(code),
          points: 25,
          failFeedback: 'const { user } = useAuth()',
        },
        {
          id: 'navigate',
          description: 'Returns Navigate to /login when no user',
          test: code => /Navigate[\s\S]*?to=["']\/login["']/.test(code) || /to=["']\/login["']/.test(code),
          points: 35,
          failFeedback: 'return <Navigate to="/login" state={{ from: location }} replace /> when !user',
        },
        {
          id: 'outlet',
          description: 'Returns Outlet when authenticated',
          test: code => /<Outlet\s*\/>/.test(code) || /<Outlet>/.test(code),
          points: 40,
          failFeedback: 'return <Outlet /> when user is authenticated',
        },
      ],
    },
    challenge: {
      instructions: `Build a complete auth system with protected routing.

**\`AuthContext.jsx\`** — create and export:
- AuthContext (createContext null)
- AuthProvider managing state: \`user\` (null initially), \`isLoading\` (false)
- \`login(username, password)\` — sets user to \`{ username, role: "student" }\` (simulate, no real API)
- \`logout()\` — sets user to null
- \`useAuth()\` custom hook

**\`RequireAuth\`** component:
- Uses useAuth and useLocation
- If no user: \`<Navigate to="/login" state={{ from: location }} replace />\`
- Else: \`<Outlet />\`

**Pages:**
- \`LoginPage\`: form with username input (controlled), Login button. On submit: call login(username, "pass"), then navigate to \`location.state?.from?.pathname || "/dashboard"\`
- \`DashboardPage\`: shows "Welcome, {user.username}" and a Logout button (calls logout then navigate("/login"))
- \`ProfilePage\`: shows "Profile: {user.username}"

**App routing:**
- "/login" → LoginPage (public)
- RequireAuth wrapper route containing:
  - "/dashboard" → DashboardPage
  - "/profile" → ProfilePage`,
      evalChecks: [
        {
          id: 'auth_provider',
          description: 'AuthProvider with user state and login/logout',
          test: code => /AuthProvider/.test(code) && /login[\s\S]*?logout|logout[\s\S]*?login/.test(code),
          points: 15,
          failFeedback: 'AuthProvider with user state, login(), and logout() functions',
        },
        {
          id: 'use_auth',
          description: 'useAuth custom hook exported',
          test: code => /function\s+useAuth|const\s+useAuth/.test(code) && /useContext/.test(code),
          points: 10,
          failFeedback: 'export function useAuth() { const ctx = useContext(AuthContext); ... }',
        },
        {
          id: 'require_auth',
          description: 'RequireAuth with Navigate and Outlet',
          test: code => /RequireAuth/.test(code) && /Navigate/.test(code) && /Outlet/.test(code),
          points: 15,
          failFeedback: 'RequireAuth: if (!user) <Navigate to="/login" state={{ from: location }} replace /> else <Outlet />',
        },
        {
          id: 'login_page',
          description: 'LoginPage with controlled input and login call',
          test: code => /LoginPage/.test(code) && /login\s*\(/.test(code) && /navigate\s*\(/.test(code),
          points: 15,
          failFeedback: 'LoginPage: controlled input, call login(), then navigate to from or "/dashboard"',
        },
        {
          id: 'redirect_after_login',
          description: 'Redirects to original page after login',
          test: code => /location\.state[\s\S]*?from|from[\s\S]*?location\.state/.test(code),
          points: 10,
          failFeedback: 'const from = location.state?.from?.pathname || "/dashboard"; navigate(from, { replace: true })',
        },
        {
          id: 'dashboard',
          description: 'Dashboard shows username and logout button',
          test: code => /DashboardPage/.test(code) && /user\.username/.test(code) && /logout/.test(code),
          points: 15,
          failFeedback: 'DashboardPage: show user.username, logout button calls logout() then navigate("/login")',
        },
        {
          id: 'routing',
          description: 'RequireAuth wraps dashboard and profile routes',
          test: code => /RequireAuth[\s\S]*?dashboard|element=\{<RequireAuth/.test(code),
          points: 20,
          failFeedback: '<Route element={<RequireAuth />}> wrapping dashboard and profile routes',
        },
      ],
    },
    hints: [
      'Navigate replaces the current render — not a hook, used in return',
      'replace prop on Navigate prevents login page appearing in browser history',
      'location.state?.from?.pathname — optional chaining for safe access',
      'Wrap protected routes in <Route element={<RequireAuth />}> with child routes inside',
      'AuthProvider should wrap the entire app (outside BrowserRouter or inside)',
    ],
    docs: [
      { label: 'Navigate Component', url: 'https://reactrouter.com/en/main/components/navigate' },
      { label: 'useLocation', url: 'https://reactrouter.com/en/main/hooks/use-location' },
      { label: 'Auth Example', url: 'https://reactrouter.com/en/main/start/examples' },
    ],
    prerequisite: 50,
  },

  {
    id: 52,
    module: 9,
    moduleTitle: 'React Router & Context',
    category: 'React',
    title: 'Full Feature: Issue Submission',
    topic: 'Integrating all concepts — form, fetch, context, routing',
    concept: `## Full Feature: Issue Submission

This capstone level integrates everything from the course:

**Django side (already built in modules 1–6):**
- \`Issue\` model with title, description, status, priority, created_at
- \`IssueSerializer\` with ModelSerializer
- \`IssueListCreateView\` (ListCreateAPIView)
- JWT auth protecting the POST endpoint

**React side (this level):**
- Auth context provides the JWT token
- Protected route guards the submit form
- Controlled form collects issue data
- useEffect + fetch (with token) GETs the issue list
- POST on submit creates a new issue
- useNavigate redirects to the list after success

### The Full Flow

\`\`\`
User → LoginPage → get JWT → stored in AuthContext
     → navigate to /issues (protected)
     → IssueList fetches GET /api/issues/ with token
     → "New Issue" button → /issues/new
     → IssueForm submits POST /api/issues/ with token
     → success → navigate back to /issues
\`\`\`

### Token in Request Headers

\`\`\`jsx
const { token } = useAuth();

fetch('/api/issues/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify(formData),
})
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

// IssueForm — integrates form + fetch + auth + routing
function IssueForm() {
  const { token } = useAuth();                        // JWT from context
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/issues/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`,         // JWT in header
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to submit issue');
      }

      navigate('/issues');                            // redirect on success
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" disabled={submitting || !form.title}>
        {submitting ? 'Submitting...' : 'Submit Issue'}
      </button>
    </form>
  );
}`,
      annotations: [
        { line: 6, note: 'token from AuthContext — no prop drilling needed' },
        { line: 9, note: 'Controlled form with one object state — generic handleChange works' },
        { line: 20, note: 'async/await for cleaner error handling with try/catch/finally' },
        { line: 25, note: 'Authorization header with Bearer token — required by DRF JWT auth' },
        { line: 28, note: 'JSON.stringify converts form object to request body' },
        { line: 30, note: 'Check res.ok — 4xx/5xx do not throw by default with fetch' },
        { line: 35, note: 'navigate after success — user lands on updated list' },
        { line: 40, note: 'finally always runs — clears submitting state even on error' },
        { line: 50, note: 'Disabled while submitting OR if title is empty — prevent double submit' },
      ],
    },
    guided: {
      instructions: 'Complete the handleSubmit function in IssueForm.',
      starterCode: `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function IssueForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/issues/', {
        method: _____,               // POST
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${_____}\`,   // token
        },
        body: JSON.stringify({ title }),
      });

      if (!res._____) throw new Error('Failed');   // .ok

      _____(  '/issues'  );   // navigate
    } catch (err) {
      setError(err.message);
    } finally {
      _____(false);   // setSubmitting
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Issue title" />
      <button type="submit" disabled={submitting || !title}>Submit</button>
    </form>
  );
}`,
      solution: `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function IssueForm() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/issues/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`,
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error('Failed');

      navigate('/issues');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Issue title" />
      <button type="submit" disabled={submitting || !title}>Submit</button>
    </form>
  );
}`,
      evalChecks: [
        {
          id: 'post_method',
          description: 'Uses POST method',
          test: code => /method\s*:\s*['"]POST['"]/.test(code),
          points: 25,
          failFeedback: "method: 'POST'",
        },
        {
          id: 'auth_header',
          description: 'Authorization header with Bearer token',
          test: code => /Authorization[\s\S]*?Bearer[\s\S]*?token/.test(code),
          points: 30,
          failFeedback: "'Authorization': `Bearer ${token}`",
        },
        {
          id: 'res_ok',
          description: 'Checks res.ok',
          test: code => /res\.ok/.test(code),
          points: 20,
          failFeedback: 'if (!res.ok) throw new Error(...)',
        },
        {
          id: 'navigate',
          description: 'Navigates to /issues on success',
          test: code => /navigate\s*\(\s*['"]\/issues['"]/.test(code),
          points: 25,
          failFeedback: "navigate('/issues') after successful POST",
        },
      ],
    },
    challenge: {
      instructions: `Build the complete Issue Tracker frontend — your course capstone.

This integrates: Auth Context, Protected Routes, useEffect fetch, controlled forms, and navigation.

**\`AuthContext\`** (same as level 51 — export AuthProvider, useAuth):
- \`user\` state: null or \`{ username, token }\`
- \`login(username)\` sets user (simulate: token = "fake-jwt-" + username)
- \`logout()\` sets user to null

**\`IssueList\`** component:
- Uses useAuth to get token
- Fetches GET \`https://jsonplaceholder.typicode.com/todos?_limit=10\` (simulate issues)
- Passes Authorization header: \`Bearer \${token}\`
- loading / error states
- Maps results: \`<article key={item.id} className="issue-card">\` with \`<h3>{item.title}</h3>\` and \`<span className={\`status \${item.completed ? 'closed' : 'open'}\`}>\`
- A \`<Link to="/issues/new">\` button at the top saying "New Issue"

**\`IssueForm\`** component:
- Controlled form: title (text), priority (select: low/medium/high)
- On submit: POSTs to \`https://jsonplaceholder.typicode.com/todos\` with JSON body and auth header
- e.preventDefault(), setSubmitting(true), try/catch/finally
- On success (res.ok): navigate('/issues')
- Disabled submit when submitting or !title

**\`LoginPage\`**: controlled username input, on submit calls login(username), navigate('/issues')

**\`LogoutButton\`**: calls logout() then navigate('/login')

**\`RequireAuth\`**: guard component (same as level 51)

**App routing**:
- "/login" public
- RequireAuth wrapping "/issues" and "/issues/new"`,
      evalChecks: [
        {
          id: 'auth_context',
          description: 'AuthContext with token in user object',
          test: code => /token/.test(code) && /login[\s\S]*?token|token[\s\S]*?login/.test(code),
          points: 10,
          failFeedback: 'user object includes token: { username, token }',
        },
        {
          id: 'issue_list_fetch',
          description: 'IssueList fetches with auth header',
          test: code => /IssueList[\s\S]*?fetch|fetch[\s\S]*?Authorization/.test(code),
          points: 10,
          failFeedback: 'IssueList fetches with Authorization: Bearer ${token} header',
        },
        {
          id: 'issue_list_states',
          description: 'IssueList handles loading and error',
          test: code => /loading/.test(code) && /error/.test(code) && /IssueList/.test(code),
          points: 8,
          failFeedback: 'loading and error states in IssueList',
        },
        {
          id: 'status_class',
          description: 'Status span with dynamic class from completed',
          test: code => /completed/.test(code) && /closed|open/.test(code),
          points: 8,
          failFeedback: "className={`status ${item.completed ? 'closed' : 'open'}`}",
        },
        {
          id: 'new_issue_link',
          description: 'Link to /issues/new in IssueList',
          test: code => /\/issues\/new/.test(code),
          points: 7,
          failFeedback: '<Link to="/issues/new">New Issue</Link>',
        },
        {
          id: 'issue_form',
          description: 'IssueForm with POST and auth header',
          test: code => /IssueForm/.test(code) && /POST/.test(code) && /Authorization/.test(code),
          points: 12,
          failFeedback: 'IssueForm POSTs with method: "POST" and Authorization header',
        },
        {
          id: 'try_catch',
          description: 'Uses try/catch/finally in form submit',
          test: code => /try\s*\{[\s\S]*?catch[\s\S]*?finally/.test(code),
          points: 10,
          failFeedback: 'try { ... } catch (err) { setError(err.message); } finally { setSubmitting(false); }',
        },
        {
          id: 'navigate_after',
          description: 'Navigates to /issues after successful submit',
          test: code => /navigate\s*\(\s*['"]\/issues['"]/.test(code),
          points: 10,
          failFeedback: "navigate('/issues') on success",
        },
        {
          id: 'login_page',
          description: 'LoginPage with controlled input and login call',
          test: code => /LoginPage/.test(code) && /login\s*\(/.test(code),
          points: 8,
          failFeedback: 'LoginPage: controlled username input, login(username) on submit',
        },
        {
          id: 'require_auth',
          description: 'RequireAuth wraps issue routes',
          test: code => /RequireAuth/.test(code) && /\/issues/.test(code) && /Outlet/.test(code),
          points: 10,
          failFeedback: 'RequireAuth with Outlet, wrapping /issues and /issues/new routes',
        },
        {
          id: 'logout',
          description: 'LogoutButton calls logout and navigates',
          test: code => /logout\s*\(\s*\)/.test(code) && /navigate/.test(code),
          points: 7,
          failFeedback: 'LogoutButton: logout() then navigate("/login")',
        },
      ],
    },
    hints: [
      'This is the capstone — bring everything together',
      'Token lives in context — no prop drilling',
      'fetch with method, headers, and body for POST',
      'try/catch/finally: try=happy path, catch=error, finally=cleanup (always runs)',
      'RequireAuth uses Navigate + Outlet — exact pattern from level 51',
      'Simulate login: token = "fake-jwt-" + username',
    ],
    docs: [
      { label: 'React Router Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial' },
      { label: 'Fetch API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch' },
      { label: 'useContext', url: 'https://react.dev/reference/react/useContext' },
    ],
    prerequisite: 51,
  },
];
