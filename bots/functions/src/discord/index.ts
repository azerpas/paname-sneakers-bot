import * as functions from 'firebase-functions';
import got from 'got/dist/source';

type DiscordProps = {
    website: string;
    size: string;
    url: string;
    email: string;
    productName: string;
    thumbnail: string;
    discord?: string;
    customWebhook?: string;
}

type DiscordErrorProps  = {
    error: string;
    user: string;
    originalError?: any;
} & DiscordProps

type DiscordPayPalProps = {
    customWebhook: string;
    paypalUrl: string;
} & DiscordProps

export const sendEntrySuccess = async (props: DiscordProps) => {
    const { website, size, url, customWebhook, productName, thumbnail, email } = props;
    functions.logger.log("Custom webhook")
    functions.logger.log(customWebhook)
    const webhook = customWebhook || functions.config().webhooks.entry || "https://discord.com/api/webhooks/691782722";
    functions.logger.log(`Webhook: ${webhook}`)
    const data = {
        "content": null,
        "embeds": [
            {
                "title": "SUCCESSFULL ENTRY 🚨", "color": 7340287,
                "fields": [
                    {
                        "name": "Website","value": website,"inline": true
                    },
                    {
                        "name": "Size","value": size,"inline": true
                    },
                    {
                        "name": "URL","value": `[Raffle](${url})`,"inline": true
                    },
                    {
                        "name": "email","value": email.substring(0,4)+"••••••••"
                    },
                    {
                        "name": "Product","value": productName,"inline": true
                    },
                ],
                "footer": {  "text": "paname.io" }, "timestamp": new Date().toISOString(),
                "thumbnail": { url: thumbnail }
            }
        ]
    }
    await got.post(webhook, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    functions.logger.log("Sent!")
}

export const sendError = async (props: DiscordErrorProps) => {
    const { website, size, url, customWebhook, email } = props;
    const webhook = functions.config().webhooks.error || "https://discord.com/api/webhooks/811375216248";
    const webhook2 = customWebhook || undefined;
    const data = {
        "content": null,
        "embeds": [
            {
                "title": "ERROR ON EXECUTION ⚠️", "color": 7340287,
                "fields": [
                    {
                        "name": "UserId","value": props.user,"inline": true
                    },
                    {
                        "name": "Website","value": website,"inline": true
                    },
                    {
                        "name": "Size","value": size,"inline": true
                    },
                    {
                        "name": "URL","value": `[Raffle](${url})`,"inline": true
                    },
                    {
                        "name": "email","value": email.substring(0,4)+"••••••••"
                    },
                    {
                        "name": "Error","value": props.error + (props.originalError ? (typeof props.originalError === 'object' ? (props.originalError.stack ? `\n${props.originalError.stack}` : "") : ""): "")
                    }
                ],
                "footer": {  "text": "paname.io" }, "timestamp": new Date().toISOString()
            }
        ]
    }
    await got.post(webhook, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if(webhook2){
        await got.post(webhook2, {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
}

export const sendPayPalWebhook = async (props: DiscordPayPalProps) => {
    const { website, email, customWebhook, paypalUrl, productName, thumbnail } = props;
    functions.logger.log("Custom webhook")
    functions.logger.log(customWebhook)
    const webhook = customWebhook;
    functions.logger.log(`Webhook: ${webhook}`)
    const data = {
        "content": null,
        "embeds": [
            {
                "title": "⚠️ CONFIRM ENTRY WITH PAYPAL ⚠️","url": paypalUrl, "color": 7340287,
                "fields": [
                    {
                        "name": "Website","value": website,"inline": true
                    },
                    {
                        "name": "URL","value": `[Paypal Link](${paypalUrl})`,"inline": true
                    },
                    {
                        "name": "Email","value": email,"inline": true
                    },
                    {
                        "name": "Product","value": productName,"inline": true
                    },
                ],
                "footer": {  "text": "paname.io" }, "timestamp": new Date().toISOString(),
                "thumbnail": { url: thumbnail }
            }
        ]
    }
    await got.post(webhook, {
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    functions.logger.log("Sent!")
}
