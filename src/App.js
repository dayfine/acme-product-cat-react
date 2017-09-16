import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import ProductList from './components/ProductList'
import Summary from './components/Summary'
import axios from 'axios'

export default class App extends Component {
  constructor () {
    super()
    this.state = {
      products: [],
      categories: []
    }
    this.AddProduct = this.AddProduct.bind(this)
    this.UpdateProduct = this.UpdateProduct.bind(this)
    this.DeleteProduct = this.DeleteProduct.bind(this)
  }

  componentDidMount () {
    Promise.all([
      axios.get(`/api/products/`),
      axios.get(`/api/categories/`)
    ])
    .then(responses => responses.map(r => r.data))
    .then(([products, categories]) => this.setState({
      products, categories
    }))
  }

  DeleteProduct (state) {
    const id = state.id
    axios.delete(`/api/products/${id}`)
      .then(res => res.data)
      .then(() => {
        this.setState(prevState => ({
          products: prevState.products.filter(p => p.id !== id)
        }))
      })
  }

  UpdateProduct (state) {
    console.log(state)
    const id = state.id
    delete state.id
    axios.put(`/api/products/${id}`, state)
      .then(res => res.data)
      .then(product => {
        this.setState(function (prevState) {
          console.log(product)
          const updatedProds = [...prevState.products]
          const idx = updatedProds.findIndex(p => p.id === id)
          updatedProds[idx] = product
          return { products: [...updatedProds] }
        })
      })
  }

  AddProduct (state) {
    delete state.id
    console.log(state)
    axios.post(`/api/products/`, state)
      .then(res => res.data)
      .then(product => {
        this.setState(prevState => ({
          products: [...prevState.products, product]
        }))
      })
  }

  render () {
    const Handlers = {
      DeleteProduct: this.DeleteProduct,
      AddProduct: this.AddProduct,
      UpdateProduct: this.UpdateProduct
    }

    return (

      <div id='main' className='container'>
        <div className='App-header'>
          <div className='col-xs-3'>
            <img src={logo} className='App-logo' alt='logo' />
          </div>
          <div className='col-xs-9'>
            <h2>Acme Product Category</h2>
          </div>
        </div>

        <div className='row'>
          <div className='col-xs-3'>
            <Summary {...this.state} />
          </div>
          <div className='col-xs-9'>
            <ProductList {...this.state} Handlers={Handlers} />
          </div>
        </div>
      </div>
    )
  }
}
