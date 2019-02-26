using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class FrameUserPermissions
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int FrameId { get; set; }
        public bool CanAddUsers { get; set; }
        public bool CanRemoveUsers { get; set; }
        public bool IsReadOnly { get; set; }
        public bool CanApprovePictures { get; set; }
        public bool RequiresPictureApproval { get; set; }
        public bool CanRemovePictures { get; set; }

        public Frames Frame { get; set; }
        public Users User { get; set; }
    }
}
