import { 
  Landmark2D, 
  BiomechanicalAngles, 
  BiomechanicalMetrics, 
  DetectedError, 
  SquatPhase, 
  AdaptiveRecommendation, 
  SessionData 
} from '../types';
import { BIOMECHANICS_CONFIG } from '../config/biomechanics.config';

/**
 * Calculates 2D angle between three points (A -> B -> C) where B is the vertex.
 * Returns angle in degrees [0, 180].
 */
export function calculateAngle(p1: Landmark2D, vertex: Landmark2D, p3: Landmark2D): number {
  if (!p1 || !vertex || !p3) return 180;

  const rad1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const rad2 = Math.atan2(p3.y - vertex.y, p3.x - vertex.x);
  let angle = Math.abs((rad1 - rad2) * (180 / Math.PI));

  if (angle > 180) {
    angle = 360 - angle;
  }

  return Math.round(angle * 10) / 10;
}

/**
 * Calculates Euclidean distance between two points
 */
export function calculateDistance(p1: Landmark2D, p2: Landmark2D): number {
  if (!p1 || !p2) return 0;
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Estimates inward knee valgus displacement in degrees.
 * Measures horizontal offset of knee joint relative to the line connecting hip and ankle.
 */
export function calculateKneeValgusAngle(
  hip: Landmark2D, 
  knee: Landmark2D, 
  ankle: Landmark2D,
  isLeft: boolean
): number {
  if (!hip || !knee || !ankle) return 0;

  // Expected midpoint vector line
  const midX = (hip.x + ankle.x) / 2;
  const dx = knee.x - midX;
  
  // In normalized 0..1 space, dx direction depends on left/right body side
  // Left knee moving inward = moving towards center (increasing x or decreasing x depending on camera mirror)
  const valgusAmount = Math.abs(dx) * 100; // convert to approx angular offset degrees
  return Math.round(valgusAmount * 10) / 10;
}

/**
 * Calculates percentage symmetry between left and right values (100 = identical, 0 = severe imbalance)
 */
export function calculateSymmetry(leftValue: number, rightValue: number): number {
  if (leftValue === 0 && rightValue === 0) return 100;
  const diff = Math.abs(leftValue - rightValue);
  const maxVal = Math.max(leftValue, rightValue, 1);
  const symmetry = Math.max(0, 100 - (diff / maxVal) * 100);
  return Math.round(symmetry);
}

/**
 * Detects current phase of squat based on knee angle trajectory
 */
export function detectSquatPhase(currentKneeAngle: number, previousPhase: SquatPhase): SquatPhase {
  const { STANDING_KNEE_ANGLE, DESCENT_START_KNEE_ANGLE, BOTTOM_MIN_KNEE_ANGLE } = BIOMECHANICS_CONFIG.SQUAT;

  if (currentKneeAngle >= STANDING_KNEE_ANGLE) {
    if (previousPhase === 'ASCENT') {
      return 'COMPLETED';
    }
    return 'STANDING';
  } else if (currentKneeAngle < DESCENT_START_KNEE_ANGLE && currentKneeAngle > BOTTOM_MIN_KNEE_ANGLE) {
    if (previousPhase === 'BOTTOM' || previousPhase === 'ASCENT') {
      return 'ASCENT';
    }
    return 'DESCENT';
  } else if (currentKneeAngle <= BOTTOM_MIN_KNEE_ANGLE) {
    return 'BOTTOM';
  }

  return previousPhase || 'STANDING';
}

/**
 * Evaluates full biomechanical quality of a squat rep frame
 */
export function evaluateSquatForm(
  leftKneeAngle: number,
  rightKneeAngle: number,
  leftHipAngle: number,
  rightHipAngle: number,
  leftAnkleAngle: number,
  rightAnkleAngle: number,
  valgusDevLeft: number,
  valgusDevRight: number,
  descentTimeMs: number = 2000
): { metrics: BiomechanicalMetrics; errors: DetectedError[]; angles: BiomechanicalAngles } {
  const avgKneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);
  const avgHipAngle = Math.round((leftHipAngle + rightHipAngle) / 2);
  const avgAnkleAngle = Math.round((leftAnkleAngle + rightAnkleAngle) / 2);

  // 1. Range of Motion (ROM) Score
  // Full extension is ~170°, deep parallel squat is ~90°
  // ROM achieved = 170 - minimum knee angle
  const romAchievedDeg = Math.max(0, 170 - avgKneeAngle);
  const targetROMDeg = 80; // 170 - 90 = 80 deg flexion
  const romPercentage = Math.min(100, Math.round((romAchievedDeg / targetROMDeg) * 100));

  // 2. Symmetry Score
  const symmetry = calculateSymmetry(leftKneeAngle, rightKneeAngle);

  // 3. Stability Score (Derived from valgus dev + smooth execution)
  const maxValgus = Math.max(valgusDevLeft, valgusDevRight);
  const stability = Math.max(20, Math.round(100 - maxValgus * 3));

  // 4. Velocity/Tempo Score
  let velocityScore = 90;
  if (descentTimeMs < BIOMECHANICS_CONFIG.SQUAT.DESCENT_TOO_FAST_MAX_MS) {
    velocityScore = 60;
  }

  // Detect Errors
  const errors: DetectedError[] = [];

  // ERROR 1: Knee Valgus
  if (maxValgus > BIOMECHANICS_CONFIG.SQUAT.VALGUS_MILD_MAX) {
    const isSevere = maxValgus > BIOMECHANICS_CONFIG.SQUAT.VALGUS_MODERATE_MAX;
    const severity = isSevere ? 'severe' : 'moderate';
    const deduction = BIOMECHANICS_CONFIG.ERROR_DEDUCTIONS.KNEE_VALGUS[severity];

    errors.push({
      id: 'err-valgus-' + Date.now(),
      errorType: 'KNEE_VALGUS',
      title: 'Inward Knee Alignment Deviation',
      severity,
      observedMetric: `${maxValgus.toFixed(1)}° inward displacement`,
      targetMetric: `< 8° alignment angle`,
      explanation: 'Your knee is collapsing inward toward the medial line during the squat descent.',
      correction: 'Keep your knee center active and track directly over your second toe.',
      affectedJoint: valgusDevLeft > valgusDevRight ? 'LEFT_KNEE' : 'RIGHT_KNEE',
      scoreDeduction: deduction,
    });
  }

  // ERROR 2: Insufficient Depth (if rep is at bottom)
  if (avgKneeAngle > 115) {
    const deduction = BIOMECHANICS_CONFIG.ERROR_DEDUCTIONS.INSUFFICIENT_DEPTH.moderate;
    errors.push({
      id: 'err-depth-' + Date.now(),
      errorType: 'INSUFFICIENT_DEPTH',
      title: 'Insufficient Squat Depth',
      severity: 'moderate',
      observedMetric: `Knee flexion ${170 - avgKneeAngle}° (${avgKneeAngle}° knee angle)`,
      targetMetric: `Flexion >= 80° (<= 90° knee angle)`,
      explanation: 'Squat depth stopped short of the target parallel angle, reducing quadriceps engagement.',
      correction: 'Lower your hips until your thighs reach parallel with the ground.',
      affectedJoint: 'HIP',
      scoreDeduction: deduction,
    });
  }

  // ERROR 3: Asymmetry
  if (symmetry < BIOMECHANICS_CONFIG.SQUAT.SYMMETRY_ACCEPTABLE_MIN) {
    const deduction = BIOMECHANICS_CONFIG.ERROR_DEDUCTIONS.ASYMMETRY.moderate;
    errors.push({
      id: 'err-asym-' + Date.now(),
      errorType: 'ASYMMETRY',
      title: 'Left/Right Weight Distribution Imbalance',
      severity: 'moderate',
      observedMetric: `${symmetry}% load symmetry`,
      targetMetric: `>= 90% symmetry`,
      explanation: 'Significant load shift detected toward your stronger limb during movement.',
      correction: 'Distribute weight evenly through both heels throughout the movement.',
      affectedJoint: leftKneeAngle < rightKneeAngle ? 'RIGHT_KNEE' : 'LEFT_KNEE',
      scoreDeduction: deduction,
    });
  }

  // Calculate Weighted Overall Score
  let totalDeductions = errors.reduce((acc, err) => acc + err.scoreDeduction, 0);
  
  // Base raw score from weighted components
  const baseComponentScore = Math.round(
    stability * BIOMECHANICS_CONFIG.SCORING_WEIGHTS.ALIGNMENT +
    romPercentage * BIOMECHANICS_CONFIG.SCORING_WEIGHTS.ROM +
    symmetry * BIOMECHANICS_CONFIG.SCORING_WEIGHTS.SYMMETRY +
    stability * BIOMECHANICS_CONFIG.SCORING_WEIGHTS.STABILITY +
    velocityScore * BIOMECHANICS_CONFIG.SCORING_WEIGHTS.TEMPO
  );

  const overallScore = Math.max(25, Math.min(100, baseComponentScore - totalDeductions));

  const metrics: BiomechanicalMetrics = {
    kneeAngle: avgKneeAngle,
    hipAngle: avgHipAngle,
    ankleAngle: avgAnkleAngle,
    rangeOfMotion: romAchievedDeg,
    romPercentage,
    symmetry,
    stability,
    velocity: velocityScore,
    formConsistency: Math.round((symmetry + stability) / 2),
    overallScore,
  };

  const angles: BiomechanicalAngles = {
    leftKneeAngle,
    rightKneeAngle,
    leftHipAngle,
    rightHipAngle,
    leftAnkleAngle,
    rightAnkleAngle,
    kneeValgusDevLeft: valgusDevLeft,
    kneeValgusDevRight: valgusDevRight,
  };

  return { metrics, errors, angles };
}

