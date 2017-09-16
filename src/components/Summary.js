import React, { Component } from 'react'

export default class Summary extends Component {
  render () {
    const {products, categories} = this.props
    const outOfStock = products.filter(p => !p.inStock).map(p => p.name).join(', ')
    const oosVerb = outOfStock.match(/,/) ? 'are' : 'is'
    const ME = products.length && products.reduce(function (prev, current) {
      return (prev.price > current.price) ? prev : current
    })

    return (
      <div className='panel panel-primary'>
        <div className='panel-heading'><h4>Product Summary</h4></div>
        <div className='panel-body'>
          <ul className='list-group'>
            <li className='list-group-item'>There are <strong>{products.length}</strong> products.</li>
            <li className='list-group-item'>Categories:

              <ul>
                {categories &&
                 categories.map(category =>
                   <li key={category.id}>
                     {category.name} has <strong>{
                      products.filter(p => p.categoryId == category.id).length
                     }</strong> products
                  </li>)
                }

              </ul>

            </li>
            <li className='list-group-item'>The most expensive product is <strong>{ME.name}</strong> at an insane ${ME.price}.</li>
            <li className='list-group-item'>Products not in stock {oosVerb} {outOfStock}.</li>
          </ul>
        </div>
      </div>

    )
  }
}
