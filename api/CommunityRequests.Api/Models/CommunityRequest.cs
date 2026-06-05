namespace CommunityRequests.Api.Models;

public sealed record CommunityRequest(
    string Id,
    string RequesterName,
    RequestCategory Category,
    string Subject,
    string Details,
    RequesterPriority RequesterPriority,
    RequestStatus Status,
    DateTimeOffset SubmittedAt,
    DateTimeOffset? LastStaffResponseAt,
    DateOnly? DesiredDate,
    string? AssignedTo,
    string? ContactEmail,
    string? ContactPhone,
    bool AccessibilityNeed);

public enum RequestCategory
{
    Room,
    Equipment,
    Accessibility,
    General
}

public enum RequesterPriority
{
    Low,
    Normal,
    Urgent
}

public enum RequestStatus
{
    New,
    InReview,
    WaitingOnRequester,
    Resolved
}
