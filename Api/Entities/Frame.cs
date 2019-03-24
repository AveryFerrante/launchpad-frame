using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class Frame
    {
        public Frame()
        {
            FramePictures = new HashSet<FramePicture>();
            FrameSettings = new HashSet<FrameSetting>();
            FrameUserPermissions = new HashSet<FrameUserPermission>();
            FrameUsers = new HashSet<FrameUser>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? EndDate { get; set; }

        public User CreatedByNavigation { get; set; }
        public ICollection<FramePicture> FramePictures { get; set; }
        public ICollection<FrameSetting> FrameSettings { get; set; }
        public ICollection<FrameUserPermission> FrameUserPermissions { get; set; }
        public ICollection<FrameUser> FrameUsers { get; set; }
    }
}
