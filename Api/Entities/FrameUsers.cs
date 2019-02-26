using System;
using System.Collections.Generic;

namespace Api.Entities
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

        public Users AddedByNavigation { get; set; }
        public Frames Frame { get; set; }
        public Users RemovedByNavigation { get; set; }
        public Users User { get; set; }
    }
}
