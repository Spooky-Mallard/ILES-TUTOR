export const module1 = [
  {
    id: 1,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'Python Classes & Inheritance',
    topic: 'What class means, why we write class X(Y), what self is',
    concept: `## What is a class in Python?

A **class** is a blueprint for creating objects. Think of it like a cookie cutter — the cutter is the class, each cookie it makes is an **instance** (object) of that class.

\`\`\`python
class Dog:
    pass
\`\`\`

That defines a Dog blueprint. \`Dog()\` creates one actual dog.

## What is self?

When you write a method inside a class, Python automatically passes the object itself as the first argument. By convention we name it \`self\`.

\`\`\`python
class Dog:
    def bark(self):
        print("Woof!")

rex = Dog()
rex.bark()  # Python translates this to: Dog.bark(rex)
\`\`\`

\`self\` IS the specific dog. Without it, the method wouldn't know which dog you're talking about.

## What is inheritance?

Inheritance means "take everything from that other class, plus add my own stuff."

\`\`\`python
class Animal:
    def breathe(self):
        print("breathing...")

class Dog(Animal):   # Dog inherits from Animal
    def bark(self):
        print("Woof!")
\`\`\`

Dog gets \`breathe()\` for free — it didn't have to define it. The \`(Animal)\` in parentheses is the syntax that enables this.

## Why Django uses this

Django's \`models.Model\` is a class packed with database-handling code: SQL generation, \`.save()\`, \`.delete()\`, query methods. When you write \`class Student(models.Model)\`, your Student class inherits ALL of that instantly. You only write the fields — Django handles the rest.`,
    annotatedExample: {
      language: 'python',
      code: `# A plain Python class — no Django yet
class Vehicle:
    # __init__ runs when you create an instance: Vehicle(...)
    def __init__(self, make, speed):
        self.make = make      # store on the object itself
        self.speed = speed

    def describe(self):       # 'self' = the specific vehicle
        return f"{self.make} goes {self.speed}mph"

# Car inherits Vehicle — gets __init__ and describe() for free
class Car(Vehicle):
    def honk(self):           # Car adds its own method
        return "Beep!"

my_car = Car("Toyota", 120)  # creates instance, runs __init__
print(my_car.describe())     # inherited from Vehicle → "Toyota goes 120mph"
print(my_car.honk())         # Car's own method → "Beep!"`,
      explanation: 'Vehicle defines shared behavior. Car inherits it. my_car is one specific Car instance.'
    },
    guided: {
      instructions: 'Fill in the blanks to complete the Animal and Dog classes.',
      language: 'python',
      starterCode: `class Animal:
    def __init__(self, name):
        ___________ = name     # store name on the object

    def speak(self):
        return "..."

class Dog(___________):        # inherit from Animal
    def speak(___________):    # receives the object itself
        return f"{self.name} says Woof!"`,
      solution: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"`,
      evalChecks: [
        {
          id: 'self_name',
          description: 'Assigns self.name in __init__',
          test: (code) => /self\.name\s*=\s*name/.test(code),
          points: 35,
          failFeedback: 'Inside __init__, store the name with: self.name = name'
        },
        {
          id: 'inherits_animal',
          description: 'Dog inherits from Animal',
          test: (code) => /class\s+Dog\s*\(\s*Animal\s*\)/.test(code),
          points: 35,
          failFeedback: 'Dog must inherit from Animal: class Dog(Animal):'
        },
        {
          id: 'speak_self',
          description: 'speak method takes self parameter',
          test: (code) => /def\s+speak\s*\(\s*self\s*\)/.test(code),
          points: 30,
          failFeedback: 'Methods inside a class must have self as the first parameter: def speak(self):'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`Shape\` class with an \`__init__\` that takes \`color\`, and a \`describe\` method that returns \`"A {color} shape"\`.

Then write a \`Circle\` class that:
- Inherits from \`Shape\`
- Has its own \`__init__\` that takes \`color\` and \`radius\`, calls \`Shape.__init__\` via \`super()\`, and stores \`self.radius\`
- Has an \`area\` method that returns \`3.14 * self.radius ** 2\``,
      language: 'python',
      starterCode: `# Write Shape and Circle here\n`,
      solution: `class Shape:
    def __init__(self, color):
        self.color = color

    def describe(self):
        return f"A {self.color} shape"

class Circle(Shape):
    def __init__(self, color, radius):
        super().__init__(color)
        self.radius = radius

    def area(self):
        return 3.14 * self.radius ** 2`,
      evalChecks: [
        {
          id: 'shape_class',
          description: 'Shape class defined with __init__ taking color',
          test: (code) => /class\s+Shape/.test(code) && /def\s+__init__\s*\(\s*self\s*,\s*color\s*\)/.test(code),
          points: 20,
          failFeedback: 'Define: class Shape: with def __init__(self, color):'
        },
        {
          id: 'self_color',
          description: 'Stores self.color in Shape.__init__',
          test: (code) => /self\.color\s*=\s*color/.test(code),
          points: 15,
          failFeedback: 'Store the color: self.color = color inside Shape.__init__'
        },
        {
          id: 'describe_method',
          description: 'describe method returns string with color',
          test: (code) => /def\s+describe\s*\(\s*self\s*\)[\s\S]*?return[\s\S]*?self\.color/.test(code),
          points: 15,
          failFeedback: 'Add: def describe(self): return f"A {self.color} shape"'
        },
        {
          id: 'circle_inherits',
          description: 'Circle inherits from Shape',
          test: (code) => /class\s+Circle\s*\(\s*Shape\s*\)/.test(code),
          points: 20,
          failFeedback: 'class Circle(Shape): — put Shape in the parentheses'
        },
        {
          id: 'super_call',
          description: 'Circle calls super().__init__',
          test: (code) => /super\s*\(\s*\)\s*\.\s*__init__\s*\(/.test(code),
          points: 15,
          failFeedback: 'Call super().__init__(color) inside Circle.__init__ to initialise the parent'
        },
        {
          id: 'area_method',
          description: 'area method uses self.radius',
          test: (code) => /def\s+area\s*\(\s*self\s*\)[\s\S]*?self\.radius/.test(code),
          points: 15,
          failFeedback: 'Add: def area(self): return 3.14 * self.radius ** 2'
        }
      ]
    },
    hints: [
      'self.name = name — the left side is on the object, the right side is the parameter',
      'To inherit: put the parent class name in parentheses: class Dog(Animal):',
      'Every instance method must have self as its first parameter',
      'super().__init__(...) calls the parent class initialiser — use it in Circle to set self.color'
    ],
    docs: [
      {
        heading: 'Class and instance syntax',
        content: 'Key syntax patterns for defining and using classes.',
        code: `class MyClass(ParentClass):
    def __init__(self, value):
        self.value = value   # instance attribute

    def method(self):
        return self.value

obj = MyClass(42)    # create instance
obj.method()         # call instance method → 42`
      },
      {
        heading: 'super() — calling the parent',
        content: 'Use super() to call a method from the parent class without naming it directly.',
        code: `class Child(Parent):
    def __init__(self, x, y):
        super().__init__(x)  # run Parent.__init__
        self.y = y`
      },
      {
        heading: 'self — what it is',
        content: 'self is the instance the method was called on. Python passes it automatically.',
        code: `rex = Dog("Rex")
rex.bark()
# Python translates to: Dog.bark(rex)
# Inside bark: self IS rex`
      }
    ],
    prerequisite: null
  },

  {
    id: 2,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'Your First Django Model',
    topic: 'models.Model, field types, how a class becomes a DB table',
    concept: `## What is a Django model?

A **model** is a Python class that maps to a database table. When you define a model, Django can create the corresponding SQL table automatically.

\`\`\`python
from django.db import models

class Department(models.Model):
    name = models.CharField(max_length=100)
\`\`\`

This creates a table with two columns: \`id\` (auto-added by Django) and \`name\`.

## Why inherit from models.Model?

\`models.Model\` is a class Django provides. It contains all the logic for talking to the database. By inheriting from it, your class gets:

- \`.save()\` — write this object to the DB
- \`.delete()\` — remove it
- \`.objects\` — query the table
- Automatic \`id\` primary key field

You write just the fields. Django handles the SQL.

## Field types

Each class attribute that's a \`models.XxxField()\` becomes a column:

| Python | SQL |
|--------|-----|
| \`CharField(max_length=n)\` | VARCHAR(n) |
| \`TextField()\` | TEXT |
| \`IntegerField()\` | INTEGER |
| \`BooleanField()\` | BOOLEAN |
| \`DateField()\` | DATE |

## The id field

Django adds \`id = models.AutoField(primary_key=True)\` automatically. You don't write it. Every record gets a unique integer id.`,
    annotatedExample: {
      language: 'python',
      code: `# models.py
from django.db import models  # always import this first

# Inheriting models.Model gives this class all ORM powers
class Department(models.Model):
    # CharField = short text, max_length is REQUIRED
    name = models.CharField(max_length=100)

    # TextField = long text, no length limit needed
    description = models.TextField(blank=True)

    # IntegerField = whole numbers
    budget = models.IntegerField(default=0)

    # BooleanField = True/False
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name  # how this object appears as text`,
      explanation: 'Each field becomes a table column. Django auto-adds an id column. models.Model provides all DB operations.'
    },
    guided: {
      instructions: 'Fill in the blanks to create a Course model with name, credits, and is_active fields.',
      language: 'python',
      starterCode: `from django.db import ___________

class Course(models.___________):
    name = models.CharField(max_length=___________)
    credits = models.___________(default=3)
    is_active = models.BooleanField(default=___________)

    def __str__(self):
        return self.name`,
      solution: `from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=200)
    credits = models.IntegerField(default=3)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name`,
      evalChecks: [
        {
          id: 'imports_models',
          description: 'Imports models from django.db',
          test: (code) => /from\s+django\.db\s+import\s+models/.test(code),
          points: 20,
          failFeedback: 'Start with: from django.db import models'
        },
        {
          id: 'inherits_model',
          description: 'Class inherits from models.Model',
          test: (code) => /class\s+\w+\s*\(\s*models\.Model\s*\)/.test(code),
          points: 30,
          failFeedback: 'Your class needs to inherit: class Course(models.Model):'
        },
        {
          id: 'charfield',
          description: 'name is a CharField with max_length',
          test: (code) => /name\s*=\s*models\.CharField\s*\(.*max_length\s*=\s*\d+/.test(code),
          points: 25,
          failFeedback: 'CharField requires max_length: models.CharField(max_length=200)'
        },
        {
          id: 'integerfield',
          description: 'credits is an IntegerField',
          test: (code) => /credits\s*=\s*models\.IntegerField\s*\(/.test(code),
          points: 25,
          failFeedback: 'Use models.IntegerField() for whole numbers'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`Lecturer\` model with:
- \`full_name\` — short text, max 150 chars
- \`email\` — short text, max 254 chars, must be unique
- \`years_experience\` — integer, default 0
- \`is_active\` — boolean, default True

Add \`__str__\` returning \`self.full_name\`.`,
      language: 'python',
      starterCode: `from django.db import models\n\n# Write Lecturer model here\n`,
      solution: `from django.db import models

class Lecturer(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254, unique=True)
    years_experience = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.full_name`,
      evalChecks: [
        {
          id: 'inherits_model',
          description: 'Lecturer class inherits models.Model',
          test: (code) => /class\s+Lecturer\s*\(\s*models\.Model\s*\)/.test(code),
          points: 20,
          failFeedback: 'class Lecturer(models.Model):'
        },
        {
          id: 'full_name',
          description: 'full_name is a CharField with max_length',
          test: (code) => /full_name\s*=\s*models\.CharField\s*\(.*max_length\s*=\s*\d+/.test(code),
          points: 20,
          failFeedback: 'full_name = models.CharField(max_length=150)'
        },
        {
          id: 'email_unique',
          description: 'email CharField has unique=True',
          test: (code) => /email\s*=\s*models\.CharField\s*\(.*unique\s*=\s*True/.test(code),
          points: 20,
          failFeedback: 'email needs unique=True: models.CharField(max_length=254, unique=True)'
        },
        {
          id: 'integer_field',
          description: 'years_experience is an IntegerField',
          test: (code) => /years_experience\s*=\s*models\.IntegerField\s*\(/.test(code),
          points: 20,
          failFeedback: 'years_experience = models.IntegerField(default=0)'
        },
        {
          id: 'str_method',
          description: '__str__ returns self.full_name',
          test: (code) => /def\s+__str__[\s\S]*?return\s+self\.full_name/.test(code),
          points: 20,
          failFeedback: 'Add: def __str__(self): return self.full_name'
        }
      ]
    },
    hints: [
      'Every model file starts with: from django.db import models',
      'The class must inherit models.Model — that is what gives it database powers',
      'CharField always needs max_length=N — Django will error without it',
      'unique=True goes inside the field parentheses as a keyword argument'
    ],
    docs: [
      {
        heading: 'Model boilerplate',
        content: 'The minimal structure every model follows.',
        code: `from django.db import models

class MyModel(models.Model):
    field_name = models.FieldType(options)

    def __str__(self):
        return self.field_name`
      },
      {
        heading: 'Common field types',
        content: 'The most-used field types and their SQL equivalents.',
        code: `CharField(max_length=n)  → VARCHAR(n)
TextField()              → TEXT
IntegerField()           → INTEGER
BooleanField()           → BOOLEAN
DateField()              → DATE
DateTimeField()          → DATETIME`
      }
    ],
    prerequisite: 1
  },

  {
    id: 3,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'The __str__ Method',
    topic: "Python's string protocol, why the admin needs it",
    concept: `## The problem without __str__

Open Django's admin panel and look at a list of Department objects without \`__str__\` defined:

\`\`\`
Department object (1)
Department object (2)
Department object (3)
\`\`\`

Useless. You can't tell them apart.

## What __str__ does

\`__str__\` is Python's protocol for "how should this object look when printed as text?" It must return a string.

\`\`\`python
def __str__(self):
    return self.name
\`\`\`

Now the admin shows:

\`\`\`
Engineering
Computer Science
Mathematics
\`\`\`

## It's a dunder method

The double underscores (dunder = double under) mean this is a special Python method with a specific purpose. Python itself calls it when it needs a string representation — when you \`print(obj)\`, use it in an f-string, or display it in the admin.

## Return type must be str

If you return something that isn't a string, you'll get a TypeError. If you want to include a number, convert it:

\`\`\`python
def __str__(self):
    return f"{self.name} (id: {self.id})"  # f-string converts id to str
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from django.db import models

class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    reg_number = models.CharField(max_length=20, unique=True)

    # Python calls this whenever it needs a string version of this object
    def __str__(self):
        # f-string combines multiple fields into one readable string
        return f"{self.reg_number} — {self.last_name}, {self.first_name}"

# In admin:   22/U/0001 — Nakato, Sarah
# In shell:   print(student) → 22/U/0001 — Nakato, Sarah
# Without it: Student object (1)`,
      explanation: '__str__ must return a str. Use self.field_name to access the object\'s data. f-strings are the cleanest way to combine fields.'
    },
    guided: {
      instructions: 'Fill in the __str__ method to return a readable string for each model.',
      language: 'python',
      starterCode: `from django.db import models

class Course(models.Model):
    code = models.CharField(max_length=10)
    title = models.CharField(max_length=200)

    def ___________(self):           # the dunder method name
        return f"{___________}: {self.title}"  # e.g. "CSC1202: Software Dev"`,
      solution: `from django.db import models

class Course(models.Model):
    code = models.CharField(max_length=10)
    title = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.code}: {self.title}"`,
      evalChecks: [
        {
          id: 'str_defined',
          description: 'Defines __str__ method',
          test: (code) => /def\s+__str__\s*\(\s*self\s*\)/.test(code),
          points: 40,
          failFeedback: 'Define the method: def __str__(self):'
        },
        {
          id: 'returns_string',
          description: '__str__ returns a value using self fields',
          test: (code) => /def\s+__str__[\s\S]*?return\s+.+self\.\w+/.test(code),
          points: 35,
          failFeedback: '__str__ must return something — use: return f"{self.code}: {self.title}"'
        },
        {
          id: 'uses_code',
          description: 'Uses self.code in the return',
          test: (code) => /def\s+__str__[\s\S]*?return[\s\S]*?self\.code/.test(code),
          points: 25,
          failFeedback: 'Include self.code in what you return'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`Module\` model with fields:
- \`code\` — CharField max 10
- \`title\` — CharField max 200
- \`credit_units\` — IntegerField default 3

Add \`__str__\` that returns: \`"{code} — {title} ({credit_units} CU)"\`
For example: \`"CSC1202 — Software Dev (3 CU)"\``,
      language: 'python',
      starterCode: `from django.db import models\n\n# Write Module model here\n`,
      solution: `from django.db import models

class Module(models.Model):
    code = models.CharField(max_length=10)
    title = models.CharField(max_length=200)
    credit_units = models.IntegerField(default=3)

    def __str__(self):
        return f"{self.code} — {self.title} ({self.credit_units} CU)"`,
      evalChecks: [
        {
          id: 'model_defined',
          description: 'Module class inherits models.Model',
          test: (code) => /class\s+Module\s*\(\s*models\.Model\s*\)/.test(code),
          points: 15,
          failFeedback: 'class Module(models.Model):'
        },
        {
          id: 'code_field',
          description: 'code CharField defined',
          test: (code) => /code\s*=\s*models\.CharField\s*\(/.test(code),
          points: 15,
          failFeedback: 'code = models.CharField(max_length=10)'
        },
        {
          id: 'title_field',
          description: 'title CharField defined',
          test: (code) => /title\s*=\s*models\.CharField\s*\(/.test(code),
          points: 15,
          failFeedback: 'title = models.CharField(max_length=200)'
        },
        {
          id: 'credits_field',
          description: 'credit_units IntegerField defined',
          test: (code) => /credit_units\s*=\s*models\.IntegerField\s*\(/.test(code),
          points: 15,
          failFeedback: 'credit_units = models.IntegerField(default=3)'
        },
        {
          id: 'str_defined',
          description: '__str__ method defined',
          test: (code) => /def\s+__str__\s*\(\s*self\s*\)/.test(code),
          points: 20,
          failFeedback: 'Add: def __str__(self):'
        },
        {
          id: 'str_uses_all_fields',
          description: '__str__ includes code, title, and credit_units',
          test: (code) => {
            const strBlock = code.match(/def\s+__str__[\s\S]*?return\s+(.+)/);
            if (!strBlock) return false;
            const ret = strBlock[1];
            return /self\.code/.test(ret) && /self\.title/.test(ret) && /self\.credit_units/.test(ret);
          },
          points: 20,
          failFeedback: 'Your __str__ return must include self.code, self.title, and self.credit_units'
        }
      ]
    },
    hints: [
      'The method name is __str__ — two underscores on each side',
      'It must have (self) as its parameter',
      'It must return a string — use an f-string: return f"{self.code}"',
      'You can include multiple fields: return f"{self.code}: {self.title}"'
    ],
    docs: [
      {
        heading: '__str__ method',
        content: 'Python calls __str__ when it needs a text representation of your object.',
        code: `def __str__(self):
    return self.name

# Django admin shows:  Engineering
# print(obj) shows:    Engineering
# Without it:          <Department: Department object (1)>`
      },
      {
        heading: 'f-strings for combining fields',
        content: 'Use f-strings to build readable strings from multiple fields.',
        code: `def __str__(self):
    return f"{self.reg_number} — {self.last_name}"
# → "22/U/0001 — Nakato"

def __str__(self):
    return f"{self.code} ({self.credit_units} CU)"
# → "CSC1202 (3 CU)"`
      }
    ],
    prerequisite: 2
  },

  {
    id: 4,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'All the Field Types',
    topic: 'CharField, TextField, IntegerField, BooleanField, DateField, DateTimeField with SQL equivalents',
    concept: `## Why there are different field types

SQL databases have strict column types — a VARCHAR column can't store a DATE. Django's field types map your Python values to the right SQL type automatically.

## The main field types

### CharField — short text
\`\`\`python
name = models.CharField(max_length=100)
\`\`\`
SQL: \`VARCHAR(100)\`. For names, codes, short descriptions. **max_length is required.**

### TextField — long text
\`\`\`python
bio = models.TextField()
\`\`\`
SQL: \`TEXT\`. No length limit. For paragraphs, articles, descriptions.

### IntegerField — whole numbers
\`\`\`python
age = models.IntegerField()
\`\`\`
SQL: \`INTEGER\`. No decimals.

### FloatField / DecimalField — decimals
\`\`\`python
gpa = models.FloatField()
price = models.DecimalField(max_digits=6, decimal_places=2)
\`\`\`
Use DecimalField for money (exact). FloatField for scientific values (approximate).

### BooleanField — True/False
\`\`\`python
is_active = models.BooleanField(default=True)
\`\`\`
SQL: \`BOOLEAN\`.

### DateField — just the date
\`\`\`python
birth_date = models.DateField()
\`\`\`
SQL: \`DATE\`. Stores year, month, day only.

### DateTimeField — date + time
\`\`\`python
created_at = models.DateTimeField(auto_now_add=True)
\`\`\`
SQL: \`DATETIME\`. Stores date AND time down to microseconds.

## auto_now_add vs auto_now

- \`auto_now_add=True\` — set once when record is created, never changes
- \`auto_now=True\` — updated every time \`.save()\` is called`,
    annotatedExample: {
      language: 'python',
      code: `from django.db import models

class Assignment(models.Model):
    # CharField → VARCHAR(200) — short text, max_length required
    title = models.CharField(max_length=200)

    # TextField → TEXT — unlimited length for the question body
    description = models.TextField()

    # IntegerField → INTEGER — whole number marks
    total_marks = models.IntegerField(default=100)

    # FloatField → REAL — decimal grade percentage
    pass_mark = models.FloatField(default=50.0)

    # BooleanField → BOOLEAN — simple flag
    is_published = models.BooleanField(default=False)

    # DateField → DATE — just the date, no time
    due_date = models.DateField()

    # DateTimeField with auto_now_add → set once on creation
    created_at = models.DateTimeField(auto_now_add=True)

    # DateTimeField with auto_now → updates every save()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title`,
      explanation: 'Each field type maps to a specific SQL column type. Django handles the translation so you never write SQL directly.'
    },
    guided: {
      instructions: 'Choose the correct field type for each attribute of this Exam model.',
      language: 'python',
      starterCode: `from django.db import models

class Exam(models.Model):
    # Short text — course code like "CSC1202"
    course_code = models.___________Field(max_length=20)

    # Long text — exam instructions paragraph
    instructions = models.___________Field()

    # Whole number — how many questions
    num_questions = models.___________Field(default=20)

    # True/False — whether results are out
    results_released = models.___________Field(default=False)

    # Date only — when the exam happens
    exam_date = models.___________Field()

    def __str__(self):
        return self.course_code`,
      solution: `from django.db import models

class Exam(models.Model):
    course_code = models.CharField(max_length=20)
    instructions = models.TextField()
    num_questions = models.IntegerField(default=20)
    results_released = models.BooleanField(default=False)
    exam_date = models.DateField()

    def __str__(self):
        return self.course_code`,
      evalChecks: [
        {
          id: 'charfield',
          description: 'course_code uses CharField',
          test: (code) => /course_code\s*=\s*models\.CharField\s*\(/.test(code),
          points: 20,
          failFeedback: 'Short text uses CharField: models.CharField(max_length=20)'
        },
        {
          id: 'textfield',
          description: 'instructions uses TextField',
          test: (code) => /instructions\s*=\s*models\.TextField\s*\(/.test(code),
          points: 20,
          failFeedback: 'Long text uses TextField: models.TextField()'
        },
        {
          id: 'integerfield',
          description: 'num_questions uses IntegerField',
          test: (code) => /num_questions\s*=\s*models\.IntegerField\s*\(/.test(code),
          points: 20,
          failFeedback: 'Whole numbers use IntegerField: models.IntegerField(default=20)'
        },
        {
          id: 'booleanfield',
          description: 'results_released uses BooleanField',
          test: (code) => /results_released\s*=\s*models\.BooleanField\s*\(/.test(code),
          points: 20,
          failFeedback: 'True/False uses BooleanField: models.BooleanField(default=False)'
        },
        {
          id: 'datefield',
          description: 'exam_date uses DateField',
          test: (code) => /exam_date\s*=\s*models\.DateField\s*\(/.test(code),
          points: 20,
          failFeedback: 'Date-only values use DateField: models.DateField()'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`StudentResult\` model with:
- \`student_name\` — short text, max 100 chars
- \`course_code\` — short text, max 10 chars
- \`score\` — decimal number (max_digits=5, decimal_places=2)
- \`grade\` — short text, max 2 chars (e.g. "A", "B+")
- \`passed\` — boolean, default False
- \`recorded_at\` — datetime, auto-set on creation

Add \`__str__\` returning \`"{student_name} — {course_code}: {grade}"\`.`,
      language: 'python',
      starterCode: `from django.db import models\n\n# Write StudentResult model here\n`,
      solution: `from django.db import models

class StudentResult(models.Model):
    student_name = models.CharField(max_length=100)
    course_code = models.CharField(max_length=10)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=2)
    passed = models.BooleanField(default=False)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} — {self.course_code}: {self.grade}"`,
      evalChecks: [
        {
          id: 'model_class',
          description: 'StudentResult class inherits models.Model',
          test: (code) => /class\s+StudentResult\s*\(\s*models\.Model\s*\)/.test(code),
          points: 10,
          failFeedback: 'class StudentResult(models.Model):'
        },
        {
          id: 'student_name',
          description: 'student_name is a CharField',
          test: (code) => /student_name\s*=\s*models\.CharField\s*\(.*max_length\s*=\s*\d+/.test(code),
          points: 15,
          failFeedback: 'student_name = models.CharField(max_length=100)'
        },
        {
          id: 'decimal_field',
          description: 'score uses DecimalField with max_digits and decimal_places',
          test: (code) => /score\s*=\s*models\.DecimalField\s*\(.*max_digits.*decimal_places|score\s*=\s*models\.DecimalField\s*\(.*decimal_places.*max_digits/.test(code),
          points: 20,
          failFeedback: 'score = models.DecimalField(max_digits=5, decimal_places=2)'
        },
        {
          id: 'boolean_field',
          description: 'passed uses BooleanField',
          test: (code) => /passed\s*=\s*models\.BooleanField\s*\(/.test(code),
          points: 15,
          failFeedback: 'passed = models.BooleanField(default=False)'
        },
        {
          id: 'datetime_auto',
          description: 'recorded_at uses DateTimeField with auto_now_add',
          test: (code) => /recorded_at\s*=\s*models\.DateTimeField\s*\(.*auto_now_add\s*=\s*True/.test(code),
          points: 20,
          failFeedback: 'recorded_at = models.DateTimeField(auto_now_add=True)'
        },
        {
          id: 'str_method',
          description: '__str__ defined and returns string with student fields',
          test: (code) => /def\s+__str__[\s\S]*?return[\s\S]*?self\.student_name/.test(code),
          points: 20,
          failFeedback: 'Add __str__ that returns a string including self.student_name'
        }
      ]
    },
    hints: [
      'CharField for short text (names, codes) — always needs max_length',
      'TextField for long text (descriptions, paragraphs) — no max_length needed',
      'IntegerField for whole numbers, DecimalField for precise decimals',
      'DateTimeField(auto_now_add=True) sets the timestamp once when the record is created'
    ],
    docs: [
      {
        heading: 'Field type reference',
        content: 'Quick mapping of Python field types to SQL column types.',
        code: `CharField(max_length=n)              → VARCHAR(n)
TextField()                          → TEXT
IntegerField()                       → INTEGER
FloatField()                         → REAL
DecimalField(max_digits, decimal_places) → DECIMAL
BooleanField()                       → BOOLEAN
DateField()                          → DATE
DateTimeField()                      → DATETIME`
      },
      {
        heading: 'auto_now_add vs auto_now',
        content: 'Two options for automatic timestamps.',
        code: `# Set ONCE on creation, never changes:
created_at = models.DateTimeField(auto_now_add=True)

# Updated EVERY time .save() is called:
updated_at = models.DateTimeField(auto_now=True)`
      }
    ],
    prerequisite: 3
  },

  {
    id: 5,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'Field Options',
    topic: 'max_length, null, blank, default, unique, choices — what each does',
    concept: `## Field options (kwargs) modify how a field behaves

Every Django field accepts keyword arguments that change its constraints and defaults.

### max_length
Required for CharField. Sets the maximum number of characters.
\`\`\`python
name = models.CharField(max_length=100)
\`\`\`

### null
Controls whether the database column can store NULL. Default: \`False\`.
\`\`\`python
middle_name = models.CharField(max_length=50, null=True)
\`\`\`
SQL: allows NULL in that column.

### blank
Controls whether Django's form validation allows an empty value. Default: \`False\`.
\`\`\`python
bio = models.TextField(blank=True)
\`\`\`
**Rule of thumb**: Use \`blank=True, null=True\` together for optional text fields. Use \`blank=True\` alone (no null) for optional CharFields and TextFields (empty string '' is better than NULL for text).

### default
Sets the value when none is provided.
\`\`\`python
credits = models.IntegerField(default=3)
is_active = models.BooleanField(default=True)
\`\`\`

### unique
Prevents duplicate values in the column.
\`\`\`python
email = models.CharField(max_length=254, unique=True)
\`\`\`
SQL: adds a UNIQUE constraint to the column.

### choices
Restricts values to a defined list. Shows a dropdown in the admin.
\`\`\`python
YEAR_CHOICES = [
    ('Y1', 'Year 1'),
    ('Y2', 'Year 2'),
    ('Y3', 'Year 3'),
    ('Y4', 'Year 4'),
]
year = models.CharField(max_length=2, choices=YEAR_CHOICES, default='Y1')
\`\`\`
Each choice is \`(stored_value, display_label)\`.`,
    annotatedExample: {
      language: 'python',
      code: `from django.db import models

class Student(models.Model):
    # Required fields — no null, no blank, no default
    first_name = models.CharField(max_length=100)
    reg_number = models.CharField(max_length=20, unique=True)  # no duplicates

    # Optional field — blank allows empty in forms, null allows NULL in DB
    middle_name = models.CharField(max_length=100, blank=True, null=True)

    # Field with a default — if not provided, uses 'Y1'
    YEAR_CHOICES = [
        ('Y1', 'Year 1'),
        ('Y2', 'Year 2'),
        ('Y3', 'Year 3'),
        ('Y4', 'Year 4'),
    ]
    year = models.CharField(max_length=2, choices=YEAR_CHOICES, default='Y1')

    # Boolean with default — every student starts active
    is_enrolled = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.reg_number} — {self.first_name}"`,
      explanation: 'null controls the DB column, blank controls form validation. choices limits allowed values. unique adds a DB constraint.'
    },
    guided: {
      instructions: 'Add the correct field options to each field as described in the comments.',
      language: 'python',
      starterCode: `from django.db import models

class Application(models.Model):
    # Must be unique — no two applications with same ref
    reference = models.CharField(max_length=20, ___________)

    # Optional field — can be left empty
    notes = models.TextField(___________, ___________)

    # Default value of False
    is_approved = models.BooleanField(___________)

    # Limited to these statuses
    STATUS = [('P', 'Pending'), ('A', 'Approved'), ('R', 'Rejected')]
    status = models.CharField(max_length=1, ___________, default='P')

    def __str__(self):
        return self.reference`,
      solution: `from django.db import models

class Application(models.Model):
    reference = models.CharField(max_length=20, unique=True)
    notes = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    STATUS = [('P', 'Pending'), ('A', 'Approved'), ('R', 'Rejected')]
    status = models.CharField(max_length=1, choices=STATUS, default='P')

    def __str__(self):
        return self.reference`,
      evalChecks: [
        {
          id: 'unique',
          description: 'reference field has unique=True',
          test: (code) => /reference\s*=\s*models\.CharField\s*\(.*unique\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'Add unique=True inside the CharField parentheses for reference'
        },
        {
          id: 'blank_null',
          description: 'notes has blank=True and null=True',
          test: (code) => /notes\s*=\s*models\.TextField\s*\(.*blank\s*=\s*True/.test(code) && /notes\s*=\s*models\.TextField\s*\(.*null\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'Optional text fields need both blank=True and null=True'
        },
        {
          id: 'default_bool',
          description: 'is_approved has default=False',
          test: (code) => /is_approved\s*=\s*models\.BooleanField\s*\(.*default\s*=\s*False/.test(code),
          points: 25,
          failFeedback: 'is_approved = models.BooleanField(default=False)'
        },
        {
          id: 'choices',
          description: 'status field has choices argument',
          test: (code) => /status\s*=\s*models\.CharField\s*\(.*choices\s*=/.test(code),
          points: 25,
          failFeedback: 'Add choices=STATUS inside the status CharField parentheses'
        }
      ]
    },
    challenge: {
      instructions: `Write an \`Issue\` model for a bug tracker with:
- \`title\` — required CharField, max 200 chars
- \`description\` — optional TextField (can be blank or null)
- \`priority\` — CharField with choices: \`('L','Low'), ('M','Medium'), ('H','High')\`, default \`'M'\`
- \`is_resolved\` — BooleanField, default False
- \`created_at\` — DateTimeField, auto-set on creation

\`__str__\` returns \`"[{priority}] {title}"\`.`,
      language: 'python',
      starterCode: `from django.db import models\n\n# Write Issue model here\n`,
      solution: `from django.db import models

class Issue(models.Model):
    PRIORITY_CHOICES = [
        ('L', 'Low'),
        ('M', 'Medium'),
        ('H', 'High'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default='M')
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.priority}] {self.title}"`,
      evalChecks: [
        {
          id: 'model_class',
          description: 'Issue class inherits models.Model',
          test: (code) => /class\s+Issue\s*\(\s*models\.Model\s*\)/.test(code),
          points: 10,
          failFeedback: 'class Issue(models.Model):'
        },
        {
          id: 'title_field',
          description: 'title is a CharField',
          test: (code) => /title\s*=\s*models\.CharField\s*\(.*max_length\s*=\s*\d+/.test(code),
          points: 10,
          failFeedback: 'title = models.CharField(max_length=200)'
        },
        {
          id: 'optional_description',
          description: 'description is optional (blank=True)',
          test: (code) => /description\s*=\s*models\.TextField\s*\(.*blank\s*=\s*True/.test(code),
          points: 20,
          failFeedback: 'description = models.TextField(blank=True, null=True)'
        },
        {
          id: 'choices_defined',
          description: 'priority choices list defined',
          test: (code) => /\[\s*\(.*'L'.*\)[\s\S]*?\(.*'M'.*\)[\s\S]*?\(.*'H'.*\)\s*\]/.test(code) || /choices.*=.*\[/.test(code),
          points: 20,
          failFeedback: 'Define a choices list with L/M/H options and assign it to choices= in the priority field'
        },
        {
          id: 'priority_field',
          description: 'priority has choices and default',
          test: (code) => /priority\s*=\s*models\.CharField\s*\(.*choices\s*=/.test(code) && /priority\s*=\s*models\.CharField\s*\(.*default\s*=/.test(code),
          points: 20,
          failFeedback: 'priority = models.CharField(max_length=1, choices=PRIORITY_CHOICES, default=\'M\')'
        },
        {
          id: 'auto_datetime',
          description: 'created_at uses DateTimeField with auto_now_add',
          test: (code) => /created_at\s*=\s*models\.DateTimeField\s*\(.*auto_now_add\s*=\s*True/.test(code),
          points: 10,
          failFeedback: 'created_at = models.DateTimeField(auto_now_add=True)'
        },
        {
          id: 'str_uses_priority_title',
          description: '__str__ returns string with priority and title',
          test: (code) => /def\s+__str__[\s\S]*?return[\s\S]*?self\.priority[\s\S]*?self\.title|def\s+__str__[\s\S]*?return[\s\S]*?self\.title/.test(code),
          points: 10,
          failFeedback: '__str__ should return something like: f"[{self.priority}] {self.title}"'
        }
      ]
    },
    hints: [
      'unique=True goes inside the field parentheses: CharField(max_length=20, unique=True)',
      'Optional text: use both blank=True and null=True — blank for forms, null for the database',
      'choices= takes a list of (value, label) tuples',
      'default= sets what value is used when you create an object without specifying that field'
    ],
    docs: [
      {
        heading: 'Field options reference',
        content: 'The most important field options and what they control.',
        code: `# unique — no duplicates in this column
email = models.CharField(max_length=254, unique=True)

# null + blank — optional field
bio = models.TextField(blank=True, null=True)

# default — used when no value given
status = models.CharField(max_length=1, default='A')

# choices — dropdown of allowed values
ROLES = [('S', 'Student'), ('L', 'Lecturer')]
role = models.CharField(max_length=1, choices=ROLES)`
      }
    ],
    prerequisite: 4
  },

  {
    id: 6,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'Django Project Structure',
    topic: 'settings.py, INSTALLED_APPS, urls.py, manage.py — what every file is for',
    concept: `## The files Django creates for you

When you run \`django-admin startproject myproject\`, you get:

\`\`\`
myproject/
    manage.py          ← your command-line tool
    myproject/
        __init__.py
        settings.py    ← all configuration lives here
        urls.py        ← URL routing for the whole project
        wsgi.py        ← how a web server talks to your app
\`\`\`

When you run \`python manage.py startapp myapp\`, you get:

\`\`\`
myapp/
    __init__.py
    admin.py           ← register models here
    apps.py            ← app configuration
    models.py          ← your database models
    tests.py
    views.py           ← your API/view logic
    migrations/        ← auto-generated DB migration files
\`\`\`

## settings.py

The control center. Key settings:

\`\`\`python
# Which apps are active in this project
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    ...
    'rest_framework',   # you add this for DRF
    'myapp',            # you add your own apps
]

# Database connection
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
\`\`\`

## INSTALLED_APPS — why this matters

Django won't know your app exists until you add it to \`INSTALLED_APPS\`. If you forget, your models won't be tracked by migrations and your admin registrations won't work.

## urls.py

Maps URLs to views. The project \`urls.py\` is the root router — it delegates to each app's own \`urls.py\`.

## manage.py

Your command-line interface to Django:
- \`python manage.py runserver\` — start dev server
- \`python manage.py makemigrations\` — detect model changes
- \`python manage.py migrate\` — apply migrations to DB
- \`python manage.py createsuperuser\` — create admin user`,
    annotatedExample: {
      language: 'python',
      code: `# settings.py (excerpt)

INSTALLED_APPS = [
    # Django's built-in apps — always present
    'django.contrib.admin',      # the /admin/ panel
    'django.contrib.auth',       # user authentication
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party — Django REST Framework
    'rest_framework',

    # Your apps — must be added manually
    'issues',   # ← add your app here, or Django ignores it
]

DATABASES = {
    'default': {
        # SQLite = one file, great for development
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}`,
      explanation: 'INSTALLED_APPS is a checklist of active components. Your app must appear here or Django ignores its models, admin registrations, and migrations.'
    },
    guided: {
      instructions: 'Fix the INSTALLED_APPS list to include the missing apps.',
      language: 'python',
      starterCode: `# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Add DRF here:
    '___________',
    # Add the custom app here:
    '___________',
]`,
      solution: `# settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'myapp',
]`,
      evalChecks: [
        {
          id: 'rest_framework',
          description: "Includes 'rest_framework' in INSTALLED_APPS",
          test: (code) => /['"]\s*rest_framework\s*['"]/.test(code),
          points: 50,
          failFeedback: "Add 'rest_framework' to INSTALLED_APPS to enable Django REST Framework"
        },
        {
          id: 'custom_app',
          description: 'Includes a custom app name in INSTALLED_APPS',
          test: (code) => {
            const apps = ['myapp', 'issues', 'students', 'courses', 'api'];
            return apps.some(a => new RegExp(`['"]${a}['"]`).test(code));
          },
          points: 50,
          failFeedback: "Add your app name (e.g. 'myapp') to INSTALLED_APPS — Django won't see your models without it"
        }
      ]
    },
    challenge: {
      instructions: `Write the \`urls.py\` for a Django project that:
1. Imports \`path\` and \`include\` from \`django.urls\`
2. Imports \`admin\` from \`django.contrib\`
3. Defines a \`urlpatterns\` list with:
   - \`admin/\` → the admin site
   - \`api/\` → includes urls from the \`'issues.urls'\` module`,
      language: 'python',
      starterCode: `# urls.py (project level)\n# Write the URL configuration here\n`,
      solution: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),
]`,
      evalChecks: [
        {
          id: 'imports_path_include',
          description: 'Imports path and include from django.urls',
          test: (code) => /from\s+django\.urls\s+import.*path.*include|from\s+django\.urls\s+import.*include.*path/.test(code),
          points: 25,
          failFeedback: 'from django.urls import path, include'
        },
        {
          id: 'imports_admin',
          description: 'Imports admin from django.contrib',
          test: (code) => /from\s+django\.contrib\s+import\s+admin/.test(code),
          points: 20,
          failFeedback: 'from django.contrib import admin'
        },
        {
          id: 'urlpatterns',
          description: 'Defines urlpatterns list',
          test: (code) => /urlpatterns\s*=\s*\[/.test(code),
          points: 15,
          failFeedback: 'Define: urlpatterns = [...]'
        },
        {
          id: 'admin_url',
          description: "admin/ URL mapped to admin.site.urls",
          test: (code) => /path\s*\(\s*['"]admin\/['"].*admin\.site\.urls/.test(code),
          points: 20,
          failFeedback: "path('admin/', admin.site.urls)"
        },
        {
          id: 'include_urls',
          description: "api/ URL uses include()",
          test: (code) => /path\s*\(\s*['"]api\/['"].*include\s*\(/.test(code),
          points: 20,
          failFeedback: "path('api/', include('issues.urls'))"
        }
      ]
    },
    hints: [
      "Add 'rest_framework' and your app name to INSTALLED_APPS in settings.py",
      'manage.py is in the root folder — always run commands from there',
      "Project urls.py delegates to app urls.py using: path('api/', include('myapp.urls'))",
      'If your model changes are not being picked up by migrations, check INSTALLED_APPS first'
    ],
    docs: [
      {
        heading: 'INSTALLED_APPS minimal setup',
        content: 'What to add to INSTALLED_APPS for a DRF project.',
        code: `INSTALLED_APPS = [
    # ... django built-ins ...
    'rest_framework',  # DRF
    'corsheaders',     # optional: for React frontend
    'myapp',           # your app
]`
      },
      {
        heading: 'Project urls.py pattern',
        content: 'The standard way to structure a project-level urls.py.',
        code: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('myapp.urls')),
]`
      },
      {
        heading: 'Common manage.py commands',
        content: 'Commands you will use every day.',
        code: `python manage.py runserver        # start dev server
python manage.py makemigrations   # detect model changes
python manage.py migrate          # apply to database
python manage.py createsuperuser  # create admin login
python manage.py shell            # interactive Python shell`
      }
    ],
    prerequisite: 5
  },

  {
    id: 7,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'Migrations — What They Are',
    topic: 'Why migrations exist, makemigrations vs migrate, what the migration file contains',
    concept: `## The problem migrations solve

Your Python model is just a class. The database knows nothing about it. Somehow, Django needs to translate your model into SQL \`CREATE TABLE\` statements — and keep the database in sync as your models change over time.

That is what migrations do.

## Two commands, two jobs

**\`python manage.py makemigrations\`**
- Reads your models.py files
- Detects what changed since the last migration
- Creates a migration file (Python code) that describes the changes

**\`python manage.py migrate\`**
- Reads all migration files that haven't been applied yet
- Runs them against the database
- Tracks which migrations have run in the \`django_migrations\` table

Think of \`makemigrations\` as writing a recipe, and \`migrate\` as cooking it.

## What a migration file looks like

\`\`\`python
# 0001_initial.py
class Migration(migrations.Migration):
    operations = [
        migrations.CreateModel(
            name='Department',
            fields=[
                ('id', models.AutoField(primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
    ]
\`\`\`

Django generates this automatically — you rarely edit it directly.

## The workflow

1. Change your model in \`models.py\`
2. Run \`makemigrations\` → creates \`0002_add_field.py\`
3. Run \`migrate\` → Django runs the SQL to add the column
4. Repeat for every model change`,
    annotatedExample: {
      language: 'python',
      code: `# Step 1: You write this model in models.py
from django.db import models

class Course(models.Model):
    name = models.CharField(max_length=200)
    credits = models.IntegerField(default=3)

# Step 2: Run in terminal:
#   python manage.py makemigrations
# Django generates: migrations/0001_initial.py

# Step 3: Run in terminal:
#   python manage.py migrate
# Django runs this SQL (approximately):
#   CREATE TABLE courses_course (
#       id INTEGER PRIMARY KEY AUTOINCREMENT,
#       name VARCHAR(200) NOT NULL,
#       credits INTEGER NOT NULL DEFAULT 3
#   );

# Step 4: You add a new field:
# description = models.TextField(blank=True)

# Step 5: Run makemigrations again → 0002_course_description.py
# Step 6: Run migrate again → ALTER TABLE adds the column`,
      explanation: 'makemigrations detects changes and writes Python migration files. migrate reads those files and runs the SQL against your database.'
    },
    guided: {
      instructions: 'Put these migration steps in the correct order by writing the commands.',
      language: 'python',
      starterCode: `# You added a new field to your model.
# Write the TWO commands you need to run, in order.
# Hint: first detect the change, then apply it.

# Command 1: detect model changes
command_1 = "python manage.py ___________"

# Command 2: apply changes to the database
command_2 = "python manage.py ___________"`,
      solution: `command_1 = "python manage.py makemigrations"
command_2 = "python manage.py migrate"`,
      evalChecks: [
        {
          id: 'makemigrations',
          description: 'Uses makemigrations to detect changes',
          test: (code) => /makemigrations/.test(code),
          points: 50,
          failFeedback: 'First command: python manage.py makemigrations — this detects your model changes'
        },
        {
          id: 'migrate',
          description: 'Uses migrate to apply to database',
          test: (code) => /[^make]migrate(?!s)/.test(code),
          points: 50,
          failFeedback: 'Second command: python manage.py migrate — this runs the SQL against your database'
        }
      ]
    },
    challenge: {
      instructions: `Answer these questions about migrations by writing Python comments that explain:

1. What does \`makemigrations\` do? (one sentence)
2. What does \`migrate\` do? (one sentence)
3. What happens if you change a model but forget to run \`makemigrations\`?
4. Write a model \`Tag\` with a \`name\` CharField (max 50), then write the two commands needed to create its table.`,
      language: 'python',
      starterCode: `from django.db import models

# 1. makemigrations:
# ...

# 2. migrate:
# ...

# 3. If you skip makemigrations:
# ...

# 4. Tag model:


# Commands:
`,
      solution: `from django.db import models

# 1. makemigrations:
# Reads models.py and creates migration files describing what changed.

# 2. migrate:
# Reads migration files and runs the SQL to update the database.

# 3. If you skip makemigrations:
# Your model change exists in Python but not in the database — queries will fail or return wrong data.

# 4. Tag model:
class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

# Commands:
# python manage.py makemigrations
# python manage.py migrate`,
      evalChecks: [
        {
          id: 'tag_model',
          description: 'Tag model defined with CharField',
          test: (code) => /class\s+Tag\s*\(\s*models\.Model\s*\)/.test(code) && /name\s*=\s*models\.CharField\s*\(/.test(code),
          points: 40,
          failFeedback: 'Define: class Tag(models.Model): with name = models.CharField(max_length=50)'
        },
        {
          id: 'makemigrations_cmd',
          description: 'makemigrations command written',
          test: (code) => /makemigrations/.test(code),
          points: 30,
          failFeedback: 'Write: python manage.py makemigrations'
        },
        {
          id: 'migrate_cmd',
          description: 'migrate command written',
          test: (code) => /[^\w]migrate(?!\w)/.test(code),
          points: 30,
          failFeedback: 'Write: python manage.py migrate'
        }
      ]
    },
    hints: [
      'makemigrations reads your models and writes migration files — it does NOT touch the database',
      'migrate reads migration files and runs SQL — this is when the table is actually created or changed',
      'Always run makemigrations BEFORE migrate — the order matters',
      'If you see "no such column" errors, you probably ran makemigrations but forgot migrate'
    ],
    docs: [
      {
        heading: 'The migration workflow',
        content: 'Every model change follows this sequence.',
        code: `# 1. Change models.py
# 2. Detect the change:
python manage.py makemigrations
# 3. Apply to database:
python manage.py migrate`
      },
      {
        heading: 'Useful migration commands',
        content: 'Other migration tools you may need.',
        code: `# Show which migrations have/haven't run:
python manage.py showmigrations

# Show the SQL that WOULD run:
python manage.py sqlmigrate myapp 0001

# Roll back to a specific migration:
python manage.py migrate myapp 0001`
      }
    ],
    prerequisite: 6
  },

  {
    id: 8,
    module: 1,
    moduleTitle: 'Django Foundations',
    category: 'Django',
    title: 'The Django Admin',
    topic: 'admin.site.register(), list_display, why the admin panel exists',
    concept: `## What the Django admin is

Django ships with a fully working admin interface at \`/admin/\`. It lets you create, read, update, and delete every model in your database — with zero frontend code from you.

This is not for end users. It is a tool for developers and data managers to manage content during development and in production.

## Registering a model

By default, your models are not visible in the admin. You must register them in \`admin.py\`:

\`\`\`python
from django.contrib import admin
from .models import Department

admin.site.register(Department)
\`\`\`

Now Department appears in the admin and you can add/edit/delete records.

## Customising with ModelAdmin

The default admin is plain. You can enhance it by creating a \`ModelAdmin\` class:

\`\`\`python
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    search_fields = ['name']
    list_filter = ['is_active']
\`\`\`

- \`list_display\` — columns shown in the list view
- \`search_fields\` — enables a search bar
- \`list_filter\` — adds filter sidebar

## The @admin.register decorator

\`@admin.register(Model)\` is a shortcut combining the class definition and registration in one step. It's equivalent to calling \`admin.site.register(Model, ModelAdmin)\` at the bottom.`,
    annotatedExample: {
      language: 'python',
      code: `# admin.py
from django.contrib import admin
from .models import Student, Course  # import your models

# Simple registration — gives basic add/edit/delete
admin.site.register(Course)

# Enhanced registration with ModelAdmin
@admin.register(Student)  # decorator registers AND defines in one step
class StudentAdmin(admin.ModelAdmin):
    # Which columns show in the list view
    list_display = ['reg_number', 'first_name', 'last_name', 'year', 'is_enrolled']

    # Enables the search bar — searches these fields
    search_fields = ['reg_number', 'first_name', 'last_name']

    # Adds a filter panel on the right
    list_filter = ['year', 'is_enrolled']

    # How many records per page
    list_per_page = 25`,
      explanation: 'admin.site.register() is the minimum. ModelAdmin gives you list_display, search, and filters. @admin.register is the preferred modern syntax.'
    },
    guided: {
      instructions: 'Complete the admin.py to register the Issue model with useful list_display.',
      language: 'python',
      starterCode: `from django.contrib import ___________
from .models import Issue

@admin.___________(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', '___________ ', 'is_resolved', 'created_at']
    search_fields = ['___________']
    list_filter = ['priority', '___________']`,
      solution: `from django.contrib import admin
from .models import Issue

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'is_resolved', 'created_at']
    search_fields = ['title']
    list_filter = ['priority', 'is_resolved']`,
      evalChecks: [
        {
          id: 'imports_admin',
          description: 'Imports admin from django.contrib',
          test: (code) => /from\s+django\.contrib\s+import\s+admin/.test(code),
          points: 20,
          failFeedback: 'from django.contrib import admin'
        },
        {
          id: 'register_decorator',
          description: 'Uses @admin.register(Issue)',
          test: (code) => /@admin\.register\s*\(\s*Issue\s*\)/.test(code),
          points: 30,
          failFeedback: '@admin.register(Issue) — put this decorator above the class definition'
        },
        {
          id: 'list_display',
          description: 'list_display contains field names',
          test: (code) => /list_display\s*=\s*\[/.test(code),
          points: 25,
          failFeedback: "list_display = ['title', 'priority', 'is_resolved', 'created_at']"
        },
        {
          id: 'search_fields',
          description: 'search_fields defined',
          test: (code) => /search_fields\s*=\s*\[/.test(code),
          points: 25,
          failFeedback: "search_fields = ['title'] — enables a search bar in the admin"
        }
      ]
    },
    challenge: {
      instructions: `Write a complete \`admin.py\` for an app that has \`Student\` and \`Course\` models.

For \`Student\`:
- Use the \`@admin.register\` decorator
- \`list_display\`: reg_number, first_name, last_name, year
- \`search_fields\`: reg_number, last_name
- \`list_filter\`: year

For \`Course\`:
- Use simple \`admin.site.register()\` — no customisation needed`,
      language: 'python',
      starterCode: `# admin.py\n# Write the admin configuration here\n`,
      solution: `from django.contrib import admin
from .models import Student, Course

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['reg_number', 'first_name', 'last_name', 'year']
    search_fields = ['reg_number', 'last_name']
    list_filter = ['year']

admin.site.register(Course)`,
      evalChecks: [
        {
          id: 'imports',
          description: 'Imports admin and both models',
          test: (code) => /from\s+django\.contrib\s+import\s+admin/.test(code) && /from\s+\.models\s+import[\s\S]*?Student[\s\S]*?Course|from\s+\.models\s+import[\s\S]*?Course[\s\S]*?Student/.test(code),
          points: 20,
          failFeedback: 'from django.contrib import admin\nfrom .models import Student, Course'
        },
        {
          id: 'student_register',
          description: '@admin.register(Student) used',
          test: (code) => /@admin\.register\s*\(\s*Student\s*\)/.test(code),
          points: 25,
          failFeedback: '@admin.register(Student) above the StudentAdmin class'
        },
        {
          id: 'student_list_display',
          description: 'StudentAdmin has list_display',
          test: (code) => /list_display\s*=\s*\[.*reg_number/.test(code),
          points: 25,
          failFeedback: "list_display = ['reg_number', 'first_name', 'last_name', 'year']"
        },
        {
          id: 'course_register',
          description: 'Course registered with admin.site.register',
          test: (code) => /admin\.site\.register\s*\(\s*Course\s*\)/.test(code),
          points: 30,
          failFeedback: 'admin.site.register(Course) — simple registration, no ModelAdmin needed'
        }
      ]
    },
    hints: [
      'admin.py is inside your app folder, next to models.py',
      'import your models with: from .models import MyModel (note the leading dot)',
      '@admin.register(MyModel) is the modern way — it replaces admin.site.register()',
      'list_display fields must be actual field names on your model'
    ],
    docs: [
      {
        heading: 'admin.py patterns',
        content: 'Two ways to register a model in admin.',
        code: `# Simple — just register, no customisation
admin.site.register(MyModel)

# Enhanced — with list view options
@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    list_display = ['field1', 'field2']
    search_fields = ['field1']
    list_filter = ['field2']`
      },
      {
        heading: 'ModelAdmin options',
        content: 'The most useful ModelAdmin attributes.',
        code: `list_display   → columns in list view
search_fields  → enables search bar
list_filter    → filter panel on right
ordering       → default sort: ['-created_at']
list_per_page  → records per page (default 100)
readonly_fields → fields you can see but not edit`
      }
    ],
    prerequisite: 7
  }
];
