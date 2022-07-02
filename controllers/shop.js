const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All products',
            path: '/',
        });
    }).catch(err => console.log(err));
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    //another approach to get the product
    /*Product.findAll({where: {id: prodId}})
        .then(products => {
            res.render('shop/product-detail', {
                pageTitle: products[0].title,
                path: '/products',
                product: products[0]
            });
        })
        .catch(err => console.log(err));*/

    Product.findByPk(prodId).then(product => {
        res.render('shop/product-detail', {
            pageTitle: product.title,
            path: '/products',
            product: product,
        });
    })
        .catch(err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        cart.getProducts()
            .then(products => {
                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Your Cart',
                    products: products
                });
            })
        }).catch(err => console.log(err));
    /*Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts,
            });
        })
    });*/

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQauntity = 1;
    req.user.getCart().then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: prodId } }).then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                const oldQauntity = product.cartItem.quantity;
                newQauntity = oldQauntity + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
            .then( product => {
                return fetchedCart.addProduct(product, {
                    through: { quantity: newQauntity }
                });
            })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
                .then(products => {
                    const product = products[0];
                    return product.cartItem.destroy();
                })
                .then(() => {
                    res.redirect('/cart');
                })
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your orders',
        path: '/orders',
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
    });
};

