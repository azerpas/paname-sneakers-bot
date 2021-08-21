declare module '@mailchimp/mailchimp_marketing' {
    type Config = {
        apiKey?: string,
        accessToken?: string,
        server?: string
    }

    type SetListMemberOptions = {
        skipMergeValidation: boolean
    }

    export type SetListMemberBody = {
        email_address: string,
        status_if_new?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional'
        status?: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional'
        merge_fields?: {[key: string]: any}
        interests?: {[key: string]: any}
    }

    export default {
        setConfig: (config: Config) => {},
        lists: {
            setListMember: (listId: string, subscriberHash: string, body: SetListMemberBody, opts?: SetListMemberOptions): Promise<any> => {},
            addListMember: (listId: string, body: SetListMemberBody): Promise<any> => {}
        }
    }
}