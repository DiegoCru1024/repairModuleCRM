using Domain.Entities;
using Infrastructure.Persistence.Data.Seeds;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Data.Configurations;

public class RequestStatusConfiguration : IEntityTypeConfiguration<RequestStatus>
{
    public void Configure(EntityTypeBuilder<RequestStatus> builder)
    {
        //Table
        builder.ToTable("request_statuses");

        //Primary Key
        builder.HasKey(rs => rs.Id);

        //Properties
        builder.Property(rs => rs.Id)
            .HasDefaultValueSql("gen_random_uuid()")
            .IsRequired();

        builder.Property(rs => rs.Name)
            .HasMaxLength(50)
            .IsRequired();

        //Seed Data
        builder.HasData(
            DefaultRequestStatuses.Seed()
        );
    }

}