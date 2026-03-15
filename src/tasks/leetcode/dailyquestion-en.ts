import { getDailyQuestionEN, getQuestionDetails } from "../../lib/leetcode";
import { sendMessage } from "../../lib/telegram";
import constants from "../../constants";
import { htmlToNode, createPage } from "../../lib/telegraph";
import envs from "../../envs";
import Redis from "ioredis";

export async function handler() {
    console.log("🚀 Starting LeetCode daily question task...");

    const redis = new Redis(envs.value.redis.url);

    const question = {
        date: "",
        sourceLink: "",
        solutionLink: "",
        titleSlug: "",
        content: "",
        frontedId: "",
        difficulty: "",
        tags: "",
    };

    try {

        // fetch daily question
        let response = await getDailyQuestionEN();
        if (response.status != 200) {
            console.error("❌ Failed to fetch daily question");
            return
        }
        let data = await response.json();

        data = data.data.activeDailyCodingChallengeQuestion;

        question.date = data.date;
        question.sourceLink = constants.value.leetcode.host_en + data.link;
        question.solutionLink = question.sourceLink + "solution";
        question.titleSlug = data.question.titleSlug;

        console.log(`📌 Today's question: ${question.titleSlug}`);

        // check if the question is already updated
        const lastUpdateItem = await redis.get("leetcode/dailyquestion-en");
        if (question.titleSlug == lastUpdateItem) {
            console.log("⏳ Already processed. Exiting...");
            return
        }

        response = await getQuestionDetails(question.titleSlug);
        if (response.status != 200) {
            console.error("❌ Failed to fetch question details");
            return
        }

        // const emoji: { [key: string]: string } = {
        //     Medium: "🟡",
        //     Easy: "🟢",
        //     Hard: "🔴",
        // };
        let details = await response.json();

        details = details.data.question;
        question.content = details.content;
        question.frontedId = details.questionFrontendId;
        // question.difficulty = emoji[details.difficulty];

        let topicTags = details.topicTags;
        topicTags = topicTags.map((item: any) => {
            let slug = "#" + item.slug;
            slug = slug.replaceAll("-", "_");
            return slug;
        });
        question.tags = topicTags.join(" ");

        // creat telegraph page
        const node = htmlToNode(question.content);
        const page = await createPage(node, question.titleSlug);
        if (!page) {
            console.log("❌ Telegraph page not created. Skipping Telegram message.");
            return;
        }

        const telegraphPage = page.data.result.url;
        // question.difficulty = `<a href="${telegraphPage}">${question.difficulty}</a>`;

        // const caption =
        //     "<b>leetcode.com " +
        //     question.date +
        //     "</b>\n" +
        //     "<b>" +
        //     question.frontedId +
        //     "." +
        //     question.titleSlug +
        //     "</b>\n\n" +
        //     "<strong>🏷️ Tags\n</strong>" +
        //     question.tags;

        const caption =
            "<b>leetcode.com " +
            question.date +
            "</b>\n" +
            "<b>" +
            question.frontedId +
            "." +
            question.titleSlug +
            "</b>\n\n" +
            telegraphPage;

        const sendOptions = {
            caption: caption,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Source",
                            url: question.sourceLink,
                        },
                        {
                            text: "Solution",
                            url: question.solutionLink,
                        },
                    ],
                ],
            },
        };

        async function sendTelegramWithRetry(chatId: string, caption: string, options: any) {
            for (let i = 0; i < 5; i++) {
                try {
                    await sendMessage(chatId, caption, options);
                    console.log("message send successfully");
                    return;
                } catch (err) {
                    console.log("⚠️ Telegram send failed, retrying...");
                    await new Promise(r => setTimeout(r, 7000));
                }
            }
            throw new Error("❌ Telegram send failed after retries");
        }

        await sendTelegramWithRetry(envs.value.leetcode.telegram_chat_id, caption, sendOptions);

        await redis.set("leetcode/dailyquestion-en", question.titleSlug);
    } catch (error) {
        console.error("❌ Error in handler:", error);
    } finally {
        // Redis
        console.log("🛑 Closing Redis connection...");
        await redis.quit();
        console.log("👋 Task completed.");
    }
}

handler().catch(console.error);