using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Web;

namespace CSD4354_Countries.Models
{
    public class DbGeographyConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return objectType.IsAssignableFrom(typeof(string));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            JObject location = JObject.Load(reader);
            JToken wkt = location["Geography"]["WellKnownText"];
            JToken cid = location["Geography"]["CoordinateSystemId"];
            string wktVal = wkt.ToString();
            int cidVal = Convert.ToInt32(cid.ToString());

            DbGeography converted = DbGeography.PointFromText(wktVal, cidVal);
            return converted;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            // Base serialization is fine
            serializer.Serialize(writer, value);
        }
    }
}