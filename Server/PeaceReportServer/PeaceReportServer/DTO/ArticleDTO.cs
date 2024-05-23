using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace PeaceReportServer.DTOs
{
    public class ArticleDTO
    {
        public string Title { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<string> Texts { get; set; }
        public List<int> ContentOrder { get; set; }
        public string JwtToken { get; set; }
    }
}
