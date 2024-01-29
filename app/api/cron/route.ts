import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scapeAmazonProduct } from "@/lib/scraper";
import {
  getHighestPrice,
  getLowestPrice,
  getAveragePrice,
  getEmailNotifType,
} from "@/lib/utils";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function GET() {
  try {
    connectToDB();
    const products = await Product.find({});
    if (!products) throw new Error("No products found!");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrappedProduct = await scapeAmazonProduct(currentProduct.url);

        if (!scrappedProduct) throw new Error("No product found");
        const updatedPriceHistory: any = [
          ...currentProduct.priceHistory,
          { price: scrappedProduct.currentPrice },
        ];

        const product = {
          ...scrappedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
        const updatedProduct = await Product.findOneAndUpdate(
          { url: product.url },
          product,
        );
        const emailNotifType = getEmailNotifType(
          scrappedProduct,
          currentProduct,
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType,
          );

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email,
          );

          await sendEmail(emailContent, userEmails);
        }
        return updatedProduct;
      }),
    );
    return NextResponse.json({
      message: "OK",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET: ${error}`);
  }
}
