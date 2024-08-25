import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import cheerio from "cheerio";

async function launchBrowser() {
  console.log("Launching browser...");
  try {
    const executablePath = await chromium.executablePath();
    console.log("Executable path:", executablePath);

    return await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
  } catch (error) {
    console.error("Error launching browser:", error);
    throw error;
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

    console.log("Launching browser...");
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
      timeout: 60000,
    });
    console.log("Page loaded");

    const content = await page.content();
    const $ = cheerio.load(content);

    const professorInfo = {
      name: $(".NameTitle__Name-dowf0z-0").text().trim() || "Unknown",
      department: $(".NameTitle__Title-dowf0z-1").text().trim() || "Unknown",
      overallRating:
        $(".RatingValue__Numerator-qw8sqy-2").text().trim() || "N/A",
      numRatings:
        $(".RatingValue__NumRatings-qw8sqy-0").text().match(/\d+/)?.[0] || "0",
      wouldTakeAgain:
        $(".FeedbackItem__FeedbackNumber-uof32n-1").first().text().trim() ||
        "N/A",
      difficulty:
        $(".FeedbackItem__FeedbackNumber-uof32n-1").last().text().trim() ||
        "N/A",
      topTags: $(".TeacherTags__TagsContainer-sc-16vmh1y-0 .Tag-bs9vf4-0")
        .map((i, el) => $(el).text().trim())
        .get(),
    };

    let feedbacks = [];
    let hasMoreRatings = true;

    while (hasMoreRatings) {
      const currentFeedbacks = $(".Rating__RatingBody-sc-1rhvpxz-0")
        .map((i, feedbackEl) => ({
          course:
            $(feedbackEl)
              .find(".RatingHeader__StyledClass-sc-1dlkqw1-3")
              .text()
              .trim() || "",
          date:
            $(feedbackEl)
              .find(".TimeStamp__StyledTimeStamp-sc-9q2r30-0")
              .text()
              .trim() || "",
          qualityRating:
            $(feedbackEl)
              .find(".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2")
              .first()
              .text()
              .trim() || "",
          difficultyRating:
            $(feedbackEl)
              .find(".CardNumRating__CardNumRatingNumber-sc-17t4b9u-2")
              .last()
              .text()
              .trim() || "",
          comments:
            $(feedbackEl)
              .find(".Comments__StyledComments-dzzyvm-0")
              .text()
              .trim() || "",
          tags: $(feedbackEl)
            .find(".RatingTags__StyledTags-sc-1boeqx2-0 .Tag-bs9vf4-0")
            .map((j, tag) => $(tag).text().trim())
            .get(),
        }))
        .get();

      feedbacks = [...feedbacks, ...currentFeedbacks];

      const loadMoreButton = await page.$(
        ".PaginationButton__StyledPaginationButton-txi1dr-1"
      );
      if (loadMoreButton) {
        try {
          console.log("Load more button found. Clicking...");
          await loadMoreButton.click();
          await page.waitForTimeout(3000); // Wait for the new content to load

          // Re-load the page content after clicking "Load More"
          const newContent = await page.content();
          $ = cheerio.load(newContent);
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
