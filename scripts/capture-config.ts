// The fixed inputs of the screenshots, shared by scripts/capture-demo.ts (the
// local Tab demo) and scripts/capture.ts (the shots). Change one and every
// capture changes, so re-run `pnpm capture` and commit the new files.

/** The Tab commit the captures show (L5, the demo's head and ?lang=). */
export const TAB_REF = "5b136f3";

/** "Now", for the browser and for the demo's server: a Thursday afternoon in Caracas. */
export const CAPTURE_NOW = "2026-10-15T17:45:00-04:00";
export const TIME_ZONE = "America/Caracas";

/**
 * The BCV rate the demo's server gets instead of the live one (Bs per USD).
 * Close to the real rate around CAPTURE_NOW (the live demo showed 875.65 on
 * 2026-10-10), so the Bs totals look right to a Venezuelan reader.
 */
export const BCV_RATE = 875.65;

/** A phone: the viewport in CSS px and the device pixel ratio. */
export const VIEWPORT = { width: 390, height: 844 };
export const DPR = 3;

/** Where scripts/capture-demo.ts serves the local demo. */
export const DEMO_PORT = 4173;
export const DEMO_URL = `http://127.0.0.1:${DEMO_PORT}`;

/** The person picked on "¿Quién eres?", as the app stores it (Ana, a client in the demo seed). */
export const ACTIVE_USER = { id: 1, nombre: "Ana", iniciales: "A", rol: "cliente" };

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];

/** The output folder, one subfolder per language. */
export const CAPTURES_DIR = new URL("../src/assets/captures/", import.meta.url);
