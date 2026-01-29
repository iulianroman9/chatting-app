import websockets
import asyncio

connected_clients = set()

async def websocket_handler(websocket):
    connected_clients.add(websocket)
    print('client connected')

    try:
        async for message in websocket:
            print(f"received message: {message}")
            
            for client in connected_clients:
                await client.send(message)

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