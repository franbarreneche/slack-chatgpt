import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { ChannelSummaryService } from "./channel-summary.service";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        const res = await (new ChannelSummaryService).run(context.req.query.channel);

        context.res = {
            status: 200,
            body: {
                data: res
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