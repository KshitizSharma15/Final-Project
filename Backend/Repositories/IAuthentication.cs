namespace CogniProject.Repositories
{
    public interface IAuthentication
    {
        string AuthenticationUser(string Email, string password);
    }
}
