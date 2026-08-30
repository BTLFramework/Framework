import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const sessionSource = readFileSync(
  new URL("../components/MindfulnessSessionDialog.tsx", import.meta.url),
  "utf8",
);
const videoSource = readFileSync(
  new URL("../components/MindfulnessVideoModal.tsx", import.meta.url),
  "utf8",
);

test("each mindfulness card is mapped to its intended video", () => {
  const mappings = {
    breathwork: "lcUlprEmMtA",
    nsdr: "OHRfUWdgflM",
    lymph: "m7ZIHCa2qeA",
    mindshift: "MH6oKWWAHq0",
  };

  for (const [trackId, videoId] of Object.entries(mappings)) {
    const trackPattern = new RegExp(
      `id: ['\"]${trackId}['\"][\\s\\S]*?videoId: ['\"]${videoId}['\"]`,
    );
    assert.match(sessionSource, trackPattern);
  }
});

test("the mindfulness player uses the selected card instead of a fixed video", () => {
  assert.match(
    videoSource,
    /youtube-nocookie\.com\/embed\/\$\{practice\.videoId\}/,
  );
  assert.match(videoSource, /\{practice\.duration\}/);
  assert.match(videoSource, /\{practice\.source\}/);
  assert.doesNotMatch(
    videoSource,
    /src=["']https:\/\/www\.youtube\.com\/embed\/lcUlprEmMtA["']/,
  );
});
