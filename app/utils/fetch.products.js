import { json } from "@remix-run/node";
import shopify from "../shopify.server";

export async function loader({ request }) {
  const { admin } = await shopify.authenticate.admin(request);
  const response = await admin.graphql(`
    {
      products(first: 100, sortKey: CREATED_AT, reverse: true) {
        nodes {
            id
            title
            description
            images(first: 1) {
                edges {
                    node {
                        src
                    }
                }
            }
            priceRangeV2 {
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
        }
      }
    }
  `);

  const parsedResponse = await response.json();

  return json({
    products: parsedResponse.data.products.nodes.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      imageUrl:
        product.images.edges.length > 0
          ? product.images.edges[0].node.src
          : null,
      price: product.priceRangeV2
        ? product.priceRangeV2.minVariantPrice.amount
        : null,
      currency: product.priceRangeV2
        ? product.priceRangeV2.minVariantPrice.currencyCode
        : null,
    })),
  });
}
