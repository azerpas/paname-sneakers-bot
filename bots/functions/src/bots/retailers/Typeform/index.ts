import got, { Got } from 'got';
/*import { parseProxy, solveCaptcha } from "../../../helper";
import * as functions from 'firebase-functions';
import * as Faker from 'faker';
import { CookieJar } from "tough-cookie";
*/
import cheerio from "cheerio";
import * as urlHelper from "url";
import { v4 as uuidv4 } from "uuid";

import 'global-agent/bootstrap';
import { EventProps, FieldsEntity, Form, InsightEventProps, Intent, SegmentProps, StartSubmit, ThankyouScreensEntity, TrackInfos } from './types';
import { randomBetween, randomChoice, sleep } from '../../../helper';
import countries from "../../../constants/countries"; 
//import { sendError } from '../../../discord';

class Typeform {
    s: Got;
    url: string;
	formId: string | undefined;
	responseId: string | undefined;
	userId: number | undefined;
	title: string | undefined;
	host: string | undefined;
	userAgent: string | undefined;
	attributionUserId: string | undefined;
	segmentKey: string | undefined;
	accountId: number | undefined;
	anonymousId: string | undefined;
	width: number | undefined;
	height: number | undefined;
	embeddingMode: string | undefined;
	timezone: string | undefined; // tz in luminati
	landingToken: string | undefined; // signature
	landedAt: number | undefined; // in ms
	scrapedAt: number | undefined;
	timer: number; // in s
	typeformViewId: string | undefined;
	fields: FieldsEntity[] | null | undefined;
	thankyouScreens: ThankyouScreensEntity[] | null | undefined;
	intents: Intent[] | null | undefined;
	//{"ip":"91.111.11.11","country":"FR","asn":{"asnum":12322,"org_name":"Free SAS"},"geo":{"city":"Paris","region":"IDF","region_name":"Île-de-France","postal_code":"75008","latitude":48.0,"longitude":2.0,"tz":"Europe/Paris","lum_city":"paris","lum_region":"idf"}}
	// POST:https://noirfonce1.typeform.com/forms/XoDOJj/start-submission
	//{"signature":"20906a69336e653932323838617a776a69337863636462796a3333713778656c657334313339363936363463366336363533373434333536343134353337366237613339343233303664373236613737353935613431363436393336343833313336333133353334333033353332333833323763336634386462363335613632373138303163303534633365313238346461663063356365396132616162303938626336373262616636396462393234373631363135343035323832","submission":{"response_id":"ji3ne92288azwji3xccdbyj33q7xeles","type":"started","form_id":"XoDOJj","landed_at":1615405282,"metadata":{"user_agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36","platform":"other","referer":"https://noirfonce1.typeform.com/to/XoDOJj?typeform-embed=embed-widget\u0026typeform-source=noirfonce.eu\u0026typeform-medium=embed-sdk\u0026typeform-embed-id=jh5md","network_id":"8b27fb41ba","ip":"90.70.157.120","browser":"default","client":"stakhanov","id_type":"form-id","source":"noirfonce.eu","medium":"embed-sdk","medium_version":"","embed_trigger_type":""}}}


    constructor(url: string){
		this.url = url;
		this.timer = 0;
		this.typeformViewId = this.setSessionId()
		this.formId = this.parseUrl()
		this.host = "https://" + urlHelper.parse(url).host!;
		this.attributionUserId = uuidv4();
		this.anonymousId = uuidv4();
		this.width = Math.floor(randomBetween(1280,1920));
		this.height = Math.floor(randomBetween(600,900));
		this.responseId = this.setSessionId();
		this.s = got.extend({
			headers:{
				'Host': urlHelper.parse(url).host!,
				'cache-control': 'max-age=0',
				'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
				'sec-ch-ua-mobile': '?0',
				'upgrade-insecure-requests': '1',
				// TODO: randomize user agent
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
				'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'sec-fetch-site': 'none',
				'sec-fetch-mode': 'navigate',
				'sec-fetch-user': '?1',
				'sec-fetch-dest': 'document',
				'accept-language': 'en',
			}
		});
    }

	parseUrl(){
		const pathname = urlHelper.parse(this.url).pathname;
		return pathname?.replace("/to/","");
	}

    setSessionId(){
		const xo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let t = "";
		for (let n = 0; n < 12; n++){
			t += xo.substr(Math.floor(Math.random() * xo.length-1),1);
		}
		return t;
	}

