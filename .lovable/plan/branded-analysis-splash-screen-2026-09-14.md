# Branded analysis splash screen

## Goal
Replace the current analysis-loading presentation with a responsive branded splash screen while preserving the existing analysis process, results flow, and loading state behavior.

## Changes
- Show the complete, uncropped Web Vision logo lockup prominently while an analysis is running.
- Add restrained motion around the brand and a clear “Analyzing website” progress message using existing theme colors and motion conventions.
- Keep useful dashboard skeletons beneath the branded splash so users still perceive progress during longer scans.
- Ensure the splash fits phone, tablet, and desktop screens without overlap or horizontal overflow.
- Respect reduced-motion preferences and preserve all current analysis, error, and results behavior.

## Technical details
- Update the existing `LoadingState` presentation only; no analyzer, API, database, routing, or scoring changes.
- Reuse the shared `Logo` component so the full original artwork remains contained and high-DPI sharp.
- Verify the loading state at mobile and desktop widths and confirm a successful build.
