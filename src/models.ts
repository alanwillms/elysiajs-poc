import { t } from 'elysia'

export const CreateProductDTO = t.Object({
  name: t.String(),
  price: t.Number({ minimum: 0.01 }),
  stock: t.Integer({ minimum: 0 }),
})

export const ProductDTO = t.Object({
  id: t.Integer({ minimum: 1 }),
  name: t.String(),
  price: t.Number({ minimum: 0.01 }),
  stock: t.Integer({ minimum: 0 }),
})
