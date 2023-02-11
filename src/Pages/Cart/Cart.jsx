import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { ContextFunction } from '../../Context/Context';
import {
    Box,
    Button,
    CardActionArea,
    CardContent,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    Slide,
    IconButton,
    TableContainer,
    TableHead,
    Table,
    Paper,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material'
import './Cart.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AiFillCloseCircle, AiOutlineLogin, AiFillInfoCircle } from 'react-icons/ai'
import CartTable from './CartTable';


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Cart = () => {
    const { cart, setCart } = useContext(ContextFunction)
    const [total, setTotal] = useState(0)
    const [shippingCost, setShippingCoast] = useState(100)
    const [openAlert, setOpenAlert] = useState(false);

    const navigate = useNavigate()

    let shipping = total >= 1000 ? 0 : shippingCost
    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false


    useEffect(() => {
        setProceed ? getCart() : setOpenAlert(true)
        window.scroll(0, 0)
    }, [])

    useEffect(() => {
        setProceed && setTotal(cart.reduce((acc, curr) => acc + (curr.productId?.price), 0))
    }, [cart])

    const getCart = async () => {
        if (setProceed) {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
            setCart(data);
        }

    }
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };


    const removeFromCart = async (product) => {
        if (setProceed) {
            const response = await axios.delete(`${process.env.REACT_APP_DELETE_CART}/${product.productId._id}`, {
                headers: {
                    'Authorization': authToken
                }
            })
            toast.error("Removed From Cart", { autoClose: 500, })
            getCart()
        }
    }
    return (
        <div className='main-cart-container'>
            {setProceed &&
                <>

                    <TableContainer component={Paper} >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ textAlign: 'center' }}>ITEM</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>PRICE</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>Order Date</TableCell>
                                    <TableCell sx={{ textAlign: 'center' }}>REMOVE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    cart.map(product =>
                                        <CartTable product={product} removeFromCart={removeFromCart} key={product._id} />

                                    )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box className='total-card'>
                        <CardActionArea >
                            <CardContent>
                                <span> Total Amount =  ₹{total} </span>
                                <br />
                                <span> Shipping Cost = ₹{cart.length === 0 ? 0 : shipping}   </span>
                                <Tooltip title="There will no shipping charge If total order is greater than ₹1000" placement="right-start">

                                    <IconButton>
                                        <AiFillInfoCircle color='#1976d2' />
                                    </IconButton>
                                </Tooltip>

                                <br />
                                <span>Bill Amount = ₹ {cart.length == 0 ? 0 : total + shipping}</span>
                            </CardContent>
                        </CardActionArea>
                    </Box>
                </>
            }
            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                    <Typography variant='h5'> Please Login To Proceed</Typography>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <Button variant='contained' onClick={handleToLogin} endIcon=<AiOutlineLogin /> color='primary'>Login</Button>
                    <Button variant='contained' color='error' endIcon=<AiFillCloseCircle /> onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Cart