import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Navigation = () => {
    return ( 
        <Navbar bg="dark" variant="dark" className="mb-3">
            <Navbar.Brand href="#home">Fridge Classifier</Navbar.Brand>
            <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/list">Images</Nav.Link>
            <Nav.Link href="/menu">Menu</Nav.Link>
            </Nav>
        </Navbar>
     );
}
 
export default Navigation;