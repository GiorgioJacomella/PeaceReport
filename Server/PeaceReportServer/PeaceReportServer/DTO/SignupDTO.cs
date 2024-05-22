﻿using System.ComponentModel.DataAnnotations;

namespace PeaceReportServer.DTOs
{
    public class SignupRequestDto
    {
        public string Id { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string Password { get; set; }

        public bool Journalist { get; set; }
        public bool RecieveNewsletter { get; set; }

        [Required(ErrorMessage = "You must agree with terms and conditions")]
        public bool AgreeWithTermsConditions { get; set; }
    }

    public class SignupResponseDto
    {
        public string Status { get; set; }
        public string Message { get; set; }
    }
}
