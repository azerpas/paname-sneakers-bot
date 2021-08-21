import mailchimp from "@mailchimp/mailchimp_marketing";
import crypto from 'crypto';

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: "us7" 
});

type ContactProps = {
    firstName: string;
    lastName: string;
    email: string;
    listId: string;
}

type UserProps = {
    email: string;
    interests: {[key: string]: any};
}

export const addContact = async (props: ContactProps) => {
    try{
        const rep = await mailchimp.lists.addListMember(props.listId, {
            email_address: props.email,
            merge_fields: {
                FNAME: props.firstName,
                LNAME: props.lastName
            },
            status: "subscribed"
        });
        if(rep.id) return rep.id;
    }catch(e){
        console.error(e);
        if(e.status === 400){
            throw new Error(`Error while adding email: ${JSON.parse(e.response.res.text).title}`)
        }else{
            throw new Error(`Error while adding email: ${e.status} ${e.response.res ? JSON.parse(e.response.res.text).title : ""}`)
        }
    }
}

export const addToGroup = async (props: UserProps) => {
    try{
        if(!process.env.MAILCHIMP_AUDIENCE_ID) throw new Error('');
        const hash = crypto.createHash('md5').update(props.email).digest('hex');
        const rep = await mailchimp.lists.setListMember(process.env.MAILCHIMP_AUDIENCE_ID, hash, {
            email_address: props.email,
            status: "subscribed",
            interests: props.interests,
        });
        if(rep.id) return rep.id;
    }catch(e){
        console.error(e);
        console.error(e.response.request._data)
        if(e.status === 400){
            throw new Error(`Error while adding email: ${JSON.parse(e.response.res.text).title}`)
        }else{
            throw new Error(`Error while adding email: ${e.status} ${e.response.res ? JSON.parse(e.response.res.text).title : ""}`)
        }
    }
}