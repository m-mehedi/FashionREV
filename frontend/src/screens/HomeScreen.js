import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
// import products from '../products'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
// import axios from 'axios'
import { listProducts } from '../actions/productActions'

function HomeScreen({ history }) {
    const dispatch = useDispatch()
    const productList = useSelector(state => state.productList)
    const {error, loading, products, page, pages} = productList
    
    let keyword = history.location.search

    useEffect(()=>{
        dispatch(listProducts(keyword))

    }, [dispatch, keyword])

    
    return (
        <div>
            {!keyword && <ProductCarousel/>}
            
            <h1>Latest products</h1>
            {loading ? <Loader />
                : error  ?  <p className='alert alert-danger'>{error}</p>
                    : (
                    <div>
                    <Row>
                        {products.map(product=>(
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate page={page} pages={pages} keyword={keyword} />
                    </div>)
        }
        </div>
    )
}

export default HomeScreen
