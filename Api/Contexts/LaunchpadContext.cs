using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Api.Entities;

namespace Api.Contexts
{
    public partial class LaunchpadContext : DbContext
    {
        public LaunchpadContext()
        {
        }

        public LaunchpadContext(DbContextOptions<LaunchpadContext> options)
            : base(options)
        {
        }

        public virtual DbSet<FrameManagers> FrameManagers { get; set; }
        public virtual DbSet<FramePictures> FramePictures { get; set; }
        public virtual DbSet<Frames> Frames { get; set; }
        public virtual DbSet<FrameSettings> FrameSettings { get; set; }
        public virtual DbSet<FrameUserPermissions> FrameUserPermissions { get; set; }
        public virtual DbSet<FrameUsers> FrameUsers { get; set; }
        public virtual DbSet<Pictures> Pictures { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Server=localhost;Database=LaunchpadFrame;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FrameManagers>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.FrameManagers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameManagers_Users");
            });

            modelBuilder.Entity<FramePictures>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.AddedDate).HasColumnType("datetime");

                entity.Property(e => e.RemovedDate).HasColumnType("datetime");

                entity.HasOne(d => d.AddedByNavigation)
                    .WithMany(p => p.FramePicturesAddedByNavigation)
                    .HasForeignKey(d => d.AddedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FramePictures_Users");

                entity.HasOne(d => d.ApprovedByNavigation)
                    .WithMany(p => p.FramePicturesApprovedByNavigation)
                    .HasForeignKey(d => d.ApprovedBy)
                    .HasConstraintName("FK_FramePictures_Users2");

                entity.HasOne(d => d.Frame)
                    .WithMany(p => p.FramePictures)
                    .HasForeignKey(d => d.FrameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FramePictures_Frames");

                entity.HasOne(d => d.Picture)
                    .WithMany(p => p.FramePictures)
                    .HasForeignKey(d => d.PictureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FramePictures_Pictures");

                entity.HasOne(d => d.RemovedByNavigation)
                    .WithMany(p => p.FramePicturesRemovedByNavigation)
                    .HasForeignKey(d => d.RemovedBy)
                    .HasConstraintName("FK_FramePictures_Users1");
            });

            modelBuilder.Entity<Frames>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Frames)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Frames_Users");
            });

            modelBuilder.Entity<FrameSettings>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Frame)
                    .WithMany(p => p.FrameSettings)
                    .HasForeignKey(d => d.FrameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameSettings_Frames");
            });

            modelBuilder.Entity<FrameUserPermissions>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Frame)
                    .WithMany(p => p.FrameUserPermissions)
                    .HasForeignKey(d => d.FrameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameUserPermissions_Frames");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.FrameUserPermissions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameUserPermissions_Users");
            });

            modelBuilder.Entity<FrameUsers>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.AcceptedDate).HasColumnType("datetime");

                entity.Property(e => e.AddedDate).HasColumnType("datetime");

                entity.Property(e => e.RemovedDate).HasColumnType("datetime");

                entity.HasOne(d => d.AddedByNavigation)
                    .WithMany(p => p.FrameUsersAddedByNavigation)
                    .HasForeignKey(d => d.AddedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameUsers_Users1");

                entity.HasOne(d => d.Frame)
                    .WithMany(p => p.FrameUsers)
                    .HasForeignKey(d => d.FrameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameUsers_Frames");

                entity.HasOne(d => d.RemovedByNavigation)
                    .WithMany(p => p.FrameUsersRemovedByNavigation)
                    .HasForeignKey(d => d.RemovedBy)
                    .HasConstraintName("FK_FrameUsers_Users2");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.FrameUsersUser)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameUsers_Users");
            });

            modelBuilder.Entity<Pictures>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Location)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.HasOne(d => d.CreatedByNavigation)
                    .WithMany(p => p.Pictures)
                    .HasForeignKey(d => d.CreatedBy)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Pictures_Users");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(60)
                    .IsUnicode(false);
            });
        }
    }
}
