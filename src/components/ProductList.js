import React, { Component } from 'react'
import ProductForm from './ProductForm'

export default class ProductList extends Component {
  render () {
    const {products, categories, Handlers} = this.props

    return (
      <div className='row'>
        <ProductForm product={null} categories={categories} Handlers={Handlers} />
        { products &&
          products.map(
            product => <ProductForm product={product} categories={categories}
              key={product.id} Handlers={Handlers} />
          )
        }

      </div>
    )
  }
}
