# Firestore Security Rules Guide

## For Development (Dev Mode)

Use the rules in `firestore-rules-dev.json`:

```json
{
  "rules": {
    ".read": "now < 1765558800000",  // 2025-12-13 - Allows read until this date
    ".write": "now < 1765558800000"  // 2025-12-13 - Allows write until this date (for dev/admin)
  }
}
```

**This is the time-based rule you mentioned** - it allows both read and write access until December 13, 2025. Perfect for development and testing your admin panel.

## For Production

Use the rules in `firestore-rules-production.json`:

```json
{
  "rules": {
    "about": {
      ".read": true,
      ".write": false
    },
    "work": {
      ".read": true,
      ".write": false
    },
    "publications": {
      ".read": true,
      ".write": false
    },
    "blogs": {
      ".read": true,
      ".write": false
    },
    "$other": {
      ".read": false,
      ".write": false
    }
  }
}
```

This allows:
- ✅ **Public read access** to all portfolio content (about, work, publications, blogs)
- ❌ **No public write access** - only you can write via the admin panel (with proper authentication)

## How to Apply Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Copy the content from the appropriate JSON file
3. Paste it into the rules editor
4. Click "Publish"

## Important Notes

- **For dev**: Use `firestore-rules-dev.json` - allows full access until the expiration date
- **For production**: Use `firestore-rules-production.json` - public read, restricted write
- Always test your rules using the Rules Playground in Firebase Console
- Consider adding authentication to your admin panel for better security

