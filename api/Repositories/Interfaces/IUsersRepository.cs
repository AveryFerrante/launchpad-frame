using api.Models;

namespace api.Repositories.Interfaces 
{
    public interface IUsersRepository
    {
        User GetUserById(int id);
        int? ValidateUser(UserCredentials credentials);
        User CreateUser(CreateUser user);

        bool CheckIfEmailExists(string email);
    }
}