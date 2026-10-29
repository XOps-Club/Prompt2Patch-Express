### Team Information
- **Team Name**: CapsLock
- **Repository**: LinkSnip (`patch1`)
- **Team Members**:
  1. Aditya Raj
  2. Bhuvan Gouda C H
  3. Jeysuriya R

---

### 1. Root Cause Summary

Use the same active-versus-archived filter for both the page query and the count query. Calculate totalPages from that filtered count, then rerun the pagination test in link.service.ts.

---

### 2. Solutions & Fixes Implemented

---

### 3. Verification & Test Evidence


---

### 4. Key AI (Copilot) Prompts Used
*Provide 2–3 examples of the iterative prompts used with Copilot to diagnose root causes rather than asking for full code solutions:*
1. **Prompt 1**: 
   - *Copilot Response / Hypothesis*:
2. **Prompt 2**: 
   - *Copilot Response / Hypothesis*:

---

### 5. Repository Enhancement (Optional)
*Describe any extra improvements made.*
