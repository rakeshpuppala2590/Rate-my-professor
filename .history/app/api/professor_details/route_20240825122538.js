import { NextResponse } from "next/server";

let puppeteer;
let chromium;

if (process.env.NODE_ENV === "production") {
  puppeteer = require("puppeteer-core");
  chromium = require("@sparticuz/chromium");
} else {
  puppeteer = require("puppeteer");
}

async function launchBrowser() {
  console.log("Launching browser...");
  if (process.env.NODE_ENV === "production") {
    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } else {
    return await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: "new",
    });
  }
}

export async function POST(request) {
  let browser;
  try {
    const { professorId } = await request.json();
    if (!professorId) {
      return NextResponse.json(
        { error: "Professor ID or URL is required" },
        { status: 400 }
      );
    }

    const professorUrl = professorId.startsWith("https://")
      ? professorId
      : `https://www.ratemyprofessors.com/professor/${professorId}`;

    browser = await launchBrowser();
    console.log("Browser launched");

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    console.log("New page created");

    console.log("Navigating to URL:", professorUrl);
    await page.goto(professorUrl, {
      waitUntil: "networkidle0",
      timeout: 160000,
    });
    console.log("Page loaded");

    // Wait for the professor info section to load
    await page.waitForSelector(".TeacherInfo__StyledTeacher-ti1fio-1", {
      timeout: 10000,
    });

    const professorInfo = await page.evaluate(() => {
      const nameElement = document.querySelector(".NameTitle__Name-dowf0z-0");
      const departmentElement = document.querySelector(
        ".NameTitle__Title-dowf0z-1"
      );
      const ratingElement = document.querySelector(
        ".RatingValue__Numerator-qw8sqy-2"
      );
      const numRatingsElement = document.querySelector(
        ".RatingValue__NumRatings-qw8sqy-0"
      );
      const wouldTakeAgainElement = document.querySelector(
        ".FeedbackItem__FeedbackNumber-uof32n-1"
      );
      const difficultyElement = document.querySelectorAll(
        ".FeedbackItem__FeedbackNumber-uof32n-1"
      )[1];
      const tagsElements = document.querySelectorAll(
        ".TeacherTags__TagsContainer-sc-16vmh1y-0 .Tag-bs9vf4-0"
      );

      return {
        name: nameElement ? nameElement.textContent.trim() : "Unknown",
        department: departmentElement
          ? departmentElement.textContent.trim()
          : "Unknown",
        overallRating: ratingElement ? ratingElement.textContent.trim() : "N/A",
        numRatings: numRatingsElement
          ? numRatingsElement.textContent.match(/\d+/)[0]
          : "0",
        wouldTakeAgain: wouldTakeAgainElement
          ? wouldTakeAgainElement.textContent.trim()
          : "N/A",
        difficulty: difficultyElement
          ? difficultyElement.textContent.trim()
          : "N/A",
        topTags: Array.from(tagsElements).map((tag) => tag.textContent.trim()),
      };
    });

    let feedbacks = [];
    let hasMoreRatings = true;

    while (hasMoreRatings) {
      // Wait for the feedback section to load
      await page.waitForSelector(".Rating__RatingBody-sc-1rhvpxz-0", {
        timeout: 10000,
      });

      // Scrape the current page of feedbacks
      const currentFeedbacks = await page.evaluate(() => {
        const feedbackElements = document.querySelectorAll(
          ".Rating__RatingBody-sc-1rhvpxz-0"
        );
        return Array.from(feedbackElements).map((feedbackEl) => {
          return {
            course:
              feedbackEl
                .querySelector(".RatingHeader__StyledClass-sc-1dlkqw1-3")
                ?.textContent.trim() || "",
            date:
              feedbackEl
                .querySelector(".TimeStamp__StyledTimeStamp-sc-9q2r30-0")
                ?.textContent.trim() || "",
            qualityRating:
              feedbackEl
                .querySelector(
                  ".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2"
                )
                ?.textContent.trim() || "",
            difficultyRating:
              feedbackEl
                .querySelectorAll(
                  ".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2"
                )[1]
                ?.textContent.trim() || "",
            comments:
              feedbackEl
                .querySelector(".Comments__StyledComments-dzzyvm-0")
                ?.textContent.trim() || "",
            tags: Array.from(
              feedbackEl.querySelectorAll(
                ".RatingTags__StyledTags-sc-1boeqx2-0 .Tag-bs9vf4-0"
              )
            ).map((tag) => tag.textContent.trim()),
          };
        });
      });

      feedbacks = [...feedbacks, ...currentFeedbacks];

      // Check if there's a "Load More Ratings" button
      const loadMoreButton = await page.$(
        ".PaginationButton__StyledPaginationButton-txi1dr-1"
      );
      if (loadMoreButton) {
        try {
          console.log("Load more button found. Clicking...");
          await loadMoreButton.click();
          await page.waitForTimeout(3000); // Wait for the new content to load
        } catch (error) {
          console.error("Error clicking load more button:", error.message);
          hasMoreRatings = false;
        }
      } else {
        console.log("Load more button not found.");
        hasMoreRatings = false;
      }
    }

    await browser.close();

    if (!professorInfo.name || professorInfo.name === "Unknown") {
      return NextResponse.json(
        { error: "Professor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ professorInfo, feedbacks });
  } catch (error) {
    console.error("Error scraping data:", error.message);
    console.error(error.stack);
    return NextResponse.json(
      { error: "Failed to scrape data", details: error.message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
