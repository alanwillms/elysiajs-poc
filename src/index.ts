import { Elysia } from 'elysia';
import { node } from '@elysiajs/node';

const app = new Elysia({ adapter: node() })
    .get('/products', () => 'Hello World')
    .listen(3000, ({ hostname, port }) => {
        console.log(`Server running at http://${hostname}:${port}`);
    });