using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class FramePicture
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

        public User AddedByNavigation { get; set; }
        public User ApprovedByNavigation { get; set; }
        public Frame Frame { get; set; }
        public Picture Picture { get; set; }
        public User RemovedByNavigation { get; set; }
    }
}
