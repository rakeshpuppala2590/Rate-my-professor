import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";
import { load } from "cheerio";

export async function POST(request) {
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

    console.log("Fetching page content...");
    const response = await axios.get(professorUrl);
    const html = response.data;

    const $ = load(html); // Use load function from cheerio

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

      const loadMoreButton = $(
        ".PaginationButton__StyledPaginationButton-txi1dr-1"
      );

      if (loadMoreButton.length > 0) {
        try {
          console.log("Load more button found. Clicking...");
          await axios.post(professorUrl); // Simulate the button click to load more ratings
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for the new content to load

          const newResponse = await axios.get(professorUrl);
          const newHtml = newResponse.data;
          $ = load(newHtml); // Re-load the page content after "Load More"
        } catch (error) {
          console.error("Error clicking load more button:", error.message);
          hasMoreRatings = false;
        }
      } else {
        console.log("Load more button not found.");
        hasMoreRatings = false;
      }
    }

    if (!professorInfo.name || professorInfo.name === "Unknown") {
      return NextResponse.json(
        { error: "Professor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ professorInfo, feedbacks });
  } catch (error) {
    console.error("Error scraping data:", error.message);
    return NextResponse.json(
      { error: "Failed to scrape data", details: error.message },
      { status: 500 }
    );
  }
}
