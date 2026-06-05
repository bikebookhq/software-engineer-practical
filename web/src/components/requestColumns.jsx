import {
  getCategoryLabel,
  getStatusLabel,
  isHighPriorityRequest,
  isOpenRequest
} from "../lib/requestTriage";

function formatDateTime(value) {
  if (!value) {
    return "None";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium"
  }).format(new Date(`${value}T00:00:00Z`));
}

function RequesterPriorityBadge({ request }) {
  if (!isHighPriorityRequest(request)) {
    return <span className="badge badgeMuted">Normal</span>;
  }

  return <span className="badge badgeWarm">Requester priority</span>;
}

function ContactSummary({ request }) {
  if (request.contactEmail) {
    return <span>{request.contactEmail}</span>;
  }

  return <span className="muted">No contact details</span>;
}

export const requestColumns = [
  {
    id: "request",
    header: "Request",
    csvValue: (request) => `${request.subject}: ${request.details}`,
    render: (request) => (
      <div className="subjectCell">
        <span className="subject">{request.subject}</span>
        <span className="details">{request.details}</span>
      </div>
    )
  },
  {
    id: "requester",
    header: "Requester",
    csvValue: (request) => request.requesterName,
    render: (request) => request.requesterName
  },
  {
    id: "category",
    header: "Category",
    csvValue: (request) => getCategoryLabel(request.category),
    render: (request) => getCategoryLabel(request.category)
  },
  {
    id: "status",
    header: "Status",
    isOpenOnly: (request) => isOpenRequest(request),
    csvValue: (request) => getStatusLabel(request.status),
    render: (request) => (
      <span className={isOpenRequest(request) ? "statusOpen" : "statusClosed"}>
        {getStatusLabel(request.status)}
      </span>
    )
  },
  {
    id: "priority",
    header: "Priority",
    csvValue: (request) =>
      isHighPriorityRequest(request) ? "Requester priority" : "Normal",
    render: (request) => <RequesterPriorityBadge request={request} />
  },
  {
    id: "submitted",
    header: "Submitted",
    csvValue: (request) => formatDateTime(request.submittedAt),
    sortValue: (request) => new Date(request.submittedAt).getTime(),
    render: (request) => formatDateTime(request.submittedAt)
  },
  {
    id: "lastResponse",
    header: "Last response",
    csvValue: (request) => formatDateTime(request.lastStaffResponseAt),
    sortValue: (request) =>
      request.lastStaffResponseAt
        ? new Date(request.lastStaffResponseAt).getTime()
        : null,
    render: (request) => formatDateTime(request.lastStaffResponseAt)
  },
  {
    id: "neededBy",
    header: "Needed by",
    csvValue: (request) => formatDate(request.desiredDate),
    sortValue: (request) =>
      request.desiredDate ? new Date(`${request.desiredDate}T00:00:00Z`).getTime() : null,
    render: (request) => formatDate(request.desiredDate)
  },
  {
    id: "owner",
    header: "Owner",
    csvValue: (request) => request.assignedTo ?? "Unassigned",
    render: (request) => request.assignedTo ?? <span className="muted">Unassigned</span>
  },
  {
    id: "contact",
    header: "Contact",
    csvValue: (request) => request.contactEmail ?? request.contactPhone ?? "",
    render: (request) => <ContactSummary request={request} />
  }
];
