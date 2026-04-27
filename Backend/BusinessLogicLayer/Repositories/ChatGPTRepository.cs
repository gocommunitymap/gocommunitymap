using BusinessLogicLayer.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace BusinessLogicLayer.Repositories
{
    public class ChatGPTRepository : IChatGPTRepository
    {
        private readonly HttpClient _httpClient;
        private const string OpenAiEndpoint = "https://api.openai.com/v1/chat/completions";
        private readonly string _apiKey;

        public ChatGPTRepository(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClient = httpClientFactory.CreateClient();
            _apiKey = configuration["OpenAI:ApiKey"]; // Get API key from appsettings.json
        }

        public async Task<string> GetChatResponseAsync(string prompt)
        {
            var requestBody = new
            {
                model = "gpt-4", // You can use "gpt-3.5-turbo" if gpt-4 is unavailable
                messages = new[]
                {
                    new { role = "system", content = "You are a helpful assistant." },
                    new { role = "user", content = prompt }
                },
                max_tokens = 1000,
                temperature = 0.7
            };

            var requestContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync(OpenAiEndpoint, requestContent);

            if (!response.IsSuccessStatusCode)
            {
                var errorResponse = await response.Content.ReadAsStringAsync();
                throw new Exception($"OpenAI API error: {errorResponse}");
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var responseJson = JsonSerializer.Deserialize<JsonElement>(responseContent);
            return responseJson.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
        }
    }
}
