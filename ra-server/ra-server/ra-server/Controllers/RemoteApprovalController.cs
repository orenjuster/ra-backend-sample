using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ra_server.Models;
using RabbitMQ.Client;

namespace ra_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RemoteApprovalController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // POST: api/Todo
        [HttpPost]
        public ActionResult<IEnumerable<string>> PostRemoteApprovalEvent(RemoteApprovalEvent approval)
        {
            PublishEvent(approval);
           
            return new string[] { "value1", "value2" };
        }

        private void PublishEvent(RemoteApprovalEvent approval)
        {
            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "RaEvents", durable: false, exclusive: false, autoDelete: false, arguments: null);

                string message = JsonConvert.SerializeObject(approval);
                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(exchange: "", routingKey: "RaEvents", basicProperties: null, body: body);
                Console.WriteLine(" [x] Sent {0}", message);
            }
        }
    }
}
