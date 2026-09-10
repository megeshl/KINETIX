// Simple runtime test suite for biomechanics engine
import { 
  calculateAngle, 
  calculateSymmetry, 
  detectSquatPhase, 
  evaluateSquatForm,
  evaluateAdaptiveProgression 
} from '../lib/biomechanicsEngine';

export function runBiomechanicsTests() {
  const results: { test: string; passed: boolean; details: string }[] = [];

  // Test 1: Calculate 90 degree right angle
  const p1 = { x: 0, y: 1 };
  const vertex = { x: 0, y: 0 };
  const p3 = { x: 1, y: 0 };
  const angle90 = calculateAngle(p1, vertex, p3);
  results.push({
    test: 'Joint Angle Calculation (90°)',
    passed: Math.abs(angle90 - 90) < 0.5,
    details: `Expected 90°, got ${angle90}°`
  });

  // Test 2: Calculate Symmetry
  const symm100 = calculateSymmetry(90, 90);
  const symm80 = calculateSymmetry(100, 80);
  results.push({
    test: 'Symmetry Calculation (Identical = 100%)',
    passed: symm100 === 100 && symm80 === 80,
    details: `100% test: ${symm100}%, 80% test: ${symm80}%`
  });

  // Test 3: Squat Phase Detection
  const phase1 = detectSquatPhase(170, 'STANDING');
  const phase2 = detectSquatPhase(120, 'STANDING');
  const phase3 = detectSquatPhase(85, 'DESCENT');
  results.push({
    test: 'Squat Phase Detection (Standing -> Descent -> Bottom)',
    passed: phase1 === 'STANDING' && phase2 === 'DESCENT' && phase3 === 'BOTTOM',
    details: `P1: ${phase1}, P2: ${phase2}, P3: ${phase3}`
  });

  // Test 4: Form Evaluation - Valgus Detection
  const evalValgus = evaluateSquatForm(90, 90, 95, 95, 80, 80, 18, 5, 2000);
  const valgusErrorDetected = evalValgus.errors.some(e => e.errorType === 'KNEE_VALGUS');
  results.push({
    test: 'Knee Valgus Error Detection (Dev > 14°)',
    passed: valgusErrorDetected,
    details: `Detected ${evalValgus.errors.length} errors, valgus present: ${valgusErrorDetected}`
  });

  // Test 5: Adaptive Engine Progression
  const adaptProgress = evaluateAdaptiveProgression([], 88);
  results.push({
    test: 'Adaptive Engine Decision (Score 88 -> PROGRESS)',
    passed: adaptProgress.decision === 'PROGRESS',
    details: `Decision: ${adaptProgress.decision}, Reason: ${adaptProgress.reason}`
  });

  console.log('--- KINETIX BIOMECHANICS TEST SUITE RESULTS ---');
  results.forEach(r => {
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] ${r.test}: ${r.details}`);
  });

  return results;
}
