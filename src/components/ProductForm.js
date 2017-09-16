import React, { Component } from 'react'

export default class ProductForm extends Component {
  constructor () {
    super()
    this.state = {
      id: null,
      name: '',
      price: 0,
      inStock: false,
      categoryId: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.HandleClick = this.HandleClick.bind(this)
  }

  componentDidMount () {
    if (!this.props.product) return
    const product = this.props.product

    this.setState({
      id: product.id,
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      categoryId: product.categoryId
    })
  }

  HandleClick (event) {
    const h = this.props.Handlers
    switch (event.target.name) {
      case 'add':
        h.AddProduct(this.state)
        break
      case 'update':
        h.UpdateProduct(this.state)
        break
      case 'delete':
        h.DeleteProduct(this.state)
        break
    }
  }

  handleInputChange (event) {
    const
      target = event.target,
      value = target.type === 'checkbox' ? target.checked : target.value,
      name = target.name

    this.setState({[name]: value})
  }

  render () {
    const {product, categories} = this.props
    const panelCls = 'panel panel-' + (product ? 'default' : 'success')

    return (
      <div className='col-xs-4'>
        <div className={panelCls}>

          <div className='panel-heading'>
            <h4>{product ? 'Product Detail' : 'Add a Product'} </h4>
          </div>

          <div className='panel-body'>
            <form noValidate>
              <fieldset>

                <div className='form-group col-xs-12'>
                  <label>Name</label>
                  <input className='form-control'
                    value={this.state.name}
                    name='name'
                    onChange={this.handleInputChange} />
                </div>

                <div className='form-group col-xs-12'>
                  <label>Category</label>
                  <select value={this.state.categoryId}
                    className='form-control'
                    name='categoryId'
                    onChange={this.handleInputChange}>
                    <option value={undefined}>-- None --</option>
                    {categories.map(category => {
                      return (
                        <option value={category.id} key={category.id}>{category.name}</option>
                      )
                    })
                  }
                  </select>
                </div>

                <div className='form-group col-xs-7'>
                  <label>Price</label>
                  <input className='form-control'
                    value={this.state.price}
                    name='price'
                    onChange={this.handleInputChange} />
                </div>
                <div className='form-group col-xs-5'>
                  <label>In Stock</label>
                  <input className='form-control'
                    type='checkbox'
                    checked={this.state.inStock}
                    name='inStock'
                    onChange={this.handleInputChange} />
                </div>

                <Submit product={product} HandleClick={this.HandleClick} />

              </fieldset>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function Submit (props) {
  const {product, HandleClick} = props
  return (
    <div className='form-group'>
      <div className='col-xs-6'>
        {product ? <button type='button' name='update' onClick={HandleClick} className='btn btn-primary'>Update</button>
        : <button type='button' name='add' onClick={HandleClick} className='btn btn-success'>Save</button>
      }
      </div>
      <div className='col-xs-6'>
        {product && <button type='button' name='delete' onClick={HandleClick} className='btn btn-danger'>Delete</button>}
      </div>
    </div>
  )
}