    getHex(e: number, f: boolean = false){
        let xo, t = "";
		if (f === true){
			xo = "abcdef0123456789";
		}else{
			xo = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		}
		for (let n = 0; n < e; n++){
			t += xo.substr(Math.floor(Math.random() * xo.length-1),1);
		}
		return t;
	}

	getTimezoneOffset(d: Date, tz: string) {
		const a = d.toLocaleString("ja", {timeZone: tz}).split(/[/\s:]/);
		let b = a.map(i=>Number(i))
		b[1]--;
		// @ts-ignore
		const t1 = Date.UTC.apply(null, b);
		const t2 = new Date(d).setMilliseconds(0);
		return (t2 - t1) / 60 / 1000;
	}

	getCountryCode(country: string){
		return countries.find(c => c.countryNameEn.toLowerCase() === country.toLowerCase() || c.countryNameLocal.toLowerCase() === country.toLowerCase())?.countryCallingCode;
	}

	async scrapeInfos(){
		const url = this.host + `/to/${this.formId}`;
		try {
			const r = await this.s.get(url);
			try {
				const $ = cheerio.load(r.body);
				let script: cheerio.Cheerio | undefined;
				$("script").map((i, el) => {
					if($(el).html()?.includes("hide_navigation")){
						script = $(el);
					}
				});
				if(!script && !script!.html()) throw new Error("Canno't find the script rendering data when scraping data of: "+url);
				this.scrapedAt = Date.now();
				// Form infos
				let regex = /form: (.*),/m;
				const formJS: Form = JSON.parse(regex.exec(script!.html()!)![1]);
				if(!formJS.title || !formJS.fields) throw new Error("Canno't detect 'title' or 'fields' from form");
				this.title = formJS.title;
				this.fields = formJS.fields;
				this.thankyouScreens = formJS.thankyou_screens;
				// Tracking infos
				regex = /trackingInfo: (.*),/m;
				const trackInfosJS: TrackInfos = JSON.parse(regex.exec(script!.html()!)![1]);
				if(!trackInfosJS.userId || !trackInfosJS.segmentKey) throw new Error("Canno't detect 'trackingInfo' from form");
				this.userId = trackInfosJS.userId;
				this.segmentKey = trackInfosJS.segmentKey;
				this.accountId = trackInfosJS.accountId;
				// Feature flags
				// TODO:
				// featureFlags: {"ENG-25-closed-screen":"variant_copy_and_typeform","ENG-40-use-phoenix-admin":true,"RESP-21-TY-SCREEN-CTA":"variant","RESP-3-show-continue-submit-button-on-optional-questions":true,"RESP-30-CSP-LEVEL2":false,"RESP-41-AB-TEST-MULTIPLE-CHOICE":"variant","RESP-87-fetch-ml-intents-api":"variant","RESP-94-mobile-footer-abc-test":true,"SB-4310-enter-to-submit-test":"out_of_experiment","SB-4523-brand-logo":false,"always-inject-new-relic":false,"beta-testers":false,"dist-94-subdomain-redirect-warning-page":1,"res-906-enable-insights-tracking":true,"sb-4351-viral-experiment":true},
				// Intents
				// intents: [{"id":"0bdRf14WG7rr","intent":"USER_LAST_NAME","score":0.9842884600486369},{"id":"ZjkjjBSxeeVv","intent":"USER_INFO_SOCIAL","score":0.8136842769120812},{"id":"29WVHQQWuxnZ","intent":"USER_INFO_SOCIAL","score":0.8136842769120812},{"id":"YFPZtvTBqiQ7","intent":"USER_EMAIL","score":0.9982722395506244},{"id":"GYt4YKQSWp9n","intent":"LOCATION_COUNTRY","score":0.9864278359075521}]
				regex = /intents: (.*)/m;
				const intentsJS: Intent[] = JSON.parse(regex.exec(script!.html()!)![1]);
				console.log(`Intents:`)
				console.log(intentsJS);
				if(!intentsJS || intentsJS.length === 0){
					console.log(1);
					this.intents = [];
				} //throw new Error("Canno't detect 'id' or 'intent' from form");
				else if(!intentsJS[0].id || !intentsJS[0].intent){
					console.log(2);
					this.intents = [];
				}else{
					console.log(3);
					this.intents = intentsJS;
				}
				
			} catch (error) {
				console.error(error);
				throw new Error("Can't parse JSON: "+error.message);
			}
		} catch (error) {
			console.error(error);
			throw new Error("Error while scraping informations: "+error.message);
		}
	}