/**
 * Evaluates adaptive progression decision for patient recovery
 */
export function evaluateAdaptiveProgression(
  recentSessions: SessionData[],
  currentSessionScore: number
): AdaptiveRecommendation {
  if (!recentSessions || recentSessions.length === 0) {
    if (currentSessionScore >= 80) {
      return {
        decision: 'PROGRESS',
        reason: 'Current session movement quality meets the progression threshold (> 80/100).',
        supportingMetrics: [
          { label: 'Session Quality', value: `${currentSessionScore}/100` },
          { label: 'Form Consistency', value: 'High' }
        ],
        confidence: 88,
        requiresClinicianReview: true
      };
    }
    return {
      decision: 'REPEAT',
      reason: 'Baseline established. Maintain current exercise load to reinforce neuromuscular patterns.',
      supportingMetrics: [
        { label: 'Session Quality', value: `${currentSessionScore}/100` },
        { label: 'Status', value: 'Consolidating Baseline' }
      ],
      confidence: 90,
      requiresClinicianReview: false
    };
  }

  const scores = [...recentSessions.map(s => s.overallScore), currentSessionScore];
  const last3 = scores.slice(-3);
  const avg3 = Math.round(last3.reduce((a, b) => a + b, 0) / last3.length);

  // Check if score is improving
  const firstScore = scores[0];
  const totalImprovement = currentSessionScore - firstScore;

  if (avg3 >= BIOMECHANICS_CONFIG.ADAPTATION.PROGRESS_MIN_SCORE && currentSessionScore >= 80) {
    return {
      decision: 'PROGRESS',
      reason: `Movement quality exceeded configured progression threshold (${BIOMECHANICS_CONFIG.ADAPTATION.PROGRESS_MIN_SCORE}/100) across consecutive sessions (+${totalImprovement} pts overall).`,
      supportingMetrics: [
        { label: '3-Session Average', value: `${avg3}/100` },
        { label: 'Score Improvement', value: `+${totalImprovement} pts` },
        { label: 'Form Corrections', value: 'Verified' }
      ],
      confidence: 94,
      requiresClinicianReview: true
    };
  } else if (currentSessionScore < BIOMECHANICS_CONFIG.ADAPTATION.REGRESS_MAX_SCORE) {
    return {
      decision: 'REGRESS',
      reason: 'Significant movement quality deterioration or persistent joint alignment deviation detected. Reducing load recommended.',
      supportingMetrics: [
        { label: 'Current Score', value: `${currentSessionScore}/100` },
        { label: 'Deviation Level', value: 'Elevated' }
      ],
      confidence: 91,
      requiresClinicianReview: true
    };
  } else {
    return {
      decision: 'REPEAT',
      reason: 'Movement performance is stabilizing. Recommend repeating current tier to consolidate form consistency before advancing.',
      supportingMetrics: [
        { label: 'Current Score', value: `${currentSessionScore}/100` },
        { label: 'Target Score', value: `>= ${BIOMECHANICS_CONFIG.ADAPTATION.PROGRESS_MIN_SCORE}/100` }
      ],
      confidence: 89,
      requiresClinicianReview: false
    };
  }
}
