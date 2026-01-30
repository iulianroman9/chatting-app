import json
import os
from flask import Flask, send_from_directory
from flask_sock import Sock

app = Flask(__name__)
sock = Sock(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, '../frontend')
USERS_FILE = os.path.join(BASE_DIR, 'users.json')
MESSAGES_FILE = os.path.join(BASE_DIR, 'messages.json')

connected_clients = {}

def get_conversation_key(user1, user2):
    return "-".join(sorted([user1, user2]))

def load_json(filepath, default):
    """load a json file or return an object you want as default (empty dict)"""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return default
    return default

def save_json(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=4)

def save_message(sender, target, message_data):
    """save messages between users in 'user1-user2' (sorted) keys"""
    messages = load_json(MESSAGES_FILE, {})
    key = get_conversation_key(sender, target)
    
    if key not in messages:
        messages[key] = []
    
    messages[key].append(message_data)
    save_json(MESSAGES_FILE, messages)

def get_history(user1, user2):
    messages = load_json(MESSAGES_FILE, {})
    key = get_conversation_key(user1, user2)
    return messages.get(key, [])

def ensure_user_exists(username):
    users = load_json(USERS_FILE, [])
    if username not in users:
        users.append(username)
        save_json(USERS_FILE, users)
        return True
    return False

@app.route('/')
def index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """needed to return css/js files"""
    return send_from_directory(FRONTEND_DIR, path)

@sock.route('/ws')
def websocket_chat(ws):
    """handler for the websocket connection"""
    current_user = None
    
    try:
        while True:
            data = ws.receive()
            if not data:
                break
            
            message = json.loads(data)
            msg_type = message.get('type')

            if msg_type == 'login':
                username = message.get('username')
                current_user = username
                connected_clients[username] = ws
                
                ensure_user_exists(username)
                print(f"User connected: {username}")
                
                user_list = load_json(USERS_FILE, [])
                broadcast_msg = json.dumps({'type': 'user-list', 'users': user_list})
                
                for client in connected_clients.values():
                    try:
                        client.send(broadcast_msg)
                    except:
                        pass

            elif 'text' in message and 'target' in message:
                target = message['target']
                sender = message.get('sender', current_user)
                
                save_message(sender, target, message)
                
                if target in connected_clients:
                    try:
                        connected_clients[target].send(json.dumps(message))
                    except:
                        del connected_clients[target]

                if sender in connected_clients:
                    connected_clients[sender].send(json.dumps(message))

            elif msg_type == 'fetch-history':
                target = message.get('target')
                if current_user and target:
                    history = get_history(current_user, target)
                    response = {
                        'type': 'history-data',
                        'target': target,
                        'messages': history
                    }
                    ws.send(json.dumps(response))

    except Exception as e:
        print(f"Connection error: {e}")
    
    finally:
        if current_user and current_user in connected_clients:
            del connected_clients[current_user]
            print(f"User disconnected: {current_user}")

if __name__ == '__main__':
    app.run(port=5000, debug=True)