namespace Application.Contracts.RepairRequest.DTOs;

public class NewRepairRequest
{
    public string ClientId { get; set; }
    public string PurchaseOrderId { get; set; }
    public string ProductId { get; set; }
    public string Motive { get; set; }
    public string Description { get; set; }
    public int DeviceStatus { get; set; }
    public string ContactEmailInfo { get; set; }
}