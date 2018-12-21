using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class User
    {
        public User()
        {
            FrameManagers = new HashSet<FrameManager>();
            FramePicturesAddedByNavigation = new HashSet<FramePicture>();
            FramePicturesApprovedByNavigation = new HashSet<FramePicture>();
            FramePicturesRemovedByNavigation = new HashSet<FramePicture>();
            FrameUserPermissions = new HashSet<FrameUserPermissions>();
            FrameUsersAddedByNavigation = new HashSet<FrameUsers>();
            FrameUsersRemovedByNavigation = new HashSet<FrameUsers>();
            FrameUsersUser = new HashSet<FrameUsers>();
            Frames = new HashSet<Frame>();
            Pictures = new HashSet<Picture>();
        }

        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Verified { get; set; }
        public DateTime? EndDate { get; set; }

        public ICollection<FrameManager> FrameManagers { get; set; }
        public ICollection<FramePicture> FramePicturesAddedByNavigation { get; set; }
        public ICollection<FramePicture> FramePicturesApprovedByNavigation { get; set; }
        public ICollection<FramePicture> FramePicturesRemovedByNavigation { get; set; }
        public ICollection<FrameUserPermissions> FrameUserPermissions { get; set; }
        public ICollection<FrameUsers> FrameUsersAddedByNavigation { get; set; }
        public ICollection<FrameUsers> FrameUsersRemovedByNavigation { get; set; }
        public ICollection<FrameUsers> FrameUsersUser { get; set; }
        public ICollection<Frame> Frames { get; set; }
        public ICollection<Picture> Pictures { get; set; }
    }
}
