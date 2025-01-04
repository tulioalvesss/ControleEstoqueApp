const ProductComponent = require('../models/ProductComponent'); 

const productComponentController = {
    createProductComponent: async (req, res) => {
        const { productId, componentId, quantity } = req.body;
        const productComponent = await ProductComponent.create({ productId, componentId, quantity });
        res.status(201).json(productComponent);
    },
    getProductComponents: async (req, res) => {
        const productComponents = await ProductComponent.findAll();
        res.status(200).json(productComponents);
    },
    updateProductComponent: async (req, res) => {
        const { id } = req.params;
        const { productId, stockId, quantity } = req.body;
        const productComponent = await ProductComponent.findByPk(id);
        productComponent.productId = productId;
        productComponent.stockId = stockId;
        productComponent.quantity = quantity;
        await productComponent.save();
        res.status(200).json(productComponent);
    },
    deleteProductComponent: async (req, res) => {
        console.log('chegou no controller');
        console.log(req.params);
        const { id } = req.params;
        console.log(id, 'produto removido');
        await ProductComponent.destroy({ where: { id } });
        res.status(204).send();
    },

    getAllComponents: async (req, res) => {
        const components = await ProductComponent.findAll();
        res.status(200).json(components);
    }


}

module.exports = productComponentController;