using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class FrameUsers
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FrameId { get; set; }
        public DateTime AddedDate { get; set; }
        public int AddedBy { get; set; }
        public DateTime? RemovedDate { get; set; }
        public int? RemovedBy { get; set; }
        public bool HasAccepted { get; set; }
        public DateTime? AcceptedDate { get; set; }

        public User AddedByNavigation { get; set; }
        public Frame Frame { get; set; }
        public User RemovedByNavigation { get; set; }
        public User User { get; set; }
    }
}
