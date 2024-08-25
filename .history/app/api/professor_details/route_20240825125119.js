import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

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

    // Fetch the page content
    console.log("Fetching page content...");
    const response = await axios.get(professorUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    // Extract professor info
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

    // Extract feedbacks
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

      // Check if there's a "Load More" button
      const loadMoreButton = $(
        ".PaginationButton__StyledPaginationButton-txi1dr-1"
      );

      if (loadMoreButton.length > 0) {
        // Append 'page' parameter to the URL if it's not there
        const nextPageUrl = `${professorUrl}?page=${feedbacks.length / 20 + 1}`;
        const nextPageResponse = await axios.get(nextPageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });

        $ = cheerio.load(nextPageResponse.data);
      } else {
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
