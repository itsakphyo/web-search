from google import genai
from dotenv import load_dotenv
import requests
import os
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
jina_api_key = os.getenv("JINA_API_KEY")

client = genai.Client(api_key=GOOGLE_API_KEY)
model_id = "gemini-2.0-flash"

GEMINI_PROMPT_TEMPLATE = """ You are an AI assistant that prepares a list of JSON and returns it. First of all, you need to extract should-have keys based on user queries. For example, if you ask, "Who are the best-rated dishwasher repair technicians in San Francisco, CA, USA, including their ratings, charges, and booking information?", the keys for JSON will be technician, rating, charge, and booking information. The example format for one JSON will be like
{{
  "name": "Triton Appliance Repair",
  "rating": 5.5,
  "price": "$70 - $179",
  "booking information": "https://yelp.com/search?find_desc=Appliance+Repair or phone number",
}}
So , in here you might think, where will you get data? You can get data from the provided additional information. This provided additional information mostly contained one or more data. Addiaional information is websearh result with jina and it do deepsearch for about top 5 results for user input. That is why I said you need to return a list of JSON. So can you do this for me?
Here is the user input query: 
{user_input}

And here is additional information: 
{additional_information}"""



def ask_deep_search(query):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {jina_api_key}'
    }
    data = {
        "model": "jina-deepsearch-v1",
        "messages": [
            {
            "role": "user",
            "content": "Hello can you be my search engine for me, Do deep search for about top 5 items for my next prompt!"
            },
            {
            "role": "assistant",
            "content": "Yes, how can I help you?"
            },
            {"role": "user", "content": query}
        ],
        "reasoning_effort": "low",
        "no_direct_answer": True
    }
    response = requests.post('https://deepsearch.jina.ai/v1/chat/completions', headers=headers, json=data)
    if response.status_code == 200:
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', '')
    else:
        raise Exception(f"Error: {response.status_code} - {response.text}")



def ask_gemini(query, additional_information):
    response = client.models.generate_content(
        model=model_id,
        contents=GEMINI_PROMPT_TEMPLATE.format(
            user_input=query,
            additional_information=additional_information
        ),
    )
    return response.text
