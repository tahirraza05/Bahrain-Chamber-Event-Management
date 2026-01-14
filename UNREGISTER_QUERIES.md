# Unregister Functionality - Queries

## Summary
Implemented unregister functionality based on Dynamics CRM screens. The following queries need clarification:

## 10 Key Queries

### 1. Unregister Behavior
**Question:** When a member is unregistered, should:
- The "Is Registered" status automatically change to `false`?
- The "Is Attended" status also be reset to `false`?
- The registration date be cleared?
- The attendance date be cleared?

**Current Implementation:** Only sets `isUnregistered = true` and `isRegistered = false`. Other fields remain unchanged.

---

### 2. Re-registration
**Question:** Can an unregistered member be re-registered?
- Should there be a "Re-register" button when `isUnregistered = true`?
- Should the Unregister toggle be disabled when unregistered?
- Should the system allow changing toggle from Yes to No to re-register?

**Current Implementation:** Unregister button is disabled when `isUnregistered = true`, but toggle can still be changed.

---

### 3. Toggle vs Button Behavior
**Question:** What is the difference between:
- Changing the "Unregister" toggle to "Yes"
- Clicking the "Unregister" button in the action bar

**Current Implementation:** Both show the same confirmation dialog and perform the same action.

---

### 4. Save Behavior
**Question:** Should unregistration:
- Happen immediately when confirmed (current implementation)?
- Require clicking "Save" button to persist?
- Auto-save when toggle is changed?

**Current Implementation:** Unregistration happens immediately on confirmation. Changes are persisted via service call.

---

### 5. Validation
**Question:** Should there be validation rules like:
- Cannot unregister if member has already attended?
- Cannot unregister if votes have been counted?
- Cannot unregister if event has ended?

**Current Implementation:** No validation rules. Unregistration can be performed at any time.

---

### 6. Activity Log
**Question:** Should unregistration actions:
- Be logged in the activity log (existing functionality)?
- Include who performed the action?
- Include timestamp?
- Include reason/remarks?

**Current Implementation:** Uses `RegistrationService.unregisterMember()` which should log activities (existing service method).

---

### 7. UI/UX Questions
**Question:**
- Should the Unregister toggle be read-only when member is already unregistered?
- Should there be visual indication (different color/styling) when unregistered?
- Should the form be disabled/read-only when unregistered?

**Current Implementation:** Button is disabled, but toggle remains editable.

---

### 8. Remarks Field
**Question:** In the screens, there's a "Remarks" field. Should:
- Remarks be required when unregistering?
- Remarks be stored with unregistration action?
- Remarks field be added to the registration detail form?

**Current Implementation:** Remarks field exists but is not validated for unregistration.

---

### 9. Supporting Document
**Question:** In the screens, there's a "Supporting Document" field. Should:
- Supporting document be required for unregistration?
- Document be uploaded when unregistering?
- Document field be added to the registration detail form?

**Current Implementation:** Supporting document field is not implemented.

---

### 10. Integration with Unregister Page
**Question:** Should the unregistration from Registration Detail Page:
- Sync with the existing "Unregister" page (`/admin/unregister`)?
- Show the member in the activity log on that page?
- Follow the same workflow as that page?

**Current Implementation:** Uses the same service method, so activities should sync.

---

## Implementation Status

✅ **Completed:**
- Unregister toggle field in form
- Unregister button in action bar
- Confirmation dialog
- Model updates
- Service integration
- Basic functionality

⏳ **Pending Clarification:**
- Field update behavior
- Re-registration workflow
- Validation rules
- Remarks/Document fields
- UI/UX refinements
