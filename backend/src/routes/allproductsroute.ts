import { Router } from 'express';
import {
  getProductsByCategorycontroller,
  getProductByIdcontroller,
  searchProductsController,
  getAllProductsController,
  getRecommendationsController
} from '../controller/allproductscontroller';

const router = Router();

// GET /products/search?q=query
router.get('/search', searchProductsController);

// GET /products/recommendations/:id
router.get('/recommendations/:id', getRecommendationsController);

// GET /products - get all products
router.get('/', getAllProductsController);

// GET /products/category/:category
router.get('/category/:category', getProductsByCategorycontroller);

// GET /products/category/:category/:id
router.get('/category/:category/:id', getProductByIdcontroller);




export default router;
