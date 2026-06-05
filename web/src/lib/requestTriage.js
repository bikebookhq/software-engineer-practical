export const statusLabels = {
  New: "New",
  InReview: "In review",
  WaitingOnRequester: "Waiting on requester",
  Resolved: "Resolved"
};

export const categoryLabels = {
  Room: "Room",
  Equipment: "Equipment",
  Accessibility: "Accessibility",
  General: "General"
};

// Legacy prototype rule. Early notes suggested requests older than 24 hours
// might need follow-up, but the staff attention rule is still unsettled.
// Do not assume this is the finished staff attention rule.
export const LEGACY_FOLLOW_UP_AFTER_HOURS = 24;

export function getStatusLabel(status) {
  return statusLabels[status] ?? status;
}

export function getCategoryLabel(category) {
  return categoryLabels[category] ?? category;
}

export function isOpenRequest(request) {
  return request.status === "New" || request.status === "InReview";
}

export function sortRequestsForDefaultView(requests) {
  return [...requests].sort((first, second) => {
    return new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime();
  });
}

// Existing badge helper for the requester's own priority selection. It is not
// the same thing as staff priority, and resolved urgent requests are possible.
export function isHighPriorityRequest(request) {
  return request.requesterPriority === "Urgent" || request.category === "Accessibility";
}
