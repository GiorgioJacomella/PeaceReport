using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace PeaceReportServer.Models
{
    public class Article
    {
        [BsonId]
        public ObjectId Id { get; set; }
        public string Title { get; set; }
        public string AuthorId { get; set; }
        public List<ContentItem> Content { get; set; }
    }

    public class ContentItem
    {
        public string Type { get; set; }
        public string Value { get; set; } 
    }
}