	async startSubmission(){
		const url = this.host + `/forms/${this.formId}/start-submission`;
		try {
			const r = await this.s.post(url, { headers: { "accept": "application/json" }});
			try {
				const js: StartSubmit = JSON.parse(r.body);
				this.landingToken = js.signature;
				this.landedAt = js.submission.landed_at;
				this.userAgent = js.submission.metadata.user_agent;
			} catch (error) {
				console.error(error);
				throw new Error("Can't parse JSON: "+error.message);
			}
		} catch (error) {
			console.error(error);
			throw new Error("Error while starting submission: "+error.message);
		}
	}

    /**
	 * @param $segment: "track" || "identify"
	 * @param $event: "present_conversation" || "start_conversation" || "identify"
	 * @param $variant
	 * @param $block
	 * @param $traits
	 * @return string
	 * @throws \Exception
	 */
    createSegment(props: SegmentProps){
		if(!this.formId) throw new Error("Canno't create a segment, form id not defined.")
		if(!this.title) throw new Error("Canno't create a segment, title not defined.")
		if(!this.host) throw new Error("Canno't create a segment, host not defined.")
		if(!this.userAgent) throw new Error("Canno't create a segment, userAgent not defined.")
        const message_id = this.getHex(32, true).toLowerCase();
		const date = new Date();
		let data = "";
		data += "{"
		data += `"timestamp": "${date.toISOString()}",`;
		data += '"integrations": {';
		switch (props.event) {
			case "present_conversation":
			case "start_conversation":
				data += '"All": false,';
				data += '"Iterable": true,';
				data += '"Natero": true';
				break;
			default:
				data += '"All": false,';
				data += '"Iterable": false,';
				if(props.event !== "block_answered"){
					data += '"Natero": false';
				}
				break;
		}
		data += '},';
		data += '"context": {';
		data += '"ip": "0.0.0.0",';
		data += '"page": {';
		data += `"path": "/to/${this.formId}",`;
		data += '"referrer": "",';
		data += '"search": "",';
		data += `"title": "${this.title}",`;
		data += `"url": "${this.host}/to/${this.formId}"`;
		data += '},';
		data += `"userAgent": "${this.userAgent}"`;
		data += '"locale": "en",';
		data += '"library": {';
		data += '"name": "analytics.js",';
		data += '"version": "4.0.4"';
		if(props.segment === "track"){
			if(!this.attributionUserId) throw new Error("Canno't create a track segment, attributionUserId not defined.") 
			if(!props.event) throw new Error("Canno't create a track segment, event type not defined.") 
			data += '"properties": {';
			data += `"event": "${props.event}",`;
			data += `"attribution_user_id": "${this.attributionUserId}",`;
			switch (props.event) {
				case "ab_test_renderer":
					/*
					Noir foncé
					"test_id": "RESP-21-TY-SCREEN-CTA",
					"variant_label": "3_curious_discover", 
					*/
					if(props.variant){
						data += `"test_id": "${props.variant.testId}",`;
						if(props.variant.label === false) data += `"variant_label": false,`;
						else data += `"variant_label": "${props.variant.label}",`;
						if(props.variant.label !== "3_curious_discover"){
							data += `"variant_id": "${props.variant.id}",`;
						}
					}else{
						data += `"test_id": "always-inject-new-relic",`;
						data += `"variant_label": false,`;
					}
					break;
				case "present_conversation":
				case "start_conversation":
				case "block_focused":
				case "submit_button_shown":
				case "conversation_submitted":
				case "block_answered":
					if(!this.accountId) throw new Error("Canno't create a track segment event, accountId not defined.")
					data += `"account_id": ${this.accountId},`;
					data += `"ws_owner_account_id": ${this.accountId},`;
					switch (props.event) {
						case "present_conversation":
						case "start_conversation":
						case "conversation_submitted":
							switch (props.event) {
								case "present_conversation":
									data += '"natero_feature_name": "present_conversation_standard",';
									break;
								case "start_conversation":
									if(!this.width) throw new Error("Canno't create a track segment event, width not defined.")
									data += '"natero_feature_name": "start_conversation",';
									data += '"is_first_conversation": true,';
									data += `"width": ${this.width},`;
									data += `"height": ${this.height},`;
									break;
								case "conversation_submitted":
									data += '"natero_feature_name": "conversation_submitted",';
									data += '"is_first_conversation": false,';
									data += `"time_to_submit": ${randomBetween(2000,4000)},`;
									break;
								default:
									break;
							}
							data += `"navigation_type": "${["click_answer", "keyboard_answer"][Math.floor(Math.random() * 2)]}",`;
							data += '"distribution_channel": "standard",';
							data += '"respondent_method": "web_renderer",';
							data += '"headers_displayed": true,';
							data += '"footers_displayed": true,';
							data += '"transparency": 0,';
							data += '"platform": "desktop",';
							data += `"prefilled_data": false,`
							data += '"visit_number": 1,';
							data += '"visit_number_current_cycle": 1,';
							data += this.embeddingMode ? `"embedding_mode": "${this.embeddingMode}",` : '"embedding_mode": null,';
							if(props.event != "conversation_submitted") data += '"renderer_version": "louvre",';

							if(!this.timezone) throw new Error("Canno't create a track segment event, timezone not defined.")
							data += `"local_time_offset": ${this.getTimezoneOffset(new Date(), this.timezone)},`;
							data += `"local_timezone": "${this.timezone}",`;
							break;

						case "block_focused":
						case "block_answered":
							if(!props.block) throw new Error("Canno't create a track segment event, block not defined.")
							if(!this.landingToken) throw new Error("Canno't create a track segment event, landingToken not defined.")
							if(!this.scrapedAt) throw new Error("Canno't create a track segment event, scrapedAt not defined.")
							data += `"block_index": ${props.block.index},`;
							data += `"block_ref": ${props.block.ref},`;
							data += `"block_type": ${props.block.type},`;
							data += `"layout_type": "wallpaper",`
							data += `"attachment_type": null,`
							data += props.block.required ? `"question_required": true,` : `"question_required": false,`;
							data += `"question_intent": ${props.block.questionIntent ? `"${props.block.questionIntent}"` : `null`},`;
							data += `"landing_token": "${this.landingToken}",`
							data += `"time_since_page_load": ${Date.now() - this.scrapedAt},`
							data += `"response_id": ${this.responseId},`
							if(props.event === "block_focused"){
								data += `"prefilled_block": ${props.block.prefilled ? "true" : "false"},`
								data += `"response_prefilled": ${props.block.prefilled ? `"partial_response"` : "null"},`
							}
							if(props.event === "block_answered"){
								data += `"changed_prefilled_value": ${props.block.prefilled ? "true" : "false"},`;
								data += `"response_filled": ${props.block.prefilled ? `"partial_response"` : "null"},`
								data += `"answered": true,`;
							}
							break;
						case "submit_button_shown":
							if(!props.block) throw new Error("Canno't create a track segment event, block not defined.")
							data += `"block_type": ${props.block.type},`;
							data += `"block_ref": ${props.block.ref},`;
						default:
							break;
					}
					
					break;
				default:
					break;
			}
			data += `"form_uid": "${this.formId}",`;
			data += `"typeform_view_id": "${this.typeformViewId}",`;
			data += `"userId": ${this.userId}`;
			data += '},';
		}
		if(props.segment === "identify" && props.traits){
			data += '"traits": {';
			data += `"accountid": ${this.accountId},`;
			data += '},';
		}
		if(props.segment === "track") data += `"event": "${props.event}",`;
		data += `"messageId": "ajs-${message_id}",`; // only contains first letters of alphabet "abcdef" and 0123456789
		data += `"anonymousId": "${this.anonymousId}",`;
		data += `"type": "${props.segment}",`;
		data += `"writeKey": "${this.segmentKey}",`;
		data += `"userId": ${this.userId},`;
		data += `"sentAt": "${date.toISOString()}",`;
		data += `"_metadata": {`;
		data += `"bundled": ["Segment.io"],`;
		data += `"unbundled": ["Amplitude"]`;
		data += '}';
		data += '}';
		return data;
    }

