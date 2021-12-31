import React from "react";
import LeftComponent from "./LeftComponent";
import MiddleComponent from "./MiddleComponent"
import RightComponent from "./RightComponent"
import DefaultPage from "./DefaultPage";
import $ from 'jquery';
import axios from "axios";
import Grid from '@mui/material/Grid';


class MainFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            radioValue: "object",
            isSubmit: false,
            isReset: false,
            entries: [],
            size: "",
            over: false
        };
        this.submitOnClick = this.submitOnClick.bind(this);
        this.getRadioChange = this.getRadioChange.bind(this);
        this.entryAddedNotifier = this.entryAddedNotifier.bind(this);
        this.entryDeletedNotifier = this.entryDeletedNotifier.bind(this);
        this.submittedCallback = this.submittedCallback.bind(this);
        this.resetOnClick = this.resetOnClick.bind(this);
        this.resetCallback = this.resetCallback.bind(this);
        this.getFirstImageSize = this.getFirstImageSize.bind(this);
        this.generateSubmitData = this.generateSubmitData.bind(this);
    }


    componentDidMount() {
        this.setState({
            data: this.props.img_data,
            size: this.getFirstImageSize()
        });
    }

    getFirstImageSize() {
        var task_image = new Image();
        task_image.src = this.props.img_data[0].image_to_annotate;
        return task_image.width + " x " + task_image.height;
    }

    generateSubmitData() {
        var label_list = Array.from($(".entry-label"), e => e.innerText);
        var corner_list = Array.from($(".entry-corner"), e => e.innerText);
        var size_list = Array.from($(".entry-size"), e => e.innerText);
        var entry_list = []
        for (var i = 0; i < label_list.length; i++) {
            var entry = {
                label: label_list[i].split(": ")[1],
                left: parseInt(corner_list[i].split("(")[1].split(',')[0]),
                top: parseInt(corner_list[i].split(", ")[1].split(')')[0]),
                width: parseInt(size_list[i].split(": ")[1].split(" x")[0]),
                height: parseInt(size_list[i].split("x ")[1])
            }
            entry_list.push(entry);
        }
        return entry_list;
    }

    submitOnClick() {
        var entry_data = this.generateSubmitData();
        axios.post('/api/tasks/annotate/submit-annotation', {
            task_id: this.state.data[0].task_id,
            image_id: this.state.data[0].image_id,
            entries: entry_data
        })
            .then((res) => {
                console.log("Annotations submitted.");
            }, (err) => {
                console.log(err);
            });

        console.log(this.state.data.length);
        if (this.state.data.length === 1) {
            this.setState({
                over: true
            });
            axios.post('/api/tasks/annotate/finish-annotation', {
                task_id: this.state.data[0].task_id
            })
                .then((res) => {
                    console.log("Task finished.");
                }, (err) => {
                    console.log(err);
                });

        } else {
            this.setState(function (prevState) {
                prevState.data.shift()
                var task_image = new Image();
                task_image.src = prevState.data[0].image_to_annotate;
                return {
                    data: prevState.data,
                    isSubmit: true,
                    radioValue: "object",
                    entries: [],
                    size: task_image.width + " x " + task_image.height
                }
            });
        }
    }

    submittedCallback() {
        this.setState({
            isSubmit: false
        });
    }

    resetOnClick() {
        this.setState({
            isReset: true,
            entries: []
        });
    }

    resetCallback() {
        this.setState({
            isReset: false
        });
    }


    getRadioChange(radioValue) {
        this.setState({
            radioValue: radioValue
        });
    }

    entryAddedNotifier(entries) {
        this.setState({
            entries: entries
        });
    }

    entryDeletedNotifier(entries) {
        this.setState({
            entries: entries
        });
    }

    render() {
        if (!this.state.over) {
            return (
                <div className="main-frame">
                    <Grid container spacing={1.5}>
                        <Grid item xs={3}>
                            <LeftComponent
                                img_data={this.props.img_data}
                                isSubmit={this.state.isSubmit}
                                submittedCallback={this.submittedCallback}
                                getRadioChange={this.getRadioChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <MiddleComponent
                                img_data={this.props.img_data[0]}
                                radioValue={this.state.radioValue}
                                submitClick={this.submitOnClick}
                                isSubmit={this.state.isSubmit}
                                submittedCallback={this.submittedCallback}
                                resetClick={this.resetOnClick}
                                isReset={this.state.isReset}
                                resetCallback={this.resetCallback}
                                entryAddedNotifier={this.entryAddedNotifier}
                                entryDeletedNotifier={this.entryDeletedNotifier}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <RightComponent
                                img_data={this.props.img_data[0]}
                                entries={this.state.entries}
                                img_size={this.state.size}
                            />
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return (
                <DefaultPage text="You have completed the task 😎" />
            )
        }
    }
}

export default MainFrame;