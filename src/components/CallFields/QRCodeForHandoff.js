import React from "react";

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
