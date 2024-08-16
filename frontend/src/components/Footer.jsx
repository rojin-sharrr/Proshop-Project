import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
    const currDate = new Date()
    const year = currDate.getFullYear()

  return (
    <footer>
     <Container> 
        <Row>
            <Col className='text-center py-3'>
                <p> ProShop &copy; {year} </p>
            </Col>
        </Row>
     </Container>

    </footer>
   
  )
}

export default Footer