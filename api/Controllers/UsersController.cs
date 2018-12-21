using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Repositories.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUsersRepository _userRepo;

        public UsersController(IUsersRepository repo)
        {
            _userRepo = repo;
        }

        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost("validate")]
        public ActionResult<User> ValidateUser([FromBody] UserCredentials credentials)
        {
            try
            {
                int? userId = _userRepo.ValidateUser(credentials);
                if(userId.HasValue)
                {
                    return Ok(_userRepo.GetUserById(userId.Value));
                }
                else
                {
                    return NotFound();
                }
            }
            catch(FormatException) // Password was incorrect
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public ActionResult<User> CreateUser([FromBody] CreateUser user)
        {
            try
            {
                return Ok(_userRepo.CreateUser(user));
            }
            catch(FormatException)
            {
                return NotFound(); //TODO: Better return type for this. Email already taken.
            }
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
