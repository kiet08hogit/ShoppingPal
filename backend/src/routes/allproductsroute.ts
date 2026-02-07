import { Router } from 'express';
import {
  getProductsByCategorycontroller,
  getProductByIdcontroller,
  searchProductsController
} from '../controller/allproductscontroller';

const router = Router();


// GET /products/search?q=query
router.get('/search', searchProductsController);

// GET /products/category/:category
router.get('/category/:category', getProductsByCategorycontroller);
// GET /products/:id
router.get('/category/:category/:id', getProductByIdcontroller);




export default router;
