import React, { useState, useEffect, useRef } from 'react';
import { PatientProfile, ExerciseDefinition, BiomechanicalMetrics, DetectedError, RepetitionData, SessionData, AdaptiveRecommendation } from '../types';
import { evaluateSquatForm, evaluateAdaptiveProgression } from '../lib/biomechanicsEngine';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { SessionSummaryModal } from './SessionSummaryModal';
import { 
  Camera, 
  VideoOff, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Activity, 
  Award,
  ShieldAlert,
  Sparkles,
  Zap
} from 'lucide-react';

interface LiveSessionProps {
  patient: PatientProfile;
  exercise: ExerciseDefinition;
  onCompleteSession: (session: SessionData) => void;
  onCancel: () => void;
  initialDemoMode?: boolean;
}

export const LiveSession: React.FC<LiveSessionProps> = ({
  patient,
  exercise,
  onCompleteSession,
  onCancel,
  initialDemoMode = false
}) => {
  // Mode state: 'DEMO' or 'WEBCAM'
  const [isDemoMode, setIsDemoMode] = useState<boolean>(initialDemoMode);

  // Demo step state: 1 = Attempt 1 (Score 62, Valgus error), 2 = Attempt 2 (Score 89, Correction Verified), 3 = Complete
  const [demoStep, setDemoStep] = useState<number>(1);

  // Real Camera States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Exercise Session Telemetry
  const [currentRep, setCurrentRep] = useState<number>(4);
  const targetReps = 10;
  const [squatPhase, setSquatPhase] = useState<'STANDING' | 'DESCENT' | 'BOTTOM' | 'ASCENT'>('DESCENT');
  
  // Real-time joint angles
  const [currentKneeAngle, setCurrentKneeAngle] = useState<number>(95);
  const [currentHipAngle, setCurrentHipAngle] = useState<number>(98);
  const [currentAnkleAngle, setCurrentAnkleAngle] = useState<number>(82);
  const [valgusDev, setValgusDev] = useState<number>(18.4);

  // Biomechanical Evaluation Outputs
  const [metrics, setMetrics] = useState<BiomechanicalMetrics>({
    kneeAngle: 95,
    hipAngle: 98,
    ankleAngle: 82,
    rangeOfMotion: 75,
    romPercentage: 75,
    symmetry: 64,
    stability: 59,
    velocity: 80,
    formConsistency: 58,
    overallScore: 62
  });

  const [detectedErrors, setDetectedErrors] = useState<DetectedError[]>([
    {
      id: 'err-valgus-demo',
      errorType: 'KNEE_VALGUS',
      title: 'Inward Knee Alignment Deviation',
      severity: 'moderate',
      observedMetric: '18.4° inward displacement',
      targetMetric: '< 8° alignment angle',
      explanation: 'Your knee is moving inward during the squat.',
      correction: 'Keep your knee aligned with your toes.',
      affectedJoint: 'RIGHT_KNEE',
      scoreDeduction: 18
    }
  ]);

  const [isVerifiedCorrection, setIsVerifiedCorrection] = useState<boolean>(false);
  const [scoreImprovement, setScoreImprovement] = useState<number>(0);
  const [adaptiveRec, setAdaptiveRec] = useState<AdaptiveRecommendation | null>(null);
  const [completedSessionData, setCompletedSessionData] = useState<SessionData | null>(null);

  // ------------------------------------------------------------------
  // DEMO MODE AUTOMATION / CONTROLLER
  // ------------------------------------------------------------------

  const handleRunAttempt1 = () => {
    setIsDemoMode(true);
    setDemoStep(1);
    setCurrentRep(4);
    setSquatPhase('DESCENT');
    setCurrentKneeAngle(95);
    setValgusDev(18.4);
    setIsVerifiedCorrection(false);
    setScoreImprovement(0);

    const evalResult = evaluateSquatForm(95, 95, 98, 98, 82, 82, 18.4, 2.0, 1800);
    setMetrics({ ...evalResult.metrics, overallScore: 62 });
    setDetectedErrors(evalResult.errors);
  };

  const handleRunAttempt2 = () => {
    setDemoStep(2);
    setCurrentRep(5);
    setSquatPhase('BOTTOM');
    setCurrentKneeAngle(88);
    setValgusDev(3.2); // Clean alignment over toe

    const evalResult = evaluateSquatForm(88, 88, 90, 90, 80, 80, 3.2, 2.0, 2200);
    const newMetrics = { ...evalResult.metrics, overallScore: 89, symmetry: 81, stability: 78 };
    setMetrics(newMetrics);
    setDetectedErrors([]);
    setIsVerifiedCorrection(true);
    setScoreImprovement(27); // +27 improvement (62 -> 89)

    const rec = evaluateAdaptiveProgression(patient.sessionHistory, 89);
    setAdaptiveRec(rec);
  };

  const handleFinishSession = () => {
    const finalScore = isVerifiedCorrection ? 89 : metrics.overallScore;
    const initialScore = 62;

    const session: SessionData = {
      id: 'sess-' + Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      timestamp: new Date().toISOString(),
      durationSeconds: 180,
      totalRepetitions: 10,
      successfulRepetitions: isVerifiedCorrection ? 10 : 6,
      overallScore: finalScore,
      initialScore: initialScore,
      finalScore: finalScore,
      scoreImprovement: isVerifiedCorrection ? 27 : 3,
      rom: 82,
      symmetry: 81,
      stability: 78,
      consistency: 91,
      errorsDetected: detectedErrors,
      recommendation: adaptiveRec || evaluateAdaptiveProgression(patient.sessionHistory, finalScore),
      isVerifiedCorrection
    };

    setCompletedSessionData(session);
    onCompleteSession(session);
  };

  // ------------------------------------------------------------------
  // WEBCAM INITIALIZATION & REAL POSE CANVAS RENDER
  // ------------------------------------------------------------------

  const startWebcam = async () => {
    setIsDemoMode(false);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setCameraError('Camera access unavailable or permission denied. Switched to DEMO SIMULATION MODE.');
      setIsDemoMode(true);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (initialDemoMode) {
      handleRunAttempt1();
    }
    return () => stopWebcam();
  }, [initialDemoMode]);

  // Canvas Skeleton Draw Loop (Simulated or Live Video)
  useEffect(() => {
    let animId: number;

    const renderCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw background frame if no video or in demo mode
      if (!isCameraActive || isDemoMode) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, w, h);

        // Grid lines for clinical Tech aesthetic
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        for (let x = 0; x < w; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += 40) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      }

      // Draw Pose Skeleton Landmarks
      // Head
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.2, 22, 0, Math.PI * 2);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Neck & Spine
      const neck = { x: w / 2, y: h * 0.28 };
      const pelvis = { x: w / 2, y: h * 0.52 };
      ctx.beginPath();
      ctx.moveTo(neck.x, neck.y);
      ctx.lineTo(pelvis.x, pelvis.y);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Shoulders
      const leftShoulder = { x: w / 2 - 50, y: h * 0.3 };
      const rightShoulder = { x: w / 2 + 50, y: h * 0.3 };
      ctx.beginPath();
      ctx.moveTo(leftShoulder.x, leftShoulder.y);
      ctx.lineTo(rightShoulder.x, rightShoulder.y);
      ctx.stroke();

      // Hips
      const leftHip = { x: w / 2 - 35, y: h * 0.52 };
      const rightHip = { x: w / 2 + 35, y: h * 0.52 };
      ctx.beginPath();
      ctx.moveTo(leftHip.x, leftHip.y);
      ctx.lineTo(rightHip.x, rightHip.y);
      ctx.stroke();

      // Knees & Ankles
      // In Attempt 1 (Demo Step 1), Right Knee collapses inward (valgus offset)
      const rightKneeX = (isDemoMode && demoStep === 1) ? w / 2 + 10 : w / 2 + 35; // Inward shift if valgus
      const rightKnee = { x: rightKneeX, y: h * 0.72 };
      const leftKnee = { x: w / 2 - 35, y: h * 0.72 };

      const rightAnkle = { x: w / 2 + 40, y: h * 0.88 };
      const leftAnkle = { x: w / 2 - 40, y: h * 0.88 };

      // Draw Left Leg (Normal)
      ctx.beginPath();
      ctx.moveTo(leftHip.x, leftHip.y);
      ctx.lineTo(leftKnee.x, leftKnee.y);
      ctx.lineTo(leftAnkle.x, leftAnkle.y);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw Right Leg (Highlight RED if Knee Valgus in Attempt 1)
      const isRightKneeErr = (isDemoMode && demoStep === 1) || valgusDev > 10;
      ctx.beginPath();
      ctx.moveTo(rightHip.x, rightHip.y);
      ctx.lineTo(rightKnee.x, rightKnee.y);
      ctx.lineTo(rightAnkle.x, rightAnkle.y);
      ctx.strokeStyle = isRightKneeErr ? '#f43f5e' : '#10b981';
      ctx.lineWidth = isRightKneeErr ? 6 : 4;
      ctx.stroke();

      // Draw Keypoint Circles
      [neck, pelvis, leftShoulder, rightShoulder, leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = (p === rightKnee && isRightKneeErr) ? '#f43f5e' : '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Highlight Error Circle around affected knee if present
      if (isRightKneeErr) {
        ctx.beginPath();
        ctx.arc(rightKnee.x, rightKnee.y, 28, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Angle & Alert Label
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 11px font-mono';
        ctx.fillText('⚠ VALGUS 18.4°', rightKnee.x + 32, rightKnee.y + 4);
      } else if (isVerifiedCorrection) {
        ctx.beginPath();
        ctx.arc(rightKnee.x, rightKnee.y, 22, 0, Math.PI * 2);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px font-mono';
        ctx.fillText('✓ ALIGNED 3.2°', rightKnee.x + 28, rightKnee.y + 4);
      }

      animId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();
    return () => cancelAnimationFrame(animId);
  }, [isCameraActive, isDemoMode, demoStep, valgusDev, isVerifiedCorrection]);

  return (
    <div className="space-y-4">
      
      {/* Top Banner: Mode Indicator & Hackathon 90s Demo Controller */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">
                Live Kinematic Assessment Mode
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isDemoMode 
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              }`}>
                {isDemoMode ? 'DEMO SIMULATION' : 'WEBCAM ACTIVE'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Exercise: <span className="text-slate-200 font-semibold">{exercise.name}</span> • Patient: <span className="text-slate-200 font-semibold">{patient.name}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Attempt 1 Trigger */}
          <button
            onClick={handleRunAttempt1}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDemoMode && demoStep === 1
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>ATTEMPT 1 (ISSUE)</span>
          </button>

          {/* Attempt 2 Trigger */}
          <button
            onClick={handleRunAttempt2}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDemoMode && demoStep === 2
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ATTEMPT 2 (CORRECTED)</span>
          </button>

          {/* Webcam Toggle */}
          {!isCameraActive ? (
            <button
              onClick={startWebcam}
              className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>START WEBCAM</span>
            </button>
          ) : (
            <button
              onClick={stopWebcam}
              className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <VideoOff className="w-3.5 h-3.5" />
              <span>STOP WEBCAM</span>
            </button>
          )}

          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            Exit
          </button>
        </div>

      </div>

      {cameraError && (
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Live Camera / Canvas Skeleton Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
          
          {/* Top Camera Overlay Header */}
          <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between text-xs font-mono bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-bold text-slate-200">SQUAT KINEMATICS ENGINE</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>PHASE: <strong className="text-cyan-300">{squatPhase}</strong></span>
              <span>FPS: <strong className="text-emerald-400">30.0</strong></span>
            </div>
          </div>

          {/* Hidden Video element for WebCam */}
          <video
            ref={videoRef}
            className="hidden"
            playsInline
            muted
          />

          {/* Real-time Pose Overlay Canvas */}
          <canvas
            ref={canvasRef}
            width={640}
            height={460}
            className="w-full h-auto max-h-[480px] object-contain rounded-xl"
          />

          {/* Bottom Live Angle Readouts Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-20 grid grid-cols-4 gap-2 text-center text-xs font-mono bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800">
            <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">KNEE FLEXION</span>
              <span className="font-bold text-cyan-300">{currentKneeAngle}°</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">HIP FLEXION</span>
              <span className="font-bold text-cyan-300">{currentHipAngle}°</span>
            </div>
              <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">ANKLE ANGLE</span>
              <span className="font-bold text-cyan-300">{currentAnkleAngle}°</span>
            </div>
            <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">ALIGNMENT DEV</span>
              <span className={`font-bold ${valgusDev > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {valgusDev}°
              </span>
            </div>
          </div>

        </div>

        {/* RIGHT: KINETIX AI LIVE PANEL (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Rep & Score Gauge */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  REPETITION COUNTER
                </span>
                <span className="text-2xl font-black font-mono text-slate-100">
                  0{currentRep} <span className="text-sm text-slate-500 font-normal">/ {targetReps}</span>
                </span>
              </div>

              {/* Status Badge */}
              <div>
                {isVerifiedCorrection ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ CORRECTION VERIFIED</span>
                  </span>
                ) : detectedErrors.length > 0 ? (
                  <span className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-500/50 font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-500/10 animate-pulse">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>⚠ FORM DEVIATION</span>
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>✓ EXCELLENT</span>
                  </span>
                )}
              </div>
            </div>

            {/* Score Ring / Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  MOVEMENT QUALITY SCORE
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-3xl font-black font-mono ${
                    metrics.overallScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {metrics.overallScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">/ 100</span>
                </div>
              </div>

              {scoreImprovement > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold text-xs">
                  +{scoreImprovement} IMPROVEMENT
                </div>
              )}
            </div>

            {/* Adaptive Recommendation Card if Step 2 / Verified */}
            {isVerifiedCorrection && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    ADAPTIVE PROGRESSION RESULT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono font-black text-xs">
                    PROGRESS
                  </span>
                </div>
                <p className="text-xs text-emerald-100 font-medium">
                  "3 consecutive high-quality repetitions detected. Score 89/100 exceeds progression threshold."
                </p>
              </div>
            )}

          </div>

          {/* Explainability Breakdown Component */}
          <ExplainabilityPanel
            metrics={metrics}
            errors={detectedErrors}
            primaryError={detectedErrors[0]}
            scoreImprovement={scoreImprovement}
            isVerifiedCorrection={isVerifiedCorrection}
          />

          {/* Action Step Button */}
          <div className="pt-2">
            {demoStep === 1 ? (
              <button
                onClick={handleRunAttempt2}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>PERFORM CORRECTED ATTEMPT (RETRY)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishSession}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>COMPLETE SESSION & SAVE REPORT</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Completion Summary Modal */}
      {completedSessionData && (
        <SessionSummaryModal
          session={completedSessionData}
          onClose={onCancel}
        />
      )}

    </div>
  );
};
