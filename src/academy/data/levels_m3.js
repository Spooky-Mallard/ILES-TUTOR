export const module3 = [
  {
    id: 15,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'What a Serializer Does',
    topic: 'The model→JSON pipeline, why you cannot return model instances from an API',
    concept: `## The problem

An API endpoint needs to return JSON. But \`Student.objects.all()\` gives you Python objects — not JSON.

\`\`\`python
# This does NOT work:
return Response(Student.objects.all())   # can't serialize a QuerySet
\`\`\`

## What a serializer does

A serializer converts Python objects ↔ JSON-compatible data:
- **Serialization**: Python object → dictionary → JSON (for sending to clients)
- **Deserialization**: JSON → dictionary → validated Python object (for saving to DB)

\`\`\`python
serializer = StudentSerializer(student)
serializer.data  # → {'id': 1, 'first_name': 'Sarah', ...}
\`\`\`

## The pipeline

\`\`\`
Request (JSON)  →  Serializer.is_valid()  →  .save()  →  Database
Database        →  Model instance          →  Serializer →  Response (JSON)
\`\`\`

## Basic structure

\`\`\`python
from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'reg_number']
\`\`\`

The \`Meta\` class tells the serializer which model and which fields to include.`,
    annotatedExample: {
      language: 'python',
      code: `# serializers.py
from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department         # which model to serialize
        fields = ['id', 'name', 'is_active']  # which fields to include

# In a view — serializing one object:
dept = Department.objects.get(pk=1)
serializer = DepartmentSerializer(dept)
print(serializer.data)
# → {'id': 1, 'name': 'Computer Science', 'is_active': True}

# Serializing many objects:
all_depts = Department.objects.all()
serializer = DepartmentSerializer(all_depts, many=True)
print(serializer.data)
# → [{'id': 1, ...}, {'id': 2, ...}]

# Deserializing (incoming data):
data = {'name': 'Mathematics', 'is_active': True}
serializer = DepartmentSerializer(data=data)
if serializer.is_valid():
    dept = serializer.save()   # creates the DB record`,
      explanation: 'Pass one object for single serialization, many=True for a queryset. Incoming data uses data=request.data, then call is_valid() before save().'
    },
    guided: {
      instructions: 'Complete the serializer for the Course model.',
      language: 'python',
      starterCode: `from rest_framework import ___________
from .models import Course

class CourseSerializer(serializers.___________):
    class ___________:
        model = ___________
        fields = ['id', 'code', 'title', 'credits']`,
      solution: `from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'code', 'title', 'credits']`,
      evalChecks: [
        {
          id: 'imports_serializers',
          description: 'Imports serializers from rest_framework',
          test: (code) => /from\s+rest_framework\s+import\s+serializers/.test(code),
          points: 25,
          failFeedback: 'from rest_framework import serializers'
        },
        {
          id: 'model_serializer',
          description: 'Inherits from serializers.ModelSerializer',
          test: (code) => /class\s+\w+\s*\(\s*serializers\.ModelSerializer\s*\)/.test(code),
          points: 30,
          failFeedback: 'class CourseSerializer(serializers.ModelSerializer):'
        },
        {
          id: 'meta_class',
          description: 'Has Meta class with model',
          test: (code) => /class\s+Meta/.test(code) && /model\s*=\s*Course/.test(code),
          points: 25,
          failFeedback: 'Inside the serializer, add: class Meta: with model = Course'
        },
        {
          id: 'fields_list',
          description: 'Has fields list in Meta',
          test: (code) => /fields\s*=\s*\[/.test(code),
          points: 20,
          failFeedback: "fields = ['id', 'code', 'title', 'credits']"
        }
      ]
    },
    challenge: {
      instructions: `Write a \`StudentSerializer\` for this Student model:
\`\`\`python
class Student(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    reg_number = models.CharField(max_length=20, unique=True)
    year = models.CharField(max_length=2)
    is_enrolled = models.BooleanField(default=True)
\`\`\`

Include all fields. Then write code that serializes a queryset of all students and accesses the serialized data.`,
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Student\n\n# Write StudentSerializer and usage code\n`,
      solution: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'reg_number', 'year', 'is_enrolled']

# Usage:
students = Student.objects.all()
serializer = StudentSerializer(students, many=True)
data = serializer.data`,
      evalChecks: [
        {
          id: 'serializer_class',
          description: 'StudentSerializer inherits ModelSerializer',
          test: (code) => /class\s+StudentSerializer\s*\(\s*serializers\.ModelSerializer\s*\)/.test(code),
          points: 30,
          failFeedback: 'class StudentSerializer(serializers.ModelSerializer):'
        },
        {
          id: 'meta_model',
          description: 'Meta class has model = Student',
          test: (code) => /class\s+Meta[\s\S]*?model\s*=\s*Student/.test(code),
          points: 25,
          failFeedback: 'class Meta: model = Student'
        },
        {
          id: 'fields_include_id',
          description: 'fields list includes id',
          test: (code) => /fields\s*=\s*\[.*['"]\s*id\s*['"]/.test(code) || /fields\s*=\s*['"]__all__['"]/.test(code),
          points: 20,
          failFeedback: "fields should include 'id' along with all model fields"
        },
        {
          id: 'many_true',
          description: 'Uses many=True when serializing queryset',
          test: (code) => /many\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'When serializing a queryset (multiple objects), pass many=True: StudentSerializer(queryset, many=True)'
        }
      ]
    },
    hints: [
      'from rest_framework import serializers — this is the import',
      'Inherit from serializers.ModelSerializer, not serializers.Serializer',
      'The Meta class (inside the serializer) tells it which model and fields to use',
      'For a queryset of multiple objects, pass many=True: Serializer(queryset, many=True)'
    ],
    docs: [
      {
        heading: 'Serializer structure',
        content: 'The minimal ModelSerializer pattern.',
        code: `from rest_framework import serializers
from .models import MyModel

class MySerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['id', 'field1', 'field2']`
      },
      {
        heading: 'Serialize one vs many',
        content: 'How to handle single objects and querysets.',
        code: `# One object
s = MySerializer(instance)
s.data  # → dict

# Many objects
s = MySerializer(queryset, many=True)
s.data  # → list of dicts

# Deserialize (incoming)
s = MySerializer(data=request.data)
if s.is_valid():
    s.save()`
      }
    ],
    prerequisite: null
  },

  {
    id: 16,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'ModelSerializer and the Meta Class',
    topic: 'model, fields, exclude, auto-generated validators',
    concept: `## The Meta class

Inside every \`ModelSerializer\`, the \`Meta\` class is where you configure:
- \`model\` — which Django model this serializer represents
- \`fields\` — which fields to include (explicit list, or \`'__all__'\`)
- \`exclude\` — alternative to fields: list fields to SKIP (everything else is included)
- \`read_only_fields\` — fields that can be seen but not written

\`\`\`python
class Meta:
    model = Student
    fields = ['id', 'first_name', 'reg_number']
    # OR
    fields = '__all__'              # all fields
    # OR
    exclude = ['internal_notes']   # all except this
\`\`\`

## Auto-generated validators

\`ModelSerializer\` reads your model's field definitions and automatically generates validators:
- \`CharField(max_length=100)\` → validates submitted text is ≤ 100 characters
- \`unique=True\` fields → validates no duplicate exists in the database
- Required fields (no \`blank=True\`, no \`default\`) → validates they are present

You get these for free. You don't write them manually.

## read_only_fields

Fields the client can see but cannot set:
\`\`\`python
class Meta:
    model = Student
    fields = '__all__'
    read_only_fields = ['id', 'created_at', 'reg_number']
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student    # the Django model
        # Explicit list — preferred for APIs (don't accidentally expose new fields)
        fields = ['id', 'first_name', 'last_name', 'reg_number', 'year']

        # id and reg_number can be seen but not changed by clients
        read_only_fields = ['id', 'reg_number']

# ModelSerializer auto-generates these validators from the model:
#   - first_name: required, max 100 chars
#   - reg_number: required, max 20 chars, must be unique (checked against DB)
#   - year: required

# You don't write these yourself — they come from the model definition`,
      explanation: 'Meta.model and Meta.fields are required. read_only_fields prevents clients from overwriting auto-generated or immutable data. Validators come free from the model.'
    },
    guided: {
      instructions: 'Complete the Meta class with the correct settings.',
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
    class ___________:           # the configuration class
        model = ___________      # which model
        fields = ['id', 'title', 'priority', 'is_resolved', 'created_at']
        ___________fields = ['id', 'created_at']  # these cannot be set by clients`,
      solution: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title', 'priority', 'is_resolved', 'created_at']
        read_only_fields = ['id', 'created_at']`,
      evalChecks: [
        {
          id: 'meta_class',
          description: 'Meta class defined inside serializer',
          test: (code) => /class\s+Meta\s*:/.test(code),
          points: 25,
          failFeedback: 'class Meta: — define it inside the serializer class'
        },
        {
          id: 'model_issue',
          description: 'model = Issue in Meta',
          test: (code) => /model\s*=\s*Issue/.test(code),
          points: 30,
          failFeedback: 'model = Issue inside the Meta class'
        },
        {
          id: 'read_only_fields',
          description: 'read_only_fields defined',
          test: (code) => /read_only_fields\s*=\s*\[/.test(code),
          points: 45,
          failFeedback: "read_only_fields = ['id', 'created_at'] — clients cannot set these"
        }
      ]
    },
    challenge: {
      instructions: `Write a \`CommentSerializer\` for:
\`\`\`python
class Comment(models.Model):
    body = models.TextField()
    author = models.CharField(max_length=100)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
\`\`\`

Requirements:
- Include: id, body, author, issue, created_at
- id, created_at should be read-only
- issue should be read-only (clients set it via the URL, not the request body)`,
      language: 'python',
      starterCode: `from rest_framework import serializers\nfrom .models import Comment\n\n# Write CommentSerializer here\n`,
      solution: `from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'body', 'author', 'issue', 'created_at']
        read_only_fields = ['id', 'created_at', 'issue']`,
      evalChecks: [
        {
          id: 'inherits_model_serializer',
          description: 'Inherits from serializers.ModelSerializer',
          test: (code) => /class\s+CommentSerializer\s*\(\s*serializers\.ModelSerializer\s*\)/.test(code),
          points: 25,
          failFeedback: 'class CommentSerializer(serializers.ModelSerializer):'
        },
        {
          id: 'meta_model',
          description: 'Meta.model = Comment',
          test: (code) => /class\s+Meta[\s\S]*?model\s*=\s*Comment/.test(code),
          points: 25,
          failFeedback: 'class Meta: model = Comment'
        },
        {
          id: 'fields_correct',
          description: 'fields list includes body, author, created_at',
          test: (code) => /fields\s*=\s*\[.*body.*author|fields\s*=\s*['"]__all__['"]/.test(code),
          points: 25,
          failFeedback: "fields = ['id', 'body', 'author', 'issue', 'created_at']"
        },
        {
          id: 'read_only',
          description: 'read_only_fields includes id and created_at',
          test: (code) => /read_only_fields\s*=\s*\[.*id.*created_at|read_only_fields\s*=\s*\[.*created_at.*id/.test(code),
          points: 25,
          failFeedback: "read_only_fields = ['id', 'created_at', 'issue']"
        }
      ]
    },
    hints: [
      'Meta is always called Meta — not MetaClass or Config',
      "fields = '__all__' includes every field but is risky — new fields get exposed automatically",
      "read_only_fields = ['id', 'created_at'] — auto-timestamps should always be read-only",
      'ModelSerializer auto-validates max_length, required fields, and unique constraints from the model'
    ],
    docs: [
      {
        heading: 'Meta class options',
        content: 'The key options inside ModelSerializer.Meta.',
        code: `class Meta:
    model = MyModel
    fields = ['id', 'name']       # explicit list (recommended)
    # OR
    fields = '__all__'             # all fields
    # OR
    exclude = ['password']         # all except listed

    read_only_fields = ['id', 'created_at']`
      }
    ],
    prerequisite: 15
  },

  {
    id: 17,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'Specifying Fields — Explicit vs __all__',
    topic: 'Why explicit is always better, security implications',
    concept: `## The problem with __all__

\`fields = '__all__'\` includes every field, including ones you add later. This is dangerous:

\`\`\`python
class User(models.Model):
    username = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=200)  # you add this later
    is_admin = models.BooleanField(default=False)
\`\`\`

With \`fields = '__all__'\`, your API now exposes \`password_hash\` and \`is_admin\` — two fields that should never be in a response. You'd have to remember to update the serializer every time.

## Explicit fields = intentional API contract

\`\`\`python
class Meta:
    model = User
    fields = ['id', 'username']   # only these two, explicitly chosen
\`\`\`

New fields added to the model are NOT automatically exposed. You have to intentionally add them.

## The rule

**Always use an explicit list for production serializers.** \`'__all__'\` is acceptable in tutorials and quick prototypes — not in code that reaches clients.

## Extra fields in the list

You can add fields that aren't on the model (from \`SerializerMethodField\`) or related fields — they just need to be declared above the Meta class. The \`fields\` list controls what goes into the output.`,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework import serializers
from .models import Student

# ❌ Risky — exposes everything, including future fields
class BadStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

# ✅ Explicit — exactly these fields, nothing more
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        # Intentional list: id is read-only auto-key, the rest are safe to expose
        fields = ['id', 'first_name', 'last_name', 'reg_number', 'year']
        # NOT included: is_enrolled (internal flag), any future password/token fields

# If you're unsure what a field does, don't include it
# If a field is for internal use only, leave it out
# If the client doesn't need it, leave it out`,
      explanation: 'Explicit fields list is a security contract. Every field in the list is a deliberate choice. __all__ is a lazy shortcut with real security risks.'
    },
    guided: {
      instructions: 'Convert the __all__ serializer to use an explicit fields list that excludes internal_notes.',
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Issue

# Issue fields: id, title, description, priority, is_resolved, internal_notes, created_at

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ___________  # list all fields EXCEPT internal_notes`,
      solution: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title', 'description', 'priority', 'is_resolved', 'created_at']`,
      evalChecks: [
        {
          id: 'not_all',
          description: "Does not use '__all__'",
          test: (code) => !/'__all__'/.test(code) && !/"__all__"/.test(code),
          points: 40,
          failFeedback: "Replace '__all__' with an explicit list of field names"
        },
        {
          id: 'explicit_list',
          description: 'Uses an explicit list for fields',
          test: (code) => /fields\s*=\s*\[/.test(code),
          points: 35,
          failFeedback: "fields = ['id', 'title', 'description', 'priority', 'is_resolved', 'created_at']"
        },
        {
          id: 'excludes_internal_notes',
          description: 'internal_notes not in fields list',
          test: (code) => !/internal_notes/.test(code.match(/fields\s*=\s*\[([^\]]*)\]/)?.[1] || ''),
          points: 25,
          failFeedback: 'Make sure internal_notes is NOT in your fields list'
        }
      ]
    },
    challenge: {
      instructions: `You're building a user profile API. The model is:
\`\`\`python
class UserProfile(models.Model):
    username = models.CharField(max_length=100)
    email = models.CharField(max_length=254)
    password_hash = models.CharField(max_length=200)
    api_key = models.CharField(max_length=64)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    bio = models.TextField(blank=True)
\`\`\`

Write a \`PublicProfileSerializer\` that:
- Exposes ONLY: id, username, bio, created_at
- Makes id and created_at read-only
- Does NOT expose: password_hash, api_key, email, is_admin`,
      language: 'python',
      starterCode: `from rest_framework import serializers\nfrom .models import UserProfile\n\n# Write PublicProfileSerializer here\n`,
      solution: `from rest_framework import serializers
from .models import UserProfile

class PublicProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'bio', 'created_at']
        read_only_fields = ['id', 'created_at']`,
      evalChecks: [
        {
          id: 'class_defined',
          description: 'PublicProfileSerializer defined',
          test: (code) => /class\s+PublicProfileSerializer\s*\(\s*serializers\.ModelSerializer\s*\)/.test(code),
          points: 20,
          failFeedback: 'class PublicProfileSerializer(serializers.ModelSerializer):'
        },
        {
          id: 'no_password',
          description: 'password_hash not in fields',
          test: (code) => {
            const fieldsMatch = code.match(/fields\s*=\s*\[([^\]]*)\]/);
            return fieldsMatch ? !fieldsMatch[1].includes('password') : true;
          },
          points: 30,
          failFeedback: 'password_hash must NOT be in your fields list — never expose password data'
        },
        {
          id: 'no_sensitive',
          description: 'api_key and is_admin not in fields',
          test: (code) => {
            const fieldsMatch = code.match(/fields\s*=\s*\[([^\]]*)\]/);
            if (!fieldsMatch) return true;
            return !fieldsMatch[1].includes('api_key') && !fieldsMatch[1].includes('is_admin');
          },
          points: 25,
          failFeedback: 'api_key and is_admin must NOT be exposed publicly'
        },
        {
          id: 'safe_fields_only',
          description: 'Only public fields included (id, username, bio, created_at)',
          test: (code) => /fields\s*=\s*\[.*username.*bio|fields\s*=\s*\[.*bio.*username/.test(code),
          points: 25,
          failFeedback: "fields = ['id', 'username', 'bio', 'created_at'] — only safe public fields"
        }
      ]
    },
    hints: [
      "Never use fields = '__all__' in a production serializer",
      'Think about which fields a client actually needs — leave out everything else',
      'Fields like password_hash, api_key, is_admin should never appear in an API response',
      "An explicit fields list is your API contract — it won't change unless you change it"
    ],
    docs: [
      {
        heading: 'Fields security checklist',
        content: 'Questions to ask for every field.',
        code: `# For each field, ask:
# 1. Does the client need this?
# 2. Is it safe to expose? (no secrets, no internal flags)
# 3. Could it be misused?

# Safe to expose:
fields = ['id', 'name', 'created_at', 'public_bio']

# Never expose:
# password, password_hash, api_key, secret_token
# is_admin, is_staff, is_superuser
# internal_notes, admin_flag`
      }
    ],
    prerequisite: 16
  },

  {
    id: 18,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'SerializerMethodField — Computed Fields',
    topic: 'Adding data that is not a model field, get_fieldname naming',
    concept: `## What SerializerMethodField does

Sometimes the data you want to return isn't stored directly on the model. You want to compute it — count related objects, combine fields, call a method.

\`SerializerMethodField\` lets you add a field to the serializer output that isn't a model field. You define a method named \`get_<fieldname>\` that returns the value.

\`\`\`python
class ProjectSerializer(serializers.ModelSerializer):
    issue_count = serializers.SerializerMethodField()

    def get_issue_count(self, obj):
        return obj.issues.count()

    class Meta:
        model = Project
        fields = ['id', 'name', 'issue_count']
\`\`\`

Output: \`{'id': 1, 'name': 'Website', 'issue_count': 12}\`

## The naming rule

- Field name: \`issue_count\`
- Method name: \`get_issue_count\` (always \`get_\` + field name)

DRF finds the method automatically by this naming convention.

## The obj parameter

The method receives \`obj\` — the specific model instance being serialized. Use it to access the object's data and relationships.

\`\`\`python
def get_full_name(self, obj):
    return f"{obj.first_name} {obj.last_name}"
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework import serializers
from .models import Department

class DepartmentSerializer(serializers.ModelSerializer):
    # Declare the computed field — it won't be found on the model
    student_count = serializers.SerializerMethodField()
    full_label = serializers.SerializerMethodField()

    # Method must be named get_<fieldname>
    def get_student_count(self, obj):
        # obj is the specific Department instance being serialized
        return obj.students.count()  # reverse FK — requires related_name='students'

    def get_full_label(self, obj):
        return f"Dept of {obj.name}"

    class Meta:
        model = Department
        # Include both the model fields AND the computed fields
        fields = ['id', 'name', 'student_count', 'full_label']

# Output for one department:
# {'id': 1, 'name': 'Computer Science', 'student_count': 47, 'full_label': 'Dept of Computer Science'}`,
      explanation: 'Declare SerializerMethodField() above Meta. Define get_fieldname(self, obj) — obj is the model instance. Include the field name in Meta.fields.'
    },
    guided: {
      instructions: 'Add a computed field that returns the number of comments on an issue.',
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
    # Declare the computed field
    comment_count = serializers.___________()

    # The method must be named get_comment_count
    def ___________(self, obj):
        return obj.comments.___________()  # count related comments

    class Meta:
        model = Issue
        fields = ['id', 'title', 'priority', 'comment_count']`,
      solution: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):
    comment_count = serializers.SerializerMethodField()

    def get_comment_count(self, obj):
        return obj.comments.count()

    class Meta:
        model = Issue
        fields = ['id', 'title', 'priority', 'comment_count']`,
      evalChecks: [
        {
          id: 'method_field',
          description: 'SerializerMethodField() declared',
          test: (code) => /serializers\.SerializerMethodField\s*\(\s*\)/.test(code),
          points: 35,
          failFeedback: 'comment_count = serializers.SerializerMethodField()'
        },
        {
          id: 'get_method',
          description: 'get_comment_count method defined',
          test: (code) => /def\s+get_comment_count\s*\(\s*self\s*,\s*obj\s*\)/.test(code),
          points: 35,
          failFeedback: 'def get_comment_count(self, obj): — naming must be get_ + field name'
        },
        {
          id: 'returns_count',
          description: 'Method returns a count of related objects',
          test: (code) => /return\s+obj\.\w+\.count\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'return obj.comments.count() — obj is the Issue instance being serialized'
        }
      ]
    },
    challenge: {
      instructions: `Add two computed fields to a \`StudentSerializer\`:

1. \`full_name\` — returns \`"{first_name} {last_name}"\`
2. \`is_senior\` — returns True if student's year is 'Y3' or 'Y4', False otherwise

The Student model has: id, first_name, last_name, reg_number, year, is_enrolled`,
      language: 'python',
      starterCode: `from rest_framework import serializers\nfrom .models import Student\n\nclass StudentSerializer(serializers.ModelSerializer):\n    # Add computed fields here\n\n    class Meta:\n        model = Student\n        fields = ['id', 'reg_number', 'full_name', 'year', 'is_senior']\n`,
      solution: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    is_senior = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_is_senior(self, obj):
        return obj.year in ['Y3', 'Y4']

    class Meta:
        model = Student
        fields = ['id', 'reg_number', 'full_name', 'year', 'is_senior']`,
      evalChecks: [
        {
          id: 'full_name_field',
          description: 'full_name declared as SerializerMethodField',
          test: (code) => /full_name\s*=\s*serializers\.SerializerMethodField/.test(code),
          points: 20,
          failFeedback: 'full_name = serializers.SerializerMethodField()'
        },
        {
          id: 'get_full_name',
          description: 'get_full_name method returns combined name',
          test: (code) => /def\s+get_full_name[\s\S]*?return[\s\S]*?obj\.first_name[\s\S]*?obj\.last_name/.test(code),
          points: 30,
          failFeedback: 'def get_full_name(self, obj): return f"{obj.first_name} {obj.last_name}"'
        },
        {
          id: 'is_senior_field',
          description: 'is_senior declared as SerializerMethodField',
          test: (code) => /is_senior\s*=\s*serializers\.SerializerMethodField/.test(code),
          points: 20,
          failFeedback: 'is_senior = serializers.SerializerMethodField()'
        },
        {
          id: 'get_is_senior',
          description: 'get_is_senior checks year Y3 or Y4',
          test: (code) => /def\s+get_is_senior[\s\S]*?Y3|def\s+get_is_senior[\s\S]*?Y4/.test(code),
          points: 30,
          failFeedback: "def get_is_senior(self, obj): return obj.year in ['Y3', 'Y4']"
        }
      ]
    },
    hints: [
      'Declare the field above the Meta class: field_name = serializers.SerializerMethodField()',
      'The method MUST be named get_fieldname — DRF finds it by this name automatically',
      'obj is the model instance being serialized — access its fields with obj.field_name',
      'Include the computed field name in your Meta.fields list'
    ],
    docs: [
      {
        heading: 'SerializerMethodField pattern',
        content: 'Always declare + define the method.',
        code: `class MySerializer(serializers.ModelSerializer):
    # 1. Declare
    computed_field = serializers.SerializerMethodField()

    # 2. Define — name must be get_ + field name
    def get_computed_field(self, obj):
        return some_calculation(obj)

    class Meta:
        model = MyModel
        fields = ['id', 'computed_field']  # 3. Include in fields`
      }
    ],
    prerequisite: 17
  },

  {
    id: 19,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'Nested Serializers',
    topic: 'Showing related object data (not just the id), read_only=True',
    concept: `## The problem: foreign keys return IDs

By default, a ForeignKey field in a serializer returns the related object's \`id\`:

\`\`\`json
{"id": 1, "title": "Fix login bug", "project": 3}
\`\`\`

The client has to make a second request to look up project 3. This is inefficient.

## Nested serializers solve this

Instead of an id, include the full related object:

\`\`\`json
{"id": 1, "title": "Fix login bug", "project": {"id": 3, "name": "Website"}}
\`\`\`

## How to nest

Declare a serializer field using another serializer class:

\`\`\`python
class IssueSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'title', 'project']
\`\`\`

## Why read_only=True

When writing (POST/PUT), the client sends a project ID, not a nested object. Setting \`read_only=True\` means:
- **GET**: expand to full nested object
- **POST/PUT**: ignore this field in input (set the FK separately)

If you need writable nested serializers, that requires additional \`create()\`/\`update()\` override — complex topic beyond this level.`,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework import serializers
from .models import Department, Student

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']

class StudentSerializer(serializers.ModelSerializer):
    # Replace the department ID with the full Department object
    # read_only=True: client can't set it as a nested object on create/update
    department = DepartmentSerializer(read_only=True)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'reg_number', 'department']

# GET response now shows:
# {
#   "id": 1,
#   "first_name": "Sarah",
#   "reg_number": "22/U/0001",
#   "department": {
#     "id": 2,
#     "name": "Computer Science"
#   }
# }

# For POST: send department_id (the ID field name Django uses for FK)
# POST data: {"first_name": "Sarah", "reg_number": "22/U/0001", "department_id": 2}`,
      explanation: 'Nested serializer replaces the FK id with the full object. Always read_only=True unless you implement custom create()/update() logic.'
    },
    guided: {
      instructions: 'Add a nested ProjectSerializer to the IssueSerializer so GET returns the full project, not just its id.',
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Project, Issue

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']

class IssueSerializer(serializers.ModelSerializer):
    # Replace project_id with nested project object
    project = ___________(read_only=___________)

    class Meta:
        model = Issue
        fields = ['id', 'title', 'project']`,
      solution: `from rest_framework import serializers
from .models import Project, Issue

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name']

class IssueSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)

    class Meta:
        model = Issue
        fields = ['id', 'title', 'project']`,
      evalChecks: [
        {
          id: 'nested_serializer',
          description: 'project uses ProjectSerializer',
          test: (code) => /project\s*=\s*ProjectSerializer\s*\(/.test(code),
          points: 50,
          failFeedback: 'project = ProjectSerializer(read_only=True)'
        },
        {
          id: 'read_only',
          description: 'read_only=True on the nested serializer',
          test: (code) => /ProjectSerializer\s*\(.*read_only\s*=\s*True/.test(code),
          points: 50,
          failFeedback: 'Pass read_only=True: project = ProjectSerializer(read_only=True)'
        }
      ]
    },
    challenge: {
      instructions: `Build a nested Comment serializer where each comment shows the full issue title (not just the issue ID).

Given:
\`\`\`python
class Issue(models.Model):
    title = models.CharField(max_length=200)
    priority = models.CharField(max_length=1)

class Comment(models.Model):
    body = models.TextField()
    author = models.CharField(max_length=100)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    created_at = models.DateTimeField(auto_now_add=True)
\`\`\`

Write:
1. A minimal \`IssueSerializer\` with just id and title
2. A \`CommentSerializer\` with body, author, created_at, and a nested issue (read-only)`,
      language: 'python',
      starterCode: `from rest_framework import serializers\nfrom .models import Issue, Comment\n\n# Write both serializers here\n`,
      solution: `from rest_framework import serializers
from .models import Issue, Comment

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ['id', 'title']

class CommentSerializer(serializers.ModelSerializer):
    issue = IssueSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'body', 'author', 'issue', 'created_at']`,
      evalChecks: [
        {
          id: 'issue_serializer',
          description: 'IssueSerializer defined with title',
          test: (code) => /class\s+IssueSerializer[\s\S]*?fields\s*=\s*\[.*title/.test(code),
          points: 25,
          failFeedback: 'class IssueSerializer with fields including title'
        },
        {
          id: 'comment_serializer',
          description: 'CommentSerializer defined',
          test: (code) => /class\s+CommentSerializer\s*\(\s*serializers\.ModelSerializer\s*\)/.test(code),
          points: 20,
          failFeedback: 'class CommentSerializer(serializers.ModelSerializer):'
        },
        {
          id: 'nested_issue',
          description: 'issue field uses IssueSerializer',
          test: (code) => /issue\s*=\s*IssueSerializer\s*\(/.test(code),
          points: 30,
          failFeedback: 'issue = IssueSerializer(read_only=True)'
        },
        {
          id: 'read_only_nested',
          description: 'Nested serializer has read_only=True',
          test: (code) => /IssueSerializer\s*\(.*read_only\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'Always add read_only=True to nested serializers unless you implement custom write logic'
        }
      ]
    },
    hints: [
      'Define the nested serializer class BEFORE the one that uses it',
      'Use it like a field: related_field = RelatedSerializer(read_only=True)',
      'read_only=True means POST/PUT requests will ignore it — that is usually what you want',
      'Include the field name in Meta.fields as usual'
    ],
    docs: [
      {
        heading: 'Nested serializer pattern',
        content: 'Replace FK id with full nested object.',
        code: `class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = ['id', 'name']

class ChildSerializer(serializers.ModelSerializer):
    parent = ParentSerializer(read_only=True)  # expand the FK

    class Meta:
        model = Child
        fields = ['id', 'title', 'parent']`
      }
    ],
    prerequisite: 18
  },

  {
    id: 20,
    module: 3,
    moduleTitle: 'Django REST Framework — Serializers',
    category: 'Django',
    title: 'Validation in Serializers',
    topic: 'validate_field(), validate(), raising ValidationError',
    concept: `## Where validation happens

DRF runs validation in layers:

1. **Field-level**: each field validates its own type, max_length, required, etc. (auto from model)
2. **Custom field validation**: \`validate_<fieldname>(self, value)\`
3. **Object-level validation**: \`validate(self, data)\` — access all fields together

## validate_fieldname

Override to add custom logic for one field:

\`\`\`python
def validate_reg_number(self, value):
    if not value.startswith('22/'):
        raise serializers.ValidationError("reg_number must start with '22/'")
    return value  # always return the value at the end
\`\`\`

## validate (object-level)

Called after all field validations pass. Access all fields in \`data\`:

\`\`\`python
def validate(self, data):
    if data['end_date'] < data['start_date']:
        raise serializers.ValidationError("end_date must be after start_date")
    return data  # always return data at the end
\`\`\`

## ValidationError

\`serializers.ValidationError\` takes a string message. DRF converts it to a structured JSON error response automatically:

\`\`\`json
{"reg_number": ["reg_number must start with '22/'"]}
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework import serializers
from .models import Issue

class IssueSerializer(serializers.ModelSerializer):

    # Field-level validation for 'title'
    # Called automatically when 'title' is in the submitted data
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters.")
        # Strip leading/trailing whitespace before saving
        return value.strip()

    # Object-level validation — sees all fields at once
    def validate(self, data):
        # Only allow High priority issues to be created resolved
        if data.get('priority') == 'H' and data.get('is_resolved') is True:
            raise serializers.ValidationError(
                "High priority issues cannot be created already resolved."
            )
        return data  # must return data

    class Meta:
        model = Issue
        fields = ['id', 'title', 'priority', 'is_resolved']`,
      explanation: 'validate_fieldname for single-field rules. validate for cross-field rules. Always return the value/data at the end.'
    },
    guided: {
      instructions: 'Add validation that ensures reg_number is not empty and starts with a year prefix.',
      language: 'python',
      starterCode: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):

    def ___________(self, value):         # validate the reg_number field
        if not value.strip():
            raise serializers.___________(  # raise validation error
                "Registration number cannot be empty."
            )
        return ___________    # return the (possibly cleaned) value

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'reg_number']`,
      solution: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):

    def validate_reg_number(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Registration number cannot be empty."
            )
        return value

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'reg_number']`,
      evalChecks: [
        {
          id: 'validate_method_name',
          description: 'Method named validate_reg_number',
          test: (code) => /def\s+validate_reg_number\s*\(\s*self\s*,\s*value\s*\)/.test(code),
          points: 40,
          failFeedback: 'def validate_reg_number(self, value): — must be named validate_ + field name'
        },
        {
          id: 'raises_validation_error',
          description: 'Raises serializers.ValidationError',
          test: (code) => /raise\s+serializers\.ValidationError\s*\(/.test(code),
          points: 35,
          failFeedback: 'raise serializers.ValidationError("message")'
        },
        {
          id: 'returns_value',
          description: 'Returns value at the end',
          test: (code) => /return\s+value/.test(code),
          points: 25,
          failFeedback: 'Always return value at the end of the validate method'
        }
      ]
    },
    challenge: {
      instructions: `Add two validations to a \`CommentSerializer\`:

1. \`validate_body\` — raises ValidationError if body is fewer than 10 characters
2. \`validate\` (object-level) — raises ValidationError if author is 'anonymous' AND the comment body contains the word 'spam'

Both must return their data at the end.`,
      language: 'python',
      starterCode: `from rest_framework import serializers\nfrom .models import Comment\n\nclass CommentSerializer(serializers.ModelSerializer):\n    # Add validation methods here\n\n    class Meta:\n        model = Comment\n        fields = ['id', 'body', 'author', 'created_at']\n`,
      solution: `from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):

    def validate_body(self, value):
        if len(value) < 10:
            raise serializers.ValidationError("Comment must be at least 10 characters.")
        return value

    def validate(self, data):
        if data.get('author') == 'anonymous' and 'spam' in data.get('body', '').lower():
            raise serializers.ValidationError("Spam comments are not allowed.")
        return data

    class Meta:
        model = Comment
        fields = ['id', 'body', 'author', 'created_at']`,
      evalChecks: [
        {
          id: 'validate_body',
          description: 'validate_body method defined',
          test: (code) => /def\s+validate_body\s*\(\s*self\s*,\s*value\s*\)/.test(code),
          points: 20,
          failFeedback: 'def validate_body(self, value):'
        },
        {
          id: 'body_length_check',
          description: 'validate_body checks length',
          test: (code) => /def\s+validate_body[\s\S]*?len\s*\(\s*value\s*\)\s*<\s*\d+/.test(code),
          points: 20,
          failFeedback: 'Check: if len(value) < 10: raise serializers.ValidationError(...)'
        },
        {
          id: 'validate_object',
          description: 'Object-level validate method defined',
          test: (code) => /def\s+validate\s*\(\s*self\s*,\s*data\s*\)/.test(code),
          points: 20,
          failFeedback: 'def validate(self, data): — for cross-field validation'
        },
        {
          id: 'spam_check',
          description: 'Object-level validate checks for spam',
          test: (code) => /def\s+validate[\s\S]*?spam/.test(code),
          points: 20,
          failFeedback: "Inside validate: check for 'spam' in data.get('body', '')"
        },
        {
          id: 'returns_data',
          description: 'validate returns data',
          test: (code) => /def\s+validate\s*\(\s*self\s*,\s*data\s*\)[\s\S]*?return\s+data/.test(code),
          points: 20,
          failFeedback: 'return data at the end of the validate method'
        }
      ]
    },
    hints: [
      "validate_fieldname takes (self, value) — value is the submitted field value",
      'Object-level validate takes (self, data) — data is a dict of all submitted fields',
      'Always return the value or data at the end — even if no changes',
      'raise serializers.ValidationError("message") — DRF handles the HTTP 400 response'
    ],
    docs: [
      {
        heading: 'Validation methods',
        content: 'Three levels of validation in serializers.',
        code: `# Field-level
def validate_fieldname(self, value):
    if bad_condition:
        raise serializers.ValidationError("message")
    return value

# Object-level (cross-field)
def validate(self, data):
    if data['end'] < data['start']:
        raise serializers.ValidationError("end must be after start")
    return data`
      }
    ],
    prerequisite: 19
  }
];
