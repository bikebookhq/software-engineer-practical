import assert from "node:assert/strict";
import test from "node:test";
import {
  isHighPriorityRequest,
  isOpenRequest,
  sortRequestsForDefaultView
} from "./requestTriage.js";

const baseRequest = {
  id: "req-test",
  requesterName: "Test Person",
  category: "General",
  subject: "Test request",
  details: "Test details",
  requesterPriority: "Normal",
  status: "New",
  submittedAt: "2026-06-10T10:00:00Z",
  lastStaffResponseAt: null,
  desiredDate: null,
  assignedTo: null,
  contactEmail: "test@example.org",
  contactPhone: null,
  accessibilityNeed: false
};

test("isOpenRequest treats new and in-review requests as open", () => {
  assert.equal(isOpenRequest({ ...baseRequest, status: "New" }), true);
  assert.equal(isOpenRequest({ ...baseRequest, status: "InReview" }), true);
  assert.equal(isOpenRequest({ ...baseRequest, status: "Resolved" }), false);
});

test("sortRequestsForDefaultView shows newest submitted request first", () => {
  const requests = [
    { ...baseRequest, id: "older", submittedAt: "2026-06-09T10:00:00Z" },
    { ...baseRequest, id: "newer", submittedAt: "2026-06-11T10:00:00Z" }
  ];

  assert.deepEqual(
    sortRequestsForDefaultView(requests).map((request) => request.id),
    ["newer", "older"]
  );
});

test("isHighPriorityRequest follows requester-selected urgency", () => {
  assert.equal(
    isHighPriorityRequest({ ...baseRequest, requesterPriority: "Urgent" }),
    true
  );
});

test.skip("attention-needed triage should not treat resolved urgent requests as staff follow-up", () => {
  const request = {
    ...baseRequest,
    requesterPriority: "Urgent",
    status: "Resolved"
  };

  assert.equal(isHighPriorityRequest(request), false);
});
