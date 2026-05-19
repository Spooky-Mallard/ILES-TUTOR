export const levelsM8 = [
  {
    id: 43,
    module: 8,
    moduleTitle: 'React Hooks',
    category: 'React',
    title: 'useState Deep Dive',
    topic: 'useState, updater functions, state batching',
    concept: `## useState Deep Dive

\`useState\` is the hook for local component state. When state changes, React re-renders the component.

\`\`\`jsx
const [value, setValue] = useState(initialValue);
\`\`\`

### The Functional Updater

When new state depends on old state, use the functional form:

\`\`\`jsx
// Wrong — stale closure
setCount(count + 1);
setCount(count + 1);   // both read same stale count

// Right — always uses latest state
setCount(c => c + 1);
setCount(c => c + 1);  // count increments twice
\`\`\`

### Objects and Arrays in State

State updates must replace, not mutate:

\`\`\`jsx
// Wrong — mutates existing object
user.name = "Bob";
setUser(user);

// Right — create new object
setUser({ ...user, name: "Bob" });

// Wrong — mutates existing array
items.push(newItem);
setItems(items);

// Right — create new array
setItems([...items, newItem]);
setItems(items.filter(i => i.id !== removeId));
setItems(items.map(i => i.id === id ? { ...i, done: true } : i));
\`\`\`

### Lazy Initial State

For expensive initial computation, pass a function (not the result):

\`\`\`jsx
// Runs on every render (bad)
const [data, setData] = useState(heavyComputation());

// Runs only once (good)
const [data, setData] = useState(() => heavyComputation());
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([            // array in state
    { id: 1, text: "Learn React", done: false },
  ]);
  const [input, setInput] = useState('');          // string in state

  function addTodo() {
    if (!input.trim()) return;
    setTodos(prev => [                             // functional updater for arrays
      ...prev,
      { id: Date.now(), text: input, done: false }
    ]);
    setInput('');
  }

  function toggleTodo(id) {
    setTodos(prev =>                               // map to update one item
      prev.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(todo => todo.id !== id));  // filter to remove
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span
              style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      annotations: [
        { line: 3, note: 'Array in state — start with initial items' },
        { line: 6, note: 'Multiple useState calls — each tracks independent state' },
        { line: 10, note: 'Functional updater: prev => [...prev, newItem] — safe even in batching' },
        { line: 18, note: 'Map over array to update one item — create new array, not mutate' },
        { line: 19, note: 'Spread into new object to update properties — do not mutate todo directly' },
        { line: 23, note: 'Filter creates new array without the removed item' },
      ],
    },
    guided: {
      instructions: 'Complete the counter with object state.',
      starterCode: `import { useState } from 'react';

function Counter() {
  // State is an object with count and step
  const [state, setState] = useState({ count: 0, step: 1 });

  function increment() {
    // Update count using functional updater, don't lose step
    setState(prev => ({ _____, count: prev.count + prev.step }));
  }

  function setStep(newStep) {
    // Update step, keep count unchanged
    setState(prev => ({ _____ }));
  }

  return (
    <div>
      <p>Count: {state.count} (step: {state.step})</p>
      <button onClick={increment}>+{state.step}</button>
      <input
        type="number"
        value={state.step}
        onChange={e => setStep(Number(e.target.value))}
      />
    </div>
  );
}`,
      solution: `import { useState } from 'react';

function Counter() {
  const [state, setState] = useState({ count: 0, step: 1 });

  function increment() {
    setState(prev => ({ ...prev, count: prev.count + prev.step }));
  }

  function setStep(newStep) {
    setState(prev => ({ ...prev, step: newStep }));
  }

  return (
    <div>
      <p>Count: {state.count} (step: {state.step})</p>
      <button onClick={increment}>+{state.step}</button>
      <input
        type="number"
        value={state.step}
        onChange={e => setStep(Number(e.target.value))}
      />
    </div>
  );
}`,
      evalChecks: [
        {
          id: 'spread_increment',
          description: 'Spreads prev in increment updater',
          test: code => /setState\s*\(\s*prev\s*=>\s*\(\s*\{\s*\.\.\.prev/.test(code),
          points: 40,
          failFeedback: 'setState(prev => ({ ...prev, count: prev.count + prev.step }))',
        },
        {
          id: 'step_update',
          description: 'setStep spreads prev and updates step',
          test: code => /setState\s*\(\s*prev\s*=>\s*\(\s*\{\s*\.\.\.prev[\s\S]*?step/.test(code),
          points: 40,
          failFeedback: 'setState(prev => ({ ...prev, step: newStep }))',
        },
        {
          id: 'functional_updater',
          description: 'Uses functional form prev => for both updates',
          test: code => (code.match(/setState\s*\(\s*prev\s*=>/g) || []).length >= 2,
          points: 20,
          failFeedback: 'Both setState calls should use functional form: setState(prev => ...)',
        },
      ],
    },
    challenge: {
      instructions: `Build a \`ShoppingCart\` component.

State: an array of cart items. Each item: \`{ id, name, price, qty }\`

Start with this initial state:
\`\`\`js
[
  { id: 1, name: "Django Book", price: 30, qty: 1 },
  { id: 2, name: "React Course", price: 50, qty: 1 },
]
\`\`\`

Implement these handlers:
- \`increaseQty(id)\` — increment qty for that item (functional updater + map)
- \`decreaseQty(id)\` — decrement qty but min 1 (functional updater + map + Math.max)
- \`removeItem(id)\` — remove item from cart (functional updater + filter)

Render:
- A \`<ul>\` with each cart item as \`<li key={item.id}>\`
- Each \`<li>\` shows: name, price × qty, three buttons (−, +, Remove)
- Below the list: a \`<p>\` showing \`"Total: $X"\` where X is sum of price × qty across all items (use reduce)`,
      evalChecks: [
        {
          id: 'state_init',
          description: 'useState initialized with array of 2 items',
          test: code => /useState\s*\(\s*\[/.test(code) && /Django Book/.test(code) && /React Course/.test(code),
          points: 10,
          failFeedback: 'Initialize useState with the two item objects in an array',
        },
        {
          id: 'increase',
          description: 'increaseQty uses functional updater and map',
          test: code => /increaseQty[\s\S]*?setState[\s\S]*?prev[\s\S]*?map|increaseQty[\s\S]*?setCart[\s\S]*?prev[\s\S]*?map/.test(code),
          points: 15,
          failFeedback: 'increaseQty: setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item))',
        },
        {
          id: 'decrease',
          description: 'decreaseQty uses Math.max to enforce min 1',
          test: code => /Math\.max\s*\(\s*1/.test(code),
          points: 15,
          failFeedback: 'decreaseQty: use Math.max(1, item.qty - 1) to prevent going below 1',
        },
        {
          id: 'remove',
          description: 'removeItem uses filter',
          test: code => /\.filter\s*\([\s\S]*?\.id\s*!==?\s*id|\.filter\s*\([\s\S]*?id\s*!==?\s*.*?\.id/.test(code),
          points: 15,
          failFeedback: 'removeItem: setCart(prev => prev.filter(item => item.id !== id))',
        },
        {
          id: 'list_render',
          description: 'Renders list with key on each item',
          test: code => /\.map\s*\(\s*item/.test(code) && /key=\{item\.id\}/.test(code),
          points: 15,
          failFeedback: 'cart.map(item => <li key={item.id}>...</li>)',
        },
        {
          id: 'buttons',
          description: 'Three buttons per item (−, +, Remove)',
          test: code => /increaseQty|increase/.test(code) && /decreaseQty|decrease/.test(code) && /removeItem|remove/.test(code),
          points: 15,
          failFeedback: 'Three buttons per item: decrease, increase, and remove',
        },
        {
          id: 'total',
          description: 'Total computed with reduce',
          test: code => /\.reduce\s*\(/.test(code) && /price[\s\S]*?qty|qty[\s\S]*?price/.test(code),
          points: 15,
          failFeedback: 'const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)',
        },
      ],
    },
    hints: [
      'Always use functional updater when new state depends on old: setState(prev => ...)',
      'Spread to update object fields: { ...prev, qty: prev.qty + 1 }',
      'map() for update-one: items.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i)',
      'filter() for remove: items.filter(i => i.id !== id)',
      'reduce() for totals: items.reduce((sum, i) => sum + i.price * i.qty, 0)',
    ],
    docs: [
      { label: 'useState Reference', url: 'https://react.dev/reference/react/useState' },
      { label: 'Updating Objects in State', url: 'https://react.dev/learn/updating-objects-in-state' },
      { label: 'Updating Arrays in State', url: 'https://react.dev/learn/updating-arrays-in-state' },
    ],
    prerequisite: 42,
  },

  {
    id: 44,
    module: 8,
    moduleTitle: 'React Hooks',
    category: 'React',
    title: 'Controlled Inputs',
    topic: 'Controlled form inputs, form submission',
    concept: `## Controlled Inputs

A **controlled input** is one where React state drives the value. Every keystroke calls a setter. This gives you full control: validation on change, formatting, disabling submit, etc.

\`\`\`jsx
const [email, setEmail] = useState('');

<input
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>
\`\`\`

### The Pattern

| Uncontrolled | Controlled |
|---|---|
| Value lives in DOM | Value lives in React state |
| Read with \`ref.current.value\` | Read with \`state\` variable |
| React doesn't know value | React always knows value |

### Common Input Types

\`\`\`jsx
// text / email / password
<input type="text" value={name} onChange={e => setName(e.target.value)} />

// number
<input type="number" value={age} onChange={e => setAge(Number(e.target.value))} />

// checkbox
<input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />

// select
<select value={role} onChange={e => setRole(e.target.value)}>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>

// textarea
<textarea value={bio} onChange={e => setBio(e.target.value)} />
\`\`\`

### Form Submission

\`\`\`jsx
function handleSubmit(e) {
  e.preventDefault();      // prevent page reload
  // use state values
  console.log({ email, password });
}

<form onSubmit={handleSubmit}>
  ...
  <button type="submit">Login</button>
</form>
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState } from 'react';

function RegistrationForm() {
  const [form, setForm] = useState({                  // single object for all fields
    username: '',
    email: '',
    role: 'user',
    agreed: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {                          // generic change handler
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,  // computed key, checkbox vs text
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();                               // stop browser page reload
    setSubmitted(true);
  }

  if (submitted) {
    return <p>Welcome, {form.username}!</p>;
  }

  const isValid = form.username.length >= 3 && form.email.includes('@') && form.agreed;

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" value={form.username} onChange={handleChange} placeholder="Username" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <label>
        <input name="agreed" type="checkbox" checked={form.agreed} onChange={handleChange} />
        I agree to terms
      </label>
      <button type="submit" disabled={!isValid}>Register</button>  {/* disable if invalid */}
    </form>
  );
}`,
      annotations: [
        { line: 3, note: 'One object in state for all form fields — easier to handle generically' },
        { line: 11, note: 'Single handler for all fields — reads input name attribute' },
        { line: 13, note: 'Computed property key: [name] uses the input\'s name as the key' },
        { line: 14, note: 'Checkbox uses checked, not value — detect with type' },
        { line: 18, note: 'e.preventDefault() stops the browser from reloading the page' },
        { line: 27, note: 'Derive validity from state — no separate validation state needed' },
        { line: 30, note: 'name attribute matches the state key — required for generic handler' },
        { line: 37, note: 'disabled is derived from form validity — prevents invalid submission' },
      ],
    },
    guided: {
      instructions: 'Complete the LoginForm with controlled inputs.',
      starterCode: `import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    _____              // prevent default
    onLogin({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={_____}   // controlled email
        onChange={e => _____}   // update email
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={_____}        // update password
        placeholder="Password"
      />
      <button type="submit" disabled={!email || !_____}>
        Login
      </button>
    </form>
  );
}`,
      solution: `import { useState } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={!email || !password}>
        Login
      </button>
    </form>
  );
}`,
      evalChecks: [
        {
          id: 'prevent_default',
          description: 'Calls e.preventDefault() in handleSubmit',
          test: code => /e\.preventDefault\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'Add e.preventDefault() at the start of handleSubmit',
        },
        {
          id: 'controlled_email',
          description: 'Email input is controlled with value and onChange',
          test: code => /value=\{email\}/.test(code) && /setEmail\s*\(\s*e\.target\.value\s*\)/.test(code),
          points: 35,
          failFeedback: 'value={email} and onChange={e => setEmail(e.target.value)}',
        },
        {
          id: 'controlled_password',
          description: 'Password input is controlled',
          test: code => /value=\{password\}/.test(code) && /setPassword\s*\(\s*e\.target\.value\s*\)/.test(code),
          points: 35,
          failFeedback: 'onChange={e => setPassword(e.target.value)}',
        },
      ],
    },
    challenge: {
      instructions: `Build a \`ProfileEditor\` component with this form:

Fields (all controlled):
- \`name\` — text input, required, min 2 chars
- \`bio\` — textarea, max 200 chars
- \`role\` — select with options: "student", "teacher", "admin"
- \`newsletter\` — checkbox

State: one object \`{ name: "", bio: "", role: "student", newsletter: false }\`

Validation (derive, not state):
- \`nameError\`: show \`<p className="error">\` if name is non-empty but shorter than 2 chars
- Button disabled if name is empty

On submit: \`e.preventDefault()\`, set a \`submitted\` boolean state to true
- If submitted, show \`<div className="success">Profile saved!</div>\` instead of form

Show a char count \`<small>\` below bio: \`"{bio.length}/200"\``,
      evalChecks: [
        {
          id: 'object_state',
          description: 'Single object state for all form fields',
          test: code => /useState\s*\(\s*\{[\s\S]*?name[\s\S]*?bio[\s\S]*?role/.test(code),
          points: 10,
          failFeedback: 'useState({ name: "", bio: "", role: "student", newsletter: false })',
        },
        {
          id: 'textarea',
          description: 'Bio textarea is controlled',
          test: code => /<textarea[\s\S]*?value=\{/.test(code) || /value=\{[\s\S]*?bio/.test(code),
          points: 10,
          failFeedback: '<textarea value={form.bio} onChange={...} />',
        },
        {
          id: 'select',
          description: 'Role select is controlled',
          test: code => /<select[\s\S]*?value=\{/.test(code) && /student/.test(code) && /teacher/.test(code),
          points: 10,
          failFeedback: '<select value={form.role} onChange={...}> with student/teacher/admin options',
        },
        {
          id: 'checkbox',
          description: 'Newsletter checkbox uses checked prop',
          test: code => /checked=\{/.test(code) && /newsletter/.test(code),
          points: 10,
          failFeedback: '<input type="checkbox" checked={form.newsletter} onChange={...} />',
        },
        {
          id: 'name_error',
          description: 'Shows error when name is 1 char',
          test: code => /name[\s\S]*?length[\s\S]*?[<>]\s*2|nameError/.test(code),
          points: 15,
          failFeedback: 'const nameError = form.name && form.name.length < 2 — then {nameError && <p className="error">...</p>}',
        },
        {
          id: 'disabled',
          description: 'Submit button disabled when name is empty',
          test: code => /disabled=\{![\s\S]*?name/.test(code) || /disabled=\{[\s\S]*?name\.length/.test(code),
          points: 15,
          failFeedback: '<button disabled={!form.name}>Submit</button>',
        },
        {
          id: 'prevent',
          description: 'e.preventDefault() on submit',
          test: code => /e\.preventDefault\s*\(\s*\)/.test(code),
          points: 10,
          failFeedback: 'e.preventDefault() inside handleSubmit',
        },
        {
          id: 'submitted',
          description: 'Shows success message after submit',
          test: code => /submitted/.test(code) && /success/.test(code),
          points: 10,
          failFeedback: 'if (submitted) return <div className="success">Profile saved!</div>',
        },
        {
          id: 'char_count',
          description: 'Shows character count for bio',
          test: code => /\.length[\s\S]*?200|200[\s\S]*?\.length/.test(code) && /<small/.test(code),
          points: 10,
          failFeedback: '<small>{form.bio.length}/200</small> below the textarea',
        },
      ],
    },
    hints: [
      'Checkbox: e.target.checked (not e.target.value)',
      'Textarea: controlled same as input — value and onChange',
      'Derive validation from state — no separate error state',
      'button disabled={!form.name || form.name.length < 2}',
      'Char count: {form.bio.length}/200 in a <small> tag',
    ],
    docs: [
      { label: 'Reacting to Input with State', url: 'https://react.dev/learn/reacting-to-input-with-state' },
      { label: 'Sharing State Between Components', url: 'https://react.dev/learn/sharing-state-between-components' },
    ],
    prerequisite: 43,
  },

  {
    id: 45,
    module: 8,
    moduleTitle: 'React Hooks',
    category: 'React',
    title: 'useEffect Fundamentals',
    topic: 'useEffect, dependency array, cleanup',
    concept: `## useEffect Fundamentals

\`useEffect\` runs side effects after render: syncing with external systems, subscriptions, timers, DOM manipulation.

\`\`\`jsx
useEffect(() => {
  // runs after render
}, [dependency, array]);
\`\`\`

### The Dependency Array

| Form | When it runs |
|---|---|
| \`useEffect(() => {...})\` | After every render |
| \`useEffect(() => {...}, [])\` | Once after first render (mount) |
| \`useEffect(() => {...}, [a, b])\` | After render where a or b changed |

### Cleanup Function

Return a function to clean up before the next effect runs (or unmount):

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(timer);         // cleanup runs before next effect
}, []);
\`\`\`

### Common Use Cases

\`\`\`jsx
// Document title
useEffect(() => {
  document.title = \`You have \${count} messages\`;
}, [count]);

// Event listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Sync external state
useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
\`\`\`

### What NOT to do

- Don't use effects to derive state from state — compute during render instead
- Don't omit dependencies — causes stale closures
- Data fetching in useEffect is discussed in the next level`,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState, useEffect } from 'react';

function TimerApp() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [title, setTitle] = useState('Timer');

  // Effect 1: interval timer — only when 'running' changes
  useEffect(() => {
    if (!running) return;                              // early return skips setup

    const id = setInterval(() => {
      setSeconds(s => s + 1);                         // functional updater — safe in interval
    }, 1000);

    return () => clearInterval(id);                   // cleanup when running changes or unmount
  }, [running]);

  // Effect 2: update document title — when seconds or title changes
  useEffect(() => {
    document.title = \`\${title} — \${seconds}s\`;
    return () => { document.title = 'React App'; };   // restore on unmount
  }, [seconds, title]);

  return (
    <div>
      <h2>{seconds}s</h2>
      <button onClick={() => setRunning(r => !r)}>
        {running ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setSeconds(0); setRunning(false); }}>
        Reset
      </button>
      <input value={title} onChange={e => setTitle(e.target.value)} />
    </div>
  );
}`,
      annotations: [
        { line: 8, note: 'Two effects — each handles one concern independently' },
        { line: 9, note: 'Early return inside effect body — skips interval when paused' },
        { line: 11, note: 'setInterval returns an ID used to clear it in cleanup' },
        { line: 12, note: 'Functional updater is safe here — no stale closure on seconds' },
        { line: 15, note: 'Cleanup function: returned arrow function clears interval' },
        { line: 16, note: 'Dependency: [running] — effect re-runs only when running changes' },
        { line: 19, note: 'Second effect depends on seconds AND title — both in array' },
        { line: 20, note: 'Cleanup restores title when component unmounts' },
      ],
    },
    guided: {
      instructions: 'Complete the window width tracker using useEffect.',
      starterCode: `import { useState, useEffect } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(_____);   // update width from window
    }

    window.addEventListener(_____, handleResize);   // event name

    return () => {
      window.removeEventListener(_____, handleResize);  // cleanup
    };
  }, _____);   // dependency array — this effect needs no deps

  return <p>Window width: {width}px</p>;
}`,
      solution: `import { useState, useEffect } from 'react';

function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <p>Window width: {width}px</p>;
}`,
      evalChecks: [
        {
          id: 'update_width',
          description: 'Updates state with window.innerWidth in handler',
          test: code => /setWidth\s*\(\s*window\.innerWidth\s*\)/.test(code),
          points: 30,
          failFeedback: 'setWidth(window.innerWidth) inside handleResize',
        },
        {
          id: 'add_listener',
          description: "Adds 'resize' event listener",
          test: code => /addEventListener\s*\(\s*['"]resize['"]/.test(code),
          points: 35,
          failFeedback: "window.addEventListener('resize', handleResize)",
        },
        {
          id: 'cleanup',
          description: 'Returns cleanup that removes event listener',
          test: code => /removeEventListener\s*\(\s*['"]resize['"][\s\S]*?handleResize/.test(code),
          points: 35,
          failFeedback: "return () => window.removeEventListener('resize', handleResize)",
        },
      ],
    },
    challenge: {
      instructions: `Build a \`Stopwatch\` component:

State:
- \`elapsed\` (number, ms) — starts at 0
- \`running\` (boolean) — starts false
- \`laps\` (array) — stores lap times

Behavior:
- One \`useEffect\` runs a \`setInterval\` every 10ms adding 10 to elapsed **only when running is true**. Use functional updater. Return cleanup.
- Button "Start/Pause" toggles running
- Button "Lap" — appends current \`elapsed\` to laps array (only visible when running)
- Button "Reset" — sets elapsed to 0, running to false, laps to []

Display:
- \`<p className="elapsed">\` showing elapsed formatted: \`Math.floor(elapsed/1000)\` seconds and \`Math.floor((elapsed % 1000) / 10)\` centiseconds — format: \`"X.XXs"\`
- \`<ul className="laps">\` mapping laps array, each \`<li key={index}>\` showing same format`,
      evalChecks: [
        {
          id: 'effect_interval',
          description: 'useEffect with setInterval only when running',
          test: code => /useEffect[\s\S]*?setInterval/.test(code) && /running/.test(code),
          points: 20,
          failFeedback: 'useEffect: if (!running) return; const id = setInterval(() => setElapsed(e => e + 10), 10); return () => clearInterval(id);',
        },
        {
          id: 'cleanup',
          description: 'Returns clearInterval as cleanup',
          test: code => /clearInterval/.test(code),
          points: 15,
          failFeedback: 'return () => clearInterval(id) inside the useEffect',
        },
        {
          id: 'functional_updater',
          description: 'Uses functional updater for elapsed',
          test: code => /setElapsed\s*\(\s*[a-z]\s*=>\s*[a-z]\s*\+\s*10\s*\)/.test(code),
          points: 15,
          failFeedback: 'setElapsed(e => e + 10) — functional updater inside setInterval',
        },
        {
          id: 'lap',
          description: 'Lap button appends elapsed to laps',
          test: code => /setLaps\s*\(\s*prev\s*=>\s*\[/.test(code) || /setLaps\s*\(\s*\[/.test(code),
          points: 15,
          failFeedback: 'setLaps(prev => [...prev, elapsed])',
        },
        {
          id: 'reset',
          description: 'Reset clears elapsed, running, and laps',
          test: code => /setElapsed\s*\(\s*0\s*\)/.test(code) && /setLaps\s*\(\s*\[\s*\]\s*\)/.test(code),
          points: 15,
          failFeedback: 'Reset: setElapsed(0), setRunning(false), setLaps([])',
        },
        {
          id: 'format',
          description: 'Formats elapsed into seconds and centiseconds',
          test: code => /elapsed\s*\/\s*1000/.test(code) && /elapsed\s*%\s*1000/.test(code),
          points: 20,
          failFeedback: 'Math.floor(elapsed/1000) for seconds, Math.floor((elapsed % 1000) / 10) for centiseconds',
        },
      ],
    },
    hints: [
      'useEffect cleanup runs before next effect AND on unmount',
      'Empty dependency array [] means run once (mount only)',
      'setInterval callback is a closure — use functional updater to avoid stale state',
      'if (!running) return; inside effect skips setup when paused',
      'Format: `${Math.floor(elapsed/1000)}.${String(Math.floor((elapsed%1000)/10)).padStart(2,"0")}s`',
    ],
    docs: [
      { label: 'useEffect Reference', url: 'https://react.dev/reference/react/useEffect' },
      { label: 'Synchronizing with Effects', url: 'https://react.dev/learn/synchronizing-with-effects' },
    ],
    prerequisite: 44,
  },

  {
    id: 46,
    module: 8,
    moduleTitle: 'React Hooks',
    category: 'React',
    title: 'Fetching Data with useEffect',
    topic: 'API fetching, loading/error states, abort controller',
    concept: `## Fetching Data with useEffect

The standard pattern for fetching data in React:

\`\`\`jsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/items')
    .then(res => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    })
    .then(data => {
      setData(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);
\`\`\`

### Prevent Race Conditions with AbortController

If the component unmounts before the fetch completes, the setState call on unmounted component causes a warning. Fix with AbortController:

\`\`\`jsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(setData)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    });

  return () => controller.abort();   // cleanup aborts in-flight request
}, []);
\`\`\`

### Re-fetching on Parameter Change

Add the ID (or query) to the dependency array:

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(setUser);
    return () => controller.abort();
  }, [userId]);   // re-fetch whenever userId changes
}
\`\`\`

### Render Pattern

\`\`\`jsx
if (loading) return <Spinner />;
if (error) return <p className="error">{error}</p>;
if (!data) return null;
return <DataView data={data} />;
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState, useEffect } from 'react';

function PostList({ category }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();     // cancel in-flight on re-run
    setLoading(true);                             // reset loading when category changes
    setError(null);

    fetch(\`https://jsonplaceholder.typicode.com/posts?userId=\${category}\`,
      { signal: controller.signal }
    )
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;    // ignore intentional aborts
        setError(err.message);
        setLoading(false);
      });

    return () => controller.abort();             // cleanup: abort on unmount or re-run
  }, [category]);                                // re-fetch when category changes

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}`,
      annotations: [
        { line: 7, note: 'Three state slices: data, loading, error — the standard fetch trio' },
        { line: 8, note: 'AbortController created inside effect — fresh per run' },
        { line: 9, note: 'Reset loading/error when dependency changes — prevents stale state' },
        { line: 13, note: 'signal passed to fetch — links request to controller' },
        { line: 22, note: 'AbortError is intentional — do not set error for it' },
        { line: 25, note: 'Cleanup: abort in-flight request when component unmounts or category changes' },
        { line: 26, note: '[category] — re-fetch whenever category prop changes' },
      ],
    },
    guided: {
      instructions: 'Complete the fetch effect to load a todo from JSONPlaceholder.',
      starterCode: `import { useState, useEffect } from 'react';

function TodoFetcher({ todoId }) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(\`https://jsonplaceholder.typicode.com/todos/\${_____}\`)  // use todoId
      .then(res => _____)      // return res.json()
      .then(data => {
        _____(data);           // set todo
        setLoading(false);
      })
      .catch(err => {
        setError(err._____);   // use message property
        setLoading(false);
      });
  }, [_____]);   // re-fetch when todoId changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!todo) return null;

  return <p>{todo.completed ? '✓' : '○'} {todo.title}</p>;
}`,
      solution: `import { useState, useEffect } from 'react';

function TodoFetcher({ todoId }) {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    fetch(\`https://jsonplaceholder.typicode.com/todos/\${todoId}\`)
      .then(res => res.json())
      .then(data => {
        setTodo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [todoId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!todo) return null;

  return <p>{todo.completed ? '✓' : '○'} {todo.title}</p>;
}`,
      evalChecks: [
        {
          id: 'url_param',
          description: 'Interpolates todoId into fetch URL',
          test: code => /todos\/\$\{todoId\}/.test(code),
          points: 30,
          failFeedback: 'Use template literal: `/todos/${todoId}`',
        },
        {
          id: 'json',
          description: 'Calls res.json() in first then()',
          test: code => /\.then\s*\(\s*res\s*=>\s*res\.json\s*\(\s*\)\s*\)/.test(code),
          points: 30,
          failFeedback: '.then(res => res.json())',
        },
        {
          id: 'set_todo',
          description: 'Sets todo with data',
          test: code => /setTodo\s*\(\s*data\s*\)/.test(code),
          points: 20,
          failFeedback: 'setTodo(data) inside the second .then()',
        },
        {
          id: 'dep_array',
          description: 'todoId in dependency array',
          test: code => /\[\s*todoId\s*\]/.test(code),
          points: 20,
          failFeedback: 'Add todoId to the dependency array: }, [todoId]);',
        },
      ],
    },
    challenge: {
      instructions: `Build a \`UserSearch\` component that searches GitHub users by username.

State: \`query\` (string), \`user\` (object | null), \`loading\` (bool), \`error\` (string | null)

- A text input (controlled) bound to \`query\`
- A "Search" button that triggers the search
- Store the search term in a separate state \`searchTerm\` (starts as "")
- On button click: set \`searchTerm = query\`
- \`useEffect\` watches \`[searchTerm]\`:
  - If searchTerm is empty string, do nothing (return early)
  - Otherwise fetch \`https://api.github.com/users/{searchTerm}\`
  - Use AbortController — return cleanup
  - On success: setUser(data), setLoading(false)
  - On error: ignore AbortError, else setError(err.message), setLoading(false)
  - Set loading(true) and error(null) at start of effect

Display:
- Loading state: \`<p>Searching...</p>\`
- Error state: \`<p className="error">{error}</p>\`
- User found: \`<div className="user-card">\` with \`<img src={user.avatar_url}>\`, \`<h3>{user.login}</h3>\`, \`<p>{user.bio}</p>\`, \`<a href={user.html_url}>View Profile</a>\``,
      evalChecks: [
        {
          id: 'query_state',
          description: 'Controlled query input and searchTerm state',
          test: code => /query[\s\S]*?useState/.test(code) && /searchTerm/.test(code),
          points: 10,
          failFeedback: 'Two states: query (controlled input) and searchTerm (triggers fetch)',
        },
        {
          id: 'search_trigger',
          description: 'Button click sets searchTerm to query',
          test: code => /setSearchTerm\s*\(\s*query\s*\)/.test(code),
          points: 10,
          failFeedback: 'onClick={() => setSearchTerm(query)} on the Search button',
        },
        {
          id: 'early_return',
          description: 'Effect returns early when searchTerm is empty',
          test: code => /if\s*\(\s*!searchTerm/.test(code) || /if\s*\(\s*searchTerm\s*===?\s*["']["']/.test(code),
          points: 10,
          failFeedback: 'if (!searchTerm) return; at the start of useEffect',
        },
        {
          id: 'abort_controller',
          description: 'Uses AbortController with signal',
          test: code => /AbortController/.test(code) && /controller\.signal/.test(code),
          points: 15,
          failFeedback: 'const controller = new AbortController(); fetch(url, { signal: controller.signal })',
        },
        {
          id: 'dep_array',
          description: 'searchTerm in dependency array',
          test: code => /\[\s*searchTerm\s*\]/.test(code),
          points: 10,
          failFeedback: '}, [searchTerm]); — searchTerm in the dependency array',
        },
        {
          id: 'cleanup',
          description: 'Returns controller.abort() as cleanup',
          test: code => /return\s*\(\s*\)\s*=>\s*controller\.abort\s*\(\s*\)/.test(code),
          points: 10,
          failFeedback: 'return () => controller.abort();',
        },
        {
          id: 'abort_ignore',
          description: 'Ignores AbortError in catch',
          test: code => /AbortError/.test(code),
          points: 10,
          failFeedback: "if (err.name === 'AbortError') return; in the catch",
        },
        {
          id: 'user_display',
          description: 'Renders user card with avatar, login, bio, and link',
          test: code => /avatar_url/.test(code) && /user\.login/.test(code) && /html_url/.test(code),
          points: 15,
          failFeedback: 'Show user.avatar_url in img, user.login in h3, user.bio in p, user.html_url in <a>',
        },
        {
          id: 'states',
          description: 'Handles loading, error, and user states in render',
          test: code => /loading/.test(code) && /error/.test(code) && /user/.test(code),
          points: 10,
          failFeedback: 'if (loading) / if (error) / if (!user) / return user card',
        },
      ],
    },
    hints: [
      'AbortController prevents setState on unmounted component',
      'Two states: query (input value) vs searchTerm (what to fetch) — avoids fetching on every keystroke',
      'Check err.name === "AbortError" before setting error state',
      'user.bio can be null — use {user.bio && <p>{user.bio}</p>}',
      'setLoading(true) and setError(null) at start of effect — reset from previous search',
    ],
    docs: [
      { label: 'Fetching Data', url: 'https://react.dev/learn/synchronizing-with-effects#fetching-data' },
      { label: 'AbortController', url: 'https://developer.mozilla.org/en-US/docs/Web/API/AbortController' },
    ],
    prerequisite: 45,
  },

  {
    id: 47,
    module: 8,
    moduleTitle: 'React Hooks',
    category: 'React',
    title: 'Custom Hooks',
    topic: 'Extracting logic into custom hooks',
    concept: `## Custom Hooks

A custom hook is a JavaScript function whose name starts with \`use\` and that calls other hooks. It lets you extract stateful logic into reusable functions.

\`\`\`jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return width;
}

// Use it in any component
function App() {
  const width = useWindowWidth();
  return <p>Width: {width}px</p>;
}
\`\`\`

### Rules of Hooks (apply to custom hooks too)

- Only call hooks at the top level — not in conditions, loops, or nested functions
- Only call hooks from React function components or other custom hooks

### Custom Hook for Fetching

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { if (e.name !== 'AbortError') { setError(e.message); setLoading(false); } });
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Component stays clean
function PostList() {
  const { data, loading, error } = useFetch('/api/posts');
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return <ul>{data.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

### Custom Hook for localStorage

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];   // same API as useState
}
\`\`\``,
    annotatedExample: {
      language: 'jsx',
      code: `import { useState, useEffect } from 'react';

// Custom hook — name starts with 'use'
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);               // update after delay
    }, delay);

    return () => clearTimeout(timer);         // cancel on value/delay change
  }, [value, delay]);

  return debouncedValue;                      // return the derived value
}

// Another custom hook — composes useDebounce + fetch logic
function useSearch(query) {
  const debouncedQuery = useDebounce(query, 400);  // hook calling hook
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!debouncedQuery) { setResults([]); return; }
    setLoading(true);
    fetch(\`/api/search?q=\${encodeURIComponent(debouncedQuery)}\`)
      .then(r => r.json())
      .then(data => { setResults(data); setLoading(false); });
  }, [debouncedQuery]);

  return { results, loading };
}

// Component — clean, no fetch or debounce logic
function SearchBox() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearch(query);    // all logic in hook

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <p>Searching...</p>}
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  );
}`,
      annotations: [
        { line: 3, note: 'Custom hook: function name starts with "use" — required convention' },
        { line: 7, note: 'Uses useEffect inside custom hook — fine, hooks can call hooks' },
        { line: 10, note: 'Cleanup clears timeout — key debounce behaviour' },
        { line: 14, note: 'Returns derived value — caller gets clean debouncedValue' },
        { line: 18, note: 'Composing hooks: useSearch calls useDebounce internally' },
        { line: 31, note: 'Return object with multiple values — destructure at call site' },
        { line: 35, note: 'Component is simple: no useEffect, no fetch, no debounce logic' },
      ],
    },
    guided: {
      instructions: 'Build a useToggle custom hook and use it.',
      starterCode: `import { useState } from 'react';

// Complete this custom hook
function useToggle(initialValue = false) {
  const [value, _____] = useState(initialValue);

  function toggle() {
    _____(v => !v);   // flip the value
  }

  return [value, _____];   // return same shape as useState
}

// Use useToggle here
function DarkModeButton() {
  const [isDark, toggle] = _____(false);

  return (
    <button onClick={_____}>
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}`,
      solution: `import { useState } from 'react';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue(v => !v);
  }

  return [value, toggle];
}

function DarkModeButton() {
  const [isDark, toggle] = useToggle(false);

  return (
    <button onClick={toggle}>
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}`,
      evalChecks: [
        {
          id: 'use_toggle_def',
          description: 'useToggle defined with useState',
          test: code => /function\s+useToggle/.test(code) && /useState/.test(code),
          points: 20,
          failFeedback: 'function useToggle(initialValue = false) { const [value, setValue] = useState(initialValue); ... }',
        },
        {
          id: 'toggle_fn',
          description: 'toggle flips state with functional updater',
          test: code => /setValue\s*\(\s*v\s*=>\s*!v\s*\)/.test(code) || /setVal\s*\(\s*v\s*=>\s*!v\s*\)/.test(code),
          points: 30,
          failFeedback: 'setValue(v => !v) inside toggle function',
        },
        {
          id: 'return_pair',
          description: 'useToggle returns [value, toggle]',
          test: code => /return\s*\[\s*value\s*,\s*toggle\s*\]/.test(code),
          points: 25,
          failFeedback: 'return [value, toggle]',
        },
        {
          id: 'usage',
          description: 'DarkModeButton uses useToggle and wires toggle to onClick',
          test: code => /useToggle\s*\(\s*false\s*\)/.test(code) && /onClick=\{toggle\}/.test(code),
          points: 25,
          failFeedback: 'const [isDark, toggle] = useToggle(false); and onClick={toggle}',
        },
      ],
    },
    challenge: {
      instructions: `Build two custom hooks and a component that uses both.

**Hook 1: \`useLocalStorage(key, initialValue)\`**
- Wraps useState with lazy initializer that reads from localStorage
- useEffect syncs state to localStorage on every change
- Returns [value, setValue] — same API as useState
- Parse with JSON.parse, stringify with JSON.stringify

**Hook 2: \`useFetch(url)\`**
- Returns { data, loading, error }
- Fetches url, parses JSON, stores in data
- Uses AbortController for cleanup
- Sets loading(true)/error(null) at start

**Component: \`SavedPosts\`**
- Uses \`useFetch('https://jsonplaceholder.typicode.com/posts?_limit=5')\` to get posts
- Uses \`useLocalStorage('savedPostIds', [])\` to persist saved post IDs
- Shows loading/error states
- For each post in data: render \`<article key={post.id}>\` with title, a Save button
  - Save button: if post.id is in savedIds, show "Unsave" (onClick removes id), else show "Save" (onClick adds id)
- Below posts: show count \`<p>{savedIds.length} saved</p>\``,
      evalChecks: [
        {
          id: 'use_local_storage',
          description: 'useLocalStorage hook defined with lazy init',
          test: code => /function\s+useLocalStorage/.test(code) && /localStorage\.getItem/.test(code),
          points: 15,
          failFeedback: 'useLocalStorage: useState(() => { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : initialValue; })',
        },
        {
          id: 'ls_sync',
          description: 'useLocalStorage syncs to localStorage with useEffect',
          test: code => /useEffect[\s\S]*?localStorage\.setItem/.test(code),
          points: 10,
          failFeedback: 'useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])',
        },
        {
          id: 'use_fetch',
          description: 'useFetch hook defined returning data/loading/error',
          test: code => /function\s+useFetch/.test(code) && /data[\s\S]*?loading[\s\S]*?error|error[\s\S]*?loading[\s\S]*?data/.test(code),
          points: 15,
          failFeedback: 'useFetch returns { data, loading, error }',
        },
        {
          id: 'fetch_abort',
          description: 'useFetch uses AbortController',
          test: code => /AbortController/.test(code) && /controller\.abort/.test(code),
          points: 10,
          failFeedback: 'AbortController in useFetch with return () => controller.abort() cleanup',
        },
        {
          id: 'component',
          description: 'SavedPosts uses both hooks',
          test: code => /useFetch\s*\(/.test(code) && /useLocalStorage\s*\(/.test(code),
          points: 10,
          failFeedback: 'SavedPosts component calls both useFetch and useLocalStorage',
        },
        {
          id: 'save_toggle',
          description: 'Save/Unsave toggles ID in savedIds',
          test: code => /savedIds[\s\S]*?filter|filter[\s\S]*?savedIds/.test(code) && /savedIds[\s\S]*?\.includes|includes[\s\S]*?savedIds/.test(code),
          points: 20,
          failFeedback: 'savedIds.includes(post.id) to check, filter to remove, [...savedIds, post.id] to add',
        },
        {
          id: 'count',
          description: 'Shows saved count',
          test: code => /savedIds\.length/.test(code) || /savedPostIds\.length/.test(code),
          points: 10,
          failFeedback: '<p>{savedIds.length} saved</p>',
        },
        {
          id: 'loading_error',
          description: 'Handles loading and error from useFetch',
          test: code => /loading[\s\S]*?return|if\s*\(\s*loading/.test(code) && /error[\s\S]*?return|if\s*\(\s*error/.test(code),
          points: 10,
          failFeedback: 'Check if (loading) and if (error) before rendering posts',
        },
      ],
    },
    hints: [
      'Custom hook name MUST start with "use"',
      'Hooks can call other hooks — that is the whole point',
      'useLocalStorage lazy init: useState(() => { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; })',
      'Return [value, setValue] from useLocalStorage so it feels like useState',
      'includes() to check, filter() to remove, spread to add: [...prev, id]',
    ],
    docs: [
      { label: 'Reusing Logic with Custom Hooks', url: 'https://react.dev/learn/reusing-logic-with-custom-hooks' },
      { label: 'Rules of Hooks', url: 'https://react.dev/reference/rules/rules-of-hooks' },
    ],
    prerequisite: 46,
  },
];
