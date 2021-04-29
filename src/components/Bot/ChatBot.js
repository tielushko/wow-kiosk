import React from "react";
import ReactWebChat, {
    createDirectLine,
    createCognitiveServicesSpeechServicesPonyfillFactory,
} from "botframework-webchat";
import "./ChatBot.css";

// styles applied to the bot component that affect the size of the chat message.
const styles = {
    bubbleMaxWidth: 200,
    bubbleImageHeight: 200,
    botAvatarInitials: "WK",
    userAvatarInitials: "U",
};

// ChatBot componenent rendered on the page.
class ChatBot extends React.Component {
    constructor(props) {
        super(props);

        // directline will contain  the key information for speech capabilities.
        // botPonyFill will ensure that microphone icon appears for input
        this.state = {
            directLine: null,
            botPonyFill: null,
        };
    }

    // upon Mounting of the component, get the access token for directLineSpeech
    componentDidMount() {
        this.fetchToken();
    }

    async fetchToken() {
        // ideally, the access keys would be kept as environment variables.
        const res = await fetch(
            "https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken",
            {
                method: "POST",
                headers: {
                    "Ocp-Apim-Subscription-Key":
                        "687e3cfae6fa46bf8cd8704ccc1ca2cf",
                },
            }
        );
        const token = await res.text();
        console.log(token);
        this.setState(() => ({
            directLine: createDirectLine({
                secret:
                    "2c4h4yYxDwo.49gc1AlYyld06R2RBHZOf3WilzPzqjcXO_KPwID3i5Q",
            }),
            botPonyFill: createCognitiveServicesSpeechServicesPonyfillFactory({
                credentials: {
                    region: "eastus",
                    // authorizationToken: token,
                    subscriptionKey: "687e3cfae6fa46bf8cd8704ccc1ca2cf",
                },
            }),
        }));
    }

    // component only if directLine and PonyFill were initialized.
    render() {
        return this.state.directLine && this.state.botPonyFill ? (
            <ReactWebChat
                // pass the main styles from css, the tokens for DL and PF and the style bot controls.
                className="iframeStyle"
                directLine={this.state.directLine}
                webSpeechPonyfillFactory={this.state.botPonyFill}
                styleOptions={styles}
            />
        ) : (
            <div>Connecting to bot&hellip;</div>
        );
    }
}

export default ChatBot;
