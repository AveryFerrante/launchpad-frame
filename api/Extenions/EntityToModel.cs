using api.Models;
using api.Entities;

namespace api.Extentions
{
    public static class EntityToModel
    {
        public static Models.User ToModel(this Entities.User user)
        {
            Models.User returnValue = null;
            if(user != null)
            {
                returnValue = new Models.User()
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Verified = user.Verified
                };
            }
            return returnValue;
        }
    }
}