import { WebClient } from "@slack/web-api";
import { SLACK_TOKEN } from "./app-config";

export class ChannelSummaryService {
    private slackApi: WebClient;

    constructor() {
        if (!SLACK_TOKEN) {
            throw new Error('SLACK_TOKEN is not defined');
        }
        this.slackApi = new WebClient(SLACK_TOKEN);
    }

    async run(channel?: string): Promise<string[] | null> {
        if (!channel) {
            throw new Error('Channel is required');
        }
        await this.slackApi.conversations.join({ channel });
        const res = await this.slackApi.conversations.history({ channel });
        return res.messages?.map(m => m.text);
    }
}