export const module6 = [
  {
    id: 34,
    module: 6,
    moduleTitle: 'Authentication & Permissions',
    category: 'Django',
    title: 'Token Authentication — How JWT Works',
    topic: 'Headers, access tokens, why stateless auth',
    concept: `## The stateless API problem

Traditional Django sessions store login state on the server. REST APIs should be **stateless** — the server shouldn't remember anything between requests.

The solution: every request carries proof of identity in its header.

## Token authentication

1. User sends \`POST /api/auth/login/\` with username and password
2. Server validates credentials and returns a **token** (a long random string or a JWT)
3. Client stores the token and sends it with every subsequent request:
   \`\`\`
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5...
   \`\`\`
4. Server reads the token from the header, verifies it, and knows who the user is

## JWT — JSON Web Token

A JWT is a base64-encoded JSON object with three parts:
- **Header**: algorithm and token type
- **Payload**: user data (id, role, expiry)
- **Signature**: cryptographic proof the payload wasn't tampered with

\`\`\`
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
  header               payload               signature
\`\`\`

No state on the server. The token itself contains everything needed.

## simplejwt

In DRF, the most common JWT library is \`djangorestframework-simplejwt\`:
\`\`\`python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # all views require auth by default
    ],
}

# urls.py — add JWT endpoints
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # POST with {username, password} → returns {access, refresh} tokens
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),

    # POST with {refresh} → returns new {access} token
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Client usage:
# 1. POST /api/auth/token/ with {username, password}
# 2. Receive: {access: "eyJ...", refresh: "eyJ..."}
# 3. Every request: Authorization: Bearer eyJ...`,
      explanation: 'simplejwt adds two endpoints: token/ to get tokens, token/refresh/ to renew them. Add JWTAuthentication to DEFAULT_AUTHENTICATION_CLASSES.'
    },
    guided: {
      instructions: 'Complete the REST_FRAMEWORK settings to enable JWT authentication.',
      language: 'python',
      starterCode: `# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        '___________simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.___________',
    ],
}`,
      solution: `# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}`,
      evalChecks: [
        {
          id: 'jwt_auth',
          description: 'JWTAuthentication class configured',
          test: (code) => /rest_framework_simplejwt\.authentication\.JWTAuthentication/.test(code),
          points: 50,
          failFeedback: "'rest_framework_simplejwt.authentication.JWTAuthentication'"
        },
        {
          id: 'is_authenticated',
          description: 'IsAuthenticated permission configured',
          test: (code) => /rest_framework\.permissions\.IsAuthenticated/.test(code),
          points: 50,
          failFeedback: "'rest_framework.permissions.IsAuthenticated'"
        }
      ]
    },
    challenge: {
      instructions: `Write the URL configuration that adds JWT endpoints to a project. Include:
1. The token obtain endpoint at \`api/auth/token/\`
2. The token refresh endpoint at \`api/auth/token/refresh/\`
3. The REST_FRAMEWORK settings enabling JWT auth and IsAuthenticated permission by default`,
      language: 'python',
      starterCode: `# Write settings.py JWT config and urls.py token endpoints\n`,
      solution: `# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]`,
      evalChecks: [
        {
          id: 'settings_jwt',
          description: 'REST_FRAMEWORK settings with JWT auth',
          test: (code) => /JWTAuthentication/.test(code),
          points: 25,
          failFeedback: 'Configure DEFAULT_AUTHENTICATION_CLASSES with JWTAuthentication'
        },
        {
          id: 'settings_permission',
          description: 'IsAuthenticated in default permissions',
          test: (code) => /IsAuthenticated/.test(code),
          points: 25,
          failFeedback: 'Configure DEFAULT_PERMISSION_CLASSES with IsAuthenticated'
        },
        {
          id: 'token_obtain',
          description: 'TokenObtainPairView URL added',
          test: (code) => /TokenObtainPairView\.as_view/.test(code),
          points: 25,
          failFeedback: "path('api/auth/token/', TokenObtainPairView.as_view())"
        },
        {
          id: 'token_refresh',
          description: 'TokenRefreshView URL added',
          test: (code) => /TokenRefreshView\.as_view/.test(code),
          points: 25,
          failFeedback: "path('api/auth/token/refresh/', TokenRefreshView.as_view())"
        }
      ]
    },
    hints: [
      "Install: pip install djangorestframework-simplejwt",
      "The package name is 'rest_framework_simplejwt' (underscores, not hyphens)",
      'TokenObtainPairView takes username + password, returns access + refresh tokens',
      'Clients send: Authorization: Bearer <access_token> in request headers'
    ],
    docs: [
      {
        heading: 'JWT auth setup',
        content: 'Minimal JWT configuration for DRF.',
        code: `# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# urls.py
from rest_framework_simplejwt.views import (
    TokenObtainPairView, TokenRefreshView
)
urlpatterns += [
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]`
      }
    ],
    prerequisite: null
  },

  {
    id: 35,
    module: 6,
    moduleTitle: 'Authentication & Permissions',
    category: 'Django',
    title: 'IsAuthenticated Permission Class',
    topic: 'permission_classes, the 401 vs 403 distinction',
    concept: `## What permission classes do

Permission classes decide whether a request is allowed to proceed. DRF checks them after authentication.

\`\`\`python
from rest_framework.permissions import IsAuthenticated

class IssueList(ListAPIView):
    permission_classes = [IsAuthenticated]
\`\`\`

## 401 vs 403

- **401 Unauthorized** — no valid credentials provided at all
- **403 Forbidden** — credentials are valid, but this user is not allowed

DRF returns 401 when no token is sent. It returns 403 when a token is valid but the permission check fails.

## Built-in permission classes

| Class | Allows |
|-------|--------|
| \`AllowAny\` | Everyone, including anonymous |
| \`IsAuthenticated\` | Any authenticated user |
| \`IsAdminUser\` | Admin users only (\`is_staff=True\`) |
| \`IsAuthenticatedOrReadOnly\` | Authenticated for writes, anyone for GET |

## Setting globally vs per-view

Global (in settings.py):
\`\`\`python
REST_FRAMEWORK = {'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated']}
\`\`\`

Per-view (overrides global):
\`\`\`python
class PublicView(ListAPIView):
    permission_classes = [AllowAny]   # public, ignores global setting
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Issue
from .serializers import IssueSerializer

# Only authenticated users can list or create issues
class IssueList(ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]   # overrides global default

# Anyone can read; only authenticated users can update/delete
class IssueDetail(RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# Public endpoint — no auth needed
class PublicStats(ListAPIView):
    queryset = Issue.objects.filter(is_resolved=False)
    serializer_class = IssueSerializer
    permission_classes = [AllowAny]`,
      explanation: 'permission_classes overrides the global default for that view. Use AllowAny for public endpoints, IsAuthenticated for private ones.'
    },
    guided: {
      instructions: 'Apply the correct permission class to each view.',
      language: 'python',
      starterCode: `from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Course
from .serializers import CourseSerializer

# Public: anyone can see the course list
class PublicCourseList(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [___________]

# Private: only authenticated users can add courses
class CourseCreate(ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [___________]`,
      solution: `from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from .models import Course
from .serializers import CourseSerializer

class PublicCourseList(ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [AllowAny]

class CourseCreate(ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]`,
      evalChecks: [
        {
          id: 'allow_any',
          description: 'Public view uses AllowAny',
          test: (code) => /PublicCourseList[\s\S]*?permission_classes\s*=\s*\[\s*AllowAny/.test(code),
          points: 50,
          failFeedback: 'permission_classes = [AllowAny] on the public view'
        },
        {
          id: 'is_authenticated',
          description: 'Private view uses IsAuthenticated',
          test: (code) => /CourseCreate[\s\S]*?permission_classes\s*=\s*\[\s*IsAuthenticated/.test(code),
          points: 50,
          failFeedback: 'permission_classes = [IsAuthenticated] on the private view'
        }
      ]
    },
    challenge: {
      instructions: `Write a custom permission class \`IsProjectOwner\` that:
- Inherits from \`permissions.BasePermission\`
- Allows any GET request (safe methods)
- For other methods, allows only if \`request.user == obj.owner\`

Then apply it to an \`IssueDetail\` view.`,
      language: 'python',
      starterCode: `from rest_framework import permissions\nfrom rest_framework.generics import RetrieveUpdateDestroyAPIView\nfrom .models import Issue\nfrom .serializers import IssueSerializer\n\n# Write IsProjectOwner permission class here\n\n\nclass IssueDetail(RetrieveUpdateDestroyAPIView):\n    queryset = Issue.objects.all()\n    serializer_class = IssueSerializer\n    # Apply the permission here\n`,
      solution: `from rest_framework import permissions
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from .models import Issue
from .serializers import IssueSerializer

class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.owner

class IssueDetail(RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated, IsProjectOwner]`,
      evalChecks: [
        {
          id: 'custom_permission',
          description: 'Custom permission class inherits BasePermission',
          test: (code) => /class\s+\w+\s*\(\s*permissions\.BasePermission\s*\)/.test(code),
          points: 30,
          failFeedback: 'class IsProjectOwner(permissions.BasePermission):'
        },
        {
          id: 'has_object_permission',
          description: 'has_object_permission method defined',
          test: (code) => /def\s+has_object_permission\s*\(\s*self\s*,\s*request\s*,\s*view\s*,\s*obj\s*\)/.test(code),
          points: 30,
          failFeedback: 'def has_object_permission(self, request, view, obj):'
        },
        {
          id: 'safe_methods',
          description: 'Allows SAFE_METHODS (GET etc.)',
          test: (code) => /SAFE_METHODS/.test(code),
          points: 20,
          failFeedback: 'if request.method in permissions.SAFE_METHODS: return True'
        },
        {
          id: 'applied_to_view',
          description: 'Permission applied to IssueDetail view',
          test: (code) => /class\s+IssueDetail[\s\S]*?permission_classes\s*=/.test(code),
          points: 20,
          failFeedback: 'permission_classes = [permissions.IsAuthenticated, IsProjectOwner] on IssueDetail'
        }
      ]
    },
    hints: [
      'permission_classes = [PermClass] — it is a list, so you can combine multiple',
      'AllowAny for public, IsAuthenticated for logged-in users only',
      '401 = no token sent; 403 = token valid but permission denied',
      'Custom permissions inherit BasePermission and implement has_permission or has_object_permission'
    ],
    docs: [
      {
        heading: 'Permission classes',
        content: 'Built-in and custom permission options.',
        code: `AllowAny                    # everyone
IsAuthenticated             # must be logged in
IsAdminUser                 # staff only
IsAuthenticatedOrReadOnly   # GET public, writes auth-only

# Custom:
class MyPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return True/False
    def has_object_permission(self, request, view, obj):
        return True/False`
      }
    ],
    prerequisite: 34
  },

  {
    id: 36,
    module: 6,
    moduleTitle: 'Authentication & Permissions',
    category: 'Django',
    title: 'Login Endpoint — Obtaining a Token',
    topic: 'obtain_auth_token, simplejwt, the request/response',
    concept: `## Getting a token

Before a client can make authenticated requests, it needs a token. There are two common approaches:

### simplejwt (JWT tokens — recommended)
\`\`\`python
POST /api/auth/token/
Body: {"username": "sarah", "password": "pass123"}
Response: {"access": "eyJ...", "refresh": "eyJ..."}
\`\`\`

The access token is short-lived (e.g. 5 minutes). The refresh token is long-lived (e.g. 24 hours).

### DRF built-in token auth
\`\`\`python
from rest_framework.authtoken.views import obtain_auth_token
path('api/auth/token/', obtain_auth_token)
\`\`\`

Returns: \`{"token": "abc123def456..."}\` — a simple opaque token, no expiry by default.

## Using the token in React

\`\`\`javascript
const response = await fetch('/api/auth/token/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({username, password})
});
const { access } = await response.json();
localStorage.setItem('token', access);

// All future requests:
fetch('/api/issues/', {
  headers: {'Authorization': \`Bearer \${access}\`}
});
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `# urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Login: POST {username, password} → {access, refresh}
    path('api/auth/token/', TokenObtainPairView.as_view()),

    # Refresh: POST {refresh} → {access}
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]

# settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),   # token expires in 1 hour
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),       # refresh valid for 7 days
}

