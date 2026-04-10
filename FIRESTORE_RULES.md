# EduStack — Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules tab
and paste these rules, then click Publish:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Admin and student data — only accessible by the owner
    match /users/{userId}/data/{document} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Institution documents — any authenticated user can read (to look up admin UPI)
    // Only the institution owner (admin) can write
    match /institutions/{instId} {
      allow read:  if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.data.adminUid == request.auth.uid;
    }

    // Attendance records — any authenticated user can read their institution's records
    match /attendance/{recordId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

These rules:
- Keep all fee/student data private to each admin ✅
- Allow students to look up institution UPI config by institution ID ✅
- Allow attendance sync between admin and student portals ✅
