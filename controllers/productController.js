import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree"

export const createProductController = async (req, res) => {
  try {
    const { name, desc, slug, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is require" });
      case !desc:
        return res.status(500).send({ error: "Description is require" });
      case !price:
        return res.status(500).send({ error: "Price is require" });
      case !category:
        return res.status(500).send({ error: "Category is require" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is require" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is require" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is require and should be less then 1 MB" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: `${name} Create Successfully`,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Creating Product",
    });
  }
};

// get Products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate('category')
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Getting Product",
    });
  }
};


// Single Product

export const getSingleProductController = async (req, res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select("-photo").populate('category');
        res.status(200).send({
            success: true,
            message: "Product Fetch Successfully",
            product,
          });
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error WHile Getting Single Product",
        });
    }
}


// Get Photo Controller

export const productPhotoController = async(req, res) => {
        try {
            const product = await productModel.findById(req.params.pid).select("photo");
            if(product.photo.data){
                res.set('Content-type', product.photo.contentType)
                return res.status(200).send(product.photo.data);
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
              success: false,
              error,
              message: "Error WHile Getting Product Photo",
            });
        }
}


// Delete PRODUCT

export const deleteProductController = async(req, res) =>{
  try {
    await productModel.findByIdAndDelete(req.params.pid).select('-photo')
    res.status(200).send({
      success:true,
      message: 'Product delete successfully'
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Deleting Product",
    });
  }
}


// Update Product

export const updateProductController = async (req, res) =>{
  try {
    const { name, desc, slug, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is require" });
      case !desc:
        return res.status(500).send({ error: "Description is require" });
      case !price:
        return res.status(500).send({ error: "Price is require" });
      case !category:
        return res.status(500).send({ error: "Category is require" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is require" });
      case !shipping:
        return res.status(500).send({ error: "Shipping is require" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is require and should be less then 1 MB" });
    }
    const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields, slug:slugify(name)},{new:true})
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Update Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Product",
    });
  }
}

// const products = await productModel.findByIdAndUpdate(req.params.id, {...req.fields, slug:slugify(name)}, {new:true})


// Search Product Controller
export const searchProductController = async(req, res) =>{
    try {
      const {keyword} = req.params
      const search ={
        $or:[
          {name: {$regex :keyword, $options :"i"}},
          {desc: {$regex :keyword, $options :"i"}}
        ]
      }
      const result = await productModel.find(search).select("-photo")

      res.status(200).send({
        success: true,
        message: "Search Successfully",
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success:false,
        message:"Error in Search Product",
        error
      })
    }
}

// Related Product Controller

export const relatedProductController = async(req, res) =>{
    try {
      const {pid,cid} = req.params
      const products = await productModel.find({
        category:cid,
        _id:{$ne:pid}
      }).select("-photo").limit(4).populate("category")
      res.status(200).send({
        success: true,
        message: "Getting Related Products",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success:false,
        message:"Error while getting  related products",
        error
      })
    }
}

export const productCategoryController = async(req, res) =>{
    try {

      const category = await categoryModel.findById(req.params.cid);
      const products = await productModel.find({category}).populate('category').select("-photo")
      res.status(200).send({
        success: true,
        message: "Getting Related Products",
        category,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success:false,
        message:"Error while getting category products",
        error
      })
    }
}

