# 📄 Data Contract – MindLens

**Version:** 1.0
**Owner:** Integration Team
**Last Updated:** 2026-02-08

---

## 1️⃣ Purpose

This document defines the **strict data interfaces** between all MindLens system components.

All modules **MUST** follow the formats defined here.
Any change requires agreement from the Integration Team.

This contract ensures:

* Safe parallel development
* Predictable integration
* Reproducible demo behavior

---

## 2️⃣ System Modules

| Module            | Responsibility                                      |
| ----------------- | --------------------------------------------------- |
| Frontend UI       | Camera preview, keyword display, sentence selection |
| Eye Tracking      | Eye direction, dwell, blink confirmation            |
| Object Detection  | Scene understanding                                 |
| Integration Layer | Context assembly, routing                           |
| Gemini AI         | Sentence reasoning & generation                     |
| TTS               | Speech output                                       |

---

## 3️⃣ Eye Tracking Output (Keyword Selection)

**Produced by:** MediaPipe Face Mesh
**Consumed by:** Integration Layer

### Description

Represents the keyword selected by eye dwell or blink confirmation.

### Schema

```json
{
  "keyword": "string",
  "confidence": "number",
  "selection_method": "eye_dwell | blink | touch_fallback",
  "timestamp": "ISO-8601 string"
}
```

### Example

```json
{
  "keyword": "thirsty",
  "confidence": 0.93,
  "selection_method": "eye_dwell",
  "timestamp": "2026-02-08T14:21:09Z"
}
```

### Rules

* `confidence` must be between `0.0 – 1.0`
* Only **one keyword** may be active per request
* Touch input MUST follow the same schema

---

## 4️⃣ Object Detection Output

**Produced by:** Google ML Kit / TensorFlow Lite
**Consumed by:** Integration Layer

### Description

Represents physical objects detected in the camera frame.

### Schema

```json
{
  "objects": [
    {
      "label": "string",
      "confidence": "number"
    }
  ],
  "frame_timestamp": "ISO-8601 string"
}
```

### Example

```json
{
  "objects": [
    { "label": "cup", "confidence": 0.88 },
    { "label": "bed", "confidence": 0.94 }
  ],
  "frame_timestamp": "2026-02-08T14:21:10Z"
}
```

### Rules

* Maximum **2 objects** forwarded to AI
* Objects sorted by confidence (descending)
* If none detected → send empty array

---

## 5️⃣ Context Assembly (Integration Layer Output)

**Produced by:** Integration Layer
**Consumed by:** Gemini API

### Description

Unified context combining user intent and environment.

### Schema

```json
{
  "keyword": "string",
  "objects": ["string"],
  "time_context": "day | night | unknown",
  "location_context": "hospital | home | public | unknown",
  "confidence": {
    "keyword": "number",
    "object": "number"
  }
}
```

### Example

```json
{
  "keyword": "thirsty",
  "objects": ["cup"],
  "time_context": "night",
  "location_context": "hospital",
  "confidence": {
    "keyword": 0.93,
    "object": 0.88
  }
}
```

### Rules

* Always include `keyword`
* Objects optional but recommended
* Context inference must be deterministic

---

## 6️⃣ Gemini API Prompt Payload

**Produced by:** Integration Layer
**Consumed by:** Gemini API

### Prompt Structure (Conceptual)

```text
User intent: <keyword>
Detected objects: <objects>
Context: <location>, <time>

Generate 3 short, polite sentences the user may want to say.
```

### Gemini Input (Structured)

```json
{
  "intent": "string",
  "objects": ["string"],
  "context": {
    "location": "string",
    "time": "string"
  }
}
```

---

## 7️⃣ Gemini API Output (Sentence Suggestions)

**Produced by:** Gemini API
**Consumed by:** Frontend UI

### Schema

```json
{
  "sentences": [
    {
      "text": "string",
      "rank": "number"
    }
  ]
}
```

### Example

```json
{
  "sentences": [
    { "text": "I am thirsty.", "rank": 1 },
    { "text": "Can I have some water?", "rank": 2 },
    { "text": "Please call the nurse.", "rank": 3 }
  ]
}
```

### Rules

* Exactly **3 sentences**
* Ordered by relevance
* Language must be simple and polite

---

## 8️⃣ Sentence Selection Output

**Produced by:** Frontend UI
**Consumed by:** TTS / Logging

### Schema

```json
{
  "selected_sentence": "string",
  "selection_method": "eye_dwell | blink | touch",
  "timestamp": "ISO-8601 string"
}
```

### Example

```json
{
  "selected_sentence": "Can I have some water?",
  "selection_method": "eye_dwell",
  "timestamp": "2026-02-08T14:21:18Z"
}
```

---

## 9️⃣ Text-to-Speech Input

**Produced by:** Frontend UI
**Consumed by:** Google TTS

### Schema

```json
{
  "text": "string",
  "language": "en-US",
  "speed": "normal"
}
```

---

## 🔟 Error & Fallback Rules

| Scenario           | Behavior                   |
| ------------------ | -------------------------- |
| No object detected | Continue with keyword only |
| Eye tracking fails | Touch fallback             |
| Gemini timeout     | Show last cached phrases   |
| Confidence < 0.6   | Require re-selection       |

---

## 1️⃣1️⃣ Contract Stability Guarantee

* This contract is **stable for the hackathon**
* Breaking changes are not allowed after Day 4
* Minor extensions must be backward compatible

---

## 1️⃣2️⃣ Judge Note (Optional Section)

MindLens uses **explicit interface contracts** to ensure:

* Reliable AI behavior
* Transparent reasoning
* Scalable assistive technology design

This approach mirrors real-world AI system deployment.

---
