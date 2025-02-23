import { Elysia, NotFoundError, Static, t } from 'elysia'
import { node } from '@elysiajs/node'
import { CreateProductDTO, ProductDTO, UpdateProductDTO } from './models'
import { findMaxId } from './helpers'

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
        ({ store, body }) =>
          store.products[
            store.products.push({
              ...body,
              id: findMaxId(store.products) + 1,
            }) - 1
          ],
        { body: CreateProductDTO, response: ProductDTO }
      )
      .patch(
        '/:id',
        ({ store, params, body }) => {
          const product = store.products.find(
            (product) => product.id === Number(params.id)
          )
          if (!product) throw new NotFoundError('Product not found')
          return Object.assign(product, body)
        },
        {
          params: t.Object({ id: t.Integer() }),
          body: UpdateProductDTO,
          response: ProductDTO,
        }
      )
  )
  .listen(3000, ({ hostname, port }) => {
    console.log(`Server running at http://${hostname}:${port}`)
  })
