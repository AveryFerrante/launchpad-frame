using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class Picture
    {
        public Picture()
        {
            FramePictures = new HashSet<FramePicture>();
        }

        public int Id { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Location { get; set; }
        public DateTime? EndDate { get; set; }

        public User CreatedByNavigation { get; set; }
        public ICollection<FramePicture> FramePictures { get; set; }
    }
}
