export const newProductCreated = (req, res) => {
    const newProduct = req.body;
    const { title } = newProduct;

    console.log('Product created:', newProduct);
    console.log('Corresponding Title:', title);
    res.status(200).send('Webhook received');
};