import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import LabelPanel from './LabelPanel';
import UrlPanel from './UrlPanel';
import InstructionPanel from './InstructionPanel';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SendIcon from '@material-ui/icons/Send';
import Button from '@mui/material/Button';
import axios from "axios";
import prettyBytes from 'pretty-bytes';
import CodeMirrorEditorPanel from "./CodeMirrorEditorPanel";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#11999E',
        },
        secondary: {
            main: '#11999E',
        }
    }
});


class AddTaskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            instruction: "",
            label: [],
            url: [],
            doc: "{}",
            responseTime: "",
            responseStatus: "",
            responseSize: ""
        }
        this.submitOnClick = this.submitOnClick.bind(this);
        this.instructionSetCallback = this.instructionSetCallback.bind(this);
        this.labelSetCallback = this.labelSetCallback.bind(this);
        this.urlSetCallback = this.urlSetCallback.bind(this);
        this.setResponse = this.setResponse.bind(this);
        this.setDoc = this.setDoc.bind(this);
    };

    submitOnClick() {
        const newTask = {
            instruction: this.state.instruction,
            author_id: this.props.auth.user.id,
            author_name: this.props.auth.user.name,
            annotator_id: "",
            annotator_name: "",
            labels: this.state.label,
            images: this.state.url.map(url => ({ url: url, status: "pending", annotation: [] })),
            status: "pending"
        }

        axios.interceptors.request.use(function (config) {

            config.metadata = { startTime: new Date() }
            return config;
        }, function (error) {
            return Promise.reject(error);
        });

        axios.interceptors.response.use(function (response) {
            response.config.metadata.endTime = new Date()
            response.duration = response.config.metadata.endTime - response.config.metadata.startTime
            return response;
        }, function (error) {
            error.config.metadata.endTime = new Date();
            error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
            return Promise.reject(error);
        });


        axios
            .post("/api/tasks/create", newTask)
            .then(res => this.setResponse(res))
            .catch(err => console.log(err));




    }

    setResponse(res) {
        this.setState({
            doc: JSON.stringify(res.data, null, 2),
            responseStatus: res.status,
            responseTime: res.duration + ' ms',
            responseSize: prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length)
        });
    }

    setDoc(doc) {
        this.setState({
            doc: doc
        });
    }

    instructionSetCallback(instruction_obj) {
        this.setState({
            instruction: instruction_obj.value
        });
    }

    labelSetCallback(label_obj) {
        const labels = label_obj.map(obj => obj.value);
        this.setState({
            label: labels
        });
    }

    urlSetCallback(url_obj) {
        const urls = url_obj.map(obj => obj.value);
        this.setState({
            url: urls
        });

    }


    render() {
        return (
            <div>
                <Container maxWidth="md">
                    <Box sx={{
                        mt: 3,
                        backgroundColor: 'white',
                    }}>
                        <h3 className="addTaskPage-h">Add your instruction</h3>
                        <div className="panel">
                            <InstructionPanel
                                instructionSetCallback={this.instructionSetCallback}
                                title={"instruction"}
                            />
                        </div>
                        <h3 className="addTaskPage-h">Add your labels</h3>
                        <div className="panel">
                            <LabelPanel
                                labelSetCallback={this.labelSetCallback}
                                title={"label"}
                            />
                        </div>
                        <h3 className="addTaskPage-h">Add your image urls</h3>
                        <div className="panel">
                            <UrlPanel
                                urlSetCallback={this.urlSetCallback}
                                title={"url"}
                            />
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <ThemeProvider theme={theme}>
                                <Button sx={{ mt: 2 }}
                                    size="large"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    color="primary"
                                    onClick={this.submitOnClick}>
                                    POST
                                </Button>
                            </ThemeProvider>
                        </div>
                        <div>
                            <h2 className="addTaskPage-h">Response</h2>
                            <div style={{ width: "150px", display: 'inline-block' }}><span className="addTaskPage-h">Status: {this.state.responseStatus}</span></div>
                            <div style={{ width: "150px", display: 'inline-block' }}><span className="addTaskPage-h">Time: {this.state.responseTime}</span></div>
                            <div style={{ width: "150px", display: 'inline-block' }}><span className="addTaskPage-h">Size: {this.state.responseSize}</span></div>
                        </div>
                        <div className="editor-panel">
                            <CodeMirrorEditorPanel
                                doc={this.state.doc}
                                setDoc={this.setDoc}
                                isEditable={false} />
                        </div>
                    </Box>
                </Container>
            </div>

        )
    }
}

AddTaskPage.propTypes = {
    auth: PropTypes.object.isRequired
};


const mapStateToProps = state => ({
    auth: state.auth
});


export default connect(mapStateToProps)(AddTaskPage);