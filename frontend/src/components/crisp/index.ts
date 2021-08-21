import { useEffect } from "react"

const Crisp = () => {
    useEffect(() => {
        //@ts-ignore
        window.$crisp = [];
        //@ts-ignore
        window.CRISP_WEBSITE_ID = "f4101367-fcf4-4795-8c7d-f8cc9fc9ea9c";

        (function() {
            const d = document;
            const s = d.createElement("script");

            s.src = "https://client.crisp.chat/l.js";
            s.async = true;
            d.getElementsByTagName("head")[0].appendChild(s);
        })();
    }, []);
    return null;
}

export default Crisp;