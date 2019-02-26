using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class Pictures
    {
        public Pictures()
        {
            FramePictures = new HashSet<FramePictures>();
        }

        public int Id { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Location { get; set; }
        public DateTime? EndDate { get; set; }

        public Users CreatedByNavigation { get; set; }
        public ICollection<FramePictures> FramePictures { get; set; }
    }
}
