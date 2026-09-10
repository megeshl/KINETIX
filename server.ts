import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { INITIAL_SEED_PATIENTS, DEMO_EXERCISES } from "./src/data/seedData";
import { evaluateSquatForm, evaluateAdaptiveProgression } from "./src/lib/biomechanicsEngine";
import { PatientProfile, SessionData } from "./src/types";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for live sessions and synthetic patients
let patientsStore: PatientProfile[] = JSON.parse(JSON.stringify(INITIAL_SEED_PATIENTS));

// Optional server-side Gemini AI client for patient-friendly explainability translations
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Gemini API client initialization deferred or key missing.");
    }
  }
  return genAIClient;
}

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------

// GET /api/health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "KINETIX AI Rehabilitation Engine", version: "1.0.0" });
});

// GET /api/patients - Get all patients
app.get("/api/patients", (_req, res) => {
  res.json({ success: true, count: patientsStore.length, patients: patientsStore });
});

// GET /api/patients/:id - Get patient by ID
app.get("/api/patients/:id", (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.id);
  if (!patient) {
    res.status(404).json({ success: false, message: "Patient not found" });
    return;
  }
  res.json({ success: true, patient });
});

// GET /api/patients/:id/recovery - Get recovery metrics & digital twin
app.get("/api/patients/:id/recovery", (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.id);
  if (!patient) {
    res.status(404).json({ success: false, message: "Patient not found" });
    return;
  }
  res.json({
    success: true,
    patientId: patient.id,
    overallRecoveryScore: patient.overallRecoveryScore,
    scoreTrend: patient.scoreTrend,
    bodyRegions: patient.bodyRegions,
    movementDNA: patient.movementDNA,
    disclaimer: "Prototype decision support — clinical decisions remain with a qualified healthcare professional."
  });
});

// GET /api/patients/:id/sessions - Get session history
app.get("/api/patients/:id/sessions", (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.id);
  if (!patient) {
    res.status(404).json({ success: false, message: "Patient not found" });
    return;
  }
  res.json({ success: true, sessions: patient.sessionHistory });
});

// GET /api/patients/:id/movement-dna - Get Movement DNA profile
app.get("/api/patients/:id/movement-dna", (req, res) => {
  const patient = patientsStore.find(p => p.id === req.params.id);
  if (!patient) {
    res.status(404).json({ success: false, message: "Patient not found" });
    return;
  }
  res.json({ success: true, movementDNA: patient.movementDNA });
});

// GET /api/dashboard/therapist - Therapist Dashboard overview
app.get("/api/dashboard/therapist", (_req, res) => {
  const totalPatients = patientsStore.length;
  const improving = patientsStore.filter(p => p.rehabStatus === "improving").length;
  const inconsistent = patientsStore.filter(p => p.rehabStatus === "inconsistent").length;
  const persistentIssues = patientsStore.filter(p => p.rehabStatus === "persistent_issue").length;
  const needsReview = patientsStore.filter(p => p.rehabStatus === "needs_review" || p.reviewPriority === "critical" || p.reviewPriority === "high");

  res.json({
    success: true,
    summary: {
      totalPatients,
      improving,
      inconsistent,
      persistentIssues,
      needsReviewCount: needsReview.length
    },
    reviewQueue: needsReview,
    patients: patientsStore
  });
});

// POST /api/session/start - Start a new assessment session
app.post("/api/session/start", (req, res) => {
  const { patientId, exerciseId } = req.body;
  const patient = patientsStore.find(p => p.id === (patientId || "pat-001"));
  const exercise = DEMO_EXERCISES.find(e => e.id === (exerciseId || "ex-squat")) || DEMO_EXERCISES[0];

  const sessionId = "sess-" + Date.now();
  res.json({
    success: true,
    sessionId,
    patient: patient || patientsStore[0],
    exercise,
    startTime: new Date().toISOString()
  });
});

// POST /api/session/analyze - Analyze frame biomechanics
app.post("/api/session/analyze", (req, res) => {
  const { leftKneeAngle, rightKneeAngle, leftHipAngle, rightHipAngle, leftAnkleAngle, rightAnkleAngle, valgusDevLeft, valgusDevRight, descentTimeMs } = req.body;

  const result = evaluateSquatForm(
    leftKneeAngle || 90,
    rightKneeAngle || 90,
    leftHipAngle || 95,
    rightHipAngle || 95,
    leftAnkleAngle || 80,
    rightAnkleAngle || 80,
    valgusDevLeft || 0,
    valgusDevRight || 0,
    descentTimeMs || 2000
  );

  res.json({
    success: true,
    metrics: result.metrics,
    errors: result.errors,
    angles: result.angles
  });
});

