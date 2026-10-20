import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// React Router 7 expects these browser globals, which the CRA test environment lacks.
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
