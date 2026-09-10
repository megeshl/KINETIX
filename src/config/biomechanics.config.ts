// Biomechanical thresholds and configuration parameters for KINETIX

export const BIOMECHANICS_CONFIG = {
  // Angle thresholds for Controlled Squat
  SQUAT: {
    STANDING_KNEE_ANGLE: 160, // >= 160° is standing
    DESCENT_START_KNEE_ANGLE: 150, // < 150° entering descent
    BOTTOM_MIN_KNEE_ANGLE: 100, // < 100° is acceptable deep squat depth
    OPTIMAL_PARALLEL_KNEE_ANGLE: 90, // 90° is ideal parallel squat
    DEEP_SQUAT_KNEE_ANGLE: 75, // < 75° deep knee flexion
    
    // Knee Valgus (Inward deviation) thresholds
    VALGUS_NORMAL_MAX: 8, // < 8° normal deviation
    VALGUS_MILD_MAX: 14, // 8°-14° mild valgus
    VALGUS_MODERATE_MAX: 22, // 14°-22° moderate valgus
    // > 22° severe valgus

    // Symmetry threshold
    SYMMETRY_OPTIMAL_MIN: 90, // >= 90% is excellent
    SYMMETRY_ACCEPTABLE_MIN: 75, // 75-89% acceptable
    
    // Tempo/Speed thresholds (in milliseconds for descent phase)
    DESCENT_TEMPO_OPTIMAL_MIN_MS: 1800, // 1.8s controlled descent
    DESCENT_TOO_FAST_MAX_MS: 900, // < 0.9s too fast / explosive loss of control
  },

  // Scoring Weights (sums to 1.0)
  SCORING_WEIGHTS: {
    ALIGNMENT: 0.35, // Knee alignment / Valgus
    ROM: 0.25,       // Range of motion / Squat depth
    SYMMETRY: 0.20,  // Left vs Right joint angle balance
    STABILITY: 0.10, // Frame-to-frame variance in trajectory
    TEMPO: 0.10      // Descent and ascent speed control
  },

  // Deductions per error
  ERROR_DEDUCTIONS: {
    KNEE_VALGUS: {
      mild: 10,
      moderate: 18,
      severe: 30,
    },
    INSUFFICIENT_DEPTH: {
      mild: 8,
      moderate: 15,
      severe: 25,
    },
    ASYMMETRY: {
      mild: 6,
      moderate: 12,
      severe: 20,
    },
    EXCESSIVE_TEMPO: {
      mild: 5,
      moderate: 10,
      severe: 15,
    },
    UNSTABLE_DESCENT: {
      mild: 5,
      moderate: 10,
      severe: 18,
    }
  },

  // Adaptive Decision thresholds
  ADAPTATION: {
    PROGRESS_MIN_SCORE: 82,
    PROGRESS_MIN_CONSECUTIVE_SESSIONS: 2,
    REGRESS_MAX_SCORE: 65,
    REGRESS_PERSISTENT_ERROR_COUNT: 3,
  }
};
