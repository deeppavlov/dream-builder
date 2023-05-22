import requests

# Endpoint 1: Create dialog session
def create_dialog_session():
    url = 'http://hostname/api/dialog_sessions'
    payload = {
        'virtual_assistant_name': 'assistantName',
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    dialog_session_id = data['dialog_session_id']
    print('Dialog session ID:', dialog_session_id)

# Endpoint 2: Send a chat message
def send_chat_message(dialog_session_id, your_message, your_prompt, lm_service_id, openai_api_key):
    url = f'http://hostname/api/dialog_sessions/{dialog_session_id}/chat'
    payload = {
        'text': your_message,
        'openai_api_key': openai_api_key,
    }
    
    response = requests.post(url, json=payload)
    data = response.json()
    # Handle the response data as needed

# Endpoint 3: Get dialog session history
def get_dialog_session_history(dialog_session_id):
    url = f'http://hostname/api/dialog_sessions/{dialog_session_id}/history'
    
    response = requests.get(url)
    data = response.json()
    # Handle the response data as needed

# Usage example
dialog_session_id = 42  # Replace with the actual dialog session ID

create_dialog_session()

your_message = 'your message'
openai_api_key = 'your-api-key'

send_chat_message(dialog_session_id, your_message, openai_api_key)
get_dialog_session_history(dialog_session_id)
