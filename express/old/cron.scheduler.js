// cron.schedule("10 * * * * *", async () => {
//   console.log(
//     "Cron job triggered: scraping pending queries from PostgreSQL...",
//   );

//   try {
//     const { rows } = await db.query(
//       'SELECT * FROM public."Comparator" WHERE status = $1',
//       ["pending"],
//     );

//     if (!rows.length) {
//       console.log("No pending queries found.");
//       return;
//     }

//     for (const row of rows) {
//       const searchQuery = row.query; // Your query column value
//       console.log("Panding task: ", searchQuery);
//       console.log("Scraping for query:", searchQuery);

//       try {
//         const amazonResponse = await scrapeAmazonProducts(searchQuery);
//         const alibabaResponse = await scrapeAlibabaProducts(searchQuery);

//         // await fetch(
//         //   "http://localhost:3001/api/scrape/alibaba",
//         //   {
//         //     method: "POST",
//         //     headers: { "Content-Type": "application/json" },
//         //     body: JSON.stringify({
//         //       searchQuery,
//         //       // maxPrice: 100,
//         //       // maxPages: 1,
//         //     }),
//         //   },
//         // );

//         //fetch() returns a 'Response' object. You need to convert that response to JSON using .json()
//         // const resultAmazon = await amazonResponse.json();
//         // const resultAlibaba = await alibabaResponse.json();
//         console.log(
//           "Scraping job result for",
//           searchQuery,
//           ":",
//           amazonResponse,
//           alibabaResponse,
//         );

//         // Optionally update the status after successful scraping:
//         await db.query(
//           'UPDATE public."Comparator" SET status = $1,alibaba = $2, amazon = $3 WHERE query = $4',
//           ["completed", alibabaResponse, amazonResponse, searchQuery],
//         );
//       } catch (scrapeError) {
//         console.error(
//           `Error scraping for query "${searchQuery}":`,
//           scrapeError,
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error in cron job:", error);
//   }
// });
