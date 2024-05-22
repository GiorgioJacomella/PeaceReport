using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PeaceReportServer.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("Email")]
        public string Email { get; set; }

        [BsonElement("Name")]
        public string Name { get; set; }

        [BsonElement("Username")]
        public string Username { get; set; }

        [BsonElement("Password")]
        public string Password { get; set; }

        [BsonElement("Journalist")]
        public bool Journalist { get; set; }

        [BsonElement("RecieveNewsletter")]
        public bool RecieveNewsletter { get; set; }

        [BsonElement("AgreeWithTermsConditions")]
        public bool AgreeWithTermsConditions { get; set; }

        [BsonElement("Token")]
        public string Token { get; set; }
    }
}
