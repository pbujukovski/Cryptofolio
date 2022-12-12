namespace Cryptofolio.Services
{
    public interface IUserAuthService
    {

        //Check is current user authorized for provided building
        public string getCurrentUserId();
        public string getCurrentUserName();

    }
}
