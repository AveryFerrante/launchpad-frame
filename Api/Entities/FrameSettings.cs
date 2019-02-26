using System;
using System.Collections.Generic;

namespace Api.Entities
{
    public partial class FrameSettings
    {
        public int Id { get; set; }
        public int FrameId { get; set; }
        public bool IsPublic { get; set; }
        public bool IsReadOnly { get; set; }

        public Frames Frame { get; set; }
    }
}