	async imitateInsights(){
		//let count = 0;
		let blockIndex = 0;
		let wait = 0;
		let previousBlock = this.fields![0];
		//let previousIntent = "";
		// Init: ab_test_renderer
		if(this.host === "https://stress95.typeform.com"){
			await this.createEvent({ event: "ab_test_renderer", variants: [{testId: "ENG-25-closed-screen", label: "variant_copy_and_logo"}] });
		}else{
			await this.createEvent({ event: "ab_test_renderer", variants: [{testId: "ENG-25-closed-screen", label: "variant_copy_and_typeform"} ] });
		}
		//! Init: ab_test_renderer
		wait = randomBetween(2000,2500);
		this.timer += wait;
		console.log(`Sleeping ${wait}ms before sending other ab_test_renderer events...`);
		await sleep(wait);

		// Init: sending initialization events
		const initstamp = Date.now();
		switch (this.host) {
			case "https://form.typeform.com":
			case "https://stress95.typeform.com": {
				let _t = [];
				_t.push({testId: "RESP-21-TY-SCREEN-CTA", label: "control"});
				_t.push({testId: "RESP-3-show-continue-submit-button-on-optional-questions", label: "optional_last_question"});
				_t.push({testId: "RESP-41-AB-TEST-MULTIPLE-CHOICE", label: "control"});
				if(this.host === "https://stress95.typeform.com"){
					_t.push({testId: "RESP-87-fetch-ml-intents-api", label: "control"});
				}else{
					_t.push({testId: "RESP-87-fetch-ml-intents-api", label: "variant"});
				}
				if(this.host === "https://stress95.typeform.com"){
					_t.push({testId: "RESP-94-mobile-footer-abc-test", label: "variant_2_bottom_bar_switch"});
				}else{
					_t.push({testId: "RESP-94-mobile-footer-abc-test", label: "variant_3_top_bar_split_navigation"});
				}
				_t.push({testId: "SB-4523-brand-logo", label: false});
				await this.createEvent({ event: "ab_test_renderer", variants: _t })
				break;
			}
			default:
				let _v = [];
				_v.push({testId: "RESP-21-TY-SCREEN-CTA", label: "control"});
				_v.push({testId: "RESP-3-show-continue-submit-button-on-optional-questions", label: "optional_last_question"});
				_v.push({testId: "RESP-41-AB-TEST-MULTIPLE-CHOICE", label: "control"});
				_v.push({testId: "RESP-87-fetch-ml-intents-api", label: "variant"});
				_v.push({testId: "RESP-94-mobile-footer-abc-test", label: "variant_3_top_bar_split_navigation"});
				_v.push({testId: "SB-4523-brand-logo", label: false});
				await this.createEvent({ event: "ab_test_renderer", variants: _v })
				break;
		}
		console.log(`Took ${Date.now() - initstamp}ms to initialize`)
		const mData = {"series":[{"type":"Counter","metric":"analytics_js.invoke","value":1,"tags":{"method":"track"}}]};
		await Promise.all([
			new Promise(async (resolve, reject) => {
				await this.sendSegment("m", JSON.stringify(mData));
				resolve(1);
			}),
			new Promise(async (resolve, reject) => {
				await sleep(200);
				await this.insightEvent({ fieldId: "WelcomeScreenID", type: "view-form-open" });
				resolve(1);
			}),
			//! Init: sending initialization events
			// Sending submission
			new Promise(async (resolve, reject) => {
				await sleep(400);
				await this.startSubmission();
				resolve(1);
			})
		]);
		//! Sending submission
		if(!this.fields) throw new Error("Error while imitating insights. Fields are empty.");
		// Sending events for blocks
		const lastField = this.fields[this.fields.length - 1];
		const blockstamp = Date.now();
		for(const block of this.fields){
			if(blockIndex === 0){
				await Promise.all([
					new Promise(async (resolve, reject) => {
						console.log(`Block index == 0. Sending a WelcomeScreenID event and starting the conversation...`);
						await this.insightEvent({ fieldId: block.id, previousFieldId: "WelcomeScreenID", type: "see" });
						console.log(`Sent WelcomeScreenID event`);
						resolve(1);
					}),
					new Promise(async (resolve, reject) => {
						await sleep(randomBetween(100,200));
						await this.createEvent({ event: "start_conversation" });
						resolve(1);
					}),
					new Promise(async (resolve, reject) => {
						wait = randomBetween(1000,1500);
						this.timer += wait;
						console.log(`Sleeping ${wait}ms before sending block focused first event... Total wait time ${this.timer}ms and time from stamp: ${Date.now() - blockstamp}ms`);
						await sleep(wait);
						console.log(`Sending block focused event. Block n°${blockIndex} of type ${block.type}, required: ${block.validations ? block.validations.required : false} with previous intent: ${this.intents && this.intents.length !== 0 ? this.intents[blockIndex].intent : undefined}.`);
						await this.createEvent({ 
							event: "block_focused", 
							block: { 
								ref: block.ref, index: blockIndex, 
								prefilled: false, type: block.type, required: block.validations ? block.validations.required : false,
								questionIntent: this.intents && this.intents.length !== 0 ? this.intents[blockIndex].intent : undefined 
							} 
						});
						resolve(1);
					})
				]);
			}else{
				await Promise.all([
					new Promise( async (resolve, reject) => {
						console.log(`Sending insight see event of field ${blockIndex}, id: ${block.id}, previous block id: ${previousBlock.id}`);
						await this.insightEvent({ fieldId: block.id, previousFieldId: previousBlock.id, type: "see" });
						resolve(1);
					}),
					new Promise( async (resolve, reject) => {
						await sleep(200);
						console.log(`Sending block answered event. Block n°${blockIndex-1} of type ${previousBlock.type}, required: ${previousBlock.validations ? previousBlock.validations.required : false} with previous intent: ${this.intents && this.intents.length !== 0 ? this.intents[blockIndex-1].intent : undefined}.`);
						await this.createEvent({ 
							event: "block_answered", 
							block: { 
								ref: previousBlock.ref, type: previousBlock.type, index: blockIndex-1, 
								questionIntent: this.intents && this.intents.length !== 0 ? this.intents[blockIndex-1].intent : undefined, 
								prefilled: false, required: block.validations ? block.validations.required : false
							} 
						});
						resolve(1);
					}),
					new Promise( async (resolve, reject) => {
						wait = randomBetween(2000,2500); //(2000,2500); Reduced because of functions timeout
						this.timer += wait;
						console.log(`Sleeping ${wait}ms before sending block focused event... Total wait time ${this.timer}ms and time from stamp: ${Date.now() - blockstamp}ms`);
						await sleep(wait);
						console.log(`Sending block focused event. Block n°${blockIndex} of type ${block.type}, required: ${block.validations ? block.validations.required : false} with previous intent: ${this.intents && this.intents.length !== 0 ? this.intents[blockIndex].intent : undefined}.`);
						await this.createEvent({ 
							event: "block_focused", 
							block: { 
								ref: block.ref, index: blockIndex, 
								prefilled: false, type: block.type, required: block.validations ? block.validations.required : false,
								questionIntent: this.intents && this.intents.length !== 0 ? this.intents[blockIndex].intent : undefined 
							} 
						});
						resolve(1);
					})
				]);
			}
			//previousIntent = this.intents ? this.intents[blockIndex].intent : "";
			blockIndex++;
			previousBlock = block;
			// After each block events, sleep to emulate user input
			wait = randomBetween(0,100); //(3000,5000); Reduced because of functions timeout
			this.timer += wait;
			console.log(`Sleeping ${wait}ms before sending other block events... Total wait time ${this.timer}ms and time from stamp: ${Date.now() - blockstamp}ms`);
			await sleep(wait);
		}
		//! Sending events for blocks
		console.log(`Blocks faking ended`)
		console.log(`Sending submit button shown`);
		await this.createEvent({ 
			event: "submit_button_shown", 
			block: { 
				ref: lastField.ref, type: lastField.type,
			} 
		});
	}

