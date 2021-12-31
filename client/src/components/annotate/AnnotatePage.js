import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import MainFrame from "./MainFrame";

class AnnotatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            success: false
        }
    }

    componentDidMount() {
        if (this.props.auth.user.id !== this.props.match.params.userId) {
            this.props.history.push("/login");
        }
        const taskId = this.props.match.params.taskId;
        axios.get('/api/tasks/annotate/' + taskId)
            .then(res => {
                if (res.status === 200) {
                    const instruction = res.data[0].instruction;
                    const labels = res.data[0].labels;
                    const task_id = res.data[0]._id;
                    const img_data = res.data[0].images.map((image) => (
                        {
                            image_id: image._id,
                            task_id: task_id,
                            instruction: instruction,
                            image_to_annotate: image.url,
                            image_labels: labels,
                            annotation: image.annotation,
                            status: image.status,
                        }
                    )).filter((image) => (image.status === "pending"));
                    this.setState({
                        data: img_data,
                        success: true
                    })
                }
            });
    }

    render() {
        if (this.state.data.length !== 0) {
            return (
                !this.state.success ? "Loading..." : (
                    <div>
                        <MainFrame img_data={this.state.data} />
                    </div>
                )
            );
        } else {
            return (
                <div>
                </div>
            )
        }
    }
}


AnnotatePage.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
)(AnnotatePage);