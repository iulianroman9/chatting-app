import websockets
import asyncio
import json
import os

connected_clients = set()
USERS_FILE = 'users.json'

def ensure_user_exists(username):
    users = []
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                users = json.load(f)
        except json.JSONDecodeError:
            users = []
    
    if username not in users:
        users.append(username)
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f)
        print(f"new user registered: {username}")
    else:
        print(f"user logged in: {username}")

async def websocket_handler(websocket):
    connected_clients.add(websocket)
    print("client connected")

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                if isinstance(data, dict) and data.get('type') == 'login':
                    username = data.get('username')
                    if username:
                        ensure_user_exists(username)
                    continue 
            except json.JSONDecodeError:
                pass

            print(f"received message: {message}")
            for client in connected_clients:
                await client.send(message)

            try:
                data = json.loads(message)
                if 'sender' in data and 'target' in data:
                    original_sender = data['sender']
                    original_target = data['target']
                    
                    data['sender'] = original_target
                    data['target'] = original_sender
                    
                    swapped_message = json.dumps(data)
                    print(f"sending swapped: {swapped_message}")

                    for client in connected_clients:
                        await client.send(swapped_message)
            except Exception as e:
                pass

    except websockets.exceptions.ConnectionClosed:
        pass

    finally:
        connected_clients.remove(websocket)
        print('client disconnected')

async def main():
    async with websockets.serve(websocket_handler, 'localhost', 8080):
        print('running websocket server on localhost:8080')
        await asyncio.Future()

if __name__ == '__main__':
    asyncio.run(main())