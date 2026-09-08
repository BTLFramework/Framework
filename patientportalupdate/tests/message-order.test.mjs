import test from "node:test"
import assert from "node:assert/strict"
import { latestChronologicalMessage, newestFirstToChronological } from "../lib/messageOrder.js"

test("patient messages render oldest to newest while retaining the latest preview", () => {
  const newestFirst = [
    { id: 3, content: "newest" },
    { id: 2, content: "middle" },
    { id: 1, content: "oldest" },
  ]

  const chronological = newestFirstToChronological(newestFirst)
  assert.deepEqual(chronological.map((message) => message.id), [1, 2, 3])
  assert.equal(latestChronologicalMessage(chronological).content, "newest")
  assert.deepEqual(newestFirst.map((message) => message.id), [3, 2, 1])
})

test("empty message collections have no latest message", () => {
  assert.deepEqual(newestFirstToChronological(null), [])
  assert.equal(latestChronologicalMessage([]), undefined)
})
