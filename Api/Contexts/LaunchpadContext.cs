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

        public virtual DbSet<FrameManager> FrameManagers { get; set; }
        public virtual DbSet<FramePicture> FramePictures { get; set; }
        public virtual DbSet<Frame> Frames { get; set; }
        public virtual DbSet<FrameSetting> FrameSettings { get; set; }
        public virtual DbSet<FrameUserPermission> FrameUserPermissions { get; set; }
        public virtual DbSet<FrameUser> FrameUsers { get; set; }
        public virtual DbSet<Picture> Pictures { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=localhost;Database=LaunchpadFrame;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FrameManager>(entity =>
            {
                entity.ToTable("FrameManagers");
                
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.FrameManagers)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameManagers_Users");
            });

            modelBuilder.Entity<FramePicture>(entity =>
            {
                entity.ToTable("FramePictures");
                
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

            modelBuilder.Entity<Frame>(entity =>
            {
                entity.ToTable("Frames");
                
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

            modelBuilder.Entity<FrameSetting>(entity =>
            {
                entity.ToTable("FrameSettings");
                
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(d => d.Frame)
                    .WithMany(p => p.FrameSettings)
                    .HasForeignKey(d => d.FrameId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_FrameSettings_Frames");
            });

            modelBuilder.Entity<FrameUserPermission>(entity =>
            {
                entity.ToTable("FrameUserPermissions");
                
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

            modelBuilder.Entity<FrameUser>(entity =>
            {
                entity.ToTable("FrameUsers");
                
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

            modelBuilder.Entity<Picture>(entity =>
            {
                entity.ToTable("Pictures");
                
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

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");

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
