export const module4 = [
  {
    id: 21,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'APIView vs Django Views',
    topic: 'How DRF views differ, Request, Response, status codes',
    concept: `## Django views vs DRF views

A regular Django view receives an \`HttpRequest\` and returns an \`HttpResponse\`. DRF replaces these with richer versions:
- \`Request\` — extends HttpRequest with \`request.data\` (parsed JSON body)
- \`Response\` — content-negotiated response (auto-converts dicts to JSON)

## APIView

The base class for all DRF views:

\`\`\`python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class CourseList(APIView):
    def get(self, request):
        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)   # → 200 JSON

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
\`\`\`

## status codes

DRF's \`status\` module has readable names:
- \`status.HTTP_200_OK\` — default for GET
- \`status.HTTP_201_CREATED\` — use for POST success
- \`status.HTTP_400_BAD_REQUEST\` — validation errors
- \`status.HTTP_404_NOT_FOUND\` — resource missing
- \`status.HTTP_204_NO_CONTENT\` — DELETE success`,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Issue
from .serializers import IssueSerializer

class IssueList(APIView):
    # Handles GET /api/issues/
    def get(self, request):
        issues = Issue.objects.all()
        # many=True because we have a queryset
        serializer = IssueSerializer(issues, many=True)
        # Response auto-serializes to JSON, default 200
        return Response(serializer.data)

    # Handles POST /api/issues/
    def post(self, request):
        # request.data has the parsed JSON body
        serializer = IssueSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # 201 Created — not 200 — for successful creation
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        # 400 Bad Request with validation error details
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`,
      explanation: 'Method names (get, post) map to HTTP methods. request.data is the parsed body. Response() auto-serializes. Use status codes from the status module.'
    },
    guided: {
      instructions: 'Complete the APIView that handles GET and POST for departments.',
      language: 'python',
      starterCode: `from rest_framework.views import APIView
from rest_framework.response import ___________
from rest_framework import status
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentList(APIView):
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(___________, many=True)
        return ___________(serializer.data)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.___________)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`,
      solution: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentList(APIView):
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)`,
      evalChecks: [
        {
          id: 'imports_response',
          description: 'Imports Response from rest_framework.response',
          test: (code) => /from\s+rest_framework\.response\s+import\s+Response/.test(code),
          points: 20,
          failFeedback: 'from rest_framework.response import Response'
        },
        {
          id: 'many_true',
          description: 'Uses many=True when serializing queryset',
          test: (code) => /many\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'Pass many=True when serializing a queryset'
        },
        {
          id: 'request_data',
          description: 'Uses request.data for POST body',
          test: (code) => /request\.data/.test(code),
          points: 25,
          failFeedback: 'request.data contains the parsed JSON body'
        },
        {
          id: 'created_status',
          description: 'POST returns 201 Created status',
          test: (code) => /HTTP_201_CREATED/.test(code),
          points: 30,
          failFeedback: 'Return status.HTTP_201_CREATED for successful POST creation'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`IssueDetail\` APIView that handles GET, PUT, and DELETE for a single issue.

- \`GET /api/issues/<pk>/\` — return the issue data
- \`PUT /api/issues/<pk>/\` — update the issue, return updated data
- \`DELETE /api/issues/<pk>/\` — delete and return 204 No Content

Handle the case where the issue doesn't exist by returning 404.`,
      language: 'python',
      starterCode: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Issue
from .serializers import IssueSerializer\n\nclass IssueDetail(APIView):\n    pass\n`,
      solution: `from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Issue
from .serializers import IssueSerializer

class IssueDetail(APIView):
    def get_object(self, pk):
        try:
            return Issue.objects.get(pk=pk)
        except Issue.DoesNotExist:
            return None

    def get(self, request, pk):
        issue = self.get_object(pk)
        if issue is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IssueSerializer(issue)
        return Response(serializer.data)

    def put(self, request, pk):
        issue = self.get_object(pk)
        if issue is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = IssueSerializer(issue, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        issue = self.get_object(pk)
        if issue is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        issue.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)`,
      evalChecks: [
        {
          id: 'get_method',
          description: 'get method defined',
          test: (code) => /def\s+get\s*\(\s*self\s*,\s*request\s*,\s*pk\s*\)/.test(code),
          points: 20,
          failFeedback: 'def get(self, request, pk): — pk is the URL parameter'
        },
        {
          id: 'put_method',
          description: 'put method defined with data=request.data',
          test: (code) => /def\s+put\s*\(\s*self\s*,\s*request\s*,\s*pk\s*\)/.test(code) && /data\s*=\s*request\.data/.test(code),
          points: 25,
          failFeedback: 'def put(self, request, pk): — pass data=request.data to the serializer'
        },
        {
          id: 'delete_method',
          description: 'delete method returns 204',
          test: (code) => /def\s+delete\s*\(\s*self\s*,\s*request\s*,\s*pk\s*\)/.test(code) && /HTTP_204_NO_CONTENT/.test(code),
          points: 25,
          failFeedback: 'def delete returns Response(status=status.HTTP_204_NO_CONTENT)'
        },
        {
          id: 'handles_404',
          description: 'Returns 404 when object not found',
          test: (code) => /HTTP_404_NOT_FOUND/.test(code),
          points: 30,
          failFeedback: 'Return Response(status=status.HTTP_404_NOT_FOUND) when the issue is not found'
        }
      ]
    },
    hints: [
      'Method names match HTTP verbs: get, post, put, patch, delete',
      'request.data is the parsed JSON body — use it for POST and PUT',
      'Response() auto-converts dicts to JSON — no need to call json.dumps()',
      'Always return 201 for created resources, 204 for deleted, 400 for validation errors'
    ],
    docs: [
      {
        heading: 'Status code reference',
        content: 'Common HTTP status codes in DRF.',
        code: `status.HTTP_200_OK           # default GET response
status.HTTP_201_CREATED      # successful POST
status.HTTP_204_NO_CONTENT   # successful DELETE
status.HTTP_400_BAD_REQUEST  # validation errors
status.HTTP_401_UNAUTHORIZED # not authenticated
status.HTTP_403_FORBIDDEN    # authenticated but not allowed
status.HTTP_404_NOT_FOUND    # resource not found`
      }
    ],
    prerequisite: null
  },

  {
    id: 22,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'ListAPIView — GET All',
    topic: 'The simplest read-only list endpoint',
    concept: `## Generic views

Writing \`get\`, \`post\`, \`put\`, \`delete\` manually on \`APIView\` for every model gets repetitive. DRF has **generic views** that handle common patterns with almost no code.

## ListAPIView

Returns a list of objects. Read-only GET endpoint.

\`\`\`python
from rest_framework.generics import ListAPIView
from .models import Course
from .serializers import CourseSerializer

class CourseList(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
\`\`\`

That's it. DRF handles:
- Fetching \`queryset\`
- Serializing with \`serializer_class\` and \`many=True\`
- Returning a \`Response\` with status 200

## queryset vs get_queryset()

You can override \`get_queryset()\` for dynamic filtering:

\`\`\`python
def get_queryset(self):
    return Course.objects.filter(is_active=True)
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.generics import ListAPIView
from .models import Issue
from .serializers import IssueSerializer

# Handles GET /api/issues/
# Returns all issues as a JSON array
class IssueList(ListAPIView):
    queryset = Issue.objects.all()          # which records
    serializer_class = IssueSerializer       # how to serialize

# Override get_queryset for dynamic filtering:
class OpenIssueList(ListAPIView):
    serializer_class = IssueSerializer

    def get_queryset(self):
        # Filter based on a query parameter: /api/issues/?priority=H
        priority = self.request.query_params.get('priority')
        qs = Issue.objects.filter(is_resolved=False)
        if priority:
            qs = qs.filter(priority=priority)
        return qs`,
      explanation: 'queryset and serializer_class are the only required attributes. Override get_queryset() for dynamic filtering based on URL params.'
    },
    guided: {
      instructions: 'Write a ListAPIView for departments that only returns active ones.',
      language: 'python',
      starterCode: `from rest_framework.generics import ___________
from .models import Department
from .serializers import DepartmentSerializer

class ActiveDepartmentList(___________):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        # Return only active departments
        return Department.objects.filter(___________)`,
      solution: `from rest_framework.generics import ListAPIView
from .models import Department
from .serializers import DepartmentSerializer

class ActiveDepartmentList(ListAPIView):
    serializer_class = DepartmentSerializer

    def get_queryset(self):
        return Department.objects.filter(is_active=True)`,
      evalChecks: [
        {
          id: 'imports_list_view',
          description: 'Imports ListAPIView',
          test: (code) => /from\s+rest_framework\.generics\s+import.*ListAPIView/.test(code),
          points: 25,
          failFeedback: 'from rest_framework.generics import ListAPIView'
        },
        {
          id: 'inherits_list_view',
          description: 'Class inherits ListAPIView',
          test: (code) => /class\s+\w+\s*\(\s*ListAPIView\s*\)/.test(code),
          points: 25,
          failFeedback: 'class ActiveDepartmentList(ListAPIView):'
        },
        {
          id: 'serializer_class',
          description: 'serializer_class set',
          test: (code) => /serializer_class\s*=\s*DepartmentSerializer/.test(code),
          points: 25,
          failFeedback: 'serializer_class = DepartmentSerializer'
        },
        {
          id: 'filters_active',
          description: 'get_queryset filters by is_active',
          test: (code) => /filter\s*\(.*is_active\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'return Department.objects.filter(is_active=True)'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`CourseList\` view using \`ListAPIView\` that:
- Returns all courses ordered by title
- Supports an optional URL query parameter \`?credits=N\` that filters to courses with exactly N credits
- Example: \`GET /api/courses/?credits=3\` returns only 3-credit courses`,
      language: 'python',
      starterCode: `from rest_framework.generics import ListAPIView\nfrom .models import Course\nfrom .serializers import CourseSerializer\n\nclass CourseList(ListAPIView):\n    serializer_class = CourseSerializer\n\n    def get_queryset(self):\n        pass\n`,
      solution: `from rest_framework.generics import ListAPIView
from .models import Course
from .serializers import CourseSerializer

class CourseList(ListAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        qs = Course.objects.all().order_by('title')
        credits = self.request.query_params.get('credits')
        if credits:
            qs = qs.filter(credits=credits)
        return qs`,
      evalChecks: [
        {
          id: 'get_queryset',
          description: 'get_queryset method defined',
          test: (code) => /def\s+get_queryset\s*\(\s*self\s*\)/.test(code),
          points: 25,
          failFeedback: 'Override get_queryset(self) to control the returned objects'
        },
        {
          id: 'order_by',
          description: 'Queryset ordered by title',
          test: (code) => /order_by\s*\(\s*['"]title['"]\s*\)/.test(code),
          points: 25,
          failFeedback: ".order_by('title') on the queryset"
        },
        {
          id: 'query_params',
          description: 'Uses request.query_params to read URL params',
          test: (code) => /request\.query_params\.get\s*\(/.test(code),
          points: 25,
          failFeedback: "credits = self.request.query_params.get('credits')"
        },
        {
          id: 'conditional_filter',
          description: 'Conditionally filters by credits',
          test: (code) => /if\s+credits/.test(code) && /filter\s*\(.*credits/.test(code),
          points: 25,
          failFeedback: 'Only filter if credits is provided: if credits: qs = qs.filter(credits=credits)'
        }
      ]
    },
    hints: [
      'ListAPIView only needs queryset and serializer_class at minimum',
      'Override get_queryset(self) when you need dynamic filtering',
      "Query params are in self.request.query_params — it's a dict-like object",
      'Chain .filter() only if the param was actually provided — check with if param:'
    ],
    docs: [
      {
        heading: 'Generic view classes',
        content: 'DRF generic views and what they handle.',
        code: `ListAPIView              # GET list
CreateAPIView            # POST create
RetrieveAPIView          # GET single
UpdateAPIView            # PUT/PATCH single
DestroyAPIView           # DELETE single
ListCreateAPIView        # GET list + POST
RetrieveUpdateAPIView    # GET + PUT/PATCH
RetrieveDestroyAPIView   # GET + DELETE
RetrieveUpdateDestroyAPIView  # GET + PUT/PATCH + DELETE`
      }
    ],
    prerequisite: 21
  },

  {
    id: 23,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'ListCreateAPIView — Adding POST',
    topic: 'How POST maps to create, the request/response cycle',
    concept: `## ListCreateAPIView

Combines list (GET) and create (POST) in one view:

\`\`\`python
from rest_framework.generics import ListCreateAPIView

class IssueList(ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
\`\`\`

- \`GET /api/issues/\` → list all issues
- \`POST /api/issues/\` → create a new issue

## What happens on POST

1. DRF calls \`get_serializer(data=request.data)\`
2. Calls \`is_valid(raise_exception=True)\` — auto-returns 400 if invalid
3. Calls \`perform_create(serializer)\` which calls \`serializer.save()\`
4. Returns \`serializer.data\` with status 201

## perform_create — where to add context

Override \`perform_create\` to set fields the client shouldn't control:

\`\`\`python
def perform_create(self, serializer):
    # Set the author from the authenticated user, not from request.data
    serializer.save(author=self.request.user)
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.generics import ListCreateAPIView
from .models import Issue
from .serializers import IssueSerializer

class IssueList(ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    # Override perform_create to inject the project from URL
    def perform_create(self, serializer):
        # self.kwargs has URL parameters — here project_id comes from /api/projects/1/issues/
        project_id = self.kwargs.get('project_id')
        serializer.save(project_id=project_id)

# Without overriding — just GET and POST with the full serializer:
class SimpleCourseList(ListCreateAPIView):
    queryset = Course.objects.all().order_by('title')
    serializer_class = CourseSerializer`,
      explanation: 'ListCreateAPIView handles both GET and POST. Override perform_create to inject fields from the URL, the current user, or computed values.'
    },
    guided: {
      instructions: 'Complete the ListCreateAPIView for comments on an issue.',
      language: 'python',
      starterCode: `from rest_framework.generics import ___________
from .models import Comment
from .serializers import CommentSerializer

class CommentList(___________):
    serializer_class = CommentSerializer

    def get_queryset(self):
        # Only return comments for this issue (issue_id from URL)
        issue_id = self.kwargs.get('issue_id')
        return Comment.objects.filter(issue_id=___________)

    def ___________(self, serializer):
        # Save with the issue_id from the URL
        issue_id = self.kwargs.get('issue_id')
        serializer.save(issue_id=issue_id)`,
      solution: `from rest_framework.generics import ListCreateAPIView
from .models import Comment
from .serializers import CommentSerializer

class CommentList(ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        issue_id = self.kwargs.get('issue_id')
        return Comment.objects.filter(issue_id=issue_id)

    def perform_create(self, serializer):
        issue_id = self.kwargs.get('issue_id')
        serializer.save(issue_id=issue_id)`,
      evalChecks: [
        {
          id: 'list_create',
          description: 'Inherits ListCreateAPIView',
          test: (code) => /class\s+\w+\s*\(\s*ListCreateAPIView\s*\)/.test(code),
          points: 25,
          failFeedback: 'class CommentList(ListCreateAPIView):'
        },
        {
          id: 'get_queryset',
          description: 'get_queryset filters by issue_id',
          test: (code) => /filter\s*\(.*issue_id/.test(code),
          points: 35,
          failFeedback: "Comment.objects.filter(issue_id=issue_id) inside get_queryset"
        },
        {
          id: 'perform_create',
          description: 'perform_create saves with issue_id',
          test: (code) => /def\s+perform_create\s*\(\s*self\s*,\s*serializer\s*\)/.test(code) && /serializer\.save\s*\(.*issue_id/.test(code),
          points: 40,
          failFeedback: 'def perform_create(self, serializer): serializer.save(issue_id=issue_id)'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`StudentList\` using \`ListCreateAPIView\` that:
- GET: returns all students ordered by reg_number
- POST: creates a new student; the \`enrolled_at\` field is set automatically (auto_now_add), so clients don't send it
- Override \`perform_create\` to set \`is_enrolled=True\` for every new student regardless of what the client sends`,
      language: 'python',
      starterCode: `from rest_framework.generics import ListCreateAPIView\nfrom .models import Student\nfrom .serializers import StudentSerializer\n\nclass StudentList(ListCreateAPIView):\n    pass\n`,
      solution: `from rest_framework.generics import ListCreateAPIView
from .models import Student
from .serializers import StudentSerializer

class StudentList(ListCreateAPIView):
    queryset = Student.objects.all().order_by('reg_number')
    serializer_class = StudentSerializer

    def perform_create(self, serializer):
        serializer.save(is_enrolled=True)`,
      evalChecks: [
        {
          id: 'inherits_list_create',
          description: 'Inherits ListCreateAPIView',
          test: (code) => /class\s+StudentList\s*\(\s*ListCreateAPIView\s*\)/.test(code),
          points: 25,
          failFeedback: 'class StudentList(ListCreateAPIView):'
        },
        {
          id: 'queryset_ordered',
          description: 'queryset ordered by reg_number',
          test: (code) => /order_by\s*\(\s*['"]reg_number['"]\s*\)/.test(code),
          points: 25,
          failFeedback: "Student.objects.all().order_by('reg_number')"
        },
        {
          id: 'perform_create',
          description: 'perform_create overridden',
          test: (code) => /def\s+perform_create\s*\(\s*self\s*,\s*serializer\s*\)/.test(code),
          points: 25,
          failFeedback: 'def perform_create(self, serializer):'
        },
        {
          id: 'saves_enrolled',
          description: 'Saves with is_enrolled=True',
          test: (code) => /serializer\.save\s*\(.*is_enrolled\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'serializer.save(is_enrolled=True)'
        }
      ]
    },
    hints: [
      'ListCreateAPIView = ListAPIView + CreateAPIView combined',
      'perform_create receives the validated serializer — call serializer.save() inside it',
      'Pass extra kwargs to serializer.save() to set fields not from request.data',
      'self.kwargs contains URL parameters — e.g. self.kwargs.get("pk")'
    ],
    docs: [
      {
        heading: 'ListCreateAPIView',
        content: 'Handles GET list and POST create.',
        code: `class MyList(ListCreateAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer

    # Optional: set fields automatically
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)`
      }
    ],
    prerequisite: 22
  },

  {
    id: 24,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'RetrieveAPIView — GET One',
    topic: 'URL parameters, pk, how Django finds the object',
    concept: `## Getting a single object

\`RetrieveAPIView\` handles \`GET /api/things/1/\` — returning a single record by its identifier.

\`\`\`python
from rest_framework.generics import RetrieveAPIView

class CourseDetail(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
\`\`\`

DRF looks for \`pk\` in the URL by default (or \`id\`, or a custom \`lookup_field\`).

## lookup_field

By default DRF uses \`pk\`. To use a different field:

\`\`\`python
class CourseDetail(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'code'   # match by course code instead of id
\`\`\`

URL: \`/api/courses/CSC1202/\` instead of \`/api/courses/1/\`

## What happens on miss

If the object doesn't exist, DRF automatically returns 404. You don't need to write try/except.`,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.generics import RetrieveAPIView
from .models import Issue, Student
from .serializers import IssueSerializer, StudentSerializer

# GET /api/issues/5/ → returns issue with id=5
class IssueDetail(RetrieveAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    # lookup_field defaults to 'pk' — matches /api/issues/<pk>/

# GET /api/students/22/U/0001/ → find by reg_number instead of id
class StudentDetail(RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'reg_number'   # URL variable must match: <reg_number>`,
      explanation: 'RetrieveAPIView handles GET for one object. DRF uses pk by default. Change lookup_field to match by a different field. 404 is automatic.'
    },
    guided: {
      instructions: 'Write a RetrieveAPIView for a single department, using pk lookup.',
      language: 'python',
      starterCode: `from rest_framework.generics import ___________
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentDetail(___________):
    queryset = ___________
    serializer_class = ___________`,
      solution: `from rest_framework.generics import RetrieveAPIView
from .models import Department
from .serializers import DepartmentSerializer

class DepartmentDetail(RetrieveAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer`,
      evalChecks: [
        {
          id: 'retrieve_view',
          description: 'Inherits RetrieveAPIView',
          test: (code) => /class\s+\w+\s*\(\s*RetrieveAPIView\s*\)/.test(code),
          points: 35,
          failFeedback: 'class DepartmentDetail(RetrieveAPIView):'
        },
        {
          id: 'queryset',
          description: 'queryset set to Department.objects.all()',
          test: (code) => /queryset\s*=\s*Department\.objects\.all\s*\(\s*\)/.test(code),
          points: 35,
          failFeedback: 'queryset = Department.objects.all()'
        },
        {
          id: 'serializer_class',
          description: 'serializer_class set',
          test: (code) => /serializer_class\s*=\s*DepartmentSerializer/.test(code),
          points: 30,
          failFeedback: 'serializer_class = DepartmentSerializer'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`StudentDetail\` view that:
- Retrieves a single student by \`reg_number\` (not by pk)
- The URL will be \`/api/students/<reg_number>/\`

You'll need to set \`lookup_field\`.`,
      language: 'python',
      starterCode: `from rest_framework.generics import RetrieveAPIView\nfrom .models import Student\nfrom .serializers import StudentSerializer\n\nclass StudentDetail(RetrieveAPIView):\n    pass\n`,
      solution: `from rest_framework.generics import RetrieveAPIView
from .models import Student
from .serializers import StudentSerializer

class StudentDetail(RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    lookup_field = 'reg_number'`,
      evalChecks: [
        {
          id: 'retrieve_view',
          description: 'Inherits RetrieveAPIView',
          test: (code) => /class\s+StudentDetail\s*\(\s*RetrieveAPIView\s*\)/.test(code),
          points: 30,
          failFeedback: 'class StudentDetail(RetrieveAPIView):'
        },
        {
          id: 'queryset',
          description: 'queryset set',
          test: (code) => /queryset\s*=\s*Student\.objects\.all/.test(code),
          points: 30,
          failFeedback: 'queryset = Student.objects.all()'
        },
        {
          id: 'lookup_field',
          description: "lookup_field = 'reg_number'",
          test: (code) => /lookup_field\s*=\s*['"]reg_number['"]/.test(code),
          points: 40,
          failFeedback: "lookup_field = 'reg_number' — this tells DRF to look up by reg_number from the URL"
        }
      ]
    },
    hints: [
      'RetrieveAPIView needs queryset and serializer_class — same as ListAPIView',
      'DRF uses pk by default to find the object in the URL',
      "lookup_field = 'code' changes the lookup to use the code field instead",
      'DRF auto-returns 404 if the object is not found — no need for try/except'
    ],
    docs: [
      {
        heading: 'RetrieveAPIView',
        content: 'Single-object GET endpoint.',
        code: `class MyDetail(RetrieveAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer
    lookup_field = 'pk'   # default — or change to any unique field`
      }
    ],
    prerequisite: 23
  },

  {
    id: 25,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'RetrieveUpdateDestroyAPIView — Full CRUD',
    topic: 'PUT vs PATCH, perform_destroy, when to use which',
    concept: `## Full CRUD on one object

\`RetrieveUpdateDestroyAPIView\` handles GET, PUT, PATCH, and DELETE for a single object:

\`\`\`python
class IssueDetail(RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
\`\`\`

## PUT vs PATCH

- \`PUT\` — full replacement. All required fields must be sent, even unchanged ones.
- \`PATCH\` — partial update. Only send the fields you want to change.

Both work automatically on \`RetrieveUpdateDestroyAPIView\`.

For PATCH, the serializer must know it's partial:

\`\`\`python
serializer = IssueSerializer(issue, data=request.data, partial=True)
\`\`\`

(Generic views handle this automatically — you only need it if using \`APIView\` manually.)

## perform_destroy

Override to add custom logic before deletion:

\`\`\`python
def perform_destroy(self, instance):
    # e.g. soft-delete instead of hard-delete
    instance.is_deleted = True
    instance.save()
    # Don't call super() — we're not deleting from DB
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Issue
from .serializers import IssueSerializer

# Handles: GET, PUT, PATCH, DELETE for /api/issues/<pk>/
class IssueDetail(RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    # Override perform_destroy for soft-delete
    def perform_destroy(self, instance):
        instance.is_resolved = True   # mark resolved instead of deleting
        instance.save()

# GET  /api/issues/5/      → returns issue 5
# PUT  /api/issues/5/      → replace all fields (full update)
# PATCH /api/issues/5/     → update only sent fields
# DELETE /api/issues/5/    → delete (or perform_destroy override)`,
      explanation: 'One class handles all four operations. Override perform_destroy for soft-delete patterns. PATCH is partial update, PUT is full replacement.'
    },
    guided: {
      instructions: 'Write a RetrieveUpdateDestroyAPIView for courses, with a soft-delete that sets is_active=False.',
      language: 'python',
      starterCode: `from rest_framework.generics import ___________
from .models import Course
from .serializers import CourseSerializer

class CourseDetail(___________):
    queryset = Course.objects.all()
    serializer_class = ___________

    def perform_destroy(self, instance):
        # Soft-delete: mark inactive instead of deleting
        instance.___________ = False
        instance.save()`,
      solution: `from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Course
from .serializers import CourseSerializer

class CourseDetail(RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()`,
      evalChecks: [
        {
          id: 'inherits_crud',
          description: 'Inherits RetrieveUpdateDestroyAPIView',
          test: (code) => /class\s+\w+\s*\(\s*RetrieveUpdateDestroyAPIView\s*\)/.test(code),
          points: 30,
          failFeedback: 'class CourseDetail(RetrieveUpdateDestroyAPIView):'
        },
        {
          id: 'perform_destroy',
          description: 'perform_destroy overridden',
          test: (code) => /def\s+perform_destroy\s*\(\s*self\s*,\s*instance\s*\)/.test(code),
          points: 35,
          failFeedback: 'def perform_destroy(self, instance):'
        },
        {
          id: 'soft_delete',
          description: 'Sets is_active=False and saves',
          test: (code) => /instance\.is_active\s*=\s*False/.test(code) && /instance\.save\s*\(\s*\)/.test(code),
          points: 35,
          failFeedback: 'instance.is_active = False then instance.save()'
        }
      ]
    },
    challenge: {
      instructions: `Write a complete \`IssueDetail\` view using \`RetrieveUpdateDestroyAPIView\` that:
- Handles GET, PUT, PATCH, DELETE for \`/api/issues/<pk>/\`
- Override \`perform_update\` to set \`updated_at\` to the current time before saving (use \`from django.utils import timezone\` and \`timezone.now()\`)
- Override \`perform_destroy\` to log a message (just \`print(f"Deleting: {instance.title}")\`) before calling the normal delete`,
      language: 'python',
      starterCode: `from rest_framework.generics import RetrieveUpdateDestroyAPIView\nfrom django.utils import timezone\nfrom .models import Issue\nfrom .serializers import IssueSerializer\n\nclass IssueDetail(RetrieveUpdateDestroyAPIView):\n    pass\n`,
      solution: `from rest_framework.generics import RetrieveUpdateDestroyAPIView
from django.utils import timezone
from .models import Issue
from .serializers import IssueSerializer

class IssueDetail(RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def perform_update(self, serializer):
        serializer.save(updated_at=timezone.now())

    def perform_destroy(self, instance):
        print(f"Deleting: {instance.title}")
        instance.delete()`,
      evalChecks: [
        {
          id: 'inherits_crud',
          description: 'Inherits RetrieveUpdateDestroyAPIView',
          test: (code) => /class\s+IssueDetail\s*\(\s*RetrieveUpdateDestroyAPIView\s*\)/.test(code),
          points: 20,
          failFeedback: 'class IssueDetail(RetrieveUpdateDestroyAPIView):'
        },
        {
          id: 'queryset_serializer',
          description: 'queryset and serializer_class set',
          test: (code) => /queryset\s*=\s*Issue\.objects/.test(code) && /serializer_class\s*=\s*IssueSerializer/.test(code),
          points: 20,
          failFeedback: 'Set queryset = Issue.objects.all() and serializer_class = IssueSerializer'
        },
        {
          id: 'perform_update',
          description: 'perform_update overridden',
          test: (code) => /def\s+perform_update\s*\(\s*self\s*,\s*serializer\s*\)/.test(code),
          points: 30,
          failFeedback: 'def perform_update(self, serializer): serializer.save(...)'
        },
        {
          id: 'perform_destroy',
          description: 'perform_destroy calls instance.delete()',
          test: (code) => /def\s+perform_destroy[\s\S]*?instance\.delete\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'perform_destroy should call instance.delete() after the print statement'
        }
      ]
    },
    hints: [
      'RetrieveUpdateDestroyAPIView handles GET + PUT + PATCH + DELETE automatically',
      'Override perform_destroy(self, instance) — instance is the object being deleted',
      'Override perform_update(self, serializer) — call serializer.save() inside',
      'PATCH sends only changed fields; PUT requires all fields — generic views handle this automatically'
    ],
    docs: [
      {
        heading: 'CRUD generic view',
        content: 'RetrieveUpdateDestroyAPIView for full single-object CRUD.',
        code: `class MyDetail(RetrieveUpdateDestroyAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MySerializer

    def perform_destroy(self, instance):
        instance.delete()  # default behaviour

    def perform_update(self, serializer):
        serializer.save()  # default behaviour`
      }
    ],
    prerequisite: 24
  },

  {
    id: 26,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'ViewSets — Why They Exist',
    topic: 'Combining all CRUD into one class, actions vs methods',
    concept: `## The problem with multiple view classes

For one model (Issue), you end up with:
- \`IssueList\` for GET list and POST
- \`IssueDetail\` for GET/PUT/PATCH/DELETE

Two classes, two URL patterns. For 10 models that's 20 classes and 20 URL entries.

## ViewSet consolidates them

\`\`\`python
from rest_framework.viewsets import ModelViewSet

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
\`\`\`

One class handles everything: list, create, retrieve, update, partial_update, destroy.

## How actions map to HTTP methods

| Action | Method | URL |
|--------|--------|-----|
| list | GET | /api/issues/ |
| create | POST | /api/issues/ |
| retrieve | GET | /api/issues/1/ |
| update | PUT | /api/issues/1/ |
| partial_update | PATCH | /api/issues/1/ |
| destroy | DELETE | /api/issues/1/ |

## ViewSet isn't directly connected to URLs

Unlike APIView, a ViewSet doesn't map directly to a URL path. You register it with a **Router** (next level) which generates all the URL patterns.`,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ReadOnlyModelViewSet
from .models import Issue, Department
from .serializers import IssueSerializer, DepartmentSerializer

# Full CRUD — list, create, retrieve, update, partial_update, destroy
class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    # Override list to add filtering
    def get_queryset(self):
        qs = Issue.objects.all()
        if self.request.query_params.get('open'):
            qs = qs.filter(is_resolved=False)
        return qs

# Read-only — only list and retrieve (no create/update/delete)
class DepartmentViewSet(ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer`,
      explanation: 'ModelViewSet gives you all 6 actions automatically. ReadOnlyModelViewSet gives only list and retrieve. Override get_queryset for dynamic filtering.'
    },
    guided: {
      instructions: 'Convert these two separate views into one ViewSet.',
      language: 'python',
      starterCode: `# Before: two separate views
# class CourseList(ListCreateAPIView): ...
# class CourseDetail(RetrieveUpdateDestroyAPIView): ...

# After: one ViewSet
from rest_framework.viewsets import ___________
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(___________):
    queryset = Course.objects.___________
    serializer_class = ___________`,
      solution: `from rest_framework.viewsets import ModelViewSet
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer`,
      evalChecks: [
        {
          id: 'model_viewset',
          description: 'Inherits ModelViewSet',
          test: (code) => /class\s+\w+\s*\(\s*ModelViewSet\s*\)/.test(code),
          points: 40,
          failFeedback: 'class CourseViewSet(ModelViewSet):'
        },
        {
          id: 'queryset',
          description: 'queryset set',
          test: (code) => /queryset\s*=\s*Course\.objects\.all\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'queryset = Course.objects.all()'
        },
        {
          id: 'serializer_class',
          description: 'serializer_class set',
          test: (code) => /serializer_class\s*=\s*CourseSerializer/.test(code),
          points: 30,
          failFeedback: 'serializer_class = CourseSerializer'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`StudentViewSet\` using \`ModelViewSet\` that:
- Filters the queryset to only return enrolled students by default
- Overrides \`perform_create\` to always set \`is_enrolled=True\`
- Has an ordering of reg_number`,
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet\nfrom .models import Student\nfrom .serializers import StudentSerializer\n\nclass StudentViewSet(ModelViewSet):\n    serializer_class = StudentSerializer\n\n    def get_queryset(self):\n        pass\n\n    def perform_create(self, serializer):\n        pass\n`,
      solution: `from rest_framework.viewsets import ModelViewSet
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(ModelViewSet):
    serializer_class = StudentSerializer

    def get_queryset(self):
        return Student.objects.filter(is_enrolled=True).order_by('reg_number')

    def perform_create(self, serializer):
        serializer.save(is_enrolled=True)`,
      evalChecks: [
        {
          id: 'model_viewset',
          description: 'Inherits ModelViewSet',
          test: (code) => /class\s+StudentViewSet\s*\(\s*ModelViewSet\s*\)/.test(code),
          points: 20,
          failFeedback: 'class StudentViewSet(ModelViewSet):'
        },
        {
          id: 'filters_enrolled',
          description: 'get_queryset filters enrolled students',
          test: (code) => /filter\s*\(.*is_enrolled\s*=\s*True/.test(code),
          points: 30,
          failFeedback: 'Student.objects.filter(is_enrolled=True) inside get_queryset'
        },
        {
          id: 'ordered',
          description: 'Results ordered by reg_number',
          test: (code) => /order_by\s*\(\s*['"]reg_number['"]\s*\)/.test(code),
          points: 25,
          failFeedback: ".order_by('reg_number')"
        },
        {
          id: 'perform_create',
          description: 'perform_create saves with is_enrolled=True',
          test: (code) => /serializer\.save\s*\(.*is_enrolled\s*=\s*True/.test(code),
          points: 25,
          failFeedback: 'serializer.save(is_enrolled=True) inside perform_create'
        }
      ]
    },
    hints: [
      'ModelViewSet replaces both ListCreateAPIView and RetrieveUpdateDestroyAPIView',
      'ReadOnlyModelViewSet gives only list and retrieve — use for public read-only data',
      'ViewSets need a Router to generate URL patterns — see the next level',
      'Override get_queryset for filtering, perform_create for create hooks'
    ],
    docs: [
      {
        heading: 'ViewSet classes',
        content: 'Choose based on what operations you need.',
        code: `ModelViewSet          # all 6 actions
ReadOnlyModelViewSet  # list + retrieve only
ViewSet               # manual action methods
GenericViewSet        # mixins only`
      }
    ],
    prerequisite: 25
  },

  {
    id: 27,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'ModelViewSet — The Shortcut',
    topic: 'queryset, serializer_class, what you get for free',
    concept: `## What ModelViewSet gives you

With just two lines of configuration, you get six fully-working endpoints:

\`\`\`python
class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
\`\`\`

| Endpoint | Method | Action |
|----------|--------|--------|
| /api/issues/ | GET | list |
| /api/issues/ | POST | create |
| /api/issues/1/ | GET | retrieve |
| /api/issues/1/ | PUT | update |
| /api/issues/1/ | PATCH | partial_update |
| /api/issues/1/ | DELETE | destroy |

## Customising individual actions

\`\`\`python
def retrieve(self, request, *args, **kwargs):
    # Override just the retrieve action
    instance = self.get_object()
    serializer = self.get_serializer(instance)
    return Response(serializer.data)
\`\`\`

## Different serializers per action

\`\`\`python
def get_serializer_class(self):
    if self.action == 'list':
        return IssueListSerializer    # lighter version for lists
    return IssueDetailSerializer       # full version for single object
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.viewsets import ModelViewSet
from .models import Issue
from .serializers import IssueSerializer, IssueListSerializer

class IssueViewSet(ModelViewSet):
    serializer_class = IssueSerializer

    def get_queryset(self):
        qs = Issue.objects.select_related('project')  # optimise FK joins
        priority = self.request.query_params.get('priority')
        if priority:
            qs = qs.filter(priority=priority)
        return qs

    # Use a lighter serializer for the list, full for detail
    def get_serializer_class(self):
        if self.action == 'list':
            return IssueListSerializer
        return IssueSerializer

    # Inject the current user as reporter on create
    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)`,
      explanation: 'ModelViewSet requires queryset and serializer_class. Override get_queryset for filtering, get_serializer_class for different serializers per action.'
    },
    guided: {
      instructions: 'Write a ModelViewSet that uses different serializers for list vs detail.',
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet
from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == '___________':     # for list action
            return CourseListSerializer
        return ___________                   # for all other actions`,
      solution: `from rest_framework.viewsets import ModelViewSet
from .models import Course
from .serializers import CourseListSerializer, CourseDetailSerializer

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer`,
      evalChecks: [
        {
          id: 'get_serializer_class',
          description: 'get_serializer_class method defined',
          test: (code) => /def\s+get_serializer_class\s*\(\s*self\s*\)/.test(code),
          points: 35,
          failFeedback: 'def get_serializer_class(self):'
        },
        {
          id: 'checks_list_action',
          description: "Checks self.action == 'list'",
          test: (code) => /self\.action\s*==\s*['"]list['"]/.test(code),
          points: 35,
          failFeedback: "if self.action == 'list': return CourseListSerializer"
        },
        {
          id: 'returns_detail',
          description: 'Returns CourseDetailSerializer for other actions',
          test: (code) => /return\s+CourseDetailSerializer/.test(code),
          points: 30,
          failFeedback: 'return CourseDetailSerializer for non-list actions'
        }
      ]
    },
    challenge: {
      instructions: `Write a complete \`ProjectViewSet\` that:
- Uses \`ModelViewSet\`
- \`get_queryset\` orders by name and accepts a \`?search=\` query param that filters by name containing the search term
- \`perform_create\` sets \`created_by=self.request.user.username\` (assume users are authenticated)
- \`get_serializer_class\` returns \`ProjectListSerializer\` for 'list' and 'ProjectDetailSerializer\` for everything else`,
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet\nfrom .models import Project\nfrom .serializers import ProjectListSerializer, ProjectDetailSerializer\n\nclass ProjectViewSet(ModelViewSet):\n    pass\n`,
      solution: `from rest_framework.viewsets import ModelViewSet
from .models import Project
from .serializers import ProjectListSerializer, ProjectDetailSerializer

class ProjectViewSet(ModelViewSet):
    def get_queryset(self):
        qs = Project.objects.all().order_by('name')
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(name__icontains=search)
        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.username)

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectDetailSerializer`,
      evalChecks: [
        {
          id: 'model_viewset',
          description: 'Inherits ModelViewSet',
          test: (code) => /class\s+ProjectViewSet\s*\(\s*ModelViewSet\s*\)/.test(code),
          points: 15,
          failFeedback: 'class ProjectViewSet(ModelViewSet):'
        },
        {
          id: 'search_filter',
          description: 'get_queryset supports search param',
          test: (code) => /query_params\.get\s*\(.*search/.test(code) && /icontains/.test(code),
          points: 30,
          failFeedback: "search = self.request.query_params.get('search') then filter(name__icontains=search)"
        },
        {
          id: 'perform_create',
          description: 'perform_create sets created_by',
          test: (code) => /serializer\.save\s*\(.*created_by/.test(code),
          points: 25,
          failFeedback: 'serializer.save(created_by=self.request.user.username)'
        },
        {
          id: 'serializer_per_action',
          description: 'get_serializer_class returns different serializers',
          test: (code) => /self\.action\s*==\s*['"]list['"]/.test(code) && /ProjectDetailSerializer/.test(code),
          points: 30,
          failFeedback: "if self.action == 'list': return ProjectListSerializer else: return ProjectDetailSerializer"
        }
      ]
    },
    hints: [
      'self.action is the name of the current action: list, create, retrieve, update, destroy',
      'get_serializer_class lets you return different serializers depending on the action',
      'perform_create and perform_destroy are the hooks — not create() or destroy() directly',
      'self.request in a ViewSet is the DRF Request object — use self.request.user for auth'
    ],
    docs: [
      {
        heading: 'ModelViewSet hooks',
        content: 'Override these methods to customise behaviour.',
        code: `def get_queryset(self):          # dynamic queryset
def get_serializer_class(self):  # per-action serializer
def perform_create(self, s):     # before save on create
def perform_update(self, s):     # before save on update
def perform_destroy(self, obj):  # before delete`
      }
    ],
    prerequisite: 26
  },

  {
    id: 28,
    module: 4,
    moduleTitle: 'DRF Views',
    category: 'Django',
    title: 'Custom Actions with @action',
    topic: 'Adding non-standard endpoints like /api/issues/summary/',
    concept: `## Beyond CRUD

Sometimes you need endpoints that don't fit GET-one / GET-all / POST / PUT / DELETE. Examples:
- \`POST /api/issues/1/resolve/\` — mark an issue as resolved
- \`GET /api/projects/summary/\` — return stats about all projects
- \`POST /api/students/1/enroll/\` — enroll a student

## The @action decorator

\`\`\`python
from rest_framework.decorators import action
from rest_framework.response import Response

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        issue = self.get_object()
        issue.is_resolved = True
        issue.save()
        return Response({'status': 'resolved'})
\`\`\`

## detail=True vs detail=False

- \`detail=True\` — operates on a single object, URL: \`/api/issues/1/resolve/\`
- \`detail=False\` — operates on the collection, URL: \`/api/issues/summary/\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Project, Issue
from .serializers import ProjectSerializer

class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    # detail=False: URL is /api/projects/summary/ (no pk)
    @action(detail=False, methods=['get'])
    def summary(self, request):
        data = {
            'total': Project.objects.count(),
            'open_issues': Issue.objects.filter(is_resolved=False).count(),
        }
        return Response(data)

    # detail=True: URL is /api/projects/1/close/ (with pk)
    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        project = self.get_object()  # uses pk from URL
        project.is_active = False
        project.save()
        return Response({'status': 'closed', 'project': project.name})`,
      explanation: 'detail=True adds the action to the single-object URL. detail=False adds it to the list URL. Method name becomes the URL segment.'
    },
    guided: {
      instructions: 'Add a custom action to enroll a student.',
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import ___________
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @___________(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        student = self.___________()    # get the specific student
        student.is_enrolled = True
        student.save()
        return Response({'status': 'enrolled'})`,
      solution: `from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    @action(detail=True, methods=['post'])
    def enroll(self, request, pk=None):
        student = self.get_object()
        student.is_enrolled = True
        student.save()
        return Response({'status': 'enrolled'})`,
      evalChecks: [
        {
          id: 'imports_action',
          description: 'Imports action decorator',
          test: (code) => /from\s+rest_framework\.decorators\s+import\s+action/.test(code),
          points: 25,
          failFeedback: 'from rest_framework.decorators import action'
        },
        {
          id: 'action_decorator',
          description: '@action decorator applied',
          test: (code) => /@action\s*\(.*detail\s*=\s*True/.test(code),
          points: 30,
          failFeedback: '@action(detail=True, methods=["post"])'
        },
        {
          id: 'get_object',
          description: 'Uses self.get_object()',
          test: (code) => /self\.get_object\s*\(\s*\)/.test(code),
          points: 25,
          failFeedback: 'student = self.get_object() — fetches the object by pk'
        },
        {
          id: 'returns_response',
          description: 'Returns a Response',
          test: (code) => /return\s+Response\s*\(/.test(code),
          points: 20,
          failFeedback: 'return Response({...})'
        }
      ]
    },
    challenge: {
      instructions: `Add two custom actions to an \`IssueViewSet\`:

1. \`resolve\` — \`detail=True\`, POST, sets \`is_resolved=True\`, returns \`{"status": "resolved", "issue": issue.title}\`
2. \`stats\` — \`detail=False\`, GET, returns total count, open count, and resolved count of issues`,
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom .models import Issue\nfrom .serializers import IssueSerializer\n\nclass IssueViewSet(ModelViewSet):\n    queryset = Issue.objects.all()\n    serializer_class = IssueSerializer\n\n    # Add resolve action here\n\n    # Add stats action here\n`,
      solution: `from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Issue
from .serializers import IssueSerializer

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        issue = self.get_object()
        issue.is_resolved = True
        issue.save()
        return Response({'status': 'resolved', 'issue': issue.title})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total = Issue.objects.count()
        open_count = Issue.objects.filter(is_resolved=False).count()
        resolved_count = Issue.objects.filter(is_resolved=True).count()
        return Response({
            'total': total,
            'open': open_count,
            'resolved': resolved_count,
        })`,
      evalChecks: [
        {
          id: 'resolve_action',
          description: 'resolve action with detail=True',
          test: (code) => /@action\s*\(.*detail\s*=\s*True[\s\S]*?\ndef\s+resolve/.test(code) || /def\s+resolve[\s\S]*?is_resolved\s*=\s*True/.test(code),
          points: 30,
          failFeedback: '@action(detail=True, methods=["post"]) then def resolve(self, request, pk=None):'
        },
        {
          id: 'sets_resolved',
          description: 'resolve sets is_resolved=True and saves',
          test: (code) => /is_resolved\s*=\s*True/.test(code) && /\.save\s*\(\s*\)/.test(code),
          points: 20,
          failFeedback: 'issue.is_resolved = True; issue.save()'
        },
        {
          id: 'stats_action',
          description: 'stats action with detail=False',
          test: (code) => /@action\s*\(.*detail\s*=\s*False/.test(code) && /def\s+stats/.test(code),
          points: 25,
          failFeedback: '@action(detail=False, methods=["get"]) then def stats(self, request):'
        },
        {
          id: 'stats_counts',
          description: 'stats returns total, open, and resolved counts',
          test: (code) => /\.count\s*\(\s*\)/.test(code) && /total|open|resolved/.test(code),
          points: 25,
          failFeedback: 'Count total, open, and resolved issues and return them in the Response'
        }
      ]
    },
    hints: [
      '@action(detail=True, methods=["post"]) for single-object actions',
      '@action(detail=False, methods=["get"]) for collection-level actions',
      'detail=True actions: URL is /api/things/1/action_name/',
      'detail=False actions: URL is /api/things/action_name/'
    ],
    docs: [
      {
        heading: '@action decorator',
        content: 'Add custom endpoints to a ViewSet.',
        code: `@action(detail=True, methods=['post'])
def my_action(self, request, pk=None):
    obj = self.get_object()
    # do something
    return Response({'status': 'done'})

# detail=True  → /api/things/1/my_action/
# detail=False → /api/things/my_action/`
      }
    ],
    prerequisite: 27
  }
];

export const module5 = [
  {
    id: 29,
    module: 5,
    moduleTitle: 'DRF Routers & URLs',
    category: 'Django',
    title: 'path() and urlpatterns',
    topic: 'URL matching, order matters, the name= argument',
    concept: `## How Django routes URLs

Django's URL dispatcher checks each pattern in \`urlpatterns\` from top to bottom. The first match wins.

\`\`\`python
from django.urls import path
from . import views

urlpatterns = [
    path('courses/', views.CourseList.as_view()),
    path('courses/<int:pk>/', views.CourseDetail.as_view()),
]
\`\`\`

## path() arguments

\`path(route, view, name=None)\`

- \`route\` — the URL pattern string
- \`view\` — the view to call (use \`.as_view()\` for class-based views)
- \`name\` — optional name for reverse URL lookup

## Order matters

\`\`\`python
urlpatterns = [
    path('courses/new/', views.NewCourse.as_view()),    # must come first
    path('courses/<int:pk>/', views.CourseDetail.as_view()),  # would match 'new' as pk otherwise
]
\`\`\`

Specific patterns before dynamic ones.

## name= for reverse URLs

\`\`\`python
path('courses/', CourseList.as_view(), name='course-list')

# In a template or view:
from django.urls import reverse
url = reverse('course-list')   # → '/courses/'
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `# urls.py (app level)
from django.urls import path
from .views import IssueList, IssueDetail, IssueComments

urlpatterns = [
    # Static patterns first
    path('issues/', IssueList.as_view(), name='issue-list'),
    # ^ matches: /api/issues/

    # Dynamic patterns after
    path('issues/<int:pk>/', IssueDetail.as_view(), name='issue-detail'),
    # ^ matches: /api/issues/5/

    # Nested resource
    path('issues/<int:issue_id>/comments/', IssueComments.as_view(), name='issue-comments'),
    # ^ matches: /api/issues/5/comments/
]

# In project urls.py:
# path('api/', include('issues.urls'))
# → all patterns above get /api/ prefix`,
      explanation: 'urlpatterns is a list of path() calls. Order matters — put specific routes before dynamic ones. name= enables reverse URL lookups.'
    },
    guided: {
      instructions: 'Complete the urlpatterns for the Course views.',
      language: 'python',
      starterCode: `from django.urls import ___________
from .views import CourseList, CourseDetail

urlpatterns = [
    path('courses/', CourseList.___________, name='course-list'),
    path('courses/<int:___________>/', CourseDetail.as_view(), name='___________'),
]`,
      solution: `from django.urls import path
from .views import CourseList, CourseDetail

urlpatterns = [
    path('courses/', CourseList.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetail.as_view(), name='course-detail'),
]`,
      evalChecks: [
        {
          id: 'imports_path',
          description: 'Imports path from django.urls',
          test: (code) => /from\s+django\.urls\s+import.*path/.test(code),
          points: 20,
          failFeedback: 'from django.urls import path'
        },
        {
          id: 'as_view',
          description: 'Uses .as_view() on both views',
          test: (code) => (code.match(/\.as_view\s*\(\s*\)/g) || []).length >= 2,
          points: 30,
          failFeedback: 'Class-based views need .as_view() to become callable: CourseList.as_view()'
        },
        {
          id: 'int_pk',
          description: 'Uses <int:pk> for detail URL',
          test: (code) => /<int:pk>/.test(code),
          points: 30,
          failFeedback: "Use <int:pk> to capture the course id: path('courses/<int:pk>/', ...)"
        },
        {
          id: 'names',
          description: 'Both paths have name= argument',
          test: (code) => (code.match(/name\s*=\s*['"][^'"]+['"]/g) || []).length >= 2,
          points: 20,
          failFeedback: "Add name= to both paths: name='course-list' and name='course-detail'"
        }
      ]
    },
    challenge: {
      instructions: `Write the complete \`urls.py\` for an issues app with:
- \`GET/POST /api/issues/\` → IssueList view
- \`GET/PUT/DELETE /api/issues/<pk>/\` → IssueDetail view
- \`GET/POST /api/issues/<issue_id>/comments/\` → CommentList view

Import the views from \`.views\`. Add appropriate \`name=\` to each.`,
      language: 'python',
      starterCode: `# urls.py\n# Write the URL configuration for the issues app\n`,
      solution: `from django.urls import path
from .views import IssueList, IssueDetail, CommentList

urlpatterns = [
    path('issues/', IssueList.as_view(), name='issue-list'),
    path('issues/<int:pk>/', IssueDetail.as_view(), name='issue-detail'),
    path('issues/<int:issue_id>/comments/', CommentList.as_view(), name='issue-comments'),
]`,
      evalChecks: [
        {
          id: 'three_paths',
          description: 'Three path() entries defined',
          test: (code) => (code.match(/\bpath\s*\(/g) || []).length >= 3,
          points: 25,
          failFeedback: 'Define three path() entries: issues/, issues/<pk>/, issues/<id>/comments/'
        },
        {
          id: 'as_view_all',
          description: 'All views use .as_view()',
          test: (code) => (code.match(/\.as_view\s*\(\s*\)/g) || []).length >= 3,
          points: 25,
          failFeedback: 'All class-based views need .as_view()'
        },
        {
          id: 'nested_url',
          description: 'Nested comments URL defined with issue_id',
          test: (code) => /issues\/.*issue_id.*comments/.test(code) || /<int:issue_id>/.test(code),
          points: 25,
          failFeedback: "path('issues/<int:issue_id>/comments/', CommentList.as_view())"
        },
        {
          id: 'names_set',
          description: 'All paths have name= argument',
          test: (code) => (code.match(/name\s*=\s*['"][^'"]+['"]/g) || []).length >= 3,
          points: 25,
          failFeedback: 'Add name= to all three paths'
        }
      ]
    },
    hints: [
      'urlpatterns is a Python list — each item is a path() call',
      'Class-based views MUST use .as_view() — function-based views do not need it',
      'Put static routes before dynamic ones: issues/new/ before issues/<pk>/',
      "name= lets you use reverse('issue-list') elsewhere in your code"
    ],
    docs: [
      {
        heading: 'path() syntax',
        content: 'The three arguments to path().',
        code: `path(
    'route/string/',          # the URL pattern
    ViewClass.as_view(),      # the view
    name='url-name'           # optional reverse name
)`
      },
      {
        heading: 'URL converters',
        content: 'Built-in converters for URL parameters.',
        code: `<int:pk>     → integer  → view receives pk as int
<str:slug>   → string   → view receives slug as str
<uuid:id>    → UUID     → view receives id as UUID
<path:rest>  → any path → includes slashes`
      }
    ],
    prerequisite: null
  },

  {
    id: 30,
    module: 5,
    moduleTitle: 'DRF Routers & URLs',
    category: 'Django',
    title: 'URL Parameters — <int:pk> and others',
    topic: 'Capturing values, <str:slug>, <uuid:id>',
    concept: `## Capturing values from the URL

When you write \`<int:pk>\` in a URL pattern, Django captures that part of the URL and passes it as a keyword argument to the view.

\`\`\`python
path('courses/<int:pk>/', CourseDetail.as_view())
\`\`\`

URL \`/courses/42/\` → calls view with \`pk=42\`

## Built-in converters

| Converter | Matches | Passes as |
|-----------|---------|-----------|
| \`int\` | digits | Python \`int\` |
| \`str\` | any non-slash string | Python \`str\` |
| \`slug\` | letters, numbers, hyphens | Python \`str\` |
| \`uuid\` | UUID format | Python \`uuid.UUID\` |
| \`path\` | any string including slashes | Python \`str\` |

## Receiving parameters in the view

\`\`\`python
class CourseDetail(RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    # pk comes from <int:pk> in the URL — DRF uses it automatically

# In APIView, you receive it as a parameter:
class CourseDetail(APIView):
    def get(self, request, pk):  # pk from URL
        course = get_object_or_404(Course, pk=pk)
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from django.urls import path
from .views import (
    IssueDetail,       # /api/issues/5/
    StudentDetail,     # /api/students/22/U/0001/ (uses reg_number)
    ArticleDetail,     # /api/articles/my-article-slug/
)

urlpatterns = [
    # <int:pk> — captures digits, passes as integer named 'pk'
    path('issues/<int:pk>/', IssueDetail.as_view()),

    # <str:reg_number> — captures any string, passes as 'reg_number'
    path('students/<str:reg_number>/', StudentDetail.as_view()),

    # <slug:slug> — captures slug strings only
    path('articles/<slug:slug>/', ArticleDetail.as_view()),
]

# In a view using APIView:
class IssueDetail(APIView):
    def get(self, request, pk):   # pk comes from URL
        issue = get_object_or_404(Issue, pk=pk)
        return Response(IssueSerializer(issue).data)`,
      explanation: 'URL converters capture and type-cast URL segments. The variable name in the pattern matches the parameter name in the view method.'
    },
    guided: {
      instructions: 'Fix the URL pattern to capture the correct parameter type for each view.',
      language: 'python',
      starterCode: `from django.urls import path
from .views import StudentDetail, ProjectDetail

urlpatterns = [
    # Student lookup by reg_number (a string like "22/U/0001")
    path('students/<___________:reg_number>/', StudentDetail.as_view()),

    # Project lookup by integer id
    path('projects/<___________:pk>/', ProjectDetail.as_view()),
]`,
      solution: `from django.urls import path
from .views import StudentDetail, ProjectDetail

urlpatterns = [
    path('students/<str:reg_number>/', StudentDetail.as_view()),
    path('projects/<int:pk>/', ProjectDetail.as_view()),
]`,
      evalChecks: [
        {
          id: 'str_converter',
          description: 'Uses <str:reg_number> for string parameter',
          test: (code) => /<str:reg_number>/.test(code),
          points: 50,
          failFeedback: '<str:reg_number> — reg_number is a string like "22/U/0001"'
        },
        {
          id: 'int_converter',
          description: 'Uses <int:pk> for integer parameter',
          test: (code) => /<int:pk>/.test(code),
          points: 50,
          failFeedback: '<int:pk> — project id is an integer'
        }
      ]
    },
    challenge: {
      instructions: `Write URL patterns and view stubs for a blog API:
- \`/api/posts/\` — PostList (GET/POST)
- \`/api/posts/<int:pk>/\` — PostDetail (GET/PUT/DELETE)
- \`/api/posts/<int:post_id>/comments/\` — CommentList (GET/POST)
- \`/api/posts/<slug:slug>/preview/\` — PostPreview (GET, lookup by slug)

Import all views from .views.`,
      language: 'python',
      starterCode: `# urls.py\n`,
      solution: `from django.urls import path
from .views import PostList, PostDetail, CommentList, PostPreview

urlpatterns = [
    path('posts/', PostList.as_view(), name='post-list'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentList.as_view(), name='post-comments'),
    path('posts/<slug:slug>/preview/', PostPreview.as_view(), name='post-preview'),
]`,
      evalChecks: [
        {
          id: 'four_paths',
          description: 'Four path() entries defined',
          test: (code) => (code.match(/\bpath\s*\(/g) || []).length >= 4,
          points: 25,
          failFeedback: 'Define four path() entries'
        },
        {
          id: 'int_pk',
          description: 'Uses <int:pk> for post detail',
          test: (code) => /<int:pk>/.test(code),
          points: 25,
          failFeedback: "<int:pk> for the post detail URL"
        },
        {
          id: 'nested_comments',
          description: 'Nested comments URL with post_id',
          test: (code) => /<int:post_id>/.test(code),
          points: 25,
          failFeedback: "<int:post_id> for the nested comments URL"
        },
        {
          id: 'slug_converter',
          description: 'Uses <slug:slug> for preview',
          test: (code) => /<slug:slug>/.test(code),
          points: 25,
          failFeedback: "<slug:slug> for the preview URL"
        }
      ]
    },
    hints: [
      '<int:pk> for integer IDs, <str:name> for string values, <slug:slug> for slug strings',
      'The variable name in <type:name> becomes the parameter name in the view',
      "Use path('things/<int:pk>/', ...) not path('things/{pk}/', ...) — that is Flask syntax",
      "For a nested URL like /issues/5/comments/, use <int:issue_id> to capture 5"
    ],
    docs: [
      {
        heading: 'URL converters',
        content: 'Type converters for URL parameters.',
        code: `<int:pk>       matches integers  → pk=42
<str:name>     any non-slash   → name="hello"
<slug:slug>    letters/hyphens → slug="my-post"
<uuid:id>      UUID format     → id=uuid.UUID(...)
<path:rest>    includes /      → rest="a/b/c"`
      }
    ],
    prerequisite: 29
  },

  {
    id: 31,
    module: 5,
    moduleTitle: 'DRF Routers & URLs',
    category: 'Django',
    title: '.as_view() — Why It\'s Required',
    topic: 'Class instantiation per request, what happens without it',
    concept: `## The problem with class-based views in URLs

Django's URL dispatcher expects a **callable** — a function that takes a request and returns a response.

A class is not a callable in this sense:

\`\`\`python
path('courses/', CourseList)   # ❌ wrong — Django gets a class, not a function
\`\`\`

## What .as_view() does

\`.as_view()\` is a class method that creates a wrapper function. When a request comes in:

1. Django calls the wrapper function
2. The wrapper creates a **new instance** of the view class
3. The instance's \`dispatch()\` method is called
4. \`dispatch()\` routes to the right method (\`get\`, \`post\`, etc.)

\`\`\`python
path('courses/', CourseList.as_view())   # ✅ correct
\`\`\`

## Why a new instance per request?

This is intentional. It prevents state from leaking between requests. If all requests shared one instance, data from one user's request could bleed into another's.

## Passing kwargs to as_view()

You can pass default kwargs to override class attributes:

\`\`\`python
path('courses/', CourseList.as_view(queryset=Course.objects.filter(is_active=True)))
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from django.urls import path
from .views import CourseList, CourseDetail

# ✅ Correct — .as_view() wraps the class into a callable
urlpatterns = [
    path('courses/', CourseList.as_view()),
    path('courses/<int:pk>/', CourseDetail.as_view()),
]

# What .as_view() is roughly equivalent to:
def course_list_view(request, *args, **kwargs):
    view_instance = CourseList()           # new instance per request
    view_instance.request = request
    return view_instance.dispatch(request, *args, **kwargs)  # routes to get/post/etc.

# dispatch() routes based on HTTP method:
# GET  → view_instance.get(request, ...)
# POST → view_instance.post(request, ...)`,
      explanation: '.as_view() creates a new view instance per request, preventing shared state. Required for all class-based views in urlpatterns.'
    },
    guided: {
      instructions: 'Fix the URL patterns — some are missing .as_view().',
      language: 'python',
      starterCode: `from django.urls import path
from .views import IssueList, IssueDetail

urlpatterns = [
    path('issues/', IssueList),               # ← fix this
    path('issues/<int:pk>/', IssueDetail.as_view()),  # ← this is correct
]`,
      solution: `from django.urls import path
from .views import IssueList, IssueDetail

urlpatterns = [
    path('issues/', IssueList.as_view()),
    path('issues/<int:pk>/', IssueDetail.as_view()),
]`,
      evalChecks: [
        {
          id: 'both_as_view',
          description: 'Both views use .as_view()',
          test: (code) => (code.match(/\.as_view\s*\(\s*\)/g) || []).length >= 2,
          points: 70,
          failFeedback: 'Both IssueList and IssueDetail need .as_view()'
        },
        {
          id: 'issue_list_path',
          description: 'IssueList registered at issues/',
          test: (code) => /path\s*\(\s*['"]issues\/['"].*IssueList\.as_view/.test(code),
          points: 30,
          failFeedback: "path('issues/', IssueList.as_view())"
        }
      ]
    },
    challenge: {
      instructions: `Explain (in comments) what .as_view() does, then write the urlpatterns for StudentList and StudentDetail views.

The explanation comments should cover:
1. Why .as_view() is needed
2. When the view instance is created
3. What dispatch() does`,
      language: 'python',
      starterCode: `from django.urls import path\nfrom .views import StudentList, StudentDetail\n\n# Explain .as_view() here:\n# 1.\n# 2.\n# 3.\n\nurlpatterns = [\n    # Write the URL patterns here\n]\n`,
      solution: `from django.urls import path
from .views import StudentList, StudentDetail

# 1. .as_view() wraps the class into a callable function Django can call
# 2. A new instance is created for each request — prevents shared state
# 3. dispatch() routes to get/post/put/delete based on the HTTP method

urlpatterns = [
    path('students/', StudentList.as_view(), name='student-list'),
    path('students/<int:pk>/', StudentDetail.as_view(), name='student-detail'),
]`,
      evalChecks: [
        {
          id: 'both_as_view',
          description: 'Both views use .as_view()',
          test: (code) => (code.match(/\.as_view\s*\(\s*\)/g) || []).length >= 2,
          points: 40,
          failFeedback: 'StudentList.as_view() and StudentDetail.as_view()'
        },
        {
          id: 'correct_urls',
          description: 'Correct URL patterns with pk for detail',
          test: (code) => /path\s*\(\s*['"]students\/['"]/.test(code) && /<int:pk>/.test(code),
          points: 30,
          failFeedback: "path('students/', ...) and path('students/<int:pk>/', ...)"
        },
        {
          id: 'explanation_present',
          description: 'Comments explain as_view',
          test: (code) => /#.*as_view|#.*instance|#.*dispatch/.test(code),
          points: 30,
          failFeedback: 'Add comments explaining what .as_view() does'
        }
      ]
    },
    hints: [
      "Without .as_view(), Django receives a class object — it won't know how to call it",
      '.as_view() returns a function. That function creates a new class instance per request.',
      'dispatch() is the method that reads request.method and calls get(), post(), etc.',
      'Never share state via class attributes — each request gets a fresh instance'
    ],
    docs: [
      {
        heading: '.as_view() explained',
        content: 'What happens when a request arrives at a class-based view.',
        code: `# Request arrives at /api/courses/
# Django calls the wrapper from .as_view()
# Wrapper creates: instance = CourseList()
# Wrapper calls: instance.dispatch(request, ...)
# dispatch routes: GET → instance.get(request, ...)`
      }
    ],
    prerequisite: 30
  },

  {
    id: 32,
    module: 5,
    moduleTitle: 'DRF Routers & URLs',
    category: 'Django',
    title: 'Routers — Auto-generating URLs',
    topic: 'DefaultRouter, register(), what routes get created',
    concept: `## The problem with manual ViewSet URLs

A ViewSet has 6 actions. You'd need to write multiple URL patterns manually for each ViewSet, matching them to the right action. Tedious and error-prone.

## DefaultRouter does it automatically

\`\`\`python
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet

router = DefaultRouter()
router.register('issues', IssueViewSet)

urlpatterns = router.urls
\`\`\`

This auto-generates all 6 URL patterns:

| URL | Method | Action |
|-----|--------|--------|
| /api/issues/ | GET | list |
| /api/issues/ | POST | create |
| /api/issues/{pk}/ | GET | retrieve |
| /api/issues/{pk}/ | PUT | update |
| /api/issues/{pk}/ | PATCH | partial_update |
| /api/issues/{pk}/ | DELETE | destroy |

## register() arguments

\`router.register(prefix, viewset, basename=None)\`

- \`prefix\` — the URL prefix (\`'issues'\` → \`/issues/\`)
- \`viewset\` — the ViewSet class
- \`basename\` — used for URL names (\`issue-list\`, \`issue-detail\`) — inferred from queryset if not set`,
    annotatedExample: {
      language: 'python',
      code: `# urls.py (app level)
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet, ProjectViewSet, StudentViewSet

router = DefaultRouter()

# Each register() generates all CRUD URLs for that ViewSet
router.register('issues', IssueViewSet)
router.register('projects', ProjectViewSet)
router.register('students', StudentViewSet)

# router.urls contains all generated URL patterns
urlpatterns = router.urls

# What gets generated for 'issues':
# GET  /issues/          → IssueViewSet.list
# POST /issues/          → IssueViewSet.create
# GET  /issues/{pk}/     → IssueViewSet.retrieve
# PUT  /issues/{pk}/     → IssueViewSet.update
# PATCH /issues/{pk}/    → IssueViewSet.partial_update
# DELETE /issues/{pk}/   → IssueViewSet.destroy
# + any @action URLs: /issues/{pk}/resolve/, /issues/stats/`,
      explanation: 'DefaultRouter generates all CRUD URL patterns from a single register() call. Combine with include() in the project urls.py to add a prefix.'
    },
    guided: {
      instructions: 'Set up a router for three ViewSets.',
      language: 'python',
      starterCode: `from rest_framework.routers import ___________
from .views import CourseViewSet, DepartmentViewSet

router = ___________()
router.___________(r'courses', CourseViewSet)
router.___________(r'departments', DepartmentViewSet)

urlpatterns = router.___________`,
      solution: `from rest_framework.routers import DefaultRouter
from .views import CourseViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'departments', DepartmentViewSet)

urlpatterns = router.urls`,
      evalChecks: [
        {
          id: 'default_router',
          description: 'Uses DefaultRouter',
          test: (code) => /DefaultRouter\s*\(\s*\)/.test(code),
          points: 25,
          failFeedback: 'router = DefaultRouter()'
        },
        {
          id: 'registers_courses',
          description: 'Registers courses ViewSet',
          test: (code) => /router\.register\s*\(.*courses.*CourseViewSet/.test(code),
          points: 25,
          failFeedback: "router.register(r'courses', CourseViewSet)"
        },
        {
          id: 'registers_departments',
          description: 'Registers departments ViewSet',
          test: (code) => /router\.register\s*\(.*departments.*DepartmentViewSet/.test(code),
          points: 25,
          failFeedback: "router.register(r'departments', DepartmentViewSet)"
        },
        {
          id: 'router_urls',
          description: 'urlpatterns = router.urls',
          test: (code) => /urlpatterns\s*=\s*router\.urls/.test(code),
          points: 25,
          failFeedback: 'urlpatterns = router.urls'
        }
      ]
    },
    challenge: {
      instructions: `Write the complete URL setup for an API with:
- \`IssueViewSet\`
- \`ProjectViewSet\`
- \`StudentViewSet\`

Use DefaultRouter. Combine \`router.urls\` with manual path entries for two non-ViewSet views:
- \`GET /api/stats/\` → \`StatsView.as_view()\`
- \`POST /api/auth/login/\` → \`LoginView.as_view()\``,
      language: 'python',
      starterCode: `from rest_framework.routers import DefaultRouter\nfrom django.urls import path\nfrom .views import IssueViewSet, ProjectViewSet, StudentViewSet, StatsView, LoginView\n\n# Set up router and combine with manual paths\n`,
      solution: `from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import IssueViewSet, ProjectViewSet, StudentViewSet, StatsView, LoginView

router = DefaultRouter()
router.register(r'issues', IssueViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = router.urls + [
    path('stats/', StatsView.as_view()),
    path('auth/login/', LoginView.as_view()),
]`,
      evalChecks: [
        {
          id: 'router_setup',
          description: 'DefaultRouter created and ViewSets registered',
          test: (code) => /DefaultRouter/.test(code) && (code.match(/router\.register/g) || []).length >= 3,
          points: 30,
          failFeedback: 'Create DefaultRouter and register all three ViewSets'
        },
        {
          id: 'combines_urls',
          description: 'Combines router.urls with manual paths using +',
          test: (code) => /router\.urls\s*\+|router\.urls\s*,/.test(code) || /urlpatterns\s*=\s*\[/.test(code),
          points: 30,
          failFeedback: 'urlpatterns = router.urls + [path(...), path(...)]'
        },
        {
          id: 'stats_path',
          description: 'StatsView path defined',
          test: (code) => /path\s*\(.*stats.*StatsView/.test(code),
          points: 20,
          failFeedback: "path('stats/', StatsView.as_view())"
        },
        {
          id: 'login_path',
          description: 'LoginView path defined',
          test: (code) => /path\s*\(.*login.*LoginView/.test(code),
          points: 20,
          failFeedback: "path('auth/login/', LoginView.as_view())"
        }
      ]
    },
    hints: [
      'DefaultRouter() creates the router — then call .register() for each ViewSet',
      "router.register('prefix', ViewSetClass) — prefix becomes the URL base",
      'urlpatterns = router.urls — or combine: router.urls + [path(...)]',
      'router.urls already contains all the generated patterns as a list'
    ],
    docs: [
      {
        heading: 'DefaultRouter setup',
        content: 'The complete router pattern.',
        code: `from rest_framework.routers import DefaultRouter
from .views import MyViewSet

router = DefaultRouter()
router.register(r'things', MyViewSet, basename='thing')

urlpatterns = router.urls
# Generates:
# GET/POST  /things/
# GET/PUT/PATCH/DELETE  /things/{pk}/`
      }
    ],
    prerequisite: 31
  },

  {
    id: 33,
    module: 5,
    moduleTitle: 'DRF Routers & URLs',
    category: 'Django',
    title: 'include() — Splitting URL Files',
    topic: 'Project urls.py vs app urls.py, api/ prefix',
    concept: `## Why split URL files

Putting all URLs in one file doesn't scale. Each app should own its own \`urls.py\`, and the project delegates to them.

## include()

\`include()\` takes a module path or a urlpatterns list and inserts it at a given prefix:

\`\`\`python
# project urls.py
from django.urls import path, include

urlpatterns = [
    path('api/', include('issues.urls')),
    path('admin/', admin.site.urls),
]
\`\`\`

All URLs defined in \`issues/urls.py\` are now available under \`/api/\`.

## The full URL

If \`issues/urls.py\` has \`path('issues/', ...)\`, it's accessible at:

\`\`\`
/api/issues/       (project prefix + app path)
\`\`\`

## Namespacing

\`\`\`python
path('api/', include(('issues.urls', 'issues')))
\`\`\`

The second element \`'issues'\` is the namespace. URL names become \`issues:issue-list\` instead of \`issue-list\`.`,
    annotatedExample: {
      language: 'python',
      code: `# project/urls.py (root URL configuration)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # All URLs from issues/urls.py are under /api/
    path('api/', include('issues.urls')),

    # You can include multiple apps:
    path('api/', include('students.urls')),  # /api/ + students/ paths
]

# issues/urls.py
from rest_framework.routers import DefaultRouter
from .views import IssueViewSet

router = DefaultRouter()
router.register(r'issues', IssueViewSet)

urlpatterns = router.urls
# → /api/issues/         GET/POST
# → /api/issues/{pk}/    GET/PUT/PATCH/DELETE`,
      explanation: 'Project urls.py uses include() to delegate to each app. Each app manages its own URLs. The include prefix is prepended to all app URLs.'
    },
    guided: {
      instructions: 'Wire up the project urls.py to include both app URL files.',
      language: 'python',
      starterCode: `from django.contrib import admin
from django.urls import path, ___________

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include the issues app URLs under /api/
    path('api/', ___________('issues.urls')),
    # Include the students app URLs under /api/
    path('___________/', include('students.urls')),
]`,
      solution: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),
    path('api/', include('students.urls')),
]`,
      evalChecks: [
        {
          id: 'imports_include',
          description: 'Imports include from django.urls',
          test: (code) => /from\s+django\.urls\s+import.*include/.test(code),
          points: 25,
          failFeedback: 'from django.urls import path, include'
        },
        {
          id: 'includes_issues',
          description: 'Includes issues.urls',
          test: (code) => /include\s*\(\s*['"]issues\.urls['"]/.test(code),
          points: 35,
          failFeedback: "path('api/', include('issues.urls'))"
        },
        {
          id: 'includes_students',
          description: 'Includes students.urls under api/',
          test: (code) => /include\s*\(\s*['"]students\.urls['"]/.test(code),
          points: 40,
          failFeedback: "path('api/', include('students.urls'))"
        }
      ]
    },
    challenge: {
      instructions: `Write a complete project urls.py for a university API with:
- Django admin at \`/admin/\`
- \`issues\` app URLs at \`/api/\`
- \`students\` app URLs at \`/api/\`
- \`courses\` app URLs at \`/api/\`

And write a simple \`courses/urls.py\` that registers a \`CourseViewSet\` with a DefaultRouter.`,
      language: 'python',
      starterCode: `# project/urls.py\n\n\n# courses/urls.py\n`,
      solution: `# project/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('issues.urls')),
    path('api/', include('students.urls')),
    path('api/', include('courses.urls')),
]

# courses/urls.py
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet

router = DefaultRouter()
router.register(r'courses', CourseViewSet)

urlpatterns = router.urls`,
      evalChecks: [
        {
          id: 'admin_url',
          description: 'Admin URL defined',
          test: (code) => /path\s*\(\s*['"]admin\/['"].*admin\.site\.urls/.test(code),
          points: 20,
          failFeedback: "path('admin/', admin.site.urls)"
        },
        {
          id: 'three_apps',
          description: 'All three app URLs included',
          test: (code) => /include\s*\(\s*['"]issues\.urls['"]/.test(code) && /include\s*\(\s*['"]students\.urls['"]/.test(code) && /include\s*\(\s*['"]courses\.urls['"]/.test(code),
          points: 30,
          failFeedback: "Include all three: include('issues.urls'), include('students.urls'), include('courses.urls')"
        },
        {
          id: 'course_router',
          description: 'courses/urls.py uses DefaultRouter',
          test: (code) => /DefaultRouter/.test(code) && /CourseViewSet/.test(code),
          points: 30,
          failFeedback: 'In courses/urls.py: router = DefaultRouter(); router.register("courses", CourseViewSet)'
        },
        {
          id: 'urlpatterns_router',
          description: 'courses urlpatterns = router.urls',
          test: (code) => /urlpatterns\s*=\s*router\.urls/.test(code),
          points: 20,
          failFeedback: 'urlpatterns = router.urls in courses/urls.py'
        }
      ]
    },
    hints: [
      "include('app.urls') pulls in all URL patterns from that module",
      'Multiple apps can share the same prefix: path("api/", include("app1.urls")), path("api/", include("app2.urls"))',
      "The full URL = project prefix + app URL: 'api/' + 'courses/' = '/api/courses/'",
      'Keep each app responsible for its own URLs — the project file just delegates'
    ],
    docs: [
      {
        heading: 'Project + app URL structure',
        content: 'The standard two-level URL organization.',
        code: `# project/urls.py
urlpatterns = [
    path('api/', include('myapp.urls')),
]

# myapp/urls.py
urlpatterns = [
    path('things/', ThingList.as_view()),
]

# Combined: GET /api/things/`
      }
    ],
    prerequisite: 32
  }
];
