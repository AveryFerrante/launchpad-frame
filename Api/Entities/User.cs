using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class User
    {
        public User()
        {
            FrameManagers = new HashSet<FrameManager>();
            FramePicturesAddedByNavigation = new HashSet<FramePicture>();
            FramePicturesApprovedByNavigation = new HashSet<FramePicture>();
            FramePicturesRemovedByNavigation = new HashSet<FramePicture>();
            FrameUserPermissions = new HashSet<FrameUserPermission>();
            FrameUsersAddedByNavigation = new HashSet<FrameUser>();
            FrameUsersRemovedByNavigation = new HashSet<FrameUser>();
            FrameUsersUser = new HashSet<FrameUser>();
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
        public ICollection<FrameUserPermission> FrameUserPermissions { get; set; }
        public ICollection<FrameUser> FrameUsersAddedByNavigation { get; set; }
        public ICollection<FrameUser> FrameUsersRemovedByNavigation { get; set; }
        public ICollection<FrameUser> FrameUsersUser { get; set; }
        public ICollection<Frame> Frames { get; set; }
        public ICollection<Picture> Pictures { get; set; }
    }
}
