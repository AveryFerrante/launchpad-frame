using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class FrameManager
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public User User { get; set; }
    }
}
