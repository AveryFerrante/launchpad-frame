using System;
using System.Collections.Generic;

namespace api.Entities
{
    public partial class FrameSettings
    {
        public int Id { get; set; }
        public int FrameId { get; set; }
        public bool IsPublic { get; set; }
        public bool IsReadOnly { get; set; }

        public Frame Frame { get; set; }
    }
}