	async createEvent(props: EventProps){
		const { variants, event, block } = props;
		this.anonymousId = uuidv4();
		let s = this.createSegment({segment: "identify", traits: true});
		await this.sendSegment("i", s);
		if(variants){
			// Promise.all with slight delay quicker than looping through the array
			await Promise.all(variants.map( async (variant, index) => {
				return new Promise(async(resolve, reject) => {
					await sleep(index*50);
					let _s = this.createSegment({segment: "track", variant, event});
					console.log(`Sending segment n°${index}...`);
					await this.sendSegment("t", _s);
					console.log(`Sent segment n°${index}`);
					resolve(1);
				})
			}));
		}
		if(block){
			s = this.createSegment({segment: "track", block, event})
			await this.sendSegment("t", s);
		}
		this.anonymousId = uuidv4();
		s = this.createSegment({segment: "identify"});
		await this.sendSegment("i", s);
	}

	async sendSegment(type: "i" | "t" | "m", data: string){
		let headers = {
			'authority': 'api.segment.io',
			'content-type': 'text/plain',
			'accept': '*/*',
			'origin': this.host,
			'referer': this.url,
			'sec-fetch-site': 'cross-site',
			'sec-fetch-mode': 'cors',
			'sec-fetch-dest': 'empty',
			'Host': undefined
		}
		const url = `https://api.segment.io/v1/${type}`;
		try {
			const r = await this.s.post(url, { headers, body: data });
			if(r.statusCode !== 200){
				console.error(`Code not 200: ${r.statusCode} while posting segment`);
				throw new Error(`Code not 200: ${r.statusCode} while posting segment`);
			}
		} catch (error) {
			console.error(`https://api.segment.io/v1/${type}`);
			console.error(data);
			console.error(error);
			throw new Error("Error while sending segment: "+error.message);
		}
	}

