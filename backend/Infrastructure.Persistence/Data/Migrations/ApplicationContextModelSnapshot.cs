﻿// <auto-generated />
using System;
using Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Infrastructure.Persistence.Data.Migrations
{
    [DbContext(typeof(ApplicationContext))]
    partial class ApplicationContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasDefaultSchema("dbo")
                .HasAnnotation("ProductVersion", "7.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("Domain.Entities.RepairRequest", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("ClientId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime?>("ClosedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("ContactEmailInfo")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("character varying(200)");

                    b.Property<int>("DeviceStatus")
                        .HasColumnType("integer");

                    b.Property<string>("OrderId")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("StatusId")
                        .HasColumnType("uuid");

                    b.Property<string>("WarrantyId")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.HasIndex("StatusId");

                    b.ToTable("repair_requests", "dbo");
                });

            modelBuilder.Entity("Domain.Entities.RequestStatus", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("gen_random_uuid()");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(20)
                        .HasColumnType("character varying(20)");

                    b.HasKey("Id");

                    b.ToTable("request_statuses", "dbo");

                    b.HasData(
                        new
                        {
                            Id = new Guid("a2a674ed-e4ae-4fbc-bb1f-29b5122e1c88"),
                            Name = "Cancelled"
                        },
                        new
                        {
                            Id = new Guid("922ff6a9-ad99-4b78-8826-fc2136829e53"),
                            Name = "InProgress"
                        },
                        new
                        {
                            Id = new Guid("56626b64-485b-458a-99fb-cdb5b635526e"),
                            Name = "Pending"
                        },
                        new
                        {
                            Id = new Guid("5bf32584-8ba2-467d-b7a1-e354217e6c3b"),
                            Name = "Solved"
                        });
                });

            modelBuilder.Entity("Domain.Entities.RepairRequest", b =>
                {
                    b.HasOne("Domain.Entities.RequestStatus", "Status")
                        .WithMany("RepairRequests")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Domain.Entities.RequestStatus", b =>
                {
                    b.Navigation("RepairRequests");
                });
#pragma warning restore 612, 618
        }
    }
}
