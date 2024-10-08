import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice.js';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Pagination.jsx';



const ProductListScreen = () => {
    const { pageNumber } = useParams();
    const { data, isLoading, error, refetch } = useGetProductsQuery({pageNumber});

    const  [createProduct, {isLoading: laodingCreate }]= useCreateProductMutation();

    const [ deleteProduct, {isLoading: loadingDelete} ] = useDeleteProductMutation();

    const deleteHandler = async (id) => {
        if(window.confirm('Are you sure you want to delete product?')){
            try {
                await deleteProduct(id);
                refetch();
                toast.success('Product Deleted Successfully')
            } catch (err) {
                toast.err(err?.data?.message || err.message);
            }
        }
    }
 
    const createProductHandler = async ()=> {
        if(window.confirm('Are you sure you want to create a new product?')){
            try {
                await createProduct();
                refetch();
                toast.success('Product Created Succesfully')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }



  return (
    <>
        <Row>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-end'>
                <Button className='btn-sm m-3' onClick={createProductHandler}> <FaEdit /> Create Product</Button>
            </Col>
        </Row>

        {laodingCreate && <Loader />}
        {loadingDelete && <Loader />}


        {isLoading? (
            <Loader />
        ): error? (
            <Message variant='danger'>{error} </Message>
        ): 
        (
            <>
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>{""}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.products.map( (product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td> 
                                    <LinkContainer to= {`/admin/product/${product._id}/edit`} >
                                        <Button variant='light' className='btn-sm mx-2' >
                                            <FaEdit />
                                        </Button>
                                    </LinkContainer>
                                    <Button variant='light' className='btn-sm' onClick={()=> deleteHandler(product._id)  } > 
                                        <FaTrash style={{color: 'red'}} />
                                    </Button>
                                </td>

                            </tr>
                        ) ) }
                    </tbody>

                </Table>
                <Paginate pages={data.pages} page={data.page} isAdmin={true}></Paginate>
            </>
        )
        }
    </>
  )
}

export default ProductListScreen