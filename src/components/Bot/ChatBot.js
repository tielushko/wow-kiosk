import React from "react";
import ReactWebChat, {
    createDirectLine,
    createCognitiveServicesSpeechServicesPonyfillFactory,
} from "botframework-webchat";
import "./ChatBot.css";

const styles = {
    bubbleMaxWidth: 200,
    bubbleImageHeight: 200,
    botAvatarInitials: "WK",
    userAvatarInitials: "U",
};

class ChatBot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            directLine: null,
            botPonyFill: null,
        };
    }

    componentDidMount() {
        this.fetchToken();
    }

    async fetchToken() {
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

    render() {
        return this.state.directLine && this.state.botPonyFill ? (
            <ReactWebChat
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
