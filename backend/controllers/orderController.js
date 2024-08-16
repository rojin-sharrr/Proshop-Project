import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js'

// @desc:   Create new orders
// @route:  POST /api/orders
// @access: Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    const order = new Order({
        orderItems: orderItems.map((item) => ({
            ...item,
            product: item._id,
            _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});


// @desc:   Get logged in users orders
// @route:  GET /api/orders/mine
// @access: Private
const getMyOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({user: req.user._id })
    res.status(200).json(orders);
})



// @desc:   Get order by ID
// @route:  GET /api/orders/:id
// @access: Private
const getOrderById = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order){
        res.status(200).json(order)
    }else{
        res.status(404)
        throw new Error('Order not found')
    }
})



// @desc:   Update Order to Paid
// @route:  PUT /api/orders/:id/pay
// @access: Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.payer.email_address,
            };

            const updatedOrder = await order.save();
            res.status(200).json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        console.error(`Error updating order to paid: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
});



// @desc:   Update Order to Delivered
// @route:  PUT /api/orders/:id/deliver
// @access: Private/Admin
const updateOrderToDelivered = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    }else{
        res.status(404);
        throw new Error('Order not Found');
    }
})



// @desc:   Get all orders
// @route:  GET /api/orders
// @access: Private/Admin
const getOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
})

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
};
