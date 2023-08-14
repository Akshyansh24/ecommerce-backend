import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddlewares.js';
import { createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from "express-formidable";
const router = express.Router();

// Routes
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// All Products
router.get('/get-product', getProductController)

// Single Product
router.get('/get-product/:pid', getSingleProductController)

// Product Photo
router.get('/product-photo/:pid', productPhotoController)

// Delete Product
router.delete('/delete-product/:pid', requireSignIn, isAdmin , deleteProductController)

// Update Product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable() , updateProductController)

// Search Product
router.get('/search/:keyword', searchProductController);

// Related Products
router.get('/related-products/:pid/:cid', relatedProductController);

// Category Wise
router.get('/product-category/:cid', productCategoryController)

export default router;