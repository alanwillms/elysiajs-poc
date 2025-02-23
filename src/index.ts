import { Elysia, NotFoundError, t } from 'elysia'
import { node } from '@elysiajs/node'
import { swagger } from '@elysiajs/swagger'
import {
  CreateProductDTO,
  ProductDTO,
  ProductQueryParamDto,
  UpdateProductDTO,
} from './models'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

new Elysia({ adapter: node() })
  .use(swagger({ path: '/docs' }))
  .group('/products', (group) =>
    group
      .onError((error) => {
        if (error.code === ('P2002' as unknown)) {
          error.set.status = 422
          return { error: 'Name must be unique' }
        }
        if (error.code === ('P2025' as unknown)) {
          error.set.status = 404
          return { error: 'Product not found' }
        }
        return error
      })
      .get('/', async () => db.product.findMany(), {
        response: t.Array(ProductDTO),
      })
      .post('/', async ({ body }) => db.product.create({ data: body }), {
        body: CreateProductDTO,
        response: ProductDTO,
      })
      .get(
        '/:id',
        async ({ params }) => {
          const product = await db.product.findFirstOrThrow({
            where: { id: params.id },
          })
          if (!product) throw new NotFoundError('Product not found')
          return product
        },
        {
          params: ProductQueryParamDto,
          response: ProductDTO,
        }
      )
      .patch(
        '/:id',
        async ({ params, body }) => {
          await db.product.findFirstOrThrow({
            select: { id: true },
            where: { id: params.id },
          })
          return db.product.update({
            where: { id: params.id },
            data: body,
          })
        },
        {
          params: ProductQueryParamDto,
          body: UpdateProductDTO,
          response: ProductDTO,
        }
      )
      .delete(
        '/:id',
        async ({ params }) => {
          await db.product.findFirstOrThrow({
            select: { id: true },
            where: { id: params.id },
          })
          return db.product.delete({ where: { id: params.id } })
        },
        {
          params: ProductQueryParamDto,
          response: ProductDTO,
        }
      )
  )
  .listen(3000, ({ hostname, port }) => {
    console.log(`Server running at http://${hostname}:${port}`)
  })
