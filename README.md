# 🧠 MindLens: Bridging the "Communication Latency Gap"

> **KitaHack 2026 Entry** | Empowering non-verbal and motor-impaired patients through Inclusion by Intelligence.

MindLens is an AI-powered assistive communication system designed for post-stroke survivors (Aphasia/Hemiplegia) and ALS patients. By replacing $14,000 specialized eye-tracking hardware with a standard smartphone, we democratize accessibility using on-device vision and Gemini AI.



---

## 💡 The Problem: The Silence of Physical Barriers
* **The Communication Latency Gap:** The critical delay between a patient’s cognitive intent and their physical ability to express it.
* **The Accessibility Gap:** High-end eye-trackers cost between **$8,225 and $14,560**. In low-to-middle income regions, access to these life-changing products is as low as **3%** (WHO, 2026).
* **Caregiver Burnout:** Communication breakdown is the #1 predictor of caregiver depressive symptoms and rapid burnout due to "constant guesswork."

## 🚀 The Solution: MindLens
* **Context-Aware Sight:** Using Gemini Vision and TFLite, the app "sees" the environment and proactively populates the UI with relevant vocabulary.
* **The "2-Tap" Victory:** A custom Switch-Scanning UI allows users to navigate the entire app with a single "gross motor" tap—no fine motor skills required.
* **Dignity Restored:** Transforms the patient from a "burden being managed" into a "communicator" who can initiate conversation.

---

## 🏗️ Technical Architecture

### 1. System Flow
1.  **Input Layer:** High-contrast Switch Scanning cycles through buttons using a native `TICK` timer.
2.  **Processing Layer (The Eyes):** Camera frames are offloaded to a **Worklet thread** (via `react-native-vision-camera`) where a **TensorFlow Lite (SSD MobileNet)** model runs inference at 2 FPS.
3.  **Intelligence Layer (The Brain):**
    * **Gemini 2.5 Flash-Lite:** Our "Contextual Intelligence Engine" translates detected labels (e.g., "Cup") into three natural, human-ready sentences (e.g., "I am thirsty").
    * **Gemini 1.5 Flash:** Performs deep "Room Scans" for comprehensive environmental discovery.
4.  **Output Layer:** **Google Cloud Text-to-Speech** vocalizes the intent in a high-fidelity, natural voice.

### 2. Performance Engineering
* **Thread Offloading:** Moved CV inference off the JS main thread to maintain a stable **60 FPS UI**.
* **Intelligent Caching:** Frequently used phrases are cached locally as audio files, reducing API latency and costs.

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

## 🎯 Success Metrics & Validation
We pivoted our design based on rapid usability testing with simulated motor-impaired participants:

* **95% Success Rate:** By switching from Eye-Tracking (40% success/high fatigue) to **Switch-Toggling**, we achieved near-perfect task completion.
* **82% Efficiency Gain:** "Time-to-Thought" was reduced from **45 seconds** (manual navigation) to just **8 seconds** (AI-assisted).
* **SDG Alignment:** Directly supporting **SDG 3** (Good Health & Well-being) and **SDG 10** (Reduced Inequalities).

---

## 👥 Team KitaHacktic
* **Angelina Surin** – Team Lead / Integration
* **Phoebe Lim Xiao Wen** – Frontend / UI
* **Tan Syn Yee** – Computer Vision Pipeline
* **Valencien Seow Yun Sun** – AI / Context Logic

---

## 🗺️ Future Roadmap
- [ ] **Hyper-Personalization:** Caregivers input custom context (e.g., "User likes warm Milo") to sharpen Gemini's predictions.
- [ ] **Multilingual Support:** Support for Malay, Mandarin, and Tamil via Google Cloud Translation.
- [ ] **Smart Glass Integration:** Shifting from handheld phones to a wearable, hands-free perspective.
- [ ] **Offline Reliability:** Transitioning to on-device Small Language Models (SLMs).

---

## 📌 License
Developed for KitaHack 2026. Educational Use Only.
