import websockets
import asyncio
import json

connected_clients = set()

async def websocket_handler(websocket):
    connected_clients.add(websocket)
    print("client connected")

    try:
        async for message in websocket:
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
            
            except json.JSONDecodeError:
                print("message wasn't valid json")
            except Exception as e:
                print(f"error sending auto reply: {e}")

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