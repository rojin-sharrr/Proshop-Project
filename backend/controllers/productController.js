import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js'


// @desc:   Fetch All Products
// @route:  GET /api/products
// @access: Public
const getProducts = asyncHandler( async (req, res) => {
    const products  = await Product.find({});
    res.status(200).json(products);
})



// @desc:   Fetch a Product
// @route:  /api/products/:id
// @access: Public
const getProductById = asyncHandler( async (req, res) => {
    const product = await Product.findById(req.params.id);
  if (product){
    res.json(product);
  }else{
    res.status(404);
    throw new Error('Resource not Found')
  }
})




// @desc:   Create a Product
// @route:  POST /api/products
// @access: Private/Admin
const createProduct = asyncHandler( async (req, res) => {
    const product = new Product({
      name: 'Sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample brand',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample Description',
    });

    const createProduct = await product.save();
    res.status(201).json(createProduct);

})




// @desc:   Update a product
// @route:  PUT /api/products/:id
// @access: Private/Admin
const updateProduct = asyncHandler( async (req, res) => {
 
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product){
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);

    }else{
      res.status(404);
      throw new Error('Resource not Found');
    }
    
  } catch (err) {
    throw new Error(err?.data?.message || err.message)
  }

})


// @desc:   Delete a product
// @route:  DELETE /api/products/:id
// @access: Private/Admin
const deleteProduct = asyncHandler( async (req, res) => {
 
   const product = await Product.findById(req.params.id);

   if (product){ 
    await Product.deleteOne({_id: product._id })
    res.status(200).json({message: 'Product Deleted'})

   }else{
     res.status(404);
     throw new Error('Resource not found');
   }

})

// @desc:   Review a Product
// @route:  POST /api/products/:id/reviews
// @access: Private
const createProductReview = asyncHandler( async (req, res) => {

  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product){ 
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed){
      res.status(400); 
      throw new Error('Product Already Reviewed');
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    }

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce( (acc, review) => acc + review.rating, 0  ) / product.reviews.length;

    await product.save();
    res.status(201).json({message: 'Review Added'})

  }else{
    res.status(404);
    throw new Error('Resource not found');
  }

})


export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };