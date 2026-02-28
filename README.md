# 🧠 MindLens: Bridging the "Communication Latency Gap"

> **KitaHack 2026 Entry** | Empowering non-verbal and motor-impaired patients through Inclusion by Intelligence.

MindLens is an AI-powered assistive communication system designed for post-stroke survivors (Aphasia/Hemiplegia) and ALS patients. By replacing $14,000 specialized eye-tracking hardware with a standard smartphone, we democratize accessibility using on-device vision and Gemini AI.



---

## 💡 The Problem: The Silence of Physical Barriers
* **The Communication Latency Gap:** The critical delay between a patient’s cognitive intent and their physical ability to express it.
* **The Reality:** Modern interfaces require "swipe-to-unlock" or precise typing—actions impossible for those with paralyzed limbs or stiff motor functions.
* **The Barrier:** High-end eye-trackers cost between **$8,225 and $14,560**. In low-to-middle income regions, access to these life-changing products is as low as **3%** (WHO, 2026).
* **The Cost:** Communication breakdown is the #1 predictor of caregiver burnout and patient "learned helplessness."

## 🚀 The Solution: MindLens
* **Context-Aware Sight:** Using Gemini Vision and TFLite, the app "sees" the room and proactively populates the UI with relevant vocabulary.
* **The "2-Tap" Victory:** A custom Switch-Scanning UI allows users to navigate the entire app with a single "gross motor" tap—no fine motor skills required.
* **Static Anchors:** Life-critical alerts like "Help" and "Pain" are always two taps away, ensuring safety regardless of the environmental context.

---

## 🏗️ Technical Architecture

### 1. System Flow
1.  **Input Layer:** High-contrast Switch Scanning cycles through buttons using a native `TICK` timer.
2.  **Processing Layer (The Eyes):** Camera frames are offloaded to a **Worklet thread** (via `react-native-vision-camera`) where a **TensorFlow Lite (SSD MobileNet)** model runs inference at 2 FPS.
3.  **Intelligence Layer (The Brain):**
    * **Gemini 2.5 Flash-Lite:** Our "Contextual Intelligence Engine" translates detected labels (e.g., "Cup") into three natural, human-ready sentences (e.g., "I am thirsty").
    * **Gemini 1.5 Flash:** Performs deep "Room Scans" for comprehensive environmental discovery.
4.  **Output Layer:** **Google Cloud Text-to-Speech** vocalizes the intent in a high-fidelity, natural voice.

---

## 🧠 Challenges & Solutions

### ⚡ The Performance Wall (UI vs. AI)
* **Problem:** Running real-time object detection on the main JS thread caused "jank," making the switch-scanner skip frames. For a patient with limited control, a 50ms lag leads to missed selections.
* **Solution:** Implemented **Native Thread Offloading**. We moved inference to a secondary thread using `react-native-worklets-core`.
* **Result:** A stable 60 FPS UI with simultaneous 2 FPS object detection.

### 🌐 The Generative Latency Trade-off
* **Problem:** Cloud LLMs require internet connectivity and introduce latency that can frustrate users in distress.
* **Solution:** Implemented **Intelligent Caching**. Frequently used phrases (e.g., "I need water") are cached locally as audio files, bypassing the API for repeat requests.

### 🔄 The Design Pivot (Validation Results)
* **Insight:** Initial testing showed that eye-tracking (40% success) was mentally exhausting and prone to errors from involuntary movements.
* **Pivot:** Replaced eye-tracking with **Switch-Toggling**, which boosted success rates to **95%** by providing a rhythmic, low-stress method to confirm intent.

---

## 🧩 Technology Stack

| Category | Technology |
|----|----------------|
| **Framework** | React Native (TypeScript) |
| **Generative AI** | Gemini 2.5 Flash-Lite (Intent), Gemini 1.5 Flash (Vision) |
| **Edge AI** | TensorFlow Lite / LiteRT (SSD MobileNet) |
| **Voice Synthesis** | Google Cloud Text-to-Speech |
| **Camera/Threading**| Vision Camera v3 + Reanimated Worklets |
| **Cloud Services** | Google Cloud Console |

---

## 🎯 Success Metrics
* **Time-to-Communication:** Reduced "Time-to-Thought" from 45s (manual) to **8s** (MindLens)—an 82% efficiency gain.
* **Prediction Acceptance:** High user preference for Gemini-generated sentences over robotic single keywords.
* **SDG Alignment:** Directly supporting **SDG 3** (Good Health & Well-being) and **SDG 10** (Reduced Inequalities).

---

## 👥 Team KitaHacktic

* **Phoebe Angelina Surin** – Team Lead / AI / Context Dev
* **Valencien Seow Yun Sun** – Frontend / UI Dev
* **Lim Xiao Wen** – Computer Vision Dev
* **Tan Syn Yee** – Integration / QA / Demo Dev
---

## 🗺️ Future Roadmap
- [ ] **Hyper-Personalization:** Caregivers input custom context to sharpen Gemini's predictions.
- [ ] **Multilingual Support:** Support for Malay, Mandarin, and Tamil via Google Cloud Translation.
- [ ] **Smart Glass Integration:** Shifting from handheld phones to a wearable, hands-free perspective.
- [ ] **Offline Mode:** Transitioning to on-device Small Language Models (SLMs) for 100% reliability.

---

## 📌 License
Developed for KitaHack 2026. Educational Use Only.