	async insightEvent(props: InsightEventProps){
		let url = "";
		switch (props.type) {
			case "see":
				url = `${this.host}/forms/${this.formId}/insights/events/see`;
				break;
			case "view-form-open":
				url = `${this.host}/forms/${this.formId}/insights/events/view-form-open`;
				break;
			default:
				url = `${this.host}/forms/${this.formId}/insights/events/see`;
				break;
		}
		
		let headers = {
			'authority': urlHelper.parse(this.url).hostname!,
			'content-type': 'application/x-www-form-urlencoded',
			'sec-fetch-site': 'same-origin',
		}
		let data: any = {
			'form_id': this.formId,
			'field_id': props.fieldId,
			'response_id': this.responseId,
			'version': '1'
		}
		if(props.type === "view-form-open"){
			data["user_agent"] = this.userAgent;
		}else{
			data["previous_seen_field_id"] = props.previousFieldId;
		}
		try {
			// @ts-ignore
			const body = new URLSearchParams(data).toString()
			const r = await this.s.post(url, { headers, body });
			if(r.statusCode !== 200){
				console.error(`Code not 200: ${r.statusCode} while posting seeEvent`);
				throw new Error(`Code not 200: ${r.statusCode} while posting seeEvent`);
			}
		} catch (error) {
			console.error(url);
			console.error(data);
			console.error(error);
			throw new Error("Error while starting submission: "+error.message);
		}
	}

