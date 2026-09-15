import test from "node:test"
import assert from "node:assert/strict"
import { authenticatedFetch } from "../src/api/authenticatedFetch.js"

test("authenticated dashboard requests use the first-party cookie and verification header", async () => {
  let captured
  const previousFetch = globalThis.fetch
  globalThis.fetch = async (input, init) => {
    captured = { input, init }
    return new Response(null, { status: 204 })
  }

  try {
    await authenticatedFetch("/backend/patients", { method: "GET" })
    assert.equal(captured.input, "/backend/patients")
    assert.equal(captured.init.credentials, "include")
    assert.equal(captured.init.headers.get("X-Requested-With"), "XMLHttpRequest")
    assert.equal(captured.init.headers.has("Authorization"), false)
  } finally {
    globalThis.fetch = previousFetch
  }
})
