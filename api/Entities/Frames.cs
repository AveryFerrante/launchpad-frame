using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class Frame
    {
        public Frame()
        {
            FramePictures = new HashSet<FramePicture>();
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

        public User CreatedByNavigation { get; set; }
        public ICollection<FramePicture> FramePictures { get; set; }
        public ICollection<FrameSettings> FrameSettings { get; set; }
        public ICollection<FrameUserPermissions> FrameUserPermissions { get; set; }
        public ICollection<FrameUsers> FrameUsers { get; set; }
    }
}
