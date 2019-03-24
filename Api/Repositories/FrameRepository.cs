using Api.Repositories.Interfaces;
using System.Threading.Tasks;
using Api.Entities;
using Microsoft.EntityFrameworkCore;
using Api.Contexts;
using System.Linq;
using System.Collections.Generic;

namespace Api.Repositories
{
    public class FrameRepository : IFrameRepository
    {
        private LaunchpadContext _context;
        public FrameRepository(LaunchpadContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Frame>> GetFramesByUserIdAsync(int userId)
        {
            return await _context.Frames.Include(f => f.FrameSettings)
                                        .Where(f => f.CreatedBy == userId).ToListAsync();
        }
    }
}