import { PrismaClient } from '@prisma/client';
import { title } from 'process';
// import { downloadCsv } from '../utils/cloudinaryUtils.js';

const prisma = new PrismaClient();

export const getScrappedProducts = async (req, res) => {
    try {
        console.log("---------------------------------------------------------------");
        console.log("Getting scrapped products...");
        console.log("---------------------------------------------------------------");

        let { query } = req.query;

        // console.log('Query :', query);

        if (!query) {
            return res.status(400).json({ error: "Query parameter is required" });
        }

        // !important: Trim extra whitespace and newlines
        query = query.trim();

        const comparator = await prisma.comparator.findUnique({
            where: { query }
        });

        if (comparator.status === "pending" || comparator.status === "processing") {
            return res.status(202).json({
                message: "Data is still being processed. Please check back in a few hours..."
            });
        }

        const result = await prisma.scrapeData.findMany({
            where: { comparatorQueryId: comparator.id },
            orderBy: { id: "asc" } // Sorting in ascending order
        });
        
        // console.log(result);
        
        const arrNew = [];
        let initialId = result[0].id, initialDate = result[0].createdAt;
        arrNew.push({dataDate: result[0].createdAt, dataPrice: Number(result[0].price), dataNOP: result[0].nop});
        result.forEach(x => {
            if (result.indexOf(x) !== 0) {
                if (x.id === initialId + 1) {
                    arrNew.push({dataDate: initialDate, dataPrice: Number(x.price), dataNOP: x.nop});
                } else {
                    initialDate = x.createdAt;
                    arrNew.push({dataDate: initialDate, dataPrice: Number(x.price), dataNOP: x.nop});
                }
                initialId = x.id;
            }
        })

        // const titleArr = [];
        // let checker = false, title;
        // for (const x of result) {
        //     if (titleArr.includes(x.title)) {
        //         checker = true; title = x.title;
        //         break;
        //     } else {
        //         titleArr.push(x.title);
        //     }
        // }



        
        const arr = [];
        const alibabaArr = [];
        const alibabaArrNew = [];
        const amazonArr = [];
        const amazonArrNew = [];

        result.forEach(x => {
            if (x.source == 'alibaba') {
                alibabaArr.push(x); // {title: x.title, dataDate: new Date(x.createdAt)}
            } else if (x.source == 'amazon') {
                amazonArr.push(x);
            }
        });
        

        alibabaArr.forEach(x => {
            let found = false;
        
            for (const y of alibabaArrNew) {
                if (x.title === y.title) {
                    const quantity = y.quantity + 1;
                    const arr = [...y.graphData, {dataDate: x.createdAt, dataPrice: x.price}];
                    x.quantity = quantity;
                    x.graphData = arr;
                    alibabaArrNew[alibabaArrNew.indexOf(y)] = x;
                    found = true;
                    break; // Stop checking once found
                }
            }
        
            if (!found) {
                x.quantity = 1;
                x.graphData = [{dataDate: x.createdAt, dataPrice: x.price}];
                alibabaArrNew.push(x);
            }
        });

        amazonArr.forEach(x => {
            let found = false;
        
            for (const y of amazonArrNew) {
                if (x.title === y.title) {
                    const quantity = y.quantity + 1;
                    const arr = [...y.graphData, {dataDate: x.createdAt, dataPrice: x.price}];
                    x.quantity = quantity;
                    x.graphData = arr;
                    amazonArrNew[amazonArrNew.indexOf(y)] = x;
                    found = true;
                    break; // Stop checking once found
                }
            }
        
            if (!found) {
                x.quantity = 1;
                x.graphData = [{dataDate: x.createdAt, dataPrice: x.price}];
                amazonArrNew.push(x);
            }
        });
        
        

        console.log("[END]")
        // res.status(200).json([...alibabaArrNew, ...amazonArrNew]); checker, title
        res.status(200).json({dataArr: [...alibabaArrNew, ...amazonArrNew], graphDataArr: arrNew});

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

