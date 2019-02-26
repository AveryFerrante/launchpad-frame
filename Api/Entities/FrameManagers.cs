using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class FrameManagers
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public Users User { get; set; }
    }
}
