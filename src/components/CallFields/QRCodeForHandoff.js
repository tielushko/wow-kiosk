import React from "react";

// handoff qr code, jus tuses the api to render the QR code with current webpage base url and add /handoff
class QRCodeForHandoff extends React.Component {
    componentDidMount() {}

    render() {
        return (
            <React.Fragment>
                <img
                    src={
                        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                        window.location.origin +
                        "/handoff"
                    }
                    alt=""
                />
            </React.Fragment>
        );
    }
}

export default QRCodeForHandoff;
