using Application.Contracts.RepairRequest.DTOs;
using Application.Contracts.Status.DTOs;
using Application.Enums;
using Application.Exceptions;
using Application.Factories.StatusFactory.Implementations;
using Application.Repositories;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Base;
using Domain.Entities;

namespace Application.Services.Implementations;

public class RepairRequestService : IRepairRequestService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidationObjectService _validationObjectService;
    private readonly ISalesModuleService _salesModuleService;

    public RepairRequestService(IUnitOfWork unitOfWork, IMapper mapper,
        IValidationObjectService validationObjectService, ISalesModuleService salesModuleService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validationObjectService = validationObjectService;
        _salesModuleService = salesModuleService;
    }

    public async Task<GetRepairRequest> CreateRequest(NewRepairRequest model, Guid createdById)
    {
        _validationObjectService.EnsureValid(model);
        var repairRequest = _mapper.Map<RepairRequest>(model);
        repairRequest.CreatedAt = DateTime.Now;
        repairRequest.StatusId = new RequestStatusFactory().CreateStatus(RequestStatuses.Pending).Id;
        repairRequest.CreatedById = createdById;
        var warranty =
            await _salesModuleService.GetWarrantyByProductIdAndSellId(Guid.Parse(model.ProductId),
                Guid.Parse(model.PurchaseOrderId));
        repairRequest.WarrantyId = warranty?.Id.ToString();

        var repairOrderStatus = (OrderStatus)new OrderStatusFactory().CreateStatus(OrderStatuses.WaitingForDiagnosis);

        var repairOrder = warranty is not null
            ? new RepairOrder(warranty.Percentage, !warranty.IsExpired, repairOrderStatus.Id)
            : new RepairOrder(0, false, repairOrderStatus.Id);

        repairRequest.RepairOrder = repairOrder;
        var createdRequest = await _unitOfWork.RepairRequests.AddAsync(repairRequest);
        await _unitOfWork.CommitAsync();
        return _mapper.Map<GetRepairRequest>(createdRequest);
    }

    public async Task<GetRepairRequest?> GetRequestById(Guid id)
    {
        var repairRequest = await _unitOfWork.RepairRequests.GetByIdAsync(id);

        if (repairRequest == null)
        {
            throw new AppException("No se encontró la solicitud de reparación");
        }

        return _mapper.Map<GetRepairRequest>(repairRequest);
    }

    public async Task<IEnumerable<GetRepairRequest>> GetAllRequests()
    {
        var repairRequests = await _unitOfWork.RepairRequests.GetAllAsync();

        return _mapper.Map<List<GetRepairRequest>>(repairRequests);
    }

    public async Task<GetRepairRequest> UpdateRequest(Guid id, UpdateRepairRequest model)
    {
        _validationObjectService.EnsureValid(model);
        var repairRequest = await _unitOfWork.RepairRequests.GetByIdAsync(id);
        if (repairRequest == null)
        {
            throw new AppException("No se encontró la solicitud de reparación");
        }

        if (repairRequest.StatusId != new RequestStatusFactory().CreateStatus(RequestStatuses.Pending).Id)
        {
            throw new AppException("No se puede actualizar una solicitud de reparación que no esté pendiente");
        }

        _mapper.Map(model, repairRequest);
        await _unitOfWork.RepairRequests.UpdateAsync(repairRequest);
        await _unitOfWork.CommitAsync();

        return _mapper.Map<GetRepairRequest>(repairRequest);
    }

    public async Task<IEnumerable<GetStatus>> GetRequestStatuses()
    {
        var statuses = await _unitOfWork.RequestStatuses.GetAllAsync();
        return _mapper.Map<IEnumerable<GetStatus>>(statuses);
    }

    public async Task<IEnumerable<GetRepairRequest>> GetRequestsWithFilters(string? status, string? clientId,
        DateTime? fromDate, DateTime? toDate, int? limit)
    {
        var repairRequests =
            await _unitOfWork.RepairRequests.GetWithFiltersAsync(status, clientId, fromDate, toDate, limit);
        return _mapper.Map<IEnumerable<GetRepairRequest>>(repairRequests);
    }

    public async Task<IEnumerable<WeeklyRequest>> RequestWeeklyReport(DateTime fromDate, DateTime toDate)
    {
        var weeklyReport = new List<WeeklyRequest>();
        for (var currentDate = fromDate; currentDate <= toDate; currentDate = currentDate.AddDays(1))
        {
            var count = await _unitOfWork.RepairRequests.CountAsync(r =>
                r.CreatedAt.Date == currentDate);
            weeklyReport.Add(new WeeklyRequest()
            {
                Name = currentDate.ToString("dd/MM"),
                Quantity = count
            });
        }
        return weeklyReport;
    }

    public async Task<IEnumerable<MonthlyRequestByState>> StatusesMonthlyReport(int year, int month)
    {
        var statuses = await _unitOfWork.RequestStatuses.GetAllAsync();
        var monthlyReport = new List<MonthlyRequestByState>();
        foreach (var status in statuses)
        {
            var count = await _unitOfWork.RepairRequests.CountAsync(r =>
                r.StatusId == status.Id && r.CreatedAt.Year == year && r.CreatedAt.Month == month);
            monthlyReport.Add(new MonthlyRequestByState
            {
                Name = status.Name,
                Quantity = count
            });
        }

        return monthlyReport;
    }
}
