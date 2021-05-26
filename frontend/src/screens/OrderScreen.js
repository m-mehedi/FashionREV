import React, { useState, useEffect } from 'react'
import { Button, Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PayPalButton } from 'react-paypal-button-v2'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

function OrderScreen({ match, history }) {
    const orderId = match.params.id
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay,  success:successPay } = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading: loadingDeliver,  success:successDeliver } = orderDeliver    

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
    }
    //Aes7R5ttRjUGtK6CWwJe8y5s0laTcDd-53ZptsPwGNa7E5NsR1NSnv6vO3SlyRMZUQEe2BPScMQNP7wI

    const addPayPalScript = () => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=Aes7R5ttRjUGtK6CWwJe8y5s0laTcDd-53ZptsPwGNa7E5NsR1NSnv6vO3SlyRMZUQEe2BPScMQNP7wI'
        script.async = true

        script.onload = () =>{
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }

    useEffect(()=> {

        if(!userInfo){
            history.push('/login')
        }

        if(!order || successPay || order._id !== Number(orderId) || successDeliver  ){        
            dispatch({type: ORDER_PAY_RESET})        
            dispatch({type: ORDER_DELIVER_RESET})

            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            }else{
                setSdkReady(true)
            }
        }
    }, [ dispatch, order, orderId, successPay, successDeliver])


    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }
    
    return loading ? (
        <Loader/>
    ) : error ? (
        <p className='alert alert-danger'>{error}</p>
    ) : (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p><strong>Shipping: </strong>
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                            {'    '}
                            {order.shippingAddress.postalCode},
                            {'    '}
                            {order.shippingAddress.country}
                            </p>

                            
                            {order.isDelivered ? (
                                <p className='alert alert-success'>Delivered on {order.deliveredAt}</p>
                            ) : (
                                <p className='alert alert-warning'>Not Delivered</p>
                            )}
                        </ListGroup.Item>

                        
                        <ListGroup.Item>
                            <h2>Payment Method</h2>

                            <p><strong>Method: </strong>
                            {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <p className='alert alert-success'>Paid on {order.paidAt}</p>
                            ) : (
                                <p className='alert alert-warning'>Not paid</p>
                            )}
                        </ListGroup.Item>


                        
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order.orderItems.length === 0 ? <p className='alert alert-danger'>Your order is empty</p>
                            : (
                                <ListGroup variant='flush'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>

                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>

                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                    </ListGroup>
                </Col>
            

            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Order Summery</h2>
                        </ListGroup.Item>
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Item:</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>                        
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Shipping:</Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                        </ListGroup.Item>                        
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax:</Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>                        
                        
                        <ListGroup.Item>
                            <Row>
                                <Col>Total:</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            {error && <p className='alert alert-danger'>{error}</p>}
                        </ListGroup.Item>


                    </ListGroup>


                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader />}

                            {!sdkReady ? (
                                <Loader />
                            ) : (
                                <PayPalButton 
                                amount={order.totalPrice} 
                                onSuccess={successPaymentHandler}/>
                            )}
                        </ListGroup.Item>
                    )}
                    {loadingDeliver && <Loader />}

                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button
                            type='button'
                            className='btn btn-block'
                            onClick={deliverHandler}
                            >
                                Mark as Delivered
                            </Button>
                        </ListGroup.Item>
                    )}
                    
                </Card>
            </Col>

            </Row>
            
        </div>
    )
}

export default OrderScreen
