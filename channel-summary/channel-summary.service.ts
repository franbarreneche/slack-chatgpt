import { ConversationsHistoryResponse, WebClient } from "@slack/web-api";
import { SLACK_TOKEN, CHAT_GPT_ORGANIZATION, CHAT_GPT_TOKEN, CHAT_GPT_MODEL } from "./app-config";
import { Configuration, OpenAIApi } from "openai";

export class ChannelSummaryService {
    private slackApi: WebClient;
    private chatgpt: OpenAIApi;

    constructor() {
        if (!SLACK_TOKEN) {
            throw new Error('SLACK_TOKEN is not defined');
        }
        if (!CHAT_GPT_TOKEN || !CHAT_GPT_ORGANIZATION) {
            throw new Error('CHAT_GPT_TOKEN or CHAT_GPT_ORGANIZATION should be defined');        
        }

        this.slackApi = new WebClient(SLACK_TOKEN);
        
        const chatGptConfig = new Configuration({
            organization: CHAT_GPT_ORGANIZATION,
            apiKey: CHAT_GPT_TOKEN,
        });
        this.chatgpt = new OpenAIApi(chatGptConfig);
    }

    async generateChannelHistorySummary(channel?: string): Promise<string> {
        if (!channel) {
            throw new Error('Channel is required');
        }

        const channelHistory = await this.retrieveSlackChannelHistory(channel);

        return this.generateChatGptSummary(channelHistory);
    }

    private async retrieveSlackChannelHistory(channel: string) {
        await this.slackApi.conversations.join({ channel });

        return this.slackApi.conversations.history({ channel });
    }

    private async generateChatGptSummary(channelHistory: ConversationsHistoryResponse) {
        const messages = this.prepareToSendToChatGpt(channelHistory);
        const summary = await this.chatgpt.createChatCompletion({ model: CHAT_GPT_MODEL, messages: messages as any, });

        return summary.data.choices[0].message.content;
    }

    private prepareToSendToChatGpt(channelHistory: ConversationsHistoryResponse) {
        const messages = channelHistory.messages
            .reverse()
            .filter(m => m.type === 'message')
            .map(m => ({ role: 'user', name: m.user, content: m.text }));

        messages.push({
            role: 'system',
            name: 'channel-summary',
            content: 'Crea un resumen de la conversación y entrégalo sin ningún tipo de explicación adicional.'
        });

        return messages;
    }
}