using Application.Contracts.RepairRequest.DTOs;
using Application.Contracts.Status.DTOs;
using Domain.Base;
using Domain.Entities;

namespace Application.Services.Interfaces;

public interface IRepairRequestService
{
    Task<GetRepairRequest> CreateRequest(NewRepairRequest model, Guid createdById);
    Task<GetRepairRequest?> GetRequestById(Guid id);
    Task<IEnumerable<GetRepairRequest>> GetAllRequests();
    Task<GetRepairRequest> UpdateRequest(Guid id, UpdateRepairRequest model);
    Task<IEnumerable<GetStatus>> GetRequestStatuses();

    Task<IEnumerable<GetRepairRequest>> GetRequestsWithFilters(string? status, string? clientId, DateTime? fromDate,
        DateTime? toDate, int? limit);
    Task<IEnumerable<WeeklyRequest>> RequestWeeklyReport(DateTime fromDate, DateTime toDate);
    Task<IEnumerable<MonthlyRequestByState>> StatusesMonthlyReport(int year, int month);
}
