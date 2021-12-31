import React from "react";
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class BoxAnnotator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hitCloseButton: false,
            status: "Free",
            coordinates: {
                x: 0,
                y: 0
            },
            offset: {
                x: 0,
                y: 0
            },
            entries: [],
            palette: [[0, 255, 0], [0, 255, 255], [252, 102, 255], [255, 165, 0], [255, 255, 0], [138, 43, 226]]
        }

        this.getImages = this.getImages.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.rectangle = this.rectangle.bind(this);
        this.refresh = this.refresh.bind(this);
        this.start = this.start.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.finish = this.finish.bind(this);
        this.resetSelectorAndGetData = this.resetSelectorAndGetData.bind(this);
        this.addEntry = this.addEntry.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.closeButtonMouseDown = this.closeButtonMouseDown.bind(this);
        this.closeButtonClick = this.closeButtonClick.bind(this);
    }

    componentDidUpdate() {
        this.getImages(this.props.img_data.image_to_annotate);
        if (this.props.isSubmit) {
            this.setState({
                entries: []
            }, () => (this.props.submittedCallback()))
        }
        if (this.props.isReset) {
            this.setState({
                entries: []
            }, () => (this.props.resetCallback()))
        }
    }

    getImages(url) {
        var ratio;
        var task_image = new Image();
        task_image.src = url;
        ratio = (task_image.height / task_image.width) * 100;
        task_image.onload = function () {
            $(".image-frame").css({
                "background-image": "url('" + task_image.src + "')",
                "padding-bottom": ratio + "%"
            });
        }
    }

    onMouseDown(e) {
        if (!this.state.hitCloseButton) {
            switch (this.state.status) {
                case "Free":
                    if (e.type === "mousedown") {
                        this.start(e.pageX, e.pageY);
                        this.setState({
                            status: "Hold"
                        });
                    }
            }
        }
    }

    onMouseMove(e) {
        switch (this.state.status) {
            case "Hold":
                var temp_coordinates = this.getCoordinates(e.pageX, e.pageY);
                this.setState({
                    coordinates: temp_coordinates
                }, () => (this.refresh()))
        }
    }

    onMouseUp(e) {
        switch (this.state.status) {
            case "Hold":
                this.setState({
                    status: "Free"
                }, () => (this.finish()));
        }

    }

    start(pageX, pageY) {
        var label_index = this.props.img_data.image_labels.indexOf(this.props.radioValue);
        if (label_index !== -1) {
            $(".box-selector").css({
                "border": "2px dotted rgb(" + this.state.palette[label_index][0] + "," + this.state.palette[label_index][1] + "," + this.state.palette[label_index][2] + ")"
            });
        }
        var temp_coordinates = this.getCoordinates(pageX, pageY);
        this.setState({
            coordinates: temp_coordinates,
            offset: temp_coordinates
        }, () => (this.refresh()))
        $(".box-selector").show();
    }

    finish() {
        var data;
        switch (this.state.status) {
            case "Free":
                data = this.resetSelectorAndGetData();
                this.addEntry(data);
        }
    }

    resetSelectorAndGetData() {
        var data, label_index;
        $(".box-selector").hide();
        data = this.rectangle();
        data.label = this.props.radioValue
        label_index = this.props.img_data.image_labels.indexOf(this.props.radioValue);
        if (label_index !== -1) {
            data.color = this.state.palette[label_index];
        }
        else {
            data.color = [0, 255, 0];
        }

        return data;
    }


    refresh() {
        var rect;
        rect = this.rectangle();
        $(".box-selector").css({
            left: (rect.left - 2) + 'px',
            top: (rect.top - 2) + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px'
        });
    }

    getCoordinates(pageX, pageY) {
        var coordinates = {
            x: Math.min(Math.max(Math.round(pageX - $(".box-annotator").offset().left), 0), Math.round($(".box-annotator").width() - 1)),
            y: Math.min(Math.max(Math.round(pageY - $(".box-annotator").offset().top), 0), Math.round($(".box-annotator").height() - 1))
        }
        return coordinates

    }

    rectangle() {
        var rect, x1, x2, y1, y2;
        x1 = Math.min(this.state.offset.x, this.state.coordinates.x);
        y1 = Math.min(this.state.offset.y, this.state.coordinates.y);
        x2 = Math.max(this.state.offset.x, this.state.coordinates.x);
        y2 = Math.max(this.state.offset.y, this.state.coordinates.y);
        rect = {
            left: x1,
            top: y1,
            width: x2 - x1 + 2,
            height: y2 - y1 + 2
        };

        return rect;
    }

    onMouseEnter(e) {
        $("div[data-id=" + e.currentTarget.getAttribute("data-id") + "] .close-button").show();
    }


    onMouseLeave(e) {
        $("div[data-id=" + e.currentTarget.getAttribute("data-id") + "] .close-button").hide();
    }


    closeButtonMouseDown(e) {
        this.setState({
            hitCloseButton: true
        });
        e.stopPropagation();
    }


    closeButtonClick(e) {
        var clicked_box = $("div[data-id=" + e.currentTarget.getAttribute("data-parentid") + "]");
        var index = $(".selected-box").index(clicked_box);
        this.setState(function (prevState) {
            prevState.entries.splice(index, 1);
            return {
                entries: prevState.entries,
                hitCloseButton: false
            }
        }, () => (this.props.entryDeletedNotifier(this.state.entries)));
    }


    addEntry(entry) {
        this.setState(function (prevState) {
            var entry_info = {
                top: entry.top,
                left: entry.left,
                width: entry.width,
                height: entry.height,
                label: entry.label,
                color: entry.color
            }
            prevState.entries.push(entry_info);
            return { entries: prevState.entries };
        }, () => (this.props.entryAddedNotifier(this.state.entries)));
    }


    render() {
        return (
            <div className="box-annotator"
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseUp={this.onMouseUp}
            >
                <div className="image-frame">
                    <div className="box-selector" style={{ display: "none" }}></div>
                    {
                        this.state.entries.map((entry, index) => (
                            <div className="selected-box"
                                key={index}
                                data-id={"sb" + index}
                                onMouseOver={this.onMouseEnter}
                                onMouseLeave={this.onMouseLeave}
                                style={{
                                    top: (entry.top - 2) + "px",
                                    left: (entry.left - 2) + "px",
                                    width: entry.width + "px",
                                    height: entry.height + "px",
                                    border: "2px solid rgb(" + entry.color[0] + "," + entry.color[1] + "," + entry.color[2] + ")",
                                    backgroundColor: "rgb(" + entry.color[0] + "," + entry.color[1] + "," + entry.color[2] + ",0.2)",
                                    color: "rgb(" + entry.color[0] + "," + entry.color[1] + "," + entry.color[2] + ")",
                                }}>
                                <div className="label-box">{entry.label}</div>
                                <FontAwesomeIcon
                                    data-id={"cb" + index}
                                    data-parentid={"sb" + index}
                                    className="close-button"
                                    icon={faTimesCircle}
                                    onClick={this.closeButtonClick}
                                    onMouseDown={this.closeButtonMouseDown}
                                />
                            </div>
                        )
                        )
                    }
                </div>
            </div>
        )
    }
}


export default BoxAnnotator;

