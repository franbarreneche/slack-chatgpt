import { WebClient } from "@slack/web-api";
import { SLACK_TOKEN, CHAT_GPT_ORGANIZATION, CHAT_GPT_TOKEN, CHAT_GPT_MODEL } from "./app-config";
import { Configuration, OpenAIApi } from "openai";

export class ChannelSummaryService {
    private slackApi: WebClient;
    private chatgtp: OpenAIApi;

    constructor() {
        if (!SLACK_TOKEN) {
            throw new Error('SLACK_TOKEN is not defined');
        }
        this.slackApi = new WebClient(SLACK_TOKEN);

        const configuration = new Configuration({
            organization: CHAT_GPT_ORGANIZATION,
            apiKey: CHAT_GPT_TOKEN,
        });

        this.chatgtp = new OpenAIApi(configuration);
    }

    async run(channel?: string): Promise<string> {
        if (!channel) {
            throw new Error('Channel is required');
        }
        await this.slackApi.conversations.join({ channel });
        const res = await this.slackApi.conversations.history({ channel });

        const messages = res.messages
            .reverse()
            .filter(m => m.type === 'message')
            .map(m => ({ role: 'user', name: m.user, content: m.text }));
        messages.push({ role: 'system', name: 'channel-summary', content: 'Crea un resumen de la conversación y entrégalo sin ningún tipo de explicación adicional.' });

        const summary = await this.chatgtp.createChatCompletion({ model: CHAT_GPT_MODEL, messages: messages as any, });
        
        return summary.data.choices[0].message.content;
    }
}