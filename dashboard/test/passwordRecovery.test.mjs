import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"

const login = fs.readFileSync(new URL("../src/components/LoginForm.jsx", import.meta.url), "utf8")
const app = fs.readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8")
const reset = fs.readFileSync(new URL("../src/pages/ResetPassword.jsx", import.meta.url), "utf8")
const forgot = fs.readFileSync(new URL("../src/pages/ForgotPassword.jsx", import.meta.url), "utf8")

test("clinician login identifies fields for password managers", () => {
  assert.match(login, /autoComplete="email"/)
  assert.match(login, /"current-password"/)
  assert.match(login, /Forgot password\?/)
})

test("public password recovery routes are available", () => {
  assert.match(app, /path="\/forgot-password"/)
  assert.match(app, /path="\/reset-password"/)
  assert.match(reset, /autoComplete="new-password"/)
})

test("password reset delivery failures are shown as errors", () => {
  assert.match(forgot, /response\?\.data\?\.error/)
  assert.match(forgot, /role="alert"/)
})
