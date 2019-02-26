using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class FramePictures
    {
        public int Id { get; set; }
        public int PictureId { get; set; }
        public int FrameId { get; set; }
        public DateTime AddedDate { get; set; }
        public int AddedBy { get; set; }
        public DateTime? RemovedDate { get; set; }
        public int? RemovedBy { get; set; }
        public bool IsApproved { get; set; }
        public int? ApprovedBy { get; set; }

        public Users AddedByNavigation { get; set; }
        public Users ApprovedByNavigation { get; set; }
        public Frames Frame { get; set; }
        public Pictures Picture { get; set; }
        public Users RemovedByNavigation { get; set; }
    }
}
