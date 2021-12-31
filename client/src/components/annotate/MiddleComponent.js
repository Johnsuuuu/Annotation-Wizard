import React from "react";
import BoxAnnotator from "./BoxAnnotator";
import $ from 'jquery';
import Button from '@material-ui/core/Button';

class MiddleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submissionLogs: ""
        }
        this.submitOnClick = this.submitOnClick.bind(this);
        this.resetOnClick = this.resetOnClick.bind(this);
    }

    submitOnClick() {
        var date = new Date();
        $(".box-selector").css({
            "border": "2px dotted rgb(0,255,0)"
        });
        this.setState((prevState) => ({ submissionLogs: prevState.submissionLogs + date + ": Task " + this.props.img_data._id + " was successfully annotated and saved to database.\n" }));
        this.props.submitClick();
    }

    resetOnClick() {
        this.props.resetClick();
    }

    render() {
        return (
            <div id="middle-component">
                <BoxAnnotator
                    img_data={this.props.img_data}
                    radioValue={this.props.radioValue}
                    entryAddedNotifier={this.props.entryAddedNotifier}
                    entryDeletedNotifier={this.props.entryDeletedNotifier}
                    isSubmit={this.props.isSubmit}
                    submittedCallback={this.props.submittedCallback}
                    isReset={this.props.isReset}
                    resetCallback={this.props.resetCallback}
                />
                <Button variant="contained" color="secondary" id="reset-button" onClick={this.resetOnClick}>Reset</Button>
                <Button variant="contained" color="primary" id="submit-button" onClick={this.submitOnClick}>Submit</Button>
                <div className="message-box">
                    <h3><strong>Submission Logs</strong></h3>
                    <textarea id="log-textarea" rows="12" readOnly={true} value={this.state.submissionLogs} />
                </div>
            </div>
        )
    }
}

export default MiddleComponent;
