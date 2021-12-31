import React from "react";
import $ from 'jquery';

class RightComponent extends React.Component {
    render() {
        return (
            <div>
                <div className="right-image-info">
                    <h2><strong>Task Info</strong></h2>
                    <p><strong>Instruction: </strong>{this.props.img_data.instruction}</p>
                    <p><strong>Task Id: </strong>{this.props.img_data.image_id}</p>
                    <p><strong>Image Size: </strong>{this.props.img_size}</p>
                    <p><strong>Image Src: </strong><a style={{ "textDecoration": "none", "color": "#11999E" }} href={this.props.img_data.image_to_annotate} target="_blank">Link</a></p>
                </div>
                <div className="right-annotation-info">
                    <h2><strong>Annotations</strong></h2>
                    <div className="annotation-bar">
                        {
                            this.props.entries.map((entry, index) =>
                            (
                                <div className="entry" key={index}>
                                    <p className="line entry-label"><span className="info-bold">Label: </span>{entry.label}</p>
                                    <p className="line entry-corner"><span className="info-bold">Top-Left Corner: </span>{"(" + Math.round((parseInt(this.props.img_size.split(" x ")[0]) / $(".box-annotator").width()) * entry.left) + ", " + Math.round((parseInt(this.props.img_size.split(" x ")[0]) / $(".box-annotator").width()) * entry.top) + ")"}</p>
                                    <p className="line entry-size"><span className="info-bold">Size: </span>{Math.round((parseInt(this.props.img_size.split(" x ")[0]) / $(".box-annotator").width()) * entry.width) + " x " + Math.round((parseInt(this.props.img_size.split(" x ")[0]) / $(".box-annotator").width()) * entry.height)}</p>
                                </div>
                            )
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default RightComponent;

