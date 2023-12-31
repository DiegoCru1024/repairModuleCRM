using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Data.Configurations;

public class RepairRequestConfiguration : IEntityTypeConfiguration<RepairRequest>
{
    public void Configure(EntityTypeBuilder<RepairRequest> builder)
    {
        //Table
        builder.ToTable("repair_requests");

        //Primary Key
        builder.HasKey(rr => rr.Id);

        //Properties
        builder.Property(rr => rr.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .IsRequired();

        builder.Property(rr => rr.ClientId)
            .IsRequired();

        builder.Property(rr => rr.PurchaseOrderId)
            .IsRequired();

        builder.Property(rr => rr.ProductId)
            .IsRequired();

        builder.Property(rr => rr.WarrantyId);

        builder.Property(rr => rr.Motive)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(rr => rr.Description)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(rr => rr.CreatedAt)
            .IsRequired();

        builder.Property(rr => rr.ClosedAt);

        builder.Property(rr => rr.DeviceStatus)
            .IsRequired();

        builder.Property(rr => rr.ContactEmailInfo)
            .IsRequired();

        builder.Property(x => x.CreatedById)
            .IsRequired();

        //Relationships
        builder.HasOne(rr => rr.Status)
            .WithMany(rs => rs.RepairRequests)
            .HasForeignKey(rr => rr.StatusId)
            .IsRequired();
    }
}