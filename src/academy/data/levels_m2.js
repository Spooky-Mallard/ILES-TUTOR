export const module2 = [
  {
    id: 9,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'objects.all() — What .objects Is',
    topic: 'The Manager class, QuerySets, lazy evaluation',
    concept: `## What is .objects?

Every Django model gets a \`.objects\` attribute automatically. It is a **Manager** — Django's interface for running queries against the database table.

\`\`\`python
Department.objects.all()   # get all rows
\`\`\`

You never instantiate the Manager yourself. Django attaches it to the class when the model is defined.

## What is a QuerySet?

\`.all()\` doesn't return a Python list. It returns a **QuerySet** — an object that represents a database query. The actual SQL is only run when you:
- Iterate over it: \`for d in Department.objects.all():\`
- Convert it: \`list(Department.objects.all())\`
- Slice it: \`Department.objects.all()[:5]\`
- Check its length: \`len(...)\`

This is called **lazy evaluation** — the query runs as late as possible.

## Why lazy?

Because you might chain more filters before you need the data:

\`\`\`python
qs = Department.objects.all()
qs = qs.filter(is_active=True)   # no query yet
qs = qs.order_by('name')         # still no query
results = list(qs)               # NOW the single optimised query runs
\`\`\`

One query with all conditions, instead of three separate queries.`,
    annotatedExample: {
      language: 'python',
      code: `from .models import Department

# .objects is the Manager — the query interface
# .all() returns a QuerySet of every row in the table
all_departments = Department.objects.all()

# No SQL runs yet — all_departments is a QuerySet description

# SQL runs here when Python needs to iterate
for dept in all_departments:
    print(dept.name)    # accesses dept object, dept.name is its field

# Slicing — SQL adds LIMIT 5
first_five = Department.objects.all()[:5]

# Counting — SQL runs SELECT COUNT(*)
total = Department.objects.all().count()
print(f"Total departments: {total}")

# Order by name — SQL adds ORDER BY name ASC
ordered = Department.objects.all().order_by('name')

# Order descending — prefix with minus
newest = Department.objects.all().order_by('-created_at')`,
      explanation: '.objects is the Manager. .all() returns a lazy QuerySet. The database query runs only when you actually access the data.'
    },
    guided: {
      instructions: 'Fill in the blanks to query all students and count them.',
      language: 'python',
      starterCode: `from .models import Student

# Get all student records
all_students = Student.___________.___________()

# Count them (runs a SELECT COUNT query)
total = Student.objects.all().___________()

# Get all, ordered by last_name
ordered = Student.objects.all().order_by('___________')`,
      solution: `from .models import Student

all_students = Student.objects.all()
total = Student.objects.all().count()
ordered = Student.objects.all().order_by('last_name')`,
      evalChecks: [
        {
          id: 'objects_all',
          description: 'Uses Student.objects.all()',
          test: (code) => /Student\.objects\.all\s*\(\s*\)/.test(code),
          points: 40,
          failFeedback: 'Access the Manager: Student.objects.all()'
        },
        {
          id: 'count',
          description: 'Uses .count() to count records',
          test: (code) => /\.count\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'Use .count() at the end: Student.objects.all().count()'
        },
        {
          id: 'order_by',
          description: 'Uses .order_by() with a field name',
          test: (code) => /\.order_by\s*\(\s*['"].+['"]\s*\)/.test(code),
          points: 30,
          failFeedback: "Use .order_by('field_name') — e.g. .order_by('last_name')"
        }
      ]
    },
    challenge: {
      instructions: `Write a Django view function \`get_all_courses\` that:
1. Queries all Course objects
2. Orders them by \`title\` (ascending)
3. Returns a count of total courses and the ordered queryset

Use this structure:
\`\`\`python
def get_all_courses():
    # your code here
    return {'count': ..., 'courses': ...}
\`\`\``,
      language: 'python',
      starterCode: `from .models import Course\n\ndef get_all_courses():\n    # Query all courses, ordered by title\n    pass\n`,
      solution: `from .models import Course

def get_all_courses():
    courses = Course.objects.all().order_by('title')
    return {'count': courses.count(), 'courses': courses}`,
      evalChecks: [
        {
          id: 'objects_all',
          description: 'Uses Course.objects.all()',
          test: (code) => /Course\.objects\.all\s*\(\s*\)/.test(code) || /Course\.objects\.order_by\s*\(/.test(code),
          points: 35,
          failFeedback: 'Course.objects.all() — use the Manager to access all records'
        },
        {
          id: 'order_by_title',
          description: "Orders by 'title'",
          test: (code) => /order_by\s*\(\s*['"]title['"]\s*\)/.test(code),
          points: 35,
          failFeedback: ".order_by('title') — chain this onto your queryset"
        },
        {
          id: 'returns_dict',
          description: 'Returns a dictionary with count and courses',
          test: (code) => /return\s*\{.*count.*courses|return\s*\{.*courses.*count/.test(code),
          points: 30,
          failFeedback: "Return: {'count': ..., 'courses': ...}"
        }
      ]
    },
    hints: [
      'The Manager is always called .objects — it is on the class, not an instance',
      '.all() returns a QuerySet, not a Python list',
      'Chain .order_by("field") to sort — prefix with "-" for descending: .order_by("-name")',
      '.count() is more efficient than len() — it runs SELECT COUNT(*) instead of fetching all rows'
    ],
    docs: [
      {
        heading: 'QuerySet basics',
        content: 'The most common QuerySet operations.',
        code: `Model.objects.all()              # all rows
Model.objects.all().count()      # SELECT COUNT(*)
Model.objects.all().order_by('field')    # ASC
Model.objects.all().order_by('-field')   # DESC
Model.objects.all()[:10]         # LIMIT 10
Model.objects.all()[10:20]       # LIMIT 10 OFFSET 10`
      },
      {
        heading: 'Lazy evaluation',
        content: 'QuerySets only hit the database when you force evaluation.',
        code: `qs = Model.objects.all()  # no SQL yet
qs = qs.order_by('name')  # still no SQL

# These force evaluation:
list(qs)        # fetch all into memory
for obj in qs:  # iterate
qs[0]           # access by index
qs.count()      # SELECT COUNT`
      }
    ],
    prerequisite: null
  },

  {
    id: 10,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'objects.filter() — Finding Records',
    topic: 'Keyword arguments, __contains, __icontains, __gte, chaining',
    concept: `## filter() vs all()

\`.all()\` returns every row. \`.filter()\` returns rows matching conditions.

\`\`\`python
Department.objects.filter(is_active=True)
\`\`\`

SQL: \`SELECT * FROM department WHERE is_active = TRUE\`

## Lookup syntax

Django uses double-underscore (\`__\`) to express comparison operators:

| Django lookup | SQL equivalent |
|---|---|
| \`name='Engineering'\` | \`WHERE name = 'Engineering'\` |
| \`credits__gte=3\` | \`WHERE credits >= 3\` |
| \`credits__lte=6\` | \`WHERE credits <= 6\` |
| \`name__contains='sci'\` | \`WHERE name LIKE '%sci%'\` |
| \`name__icontains='sci'\` | \`WHERE LOWER(name) LIKE '%sci%'\` (case-insensitive) |
| \`name__startswith='Eng'\` | \`WHERE name LIKE 'Eng%'\` |

## Chaining filters

\`\`\`python
Department.objects
    .filter(is_active=True)
    .filter(name__icontains='sci')
    .order_by('name')
\`\`\`

Each \`.filter()\` narrows the queryset further. All conditions combined in one SQL query.

## Multiple conditions in one filter

\`\`\`python
Department.objects.filter(is_active=True, name__startswith='Eng')
\`\`\`

Comma-separated conditions are AND'd together.`,
    annotatedExample: {
      language: 'python',
      code: `from .models import Student

# Exact match — WHERE year = 'Y3'
year3 = Student.objects.filter(year='Y3')

# Greater than or equal — WHERE credit_units >= 3
good_students = Student.objects.filter(gpa__gte=3.0)

# Case-insensitive contains — WHERE LOWER(last_name) LIKE '%nakato%'
nakatos = Student.objects.filter(last_name__icontains='nakato')

# Multiple conditions in one call — AND
active_year3 = Student.objects.filter(year='Y3', is_enrolled=True)

# Chained — same result, different style
chained = Student.objects.filter(year='Y3').filter(is_enrolled=True)

# Combine with order_by
result = (Student.objects
          .filter(is_enrolled=True)
          .filter(year__in=['Y3', 'Y4'])  # WHERE year IN ('Y3', 'Y4')
          .order_by('last_name'))`,
      explanation: "filter() uses keyword arguments with __ lookups to express WHERE conditions. Chain multiple .filter() calls to AND conditions together."
    },
    guided: {
      instructions: 'Write the filter expressions to match each described query.',
      language: 'python',
      starterCode: `from .models import Course

# Get all courses with more than 2 credit units
high_credit = Course.objects.filter(credits___________2)

# Get courses whose title contains "computer" (case-insensitive)
cs_courses = Course.objects.filter(title___________'computer')

# Get active courses with at least 3 credits
good_courses = Course.objects.filter(___________, credits__gte=___________)`,
      solution: `from .models import Course

high_credit = Course.objects.filter(credits__gt=2)
cs_courses = Course.objects.filter(title__icontains='computer')
good_courses = Course.objects.filter(is_active=True, credits__gte=3)`,
      evalChecks: [
        {
          id: 'gt_lookup',
          description: 'Uses __gt or __gte for numeric comparison',
          test: (code) => /credits__g(t|te)\s*=\s*\d/.test(code),
          points: 35,
          failFeedback: 'For "greater than": credits__gt=2 or for "at least": credits__gte=2'
        },
        {
          id: 'icontains',
          description: 'Uses __icontains for case-insensitive search',
          test: (code) => /title__icontains/.test(code),
          points: 35,
          failFeedback: 'Case-insensitive search: title__icontains="computer"'
        },
        {
          id: 'multi_condition',
          description: 'filter() with multiple conditions',
          test: (code) => /filter\s*\([^)]*,\s*[^)]*\)/.test(code),
          points: 30,
          failFeedback: 'Multiple conditions in one filter: filter(is_active=True, credits__gte=3)'
        }
      ]
    },
    challenge: {
      instructions: `Write queries for a student database:

1. All Year 4 students who are enrolled
2. Students with last_name starting with "A" or "B" — use \`last_name__regex=r'^[AB]'\`
3. Students enrolled in any of: Y3, Y4 — use \`year__in=[...]\`
4. All enrolled students, ordered by last_name then first_name`,
      language: 'python',
      starterCode: `from .models import Student\n\n# 1. Year 4 enrolled:\n\n# 2. Last name starts A or B:\n\n# 3. Y3 or Y4:\n\n# 4. Enrolled, ordered:\n`,
      solution: `from .models import Student

# 1.
year4_enrolled = Student.objects.filter(year='Y4', is_enrolled=True)

# 2.
ab_students = Student.objects.filter(last_name__regex=r'^[AB]')

# 3.
upper_years = Student.objects.filter(year__in=['Y3', 'Y4'])

# 4.
ordered = Student.objects.filter(is_enrolled=True).order_by('last_name', 'first_name')`,
      evalChecks: [
        {
          id: 'exact_filter',
          description: 'Filters by year with exact match',
          test: (code) => /filter\s*\(.*year\s*=\s*['"]Y\d['"]/.test(code),
          points: 25,
          failFeedback: "Exact match: Student.objects.filter(year='Y4')"
        },
        {
          id: 'in_lookup',
          description: 'Uses __in lookup for multiple values',
          test: (code) => /year__in\s*=\s*\[/.test(code),
          points: 25,
          failFeedback: "year__in=['Y3', 'Y4'] — matches any value in the list"
        },
        {
          id: 'multi_filter',
          description: 'At least one filter with two conditions',
          test: (code) => /filter\s*\([^)]*,\s*[^)]*\)/.test(code) || (code.match(/\.filter\s*\(/g) || []).length >= 2,
          points: 25,
          failFeedback: 'Combine conditions: filter(year="Y4", is_enrolled=True)'
        },
        {
          id: 'order_by_multi',
          description: 'order_by with multiple fields',
          test: (code) => /order_by\s*\(\s*['"][^'"]+['"]\s*,\s*['"][^'"]+['"]\s*\)/.test(code),
          points: 25,
          failFeedback: ".order_by('last_name', 'first_name') — multiple fields, first takes priority"
        }
      ]
    },
    hints: [
      "__gte means 'greater than or equal to' — credits__gte=3 means credits >= 3",
      '__icontains is case-insensitive contains — great for search boxes',
      "Multiple conditions in one .filter() are AND'd: filter(a=1, b=2) means WHERE a=1 AND b=2",
      "__in accepts a list: year__in=['Y3','Y4'] means WHERE year IN ('Y3','Y4')"
    ],
    docs: [
      {
        heading: 'Field lookups',
        content: 'Double-underscore lookups express WHERE conditions.',
        code: `exact:       field='value'      → = 'value'
contains:    field__contains='x' → LIKE '%x%'
icontains:   field__icontains='x' → ILIKE '%x%'
startswith:  field__startswith='x' → LIKE 'x%'
gt/gte:      field__gt=5         → > 5 / >= 5
lt/lte:      field__lt=5         → < 5 / <= 5
in:          field__in=[1,2,3]   → IN (1,2,3)
isnull:      field__isnull=True  → IS NULL`
      }
    ],
    prerequisite: 9
  },

  {
    id: 11,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'objects.get() vs filter()',
    topic: 'When each is appropriate, DoesNotExist, returning one vs many',
    concept: `## The difference

\`.get()\` returns **exactly one** object. \`.filter()\` returns **zero or more** objects in a QuerySet.

\`\`\`python
Student.objects.get(reg_number='22/U/0001')   # one Student
Student.objects.filter(year='Y3')              # QuerySet of students
\`\`\`

## When .get() raises exceptions

\`.get()\` enforces that exactly one result exists. It raises:
- \`Model.DoesNotExist\` — if no record matches
- \`Model.MultipleObjectsReturned\` — if more than one matches

\`\`\`python
try:
    student = Student.objects.get(reg_number='22/U/0001')
except Student.DoesNotExist:
    # handle not found
    return None
\`\`\`

## When to use which

Use \`.get()\` when:
- You're looking up by a unique field (id, reg_number, email)
- You expect and require exactly one result

Use \`.filter()\` when:
- You're searching and might get zero, one, or many results
- You're building a list view

## get_object_or_404

In Django views, \`get_object_or_404()\` is the standard shortcut:
\`\`\`python
from django.shortcuts import get_object_or_404
student = get_object_or_404(Student, pk=id)
# → raises Http404 if not found, instead of DoesNotExist
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from .models import Student

# .get() — for unique lookups (id, unique fields)
# Returns one Student object, not a QuerySet
try:
    student = Student.objects.get(id=1)
    print(student.first_name)         # access the object directly
except Student.DoesNotExist:
    print("No student with that id")
except Student.MultipleObjectsReturned:
    print("Bug: multiple students with same id")  # shouldn't happen for id

# .filter() — for searches, returns QuerySet
results = Student.objects.filter(year='Y3')
# results might be empty, have one item, or have many

# Check if any results:
if results.exists():       # efficient — doesn't fetch all rows
    print(f"Found {results.count()}")

# .get() with pk is shorthand for primary key
student = Student.objects.get(pk=5)  # same as id=5`,
      explanation: '.get() raises exceptions if 0 or 2+ results. Use it for unique field lookups. .filter() always returns a QuerySet.'
    },
    guided: {
      instructions: 'Complete the function that safely fetches a single course by its id.',
      language: 'python',
      starterCode: `from .models import Course

def get_course_by_id(course_id):
    try:
        # Use .get() to find the exact course
        course = Course.objects.___________(id=___________)
        return course
    except Course.___________:
        return None`,
      solution: `from .models import Course

def get_course_by_id(course_id):
    try:
        course = Course.objects.get(id=course_id)
        return course
    except Course.DoesNotExist:
        return None`,
      evalChecks: [
        {
          id: 'uses_get',
          description: 'Uses .get() for single record lookup',
          test: (code) => /Course\.objects\.get\s*\(/.test(code),
          points: 40,
          failFeedback: 'Course.objects.get(id=course_id) — .get() returns one object'
        },
        {
          id: 'passes_id',
          description: 'Passes the id parameter to .get()',
          test: (code) => /\.get\s*\(.*id\s*=\s*course_id/.test(code) || /\.get\s*\(.*pk\s*=\s*course_id/.test(code),
          points: 30,
          failFeedback: 'Pass the variable: Course.objects.get(id=course_id)'
        },
        {
          id: 'catches_doesnotexist',
          description: 'Catches Course.DoesNotExist',
          test: (code) => /except\s+Course\.DoesNotExist/.test(code),
          points: 30,
          failFeedback: 'Catch the exception: except Course.DoesNotExist:'
        }
      ]
    },
    challenge: {
      instructions: `Write two functions:

1. \`find_student(reg_number)\` — uses \`.get()\` to return a student by reg_number, returns \`None\` if not found
2. \`search_students(name)\` — uses \`.filter()\` with \`__icontains\` on first_name OR last_name to return matching students

For the search, you'll need \`Q\` objects for OR conditions:
\`\`\`python
from django.db.models import Q
Student.objects.filter(Q(first_name__icontains=name) | Q(last_name__icontains=name))
\`\`\``,
      language: 'python',
      starterCode: `from .models import Student\nfrom django.db.models import Q\n\ndef find_student(reg_number):\n    pass\n\ndef search_students(name):\n    pass\n`,
      solution: `from .models import Student
from django.db.models import Q

def find_student(reg_number):
    try:
        return Student.objects.get(reg_number=reg_number)
    except Student.DoesNotExist:
        return None

def search_students(name):
    return Student.objects.filter(
        Q(first_name__icontains=name) | Q(last_name__icontains=name)
    )`,
      evalChecks: [
        {
          id: 'get_by_reg',
          description: 'find_student uses .get() with reg_number',
          test: (code) => /Student\.objects\.get\s*\(.*reg_number/.test(code),
          points: 25,
          failFeedback: 'Student.objects.get(reg_number=reg_number)'
        },
        {
          id: 'catches_exception',
          description: 'Catches DoesNotExist in find_student',
          test: (code) => /except\s+Student\.DoesNotExist/.test(code),
          points: 25,
          failFeedback: 'except Student.DoesNotExist: return None'
        },
        {
          id: 'filter_search',
          description: 'search_students uses .filter()',
          test: (code) => /Student\.objects\.filter\s*\(/.test(code),
          points: 25,
          failFeedback: 'Student.objects.filter(...) for the search function'
        },
        {
          id: 'q_objects_or',
          description: 'Uses Q objects with | for OR',
          test: (code) => /Q\s*\(.*icontains.*\)\s*\|\s*Q\s*\(.*icontains/.test(code),
          points: 25,
          failFeedback: 'Q(first_name__icontains=name) | Q(last_name__icontains=name)'
        }
      ]
    },
    hints: [
      '.get() raises DoesNotExist if nothing matches — always wrap it in try/except',
      'Use .get() only with unique fields like id, pk, email, reg_number',
      '.filter() never raises an exception — it returns an empty QuerySet if nothing matches',
      'Use .exists() to check if a QuerySet has any results without fetching the data'
    ],
    docs: [
      {
        heading: '.get() vs .filter()',
        content: 'Choosing between get and filter.',
        code: `# get — for unique field lookups
try:
    obj = Model.objects.get(pk=5)
except Model.DoesNotExist:
    obj = None

# filter — for searches, returns QuerySet
results = Model.objects.filter(name__icontains='xyz')
if results.exists():
    first = results.first()`
      }
    ],
    prerequisite: 10
  },

  {
    id: 12,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'Creating and Saving Records',
    topic: '.save() vs objects.create() — the difference',
    concept: `## Two ways to create a record

**Method 1: Two-step with .save()**
\`\`\`python
student = Student()          # create Python object
student.first_name = 'Sarah'
student.reg_number = '22/U/0001'
student.save()               # SQL INSERT runs here
\`\`\`

Or with constructor:
\`\`\`python
student = Student(first_name='Sarah', reg_number='22/U/0001')
student.save()
\`\`\`

**Method 2: One-step with .create()**
\`\`\`python
student = Student.objects.create(
    first_name='Sarah',
    reg_number='22/U/0001'
)
# creates AND saves in one call
\`\`\`

## Which to use?

- Use \`.create()\` when creating a new record in one step
- Use \`.save()\` when you need to modify an existing object

\`\`\`python
student = Student.objects.get(pk=1)
student.first_name = 'Grace'   # modify
student.save()                  # UPDATE (not INSERT — it has a pk already)
\`\`\`

## get_or_create

A useful helper that avoids duplicates:
\`\`\`python
student, created = Student.objects.get_or_create(
    reg_number='22/U/0001',
    defaults={'first_name': 'Sarah'}
)
# created is True if it was inserted, False if it already existed
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from .models import Department

# Method 1: create then save
dept = Department()
dept.name = 'Computer Science'
dept.is_active = True
dept.save()    # INSERT INTO department (name, is_active) VALUES (...)
print(dept.id)  # Django sets .id after .save() — was None before

# Method 2: create() — shortcut that does both in one line
dept2 = Department.objects.create(name='Engineering', is_active=True)
print(dept2.id)  # already set

# Updating an existing record
dept2.name = 'Electrical Engineering'
dept2.save()    # runs UPDATE, not INSERT — Django knows it has an id

# Deleting a record
dept2.delete()  # DELETE FROM department WHERE id = 2

# get_or_create — safe insert that avoids duplicates
dept3, was_created = Department.objects.get_or_create(
    name='Mathematics',
    defaults={'is_active': True}
)
print(was_created)  # True if new, False if it already existed`,
      explanation: '.create() is a one-liner that creates and saves. .save() on an existing object runs UPDATE. .id is None until after .save().'
    },
    guided: {
      instructions: 'Complete the function that creates a new Course record.',
      language: 'python',
      starterCode: `from .models import Course

def create_course(code, title, credits=3):
    # One-step creation using .create()
    course = Course.objects.___________(
        code=___________,
        title=title,
        ___________=credits
    )
    return course`,
      solution: `from .models import Course

def create_course(code, title, credits=3):
    course = Course.objects.create(
        code=code,
        title=title,
        credits=credits
    )
    return course`,
      evalChecks: [
        {
          id: 'uses_create',
          description: 'Uses .objects.create() method',
          test: (code) => /Course\.objects\.create\s*\(/.test(code),
          points: 40,
          failFeedback: 'Course.objects.create(...) — pass all field values as keyword arguments'
        },
        {
          id: 'passes_code',
          description: 'Passes code to create()',
          test: (code) => /create\s*\(.*code\s*=\s*code/.test(code),
          points: 30,
          failFeedback: 'Pass code=code inside create()'
        },
        {
          id: 'passes_credits',
          description: 'Passes credits to create()',
          test: (code) => /create\s*\(.*credits\s*=\s*credits/.test(code),
          points: 30,
          failFeedback: 'Pass credits=credits inside create()'
        }
      ]
    },
    challenge: {
      instructions: `Write three functions:

1. \`create_student(first_name, last_name, reg_number, year='Y1')\` — creates and returns a Student using .create()
2. \`update_student_year(student_id, new_year)\` — fetches student by id, sets year, saves, returns student
3. \`delete_student(student_id)\` — fetches student by id, deletes it, returns True; returns False if not found`,
      language: 'python',
      starterCode: `from .models import Student\n\ndef create_student(first_name, last_name, reg_number, year='Y1'):\n    pass\n\ndef update_student_year(student_id, new_year):\n    pass\n\ndef delete_student(student_id):\n    pass\n`,
      solution: `from .models import Student

def create_student(first_name, last_name, reg_number, year='Y1'):
    return Student.objects.create(
        first_name=first_name,
        last_name=last_name,
        reg_number=reg_number,
        year=year
    )

def update_student_year(student_id, new_year):
    try:
        student = Student.objects.get(id=student_id)
        student.year = new_year
        student.save()
        return student
    except Student.DoesNotExist:
        return None

def delete_student(student_id):
    try:
        student = Student.objects.get(id=student_id)
        student.delete()
        return True
    except Student.DoesNotExist:
        return False`,
      evalChecks: [
        {
          id: 'create_method',
          description: 'create_student uses .objects.create()',
          test: (code) => /Student\.objects\.create\s*\(/.test(code),
          points: 30,
          failFeedback: 'Student.objects.create(first_name=first_name, ...)'
        },
        {
          id: 'update_save',
          description: 'update function assigns field then calls .save()',
          test: (code) => /student\.year\s*=\s*new_year/.test(code) && /student\.save\s*\(\s*\)/.test(code),
          points: 35,
          failFeedback: 'Assign the new value: student.year = new_year, then student.save()'
        },
        {
          id: 'delete_call',
          description: 'delete function calls .delete()',
          test: (code) => /student\.delete\s*\(\s*\)/.test(code),
          points: 35,
          failFeedback: 'Fetch the student, then call: student.delete()'
        }
      ]
    },
    hints: [
      '.create() does both steps at once — you get back an object with .id already set',
      'To update: get the object, change the field, call .save() — Django runs UPDATE not INSERT',
      'To delete: get the object, call .delete() — or queryset.delete() to delete many at once',
      '.id is None on a new object until after .save() or .create()'
    ],
    docs: [
      {
        heading: 'Create, update, delete',
        content: 'The three write operations.',
        code: `# Create
obj = Model.objects.create(field=value)

# Update
obj = Model.objects.get(pk=id)
obj.field = new_value
obj.save()

# Delete one
obj.delete()

# Delete many
Model.objects.filter(is_active=False).delete()`
      }
    ],
    prerequisite: 11
  },

  {
    id: 13,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'ForeignKey — The Join Behind the Scenes',
    topic: 'What ForeignKey creates in the DB, on_delete options, forward vs reverse access',
    concept: `## What a ForeignKey is

A ForeignKey links one model to another. In the database, it becomes an integer column storing the other table's primary key.

\`\`\`python
class Issue(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
\`\`\`

SQL: \`project_id INTEGER REFERENCES project(id)\`

## on_delete — required argument

When the related object is deleted, what happens to this object?

| Option | Meaning |
|--------|---------|
| \`models.CASCADE\` | Delete this object too — cascade the delete |
| \`models.SET_NULL\` | Set the field to NULL (requires null=True) |
| \`models.PROTECT\` | Prevent deletion — raise an error |
| \`models.SET_DEFAULT\` | Set to the field's default value |

## Forward access (the normal direction)

\`\`\`python
issue = Issue.objects.get(pk=1)
print(issue.project.name)   # access the related Project
\`\`\`

Django follows the ForeignKey and fetches the Project. This triggers a second SQL query unless you use \`select_related()\`.

## Reverse access

From the Project side, you can get all its issues:
\`\`\`python
project = Project.objects.get(pk=1)
project.issue_set.all()   # default reverse name is model_set
\`\`\`

The default reverse name is \`<modelname>_set\`. You can customise it with \`related_name=\`.`,
    annotatedExample: {
      language: 'python',
      code: `from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    reg_number = models.CharField(max_length=20, unique=True)

    # ForeignKey: each student belongs to one department
    # on_delete=CASCADE: if department deleted, delete this student too
    department = models.ForeignKey(
        Department,
        on_delete=models.CASCADE,
        related_name='students'   # Department.students.all() instead of department_set
    )

    def __str__(self):
        return self.reg_number

# Forward access — from student to department
student = Student.objects.get(pk=1)
print(student.department.name)   # follows FK, fetches Department

# Reverse access — from department to all its students
dept = Department.objects.get(name='Computer Science')
for s in dept.students.all():    # uses related_name='students'
    print(s.reg_number)`,
      explanation: 'ForeignKey stores an integer id in the DB column. Access the related object directly via student.department. Reverse access via related_name.'
    },
    guided: {
      instructions: 'Add a ForeignKey to connect Issue to a Project model.',
      language: 'python',
      starterCode: `from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Issue(models.Model):
    title = models.CharField(max_length=200)

    # Link to Project — deleting the project deletes its issues
    project = models.ForeignKey(
        ___________,
        on_delete=models.___________,
        related_name='___________'
    )

    def __str__(self):
        return self.title`,
      solution: `from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Issue(models.Model):
    title = models.CharField(max_length=200)

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='issues'
    )

    def __str__(self):
        return self.title`,
      evalChecks: [
        {
          id: 'foreignkey_field',
          description: 'project is a ForeignKey field',
          test: (code) => /project\s*=\s*models\.ForeignKey\s*\(/.test(code),
          points: 30,
          failFeedback: 'project = models.ForeignKey(Project, on_delete=...)'
        },
        {
          id: 'references_project',
          description: 'ForeignKey references Project model',
          test: (code) => /ForeignKey\s*\(\s*Project/.test(code),
          points: 30,
          failFeedback: 'First argument to ForeignKey should be the related model: ForeignKey(Project, ...)'
        },
        {
          id: 'on_delete',
          description: 'on_delete argument provided',
          test: (code) => /on_delete\s*=\s*models\.(CASCADE|SET_NULL|PROTECT|SET_DEFAULT)/.test(code),
          points: 25,
          failFeedback: 'on_delete is required: on_delete=models.CASCADE'
        },
        {
          id: 'related_name',
          description: 'related_name set',
          test: (code) => /related_name\s*=\s*['"][^'"]+['"]/.test(code),
          points: 15,
          failFeedback: "related_name='issues' — allows project.issues.all()"
        }
      ]
    },
    challenge: {
      instructions: `Write a \`Comment\` model that belongs to an \`Issue\`. The Issue model is already defined.

\`Comment\` needs:
- \`body\` — TextField
- \`author\` — CharField max 100
- \`issue\` — ForeignKey to Issue, CASCADE on delete, related_name='comments'
- \`created_at\` — DateTimeField auto_now_add

\`__str__\` returns \`"Comment by {author} on {issue.title}"\`.

Then write a query that gets all comments for an issue with id=5, ordered by created_at.`,
      language: 'python',
      starterCode: `from django.db import models

class Issue(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

# Write Comment model below

`,
      solution: `from django.db import models

class Issue(models.Model):
    title = models.CharField(max_length=200)

    def __str__(self):
        return self.title

class Comment(models.Model):
    body = models.TextField()
    author = models.CharField(max_length=100)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.issue.title}"

# Query
comments = Issue.objects.get(pk=5).comments.all().order_by('created_at')`,
      evalChecks: [
        {
          id: 'comment_model',
          description: 'Comment class inherits models.Model',
          test: (code) => /class\s+Comment\s*\(\s*models\.Model\s*\)/.test(code),
          points: 15,
          failFeedback: 'class Comment(models.Model):'
        },
        {
          id: 'fk_to_issue',
          description: 'issue ForeignKey references Issue',
          test: (code) => /ForeignKey\s*\(\s*Issue/.test(code),
          points: 25,
          failFeedback: 'issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="comments")'
        },
        {
          id: 'cascade',
          description: 'on_delete=CASCADE',
          test: (code) => /on_delete\s*=\s*models\.CASCADE/.test(code),
          points: 20,
          failFeedback: 'on_delete=models.CASCADE — deletes comments when their issue is deleted'
        },
        {
          id: 'related_name_comments',
          description: "related_name='comments'",
          test: (code) => /related_name\s*=\s*['"]comments['"]/.test(code),
          points: 20,
          failFeedback: "related_name='comments' — enables issue.comments.all()"
        },
        {
          id: 'str_includes_author',
          description: '__str__ includes self.author',
          test: (code) => /def\s+__str__[\s\S]*?return[\s\S]*?self\.author/.test(code),
          points: 20,
          failFeedback: '__str__ should include self.author in the returned string'
        }
      ]
    },
    hints: [
      'ForeignKey(ModelName, on_delete=...) — the model name is the class, not a string',
      'on_delete=models.CASCADE is the most common choice — deletes related objects too',
      'related_name sets the reverse accessor: related_name="comments" → issue.comments.all()',
      'To access the related object: instance.foreignkey_field.field_name — e.g. comment.issue.title'
    ],
    docs: [
      {
        heading: 'ForeignKey syntax',
        content: 'How to define and use ForeignKey fields.',
        code: `# Define
class Comment(models.Model):
    issue = models.ForeignKey(
        Issue,
        on_delete=models.CASCADE,
        related_name='comments'
    )

# Forward access
comment.issue.title

# Reverse access
issue.comments.all()
issue.comments.filter(author='Sarah')`
      },
      {
        heading: 'on_delete options',
        content: 'What happens when the related object is deleted.',
        code: `models.CASCADE     # delete this object too
models.SET_NULL    # set to NULL (need null=True)
models.PROTECT     # prevent deletion, raise error
models.SET_DEFAULT # set to field's default value`
      }
    ],
    prerequisite: 12
  },

  {
    id: 14,
    module: 2,
    moduleTitle: 'The ORM — Querying Your Database',
    category: 'Django',
    title: 'related_name and Reverse Lookups',
    topic: 'How department.students.all() works, naming conventions',
    concept: `## The default reverse name

When you define a ForeignKey without a \`related_name\`, Django creates a default reverse accessor: \`<model_name>_set\`.

\`\`\`python
class Issue(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    # no related_name

project.issue_set.all()   # default: lowercase model name + _set
\`\`\`

## Setting related_name

\`related_name\` replaces the default with something readable:

\`\`\`python
class Issue(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='issues')

project.issues.all()   # much cleaner
\`\`\`

## Best practice: always set related_name

Use the plural of the child model name: if the child is \`Issue\`, use \`related_name='issues'\`.

## Filtering through reverse relations

\`\`\`python
# Get all projects that have at least one open issue
Project.objects.filter(issues__is_resolved=False).distinct()
# SQL: JOIN with issues table, WHERE is_resolved = FALSE
\`\`\`

The double-underscore traverses the relationship in a filter.

## related_name='+' disables reverse access

If you never need to traverse the relationship in reverse, set \`related_name='+'\` to tell Django not to create the accessor at all.`,
    annotatedExample: {
      language: 'python',
      code: `from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)

class Lecturer(models.Model):
    name = models.CharField(max_length=100)
    # related_name='lecturers' → department.lecturers.all()
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='lecturers'
    )

class Course(models.Model):
    code = models.CharField(max_length=10)
    # A course belongs to a department AND is taught by a lecturer
    department = models.ForeignKey(
        Department, on_delete=models.CASCADE, related_name='courses'
    )
    lecturer = models.ForeignKey(
        Lecturer, on_delete=models.SET_NULL, null=True, related_name='courses'
    )

# Reverse access examples:
dept = Department.objects.get(name='CS')
dept.lecturers.all()     # all lecturers in CS
dept.courses.all()       # all courses in CS
dept.courses.filter(lecturer__isnull=False)  # courses with a lecturer assigned

# Traverse in filter — find depts with any course:
Department.objects.filter(courses__isnull=False).distinct()`,
      explanation: 'related_name gives you the reverse accessor. Use plural model name as convention. Traverse the relation in filters with __ notation.'
    },
    guided: {
      instructions: 'Fix the related_name values so the reverse accessor code at the bottom works.',
      language: 'python',
      starterCode: `from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)

class Issue(models.Model):
    title = models.CharField(max_length=200)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name='___________'   # so project.issues.all() works
    )

# This should work after your fix:
# project = Project.objects.get(pk=1)
# project.issues.all()`,
      solution: `from django.db import models

class Project(models.Model):
    name = models.CharField(max_length=200)

class Issue(models.Model):
    title = models.CharField(max_length=200)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name='issues'
    )`,
      evalChecks: [
        {
          id: 'related_name_issues',
          description: "related_name set to 'issues'",
          test: (code) => /related_name\s*=\s*['"]issues['"]/.test(code),
          points: 60,
          failFeedback: "related_name='issues' — this creates project.issues as the reverse accessor"
        },
        {
          id: 'fk_defined',
          description: 'ForeignKey to Project defined',
          test: (code) => /ForeignKey\s*\(\s*Project/.test(code),
          points: 40,
          failFeedback: 'ForeignKey(Project, on_delete=models.CASCADE, related_name="issues")'
        }
      ]
    },
    challenge: {
      instructions: `Write models for a university with:
- \`Faculty\` — name CharField max 100
- \`Department\` — name CharField, ForeignKey to Faculty with related_name='departments'
- \`Student\` — first_name, reg_number (unique), ForeignKey to Department with related_name='students'

Then write queries:
1. Get all departments in a faculty named 'Science'
2. Get all students in department with id=3
3. Get all faculties that have at least one department (use filter with departments__)`,
      language: 'python',
      starterCode: `from django.db import models\n\n# Write Faculty, Department, Student models\n\n\n# Then write the three queries\n`,
      solution: `from django.db import models

class Faculty(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Department(models.Model):
    name = models.CharField(max_length=100)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='departments')

    def __str__(self):
        return self.name

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    reg_number = models.CharField(max_length=20, unique=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='students')

    def __str__(self):
        return self.reg_number

# 1.
science_depts = Department.objects.filter(faculty__name='Science')

# 2.
dept3_students = Student.objects.filter(department__id=3)

# 3.
faculties_with_depts = Faculty.objects.filter(departments__isnull=False).distinct()`,
      evalChecks: [
        {
          id: 'faculty_model',
          description: 'Faculty model defined',
          test: (code) => /class\s+Faculty\s*\(\s*models\.Model\s*\)/.test(code),
          points: 10,
          failFeedback: 'class Faculty(models.Model): with a name field'
        },
        {
          id: 'dept_fk',
          description: 'Department has ForeignKey to Faculty with related_name',
          test: (code) => /class\s+Department[\s\S]*?ForeignKey\s*\(\s*Faculty[\s\S]*?related_name\s*=\s*['"]departments['"]/.test(code),
          points: 25,
          failFeedback: 'Department needs: faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="departments")'
        },
        {
          id: 'student_fk',
          description: 'Student has ForeignKey to Department with related_name',
          test: (code) => /class\s+Student[\s\S]*?ForeignKey\s*\(\s*Department[\s\S]*?related_name\s*=\s*['"]students['"]/.test(code),
          points: 25,
          failFeedback: 'Student needs: department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="students")'
        },
        {
          id: 'traverse_filter',
          description: 'Uses __ to traverse relationship in a filter',
          test: (code) => /filter\s*\(.*faculty__name|filter\s*\(.*department__id|filter\s*\(.*departments__/.test(code),
          points: 40,
          failFeedback: 'Use __ to traverse: filter(faculty__name="Science") or filter(departments__isnull=False)'
        }
      ]
    },
    hints: [
      "related_name='departments' means you can do faculty.departments.all()",
      'Use the plural of the child model name as the related_name — it reads naturally',
      'Traverse relationships in filters: filter(department__name="CS") crosses the FK',
      ".distinct() prevents duplicate rows when filtering through a reverse relation"
    ],
    docs: [
      {
        heading: 'related_name convention',
        content: 'Always set related_name to the plural of the child model.',
        code: `class Issue(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE,
        related_name='issues'    # plural of Issue
    )

# Then use it:
project.issues.all()
project.issues.filter(is_resolved=False)
project.issues.count()`
      },
      {
        heading: 'Traversing relations in filters',
        content: 'Use __ to follow FK chains in filter() and order_by().',
        code: `# Forward: through a FK
Issue.objects.filter(project__name='Website')

# Reverse: through related_name
Project.objects.filter(issues__priority='H')

# Multi-hop: through two FKs
Student.objects.filter(department__faculty__name='Science')`
      }
    ],
    prerequisite: 13
  }
];
