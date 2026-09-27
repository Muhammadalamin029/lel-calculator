# LEL Calculator

Simple everyday calculator for LEL Store. Expo + React Native + TypeScript,
single screen, fully offline. No backend, no auth, no ads, no tracking,
zero Android permissions.

- App name: **LEL Calculator**
- Package: `com.lelstore.calculator`
- Version: 1.0.0 (versionCode 2 — EAS `autoIncrement` bumped the local
  `versionCode: 1` during the first production build)

## Requirements

- Node 22+
- Expo account + EAS CLI for cloud builds (`npm i -g eas-cli`)
- Android emulator or device for manual QA

## Develop

```bash
npm install
npm start            # scan QR with Expo Go (SDK 57)
npm test             # 31 calculator-engine tests
npm run typecheck
npm run lint
npx expo-doctor
```

> Development uses Expo Go. EAS development builds are configured but cannot
> load JS remotely because the app blocks `INTERNET` — this is intentional
> for the zero-permission production build.

## Project layout

```
App.tsx                    # single screen: display + keypad, theme wiring
index.ts                   # Expo root registration (no router — none needed)
src/engine/calculator.ts   # pure calculation engine (no RN imports, no eval)
src/state/useCalculator.ts # React binding (useReducer, local state only)
src/components/            # CalculatorDisplay, Keypad, CalcButton
src/constants/calculator.ts# key layout + accessibility labels
src/theme/colors.ts        # light/dark LEL palette (black/white/gold)
tests/calculator.test.ts   # engine tests
assets/                    # icon.png, adaptive-icon.png, splash-icon.png (+ SVG sources)
scripts/generate-assets.py # regenerates PNGs from the SVG sources
store/                     # Play listing, privacy policy, QA matrix, feature graphic
```

## Regenerate assets

```bash
python3 scripts/generate-assets.py   # needs cairosvg + Pillow
```

## Build (EAS)

First run (one time): `eas init` and replace `extra.eas.projectId` in
`app.json`. Signing is managed by EAS — never commit keystores.

```bash
eas build --platform android --profile preview      # APK for manual QA
eas build --platform android --profile production   # AAB for Play Console
```

`eas.json` production profile uses `app-bundle`. `autoIncrement` bumps the
remote `versionCode` on each EAS production build (local `app.json` stays at
`versionCode: 1` by design) — the first production build already bumped it to
2, so Play Console's version history starts at code 2.

## Privacy

No account. Calculations are performed locally and never transmitted.
No personal information collected, no third-party tracking, no ads.
Full text: `store/privacy-policy.md` (publish it at a public URL and link it
in Play Console).

## Play Console checklist

1. Create app → Tools category → title **LEL Calculator**
2. Upload production AAB (`com.lelstore.calculator`, v1.0.0 / code 2)
3. Paste title/short/full description from `store/play-listing.md`
4. Upload `assets/icon.png` (512+), `store/feature-graphic.png` (1024×500),
   real-UI phone screenshots (see `store/manual-qa.md`)
5. Data Safety: no data collected, no data shared, zero permissions
6. Content rating questionnaire → Everyone
7. Publish privacy policy URL, set countries, roll out to internal test,
   then production
