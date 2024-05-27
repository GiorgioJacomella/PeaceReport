namespace PeaceReportServer.DTOs
{
    public class UpdateArticleDTO
    {
        public string Title { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string> Texts { get; set; } = new List<string>();
        public List<int> ContentOrder { get; set; } = new List<int>();
    }
}