// POST /api/session/complete - Complete session and update database
app.post("/api/session/complete", (req, res) => {
  const { sessionData } = req.body as { sessionData: SessionData };

  if (!sessionData || !sessionData.patientId) {
    res.status(400).json({ success: false, message: "Invalid session payload" });
    return;
  }

  const patientIndex = patientsStore.findIndex(p => p.id === sessionData.patientId);
  if (patientIndex !== -1) {
    const patient = patientsStore[patientIndex];
    
    // Calculate adaptive progression
    const recommendation = evaluateAdaptiveProgression(patient.sessionHistory, sessionData.overallScore);
    sessionData.recommendation = recommendation;

    // Add session to patient history
    patient.sessionHistory.push(sessionData);

    // Update patient scores & Movement DNA
    const newScore = Math.round((patient.overallRecoveryScore * 0.7) + (sessionData.overallScore * 0.3));
    patient.overallRecoveryScore = newScore;
    patient.scoreTrend = newScore - patient.baselineScore;
    patient.lastSessionDate = new Date().toISOString().split("T")[0];

    // Update target joint metrics on body region
    const targetRegion = patient.bodyRegions.find(r => r.id === "right_knee" || r.id === "left_knee");
    if (targetRegion) {
      targetRegion.metrics.rom = Math.round(sessionData.rom);
      targetRegion.metrics.stability = Math.round(sessionData.stability);
      targetRegion.metrics.symmetry = Math.round(sessionData.symmetry);
      targetRegion.metrics.alignment = Math.round(sessionData.overallScore);
      targetRegion.recoveryTrend = sessionData.overallScore >= 80 ? "improving" : "stable";
      if (sessionData.isVerifiedCorrection) {
        targetRegion.persistentIssue = null;
        targetRegion.status = "green";
        patient.rehabStatus = "improving";
        patient.statusLabel = "🟢 Improving";
      }
    }

    // Update Movement DNA
    patient.movementDNA.rom.current = Math.round(sessionData.rom);
    patient.movementDNA.symmetry.current = Math.round(sessionData.symmetry);
    patient.movementDNA.stability.current = Math.round(sessionData.stability);
    patient.movementDNA.movementQuality.current = Math.round(sessionData.overallScore);
    patient.movementDNA.consistency.current = Math.round(sessionData.consistency);

    patientsStore[patientIndex] = patient;

    res.json({
      success: true,
      message: "Session saved successfully",
      updatedPatient: patient,
      recommendation
    });
  } else {
    res.status(404).json({ success: false, message: "Patient not found" });
  }
});

// POST /api/adaptation/evaluate - Evaluate adaptive recommendation
app.post("/api/adaptation/evaluate", (req, res) => {
  const { patientId, currentScore } = req.body;
  const patient = patientsStore.find(p => p.id === patientId);
  const recommendation = evaluateAdaptiveProgression(
    patient ? patient.sessionHistory : [],
    currentScore || 85
  );

  res.json({
    success: true,
    recommendation,
    disclaimer: "Clinical decision support only. Clinical decisions remain with a qualified healthcare professional."
  });
});

// POST /api/explainability/translate - Optional LLM conversion of biomechanical findings
app.post("/api/explainability/translate", async (req, res) => {
  const { score, errors, primaryIssue } = req.body;

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are KINETIX AI Explainability Assistant. Convert these technical biomechanical findings into 2 warm, encouraging, patient-friendly sentences:
Movement Score: ${score}/100
Primary Issue: ${primaryIssue}
Errors: ${JSON.stringify(errors)}
Keep it concise, supportive, and focus on actionable physical cues. End with a disclaiming note that this is support guidance.`,
      });
      res.json({ success: true, translation: response.text });
      return;
    }
  } catch (err) {
    console.warn("Gemini translation error, falling back to rule-based explanation:", err);
  }

  // Fallback rule-based explanation
  res.json({
    success: true,
    translation: `Your movement score of ${score}/100 shows good movement effort. ${primaryIssue ? `Focus on adjusting your ${primaryIssue} to optimize joint load.` : 'Great form consistency!'}`
  });
});


// ------------------------------------------------------------------
// VITE / STATIC FILE SERVER INTEGRATION
// ------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KINETIX SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
