# 🧠 MindLens by KitaHacktic

MindLens is an AI-powered assistive communication system that uses **computer vision, eye tracking, and generative AI** to help users express intent through minimal physical interaction.

Designed for hackathon deployment, MindLens demonstrates how modern AI can restore communication, reduce inequality, and improve healthcare accessibility.

---

## 🚀 Core Features

- 👁️ Eye-based keyword selection (MediaPipe)
- 📷 Real-time object detection (Google ML Kit / TFLite)
- 🤖 Context-aware sentence generation (Gemini API)
- 🔊 Text-to-Speech output
- 📱 Mobile-first implementation (React Native)

---

## 🏗️ System Architecture

Camera Feed  
→ Object Detection  
→ Eye Tracking Keyword Selection  
→ Context Assembly  
→ Gemini AI (Sentence Reasoning)  
→ User Selection  
→ Text-to-Speech Output

All inter-module communication follows a strict data contract.

---

## 🧩 Technology Stack

### Google AI
- **Gemini API** – Sentence generation & ranking
- **MediaPipe** – Eye & face tracking
- **Google ML Kit / TensorFlow Lite** – Object detection

### App & Infrastructure
- **React Native** – Cross-platform mobile app
- **Firebase (optional)** – User history & analytics
- **Google Text-to-Speech** – Voice output

---

## 🎯 SDG Alignment

- **SDG 10 – Reduced Inequalities**  
  Assistive technology enabling equal communication access

- **SDG 3 – Good Health & Well-Being**  
  Improved patient-caregiver interaction

---

## 👥 Team Roles

| Role | Responsibility |
|----|----------------|
| Frontend / UI | Camera view, keyword UI, sentence display |
| Computer Vision | Object detection pipeline |
| AI / Context | Gemini API integration & prompt logic |
| Integration / QA | Data contracts, module integration, demo |

---

## 📄 Documentation

- `docs/data_contract.md` – Inter-module data interfaces
- `docs/architecture.md` – System flow (optional)

---

## 🧪 Development Notes

- All feature development occurs in separate branches
- `main` branch is stable & demo-ready
- All modules must follow the data contract strictly

---

## 🎥 Demo Scenario

Hospital setting:
1. User selects keyword “thirsty” using eye gaze
2. System detects nearby cup
3. Gemini suggests 3 relevant sentences
4. User selects sentence
5. Text-to-Speech speaks it aloud

---

## 📌 License
Hackathon / Educational Use
