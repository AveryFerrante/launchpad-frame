using System.Threading.Tasks;
using Api.Entities;

namespace Api.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<Users> Validate();
    }
}