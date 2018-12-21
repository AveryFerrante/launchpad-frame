using api.Contexts;
using api.Models;
using api.Repositories.Interfaces;
using System.Linq;
using api.Extentions;
using BCrypt.Net;
using System;

namespace api.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private LaunchpadFrameContext _context;

        public UsersRepository(LaunchpadFrameContext context)
        {
            _context = context;
        }
        public User GetUserById(int id)
        {
            return _context.Users.Where(u => u.Id == id && u.EndDate == null).SingleOrDefault().ToModel();
        }

        public int? ValidateUser(UserCredentials credentials)
        {
            var user = _context.Users.Where(u => u.Email.ToLower() == credentials.Email.ToLower() && u.EndDate == null).SingleOrDefault();
            if (user != null)
            {
                if (BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password))
                {
                    return user.Id;
                }
                else
                {
                    throw new FormatException("Invalid Password"); //TODO: How to handle this situation better?
                }
            }
            else
            {
                return null;
            }
        }

        public User CreateUser(CreateUser user)
        {
            if(!CheckIfEmailExists(user.Email))
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);
                var newUser = new Entities.User()
                {
                    CreatedDate = DateTime.Now,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Password = hashedPassword
                };
                _context.Users.Add(newUser);
                _context.SaveChanges();
                return(newUser.ToModel());
            }
            else
            {
                throw new FormatException("Email Already In Use"); //TODO: How to handle this situation better?
            }
        }

        public bool CheckIfEmailExists(string email)
        {
            var existingEmail = _context.Users.Where(u => u.Email.ToLower() == email.ToLower()).Select(u => u.Email).SingleOrDefault();
            if(existingEmail != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}