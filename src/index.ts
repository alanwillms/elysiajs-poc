import { Elysia, Static } from 'elysia'
import { node } from '@elysiajs/node'
import { CreateProductDTO, ProductDTO } from './models'

const store = new Elysia().state({
  products: [] as Static<typeof ProductDTO>[],
})

new Elysia({ adapter: node() })
  .use(store)
  .group('/products', (group) =>
    group
      .get('/', ({ store }) => store.products)
      .post(
        '/',
        ({ store, body }) => {
          const maxId = store.products.reduce(
            (max, { id }) => (id > max ? id : max),
            0
          )
          const newProduct = {
            ...body,
            id: maxId + 1,
          }
          store.products.push(newProduct)
          return newProduct
        },
        { body: CreateProductDTO, response: ProductDTO }
      )
  )
  .listen(3000, ({ hostname, port }) => {
    console.log(`Server running at http://${hostname}:${port}`)
  })
