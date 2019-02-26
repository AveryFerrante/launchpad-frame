using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class Users
    {
        public Users()
        {
            FrameManagers = new HashSet<FrameManagers>();
            FramePicturesAddedByNavigation = new HashSet<FramePictures>();
            FramePicturesApprovedByNavigation = new HashSet<FramePictures>();
            FramePicturesRemovedByNavigation = new HashSet<FramePictures>();
            FrameUserPermissions = new HashSet<FrameUserPermissions>();
            FrameUsersAddedByNavigation = new HashSet<FrameUsers>();
            FrameUsersRemovedByNavigation = new HashSet<FrameUsers>();
            FrameUsersUser = new HashSet<FrameUsers>();
            Frames = new HashSet<Frames>();
            Pictures = new HashSet<Pictures>();
        }

        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Verified { get; set; }
        public DateTime? EndDate { get; set; }

        public ICollection<FrameManagers> FrameManagers { get; set; }
        public ICollection<FramePictures> FramePicturesAddedByNavigation { get; set; }
        public ICollection<FramePictures> FramePicturesApprovedByNavigation { get; set; }
        public ICollection<FramePictures> FramePicturesRemovedByNavigation { get; set; }
        public ICollection<FrameUserPermissions> FrameUserPermissions { get; set; }
        public ICollection<FrameUsers> FrameUsersAddedByNavigation { get; set; }
        public ICollection<FrameUsers> FrameUsersRemovedByNavigation { get; set; }
        public ICollection<FrameUsers> FrameUsersUser { get; set; }
        public ICollection<Frames> Frames { get; set; }
        public ICollection<Pictures> Pictures { get; set; }
    }
}
