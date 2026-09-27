# Manual Android QA matrix — LEL Calculator 1.0.0 (versionCode 2)

Run against the `preview` APK first, then repeat the starred items on the
`production` AAB installed via `bundletool` or the Play internal track.

Automated coverage: `npm test` (31 engine tests). The items below cover the
real Android application and must be checked by hand on a device/emulator.

## Install & launch

- [ ] Fresh install on a wiped emulator/device, Android 7+ (*)
- [ ] Cold launch opens straight into the calculator, no onboarding (*)
- [ ] Launch time feels instant; splash shows LEL wordmark on black (*)
- [ ] No debug banners, placeholder text, or test credentials anywhere (*)

## Calculator buttons (light + dark)

- [ ] 25 + 15 = 40; 100 − 25 = 75; 12 × 8 = 96; 144 ÷ 12 = 12 (*)
- [ ] 5.5 + 2.25 = 7.75; no trailing zeros (15, not 15.000000) (*)
- [ ] % : 50 % → 0.5; 200 + 10 % = → 220 (*)
- [ ] ± toggles sign; AC clears; ⌫ deletes; = repeats last op (*)
- [ ] 5 ÷ 0 = shows "Can't divide by zero", no crash/NaN/Infinity,
      next digit starts fresh (*)
- [ ] Operator replacement: 5 + then × behaves as 5 ×

## System behaviour

- [ ] Android back button from the single screen exits (no crash) (*)
- [ ] Background → foreground keeps current entry (*)
- [ ] Rotation locked to portrait
- [ ] Airplane mode: everything works, zero network requests (*)

## Screens & appearance

- [ ] Small phone (~4.7", 720p): keypad fits, no overflow
- [ ] Large phone/tablet (~6.8"+): layout balanced, no stretching
- [ ] Light mode: all text/buttons readable; dark mode: same
- [ ] Font size set to Largest in system settings: display shrinks,
      keypad intact
- [ ] TalkBack: every key announces its label; result is announced

## Release build

- [ ] `eas build --platform android --profile production` succeeds
- [ ] AAB has applicationId `com.lelstore.calculator`, versionCode 2
- [ ] Merged manifest declares zero `uses-permission` entries (*)
- [ ] Installed release build passes the starred checks above (*)

## Screenshots

Capture 1080×1920 (or device native) PNGs of the real production UI —
light mode, dark mode, one mid-calculation, one showing the divide-by-zero
message — and upload them to Play Console. Do not mock or edit them.
