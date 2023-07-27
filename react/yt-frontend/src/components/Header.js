import React from 'react'
import Card from 'react-bootstrap/Card';
// import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header(props) {
  return (
    <Card.Header style={{fontFamily: "Open Sans"}}>
        <h1 style={{margin: "1%"}}>{props.text}</h1>
        {/* <Card bg="secondary" text="light" className="mb-2" style={{margin: "0"}} >
            
        </Card>       */}
    </Card.Header>  
  )
}

export default Header