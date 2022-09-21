// as per https://www.gatsbyjs.com/plugins/gatsby-plugin-google-gtag/
export const fireGtagEvent = (eventType: string, data: object) => {
    // @ts-ignore
    if (window.gtag) {
    // @ts-ignore
        window.gtag("event", eventType, data)
    }
}
