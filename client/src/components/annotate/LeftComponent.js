import React from "react";
import $ from 'jquery';

class LeftComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radioValue: "object"
        };
        this.onChangeRadioValue = this.onChangeRadioValue.bind(this);
        this.getImages = this.getImages.bind(this);
    }

    componentDidUpdate() {
        if (this.props.isSubmit) {
            $(".radio").prop("checked", false);
            this.props.submittedCallback();
        }
    }

    onChangeRadioValue(e) {
        this.setState({
            radioValue: e.target.value
        }, () => (this.props.getRadioChange(this.state.radioValue))
        )
    }

    getImages(url, index) {
        return (<img key={index} className="sidebar-images" src={url} alt="task" />);
    }


    render() {
        return (
            <div>
                <div className="radio-component">
                    <h2><strong>Labels</strong></h2>
                    <div onChange={this.onChangeRadioValue}>
                        {this.props.img_data[0].image_labels.map((label, index) => {
                            return (<div key={index}>
                                <input type="radio" className="radio" value={label} name="task_label" /> {label}
                            </div>);
                        })}
                    </div>
                </div>
                <div className="upcoming-images">
                    <h2 className="sidebar-title"><strong>Up Next</strong></h2>
                    <div className="sidebar">
                        {this.props.img_data.map((data, index) => {
                            return this.getImages(data.image_to_annotate, index)
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default LeftComponent;