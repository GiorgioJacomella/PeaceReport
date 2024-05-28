using System.ComponentModel.DataAnnotations;

public class UserUpdateDto
{
    [EmailAddress(ErrorMessage = "Invalid Email Address")]
    public string Email { get; set; }
    public string Name { get; set; }
    public string Username { get; set; }
    public bool Journalist { get; set; }
    public bool RecieveNewsletter { get; set; }
    public bool AgreeWithTermsConditions { get; set; }
}