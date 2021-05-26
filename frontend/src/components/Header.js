import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, Row, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import SearchBox from './SearchBox'
import { logout } from '../actions/userActions'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler =() =>{
        dispatch(logout())
    }

    return (
        <header>
            <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to='/'>
                <Navbar.Brand>FashionREV</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">

                    <Nav className="mr-auto">
                    <LinkContainer to='/'>
                    <Nav.Link>Home</Nav.Link>
                    </LinkContainer>

                    <LinkContainer to='/cart'>
                    <Nav.Link><i className="fa fa-shopping-cart"></i> Cart</Nav.Link>
                    </LinkContainer>

                    {userInfo ? (
                        <NavDropdown title={userInfo.name} id='username'>
                            <LinkContainer to='/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>


                        </NavDropdown>
                    ) :  (
                        <LinkContainer to='/login'>
                        <Nav.Link><i className="fa fa-user"></i> Login</Nav.Link>
                        </LinkContainer>
                    )}

                    {userInfo && userInfo.isAdmin && (
                        <NavDropdown title='Admin' id='adminmenu'>
                            <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item>Products</NavDropdown.Item>
                            </LinkContainer>

                            <LinkContainer to='/admin/orderlist'>
                                <NavDropdown.Item>Orders</NavDropdown.Item>
                            </LinkContainer>


                        </NavDropdown>
                    )}

                    </Nav>
                    
                    <SearchBox />
                    {/* <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                    </Form> */}
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </header>
    )
}

export default Header
