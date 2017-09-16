const
  express = require('express'),
  app = express(),
  path = require('path')

app.use(require('body-parser').json())

const
  Sequelize = require('sequelize'),
  conn = new Sequelize(
    process.env.DATABASE_URL || 'postgres://localhost/acme_react_db',
    {logging: false}
  )

const Product = conn.define('product', {
  name: {
    type: conn.Sequelize.STRING,
    unique: true
  },
  price: {
    type: conn.Sequelize.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  inStock: {
    type: conn.Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeValidate: function (product) {
      if (product.categoryId === '') {
        product.categoryId = null
      }
    }
  }
})

const Category = conn.define('category', {
  name: conn.Sequelize.STRING
})

Product.belongsTo(Category)
Category.hasMany(Product)

conn.sync({ force: true })
  .then(() => {
    return Promise.all([
      Product.create({ name: 'foo', price: 10 }),
      Product.create({ name: 'fizz', price: 20 }),
      Product.create({ name: 'bar', price: 3, inStock: false }),
      Product.create({ name: 'bazz', price: 1, inStock: false }),
      Category.create({ name: 'Gunpla Category' }),
      Category.create({ name: 'Drink Category' }),
      Category.create({ name: 'Music Category' })
    ])
    .then(([foo, fizz, bar, bazz, fooCategory, barCategory]) => {
      return Promise.all([
        fooCategory.addProducts([ foo, fizz ]),
        barCategory.addProduct(bar)
      ])
    })
  })

app.use('/dist', express.static(path.join(__dirname, 'dist')))
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')))

// app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, '/public/index.html')))

app.get('/api/products', (req, res, next) => {
  Product.findAll({
    order: ['id'],
    include: Category
  })
  .then(products => res.send(products))
  .catch(next)
})

app.get('/api/categories', (req, res, next) => {
  Category.findAll({
    order: ['id'],
    include: Product
  })
  .then(categories => res.send(categories))
  .catch(next)
})

app.put('/api/products/:id', (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (!req.body.categoryId) {
        req.body.categoryId = null
      }
      Object.assign(product, req.body)
      return product.save()
    })
    .then(result => res.send(result))
    .catch(next)
})

app.post('/api/products/', (req, res, next) => {
  Product.create(req.body)
    .then(result => res.send(result))
    .catch(next)
})

app.delete('/api/products/:id', (req, res, next) => {
  Product.destroy({ where: { id: req.params.id }})
    .then(() => res.sendStatus(204))
    .catch(next)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err)
})

app.listen(process.env.PORT || 3001)
