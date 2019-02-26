using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class Frames
    {
        public Frames()
        {
            FramePictures = new HashSet<FramePictures>();
            FrameSettings = new HashSet<FrameSettings>();
            FrameUserPermissions = new HashSet<FrameUserPermissions>();
            FrameUsers = new HashSet<FrameUsers>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? EndDate { get; set; }

        public Users CreatedByNavigation { get; set; }
        public ICollection<FramePictures> FramePictures { get; set; }
        public ICollection<FrameSettings> FrameSettings { get; set; }
        public ICollection<FrameUserPermissions> FrameUserPermissions { get; set; }
        public ICollection<FrameUsers> FrameUsers { get; set; }
    }
}
