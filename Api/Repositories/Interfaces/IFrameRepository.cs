using System.Threading.Tasks;
using Api.Entities;
using System.Collections.Generic;

namespace Api.Repositories.Interfaces
{
    public interface IFrameRepository
    {
        Task<IEnumerable<Frame>> GetFramesByUserIdAsync(int userId);
    }
}
