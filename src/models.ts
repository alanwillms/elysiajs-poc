import { t } from 'elysia'

export const ProductQueryParamDto = t.Object({
  id: t.Integer(),
})

export const CreateProductDTO = t.Object({
  name: t.String(),
  price: t.Number({ minimum: 0.01 }),
  stock: t.Integer({ minimum: 0 }),
})

export const UpdateProductDTO = t.Object({
  name: t.Optional(t.String()),
  price: t.Optional(t.Number({ minimum: 0.01 })),
  stock: t.Optional(t.Integer({ minimum: 0 })),
})

export const ProductDTO = t.Object({
  id: t.Integer({ minimum: 1 }),
  name: t.String(),
  price: t.Number({ minimum: 0.01 }),
  stock: t.Integer({ minimum: 0 }),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})
