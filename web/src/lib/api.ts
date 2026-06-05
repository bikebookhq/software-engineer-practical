export type RequestCategory = "Room" | "Equipment" | "Accessibility" | "General";
export type RequesterPriority = "Low" | "Normal" | "Urgent";
export type RequestStatus = "New" | "InReview" | "WaitingOnRequester" | "Resolved";

export type CommunityRequest = {
  id: string;
  requesterName: string;
  category: RequestCategory;
  subject: string;
  details: string;
  requesterPriority: RequesterPriority;
  status: RequestStatus;
  submittedAt: string;
  lastStaffResponseAt: string | null;
  desiredDate: string | null;
  assignedTo: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  accessibilityNeed: boolean;
};

export type RequestsResponse = {
  generatedAt: string;
  requests: CommunityRequest[];
};

const defaultApiUrl = "http://localhost:5087";

export async function fetchCommunityRequests(signal?: AbortSignal): Promise<RequestsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_REQUEST_API_URL ?? defaultApiUrl;
  const response = await fetch(`${apiUrl}/api/requests`, { signal });

  if (!response.ok) {
    throw new Error(`Request API returned ${response.status}`);
  }

  return response.json() as Promise<RequestsResponse>;
}