# Example login flow in JavaScript (React):
# const res = await fetch('/api/auth/token/', {
#     method: 'POST',
#     headers: {'Content-Type': 'application/json'},
#     body: JSON.stringify({username: 'sarah', password: 'pass123'})
# })
# const {access, refresh} = await res.json()
# localStorage.setItem('accessToken', access)`,
      explanation: 'TokenObtainPairView handles login. SIMPLE_JWT settings control token lifetimes. The client stores the access token and sends it in the Authorization header.'
    },
    guided: {
      instructions: 'Complete the login flow configuration.',
      language: 'python',
      starterCode: `from django.urls import path
from rest_framework_simplejwt.views import ___________, TokenRefreshView

urlpatterns = [
    path('api/auth/token/', ___________.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=___________),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}`,
      solution: `from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/auth/token/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}`,
      evalChecks: [
        {
          id: 'token_obtain',
          description: 'TokenObtainPairView imported and used',
          test: (code) => /TokenObtainPairView/.test(code) && /TokenObtainPairView\.as_view/.test(code),
          points: 40,
          failFeedback: 'TokenObtainPairView.as_view() at the api/auth/token/ path'
        },
        {
          id: 'simple_jwt_settings',
          description: 'SIMPLE_JWT settings defined',
          test: (code) => /SIMPLE_JWT\s*=\s*\{/.test(code),
          points: 30,
          failFeedback: 'SIMPLE_JWT = { "ACCESS_TOKEN_LIFETIME": timedelta(...) }'
        },
        {
          id: 'timedelta',
          description: 'timedelta used for token lifetime',
          test: (code) => /timedelta\s*\(/.test(code),
          points: 30,
          failFeedback: 'from datetime import timedelta — use timedelta(minutes=60) for the lifetime'
        }
      ]
    },
    challenge: {
      instructions: `Write the JavaScript (in a comment block) that shows the complete login and authenticated request flow:

1. A function \`login(username, password)\` that POSTs to \`/api/auth/token/\`, stores the access token in localStorage
2. A function \`getIssues()\` that fetches \`/api/issues/\` with the Authorization header

Then write the Python URL configuration that makes this work.`,
      language: 'python',
      starterCode: `# Python URL configuration\nfrom django.urls import path\nfrom rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView\n\n# Also write the JavaScript in comments below:\n# async function login(username, password) { ... }\n# async function getIssues() { ... }\n`,
      solution: `from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/auth/token/', TokenObtainPairView.as_view()),
    path('api/auth/token/refresh/', TokenRefreshView.as_view()),
]

# async function login(username, password) {
#   const res = await fetch('/api/auth/token/', {
#     method: 'POST',
#     headers: { 'Content-Type': 'application/json' },
#     body: JSON.stringify({ username, password })
#   })
#   const { access } = await res.json()
#   localStorage.setItem('token', access)
# }

# async function getIssues() {
#   const token = localStorage.getItem('token')
#   const res = await fetch('/api/issues/', {
#     headers: { 'Authorization': \`Bearer \${token}\` }
#   })
#   return res.json()
# }`,
      evalChecks: [
        {
          id: 'token_endpoints',
          description: 'Both token endpoints defined',
          test: (code) => /TokenObtainPairView\.as_view/.test(code) && /TokenRefreshView\.as_view/.test(code),
          points: 40,
          failFeedback: 'Define both TokenObtainPairView and TokenRefreshView URLs'
        },
        {
          id: 'authorization_header',
          description: 'Authorization header shown in comments',
          test: (code) => /Authorization.*Bearer/.test(code),
          points: 30,
          failFeedback: "Show Authorization: Bearer <token> in the getIssues comment"
        },
        {
          id: 'localstorage',
          description: 'localStorage usage shown in comments',
          test: (code) => /localStorage/.test(code),
          points: 30,
          failFeedback: 'Show localStorage.setItem("token", access) in the login comment'
        }
      ]
    },
    hints: [
      'TokenObtainPairView returns both access and refresh tokens',
      'Access tokens are short-lived — the client needs to refresh them periodically',
      'The Authorization header format is: Bearer <token> (with a space, capital B)',
      'localStorage.setItem("token", access) stores the token in the browser'
    ],
    docs: [
      {
        heading: 'Login flow',
        content: 'The complete authentication sequence.',
        code: `# 1. POST to get tokens
POST /api/auth/token/
{ "username": "sarah", "password": "pass" }
→ { "access": "eyJ...", "refresh": "eyJ..." }

# 2. Use access token
GET /api/issues/
Authorization: Bearer eyJ...

# 3. Refresh when access expires
POST /api/auth/token/refresh/
{ "refresh": "eyJ..." }
→ { "access": "new_eyJ..." }`
      }
    ],
    prerequisite: 35
  },

  {
    id: 37,
    module: 6,
    moduleTitle: 'Authentication & Permissions',
    category: 'Django',
    title: 'Protecting Specific Views',
    topic: 'get_permissions(), authentication_classes, mixing public and private',
    concept: `## The problem: one API, mixed access

Your API might have:
- Public endpoints: \`GET /api/courses/\` — anyone can browse
- Private endpoints: \`POST /api/issues/\` — must be logged in
- Owner-only: \`DELETE /api/issues/1/\` — only the issue creator

## Per-view permission_classes

Override \`permission_classes\` at the class level:
\`\`\`python
class IssueList(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
\`\`\`

## get_permissions() for conditional logic

When different actions need different permissions:

\`\`\`python
class IssueViewSet(ModelViewSet):
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
\`\`\`

Note: \`get_permissions\` must return **instances** (with \`()\`), not classes.

## authentication_classes

Controls which authentication schemes are tried for this view:
\`\`\`python
class PublicView(ListAPIView):
    authentication_classes = []   # skip auth entirely
    permission_classes = [AllowAny]
\`\`\``,
    annotatedExample: {
      language: 'python',
      code: `from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Course
from .serializers import CourseSerializer

class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    # Different permissions per action
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            # Read actions: anyone
            permission_classes = [AllowAny]
        elif self.action in ['create', 'update', 'partial_update']:
            # Write actions: must be logged in
            permission_classes = [IsAuthenticated]
        else:
            # Delete: admin only
            permission_classes = [IsAdminUser]

        # Must return instances (with ()), not classes
        return [permission() for permission in permission_classes]`,
      explanation: 'get_permissions returns instances, not classes. Return [AllowAny()] not [AllowAny]. Use self.action to vary permissions per action.'
    },
    guided: {
      instructions: 'Complete get_permissions to make list/retrieve public and create/update private.',
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Issue
from .serializers import IssueSerializer

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def get_permissions(self):
        if self.action in ['___________', '___________']:
            return [___________()] # public
        return [IsAuthenticated()]  # private`,
      solution: `from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Issue
from .serializers import IssueSerializer

class IssueViewSet(ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]`,
      evalChecks: [
        {
          id: 'list_retrieve_public',
          description: 'list and retrieve return AllowAny()',
          test: (code) => /\[['"]list['"],\s*['"]retrieve['"]\]|['"]list['"][\s\S]*?['"]retrieve['"]/.test(code) && /AllowAny\s*\(\s*\)/.test(code),
          points: 50,
          failFeedback: "if self.action in ['list', 'retrieve']: return [AllowAny()]"
        },
        {
          id: 'returns_instances',
          description: 'Returns permission instances (with ())',
          test: (code) => /AllowAny\s*\(\s*\)/.test(code) && /IsAuthenticated\s*\(\s*\)/.test(code),
          points: 50,
          failFeedback: 'Return instances: [AllowAny()] not [AllowAny] — the () creates an instance'
        }
      ]
    },
    challenge: {
      instructions: `Write a \`ProjectViewSet\` where:
- \`list\` and \`retrieve\`: public (AllowAny)
- \`create\`: authenticated users only
- \`update\` and \`partial_update\`: admin users only (IsAdminUser)
- \`destroy\`: admin users only

Use \`get_permissions\` to implement this. All methods return **instances**.`,
      language: 'python',
      starterCode: `from rest_framework.viewsets import ModelViewSet\nfrom rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser\nfrom .models import Project\nfrom .serializers import ProjectSerializer\n\nclass ProjectViewSet(ModelViewSet):\n    queryset = Project.objects.all()\n    serializer_class = ProjectSerializer\n\n    def get_permissions(self):\n        pass\n`,
      solution: `from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Project
from .serializers import ProjectSerializer

class ProjectViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        elif self.action == 'create':
            return [IsAuthenticated()]
        else:
            return [IsAdminUser()]`,
      evalChecks: [
        {
          id: 'get_permissions',
          description: 'get_permissions method defined',
          test: (code) => /def\s+get_permissions\s*\(\s*self\s*\)/.test(code),
          points: 20,
          failFeedback: 'def get_permissions(self):'
        },
        {
          id: 'read_public',
          description: 'list/retrieve return AllowAny()',
          test: (code) => /list.*retrieve|retrieve.*list/.test(code) && /AllowAny\s*\(\s*\)/.test(code),
          points: 25,
          failFeedback: "if self.action in ['list', 'retrieve']: return [AllowAny()]"
        },
        {
          id: 'create_auth',
          description: 'create returns IsAuthenticated()',
          test: (code) => /create/.test(code) && /IsAuthenticated\s*\(\s*\)/.test(code),
          points: 25,
          failFeedback: "elif self.action == 'create': return [IsAuthenticated()]"
        },
        {
          id: 'admin_only',
          description: 'update/destroy return IsAdminUser()',
          test: (code) => /IsAdminUser\s*\(\s*\)/.test(code),
          points: 30,
          failFeedback: 'return [IsAdminUser()] for update and destroy actions'
        }
      ]
    },
    hints: [
      'get_permissions must return instances: [AllowAny()] not [AllowAny]',
      'self.action is the current action name: list, retrieve, create, update, destroy',
      "Use in [...] for multiple actions: if self.action in ['list', 'retrieve']:",
      'You can combine multiple permissions in the list: [IsAuthenticated(), IsOwner()]'
    ],
    docs: [
      {
        heading: 'get_permissions pattern',
        content: 'Vary permissions per action in a ViewSet.',
        code: `def get_permissions(self):
    if self.action in ['list', 'retrieve']:
        return [AllowAny()]
    return [IsAuthenticated()]

# Remember: return INSTANCES not classes
# [AllowAny()]  ← correct
# [AllowAny]    ← wrong`
      }
    ],
    prerequisite: 36
  }
];
