import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const newProductCreated = async (req, res) => {
    try {
        console.log("---------------------------------------------------------------");
        console.log("There is a new product in your store...");
        console.log("---------------------------------------------------------------");

        const newProduct = req.body;
        const { title } = newProduct;

        console.log('Product created:', newProduct);
        console.log('Corresponding Title:', title);

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const existingQuery = await prisma.comparator.findUnique({
            where: { query: title }
        });

        if (!existingQuery) {
            await prisma.comparator.create({
                data: {
                    query: title,
                }
            });
            console.log('New query inserted:', title);
        } else {
            const currentDate = new Date();
            const updatedAtDate = existingQuery.updatedAt;
            const differenceInTime = currentDate - updatedAtDate;
            const differenceInDays = differenceInTime / (1000 * 3600 * 24);
            const isOlderThanOneWeek = differenceInDays > 7;

            console.log("Difference in days:", differenceInDays);

            if (isOlderThanOneWeek) {
                await prisma.comparator.update({
                    where: { id: existingQuery.id },
                    data: { status: 'pending' }
                });
                console.log('Query exists but has not been updated, status changed to pending:', title);
            } else console.log('Query exists but was updated recently:', title);
        }

        console.log("[END]");
        res.status(200).send('Webhook processed successfully');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