	async submit(size: string, profile: Profile, captcha?: string){
		const url = `${this.host}/forms/${this.formId}/complete-submission`;
		let headers = {
			'content-type': 'application/json; charset=UTF-8',
			'referer': this.url
		}
		const requiredFields = this.fields!.filter(field => {
			if(field.validations ? field.validations.required : false) return true;
			// Some websites will leave some fields unrequired when actually asking for them, probably to trick bots.
			const requiresInstagram = ["https://stress95.typeform.com", "https://panameio.typeform.com"];
			if(field.title.match(/(?:ig username|IG username|instagram|Instagram)/mi) && requiresInstagram.includes(this.host!)){
				return true;
			}else{
				return false;
			}
		});
		console.log(`Filling required fields`);
		const answers = requiredFields.map(field => { 
			let answer: any =  {
				field: {
					id: field.id,
					type: field.type
				}
			}
			switch (field.type) {
				case "dropdown":
				case "short_text":
					answer.type = "text";
					if(field.title.match(/(?:first name|firstname|^name$|given name|forename|prénom|prenom)/mi)){
						answer.text = profile.fname;
					}else if(field.title.match(/(?:last name|lastname|surname|patronymic|family name|familyname|nom de famille)/mi)){
						answer.text = profile.lname;
					}else if(field.title.match(/(?:ADDRESS|Shipping Address|adress|Address Line 1|adresse)/mi) && !field.title.match(/(?:email)/mi)){
						if(field.title.match(/(?:ADDRESS2|Shipping Address 2|adress2|Address Line 2)/mi) && profile.address2){
							answer.text = profile.address2;
							break;
						}
						answer.text = (profile.housenumber ? profile.housenumber + " " : "") + profile.address;
					}else if(field.title.match(/(?:postal code|ZIP CODE|zip|postalcode|postcode|zipcode|code postal)/mi)){
						answer.text = profile.zip;
					}else if(field.title.match(/(?:city|town|municipality|ville)/mi)){
						answer.text = profile.city;
					}else if(field.title.match(/(?:country|pays|nation)/mi)){
						if(field.type === "dropdown"){
							const country = field.properties.choices!.find(c => c.label.toLowerCase() === profile.country!.toLowerCase());
							if(country){
								answer.text = country.label;	
							}else{
								throw new Error(`Canno't find the country given by the user: ${profile.country}, inside the choices available for this form (${field.properties.choices!.map(c => c.label).toString()})`);
							}
						}else{
							answer.text = profile.country;
						}
					}else if(field.title.match(/(?:size|taille|pointure)/mi)){
						if(field.type === "dropdown"){
							const siz = field.properties.choices!.find(c => c.label.toLowerCase().includes(size.toLowerCase()));
							if(siz && siz.label){
								answer.text = siz.label;	
							}else{
								throw new Error(`Canno't find the size given by the user: ${size}, inside the choices available for this form (${field.properties.choices!.map(c => c.label).toString()})`);
							}
						}else{
							answer.text = size;
						}
					}else if(field.title.match(/(?:captcha)/mi)){
						answer.text = captcha;
					}else if(field.title.match(/(?:newsletter)/mi)){
						answer.text = "No";
					}else if(field.title.match(/(?:complete name|full name|fullname|completename)/mi)){
						answer.text = profile.fname + " " + profile.lname;
					}else if(field.title.match(/(?:ig username|IG username|instagram|Instagram)/mi)){
						answer.text = profile.instagram;
					}else if(field.title.match(/(?:phone number|phone)/mi)){
						answer.text = profile.phone;
					}
					break;
				case "email":
					answer.type = "email";
					answer.email = profile.email;
					break;
				case "number":
					answer.type = "number";
					if(field.title.match(/(?:phone number|phone)/mi)){
						answer.number = parseInt(profile.phone!.replace(/^0/, "").replace(/^\+\d{2}/, "").replace(/^\#/, ""));
					}else{
						answer.number = Math.floor(Math.random() * 10000000);
					}
					break;
				case "phone_number":
					answer.type = "phone_number";
					const countryCode = this.getCountryCode(profile.country!) || "33";
					let regex = `^\\+\\d{${countryCode.length}}`
					const found = profile.phone!.match(regex);
					if(found){ // "+{dial_number}" inside
						answer.phone_number = profile.phone;
						break;
					}else{ // add "+{dial_number}"
						// start with 0 (french numbers)
						if(profile.phone!.match(/^0/)){
							profile.phone = "+" + countryCode + profile.phone!.substr(1);
							answer.phone_number = profile.phone;
							break;
						}
						const firstThree = profile.phone!.substr(0,3);
						// 2-3 first numbers reference to a dial code, then just add +
						if(countries.find(c => c.countryCallingCode === firstThree)){
							answer.phone_number = "+" + profile.phone;
							break;
						}else{
							throw new Error("Canno't parse the phone number. Please input your phone number in an international format, ex: '+1 434 553 0230' or '+33 6 34 43 24 42'")
						}
					}
				case "multiple_choice":
					answer.type = "choices";
					if(field.title.match(/(?:language|langage|tongue)/mi)){
						answer.choice = [{ id: field.properties.choices![0].id, label: field.properties.choices![0].label }]
						break;
					}else if(field.title.match(/(?:size|taille|pointure)/mi)){
						const siz = field.properties.choices!.find(c => c.label.toLowerCase().includes(size.toLowerCase()));
						if(siz && siz.label && siz.id){
							answer.choices = [{label: siz.label, id: siz.id}];	
						}else{
							throw new Error(`Canno't find the size given by the user: ${size}, inside the choices available for this form (${field.properties.choices!.map(c => c.label).toString()})`);
						}
					}else if(field.title.match(/(?:country|pays|nation)/mi)){
						let country = field.properties.choices!.find(choice => choice.label.toLowerCase().trim() === profile.country?.toLowerCase().trim());
						if(country){
							answer.choice = [{ id: country.id, label: country.label }];
						}else{
							country = randomChoice(field.properties.choices!);
							answer.choice = [{ id: country!.id, label: country!.label }];
						}
						break;
					}
					break;
				case "yes_no":
					answer.type = "boolean";
					if(field.title.match(/(?:order)/mi)){
						answer.boolean = false;
					}else{
						answer.boolean = false;
					}
					break;
				case "legal":
					answer.type = "boolean";
					if(field.title.match(/(?:accept)/mi)){
						answer.boolean = true;
					}else if(field.title.match(/(?:consent|Consent)/mi)){
						answer.boolean = false;
					}else if(field.title.match(/(?:paypal|invoice)/mi)){
						answer.boolean = true;
					}
					break;
				default:
					break;
			}
			return answer;
		})
		const data = {
			answers,
			form_id: this.formId,
			landed_at: this.landedAt,
			signature: this.landingToken
		}
		try {
			console.log(`Submitting...`)
			const r = await this.s.post(url, { headers, body: JSON.stringify(data) });
			if(r.statusCode !== 200){
				console.error(`Code not 200: ${r.statusCode} while posting completing`);
				throw new Error(`Code not 200: ${r.statusCode} while posting completing`);
			}
			console.log(r.body);
			const js = JSON.parse(r.body);
			if(js.type === "completed"){
				await this.insightEvent({ fieldId: "EndingID", previousFieldId: this.fields![this.fields!.length - 1].id, type: "see" })
				await this.createEvent({ event: "conversation_submitted" })
				return {
                    finalStatusCode: r.statusCode, 
                    responseText: r.statusCode === 200 ? this.thankyouScreens![0].title : "Error: "+r.body
                };
			}else{
				return {
                    finalStatusCode: r.statusCode, 
                    responseText: r.statusCode === 200 ? r.body : "Error: "+r.body,
                    error: {message: `Captured response ${r.statusCode}. Error: ${r.body}`, originalError: r.body}
                };
			}
			
		} catch (error) {
			console.error(url);
			console.error(data);
			console.error(error);
			if(error.response){
				console.error(error.response.body);
			}
			throw new Error("Error while completing submission: "+error.message);
		}
	}
}

export { Typeform }