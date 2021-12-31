import React from "react";

function DefaultPage(props) {
    return (
        <div id="default-page">
            <div className="default-page-text">
                <h1>{props.text}</h1>
            </div>
        </div>
    )
}

export default DefaultPage;