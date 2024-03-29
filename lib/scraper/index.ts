"use server";
import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${username}-session${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorised: false,
  };

  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.base.a-color-price"),
      $(".a-button-selected .a-color-base"),
    );
    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("#priceblock_dealprice"),
      $(".a-size-base.a-color-price"),
    );
    const container = $("#wayfinding-breadcrumbs_container");
    console.log("container" + container);
    const mainCategory = container.find("a").first().text().trim();
    const subCategory = container.find("a").eq(1).text().trim();

    const categoryText =
      mainCategory !== "" && subCategory !== ""
        ? `${mainCategory} (${subCategory})`
        : "";
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
        "currently unavailable" || currentPrice === "";

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      `{}`;

    const reviewCount = $("#averageCustomerReviews .a-size-base")
      .eq(1)
      .text()
      .trim()
      .replace(/\D/g, "");
    const stars = $("#averageCustomerReviews .a-size-base").eq(0).text().trim();

    const imageUrls = Object.keys(JSON.parse(images));

    const currency = extractCurrency($(".a-price-symbol"));

    const discountRate =
      $(".savingsPercentage").text().replace(/[-%]/g, "") ||
      $(
        "a-size-double-large.a-color-pric.savingPriceOverrid.aok-align-center.reinventPriceSavingsPercentageMargin.savingsPercentage",
      )
        .text()
        .replace(/[%]/g, "");
    const description = extractDescription($);
    const data = {
      url,
      title,
      description,
      currency: currency || "$",
      image: imageUrls[0],
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: categoryText,
      reviewsCount: Number(reviewCount),
      stars: stars,
      isOutOfStock: outOfStock,
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      averagePrice: Number(currentPrice) || Number(originalPrice),
    };

    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
