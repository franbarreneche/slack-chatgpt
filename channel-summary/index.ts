import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ChannelSummaryService } from "./channel-summary.service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const { channel } = context.req.query;
        const summary = await (new ChannelSummaryService).run(channel);

        context.res = {
            status: 200,
            body: {
                data: summary
            }
        };
    } catch (e: any) {
        context.res = {
            status: 500,
            body: {
                error: {
                    code: 500,
                    message: e.message,
                }
            }
        }
    }
};

export default httpTrigger;