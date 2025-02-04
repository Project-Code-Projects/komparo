export const newProductCreated = (req, res) => {
    const newProduct = req.body;
    console.log('Product created:', newProduct);
    res.status(200).send('Webhook received');
};