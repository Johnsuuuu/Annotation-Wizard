import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LabelPanel from './LabelPanel';
import UrlPanel from './UrlPanel';
import InstructionPanel from './InstructionPanel';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SendIcon from '@material-ui/icons/Send';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import prettyBytes from 'pretty-bytes';
import CodeMirrorEditorPanel from './CodeMirrorEditorPanel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#11999E',
    },
    secondary: {
      main: '#11999E',
    },
  },
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

class AddTaskPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instruction: '',
      label: [],
      url: [],
      doc: '{}',
      responseTime: '',
      responseStatus: '',
      responseSize: '',
      openInstructionAlert: false,
      openLabelAlert: false,
      openUrlAlert: false,
      postSuccessAlert: false,
    };
    this.submitOnClick = this.submitOnClick.bind(this);
    this.instructionSetCallback = this.instructionSetCallback.bind(this);
    this.labelSetCallback = this.labelSetCallback.bind(this);
    this.urlSetCallback = this.urlSetCallback.bind(this);
    this.setResponse = this.setResponse.bind(this);
    this.setDoc = this.setDoc.bind(this);
    this.instructionAlertOnClose = this.instructionAlertOnClose.bind(this);
    this.labelAlertOnClose = this.labelAlertOnClose.bind(this);
    this.urlAlertOnClose = this.urlAlertOnClose.bind(this);
    this.checkImage = this.checkImage.bind(this);
    this.checkIfValid = this.checkIfValid.bind(this);
    this.postSuccessAlertOnClose = this.postSuccessAlertOnClose.bind(this);
  }

  postSuccessAlertOnClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      postSuccessAlert: false,
    });
  }

  instructionAlertOnClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openInstructionAlert: false,
    });
  }

  labelAlertOnClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openLabelAlert: false,
    });
  }

  urlAlertOnClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      openUrlAlert: false,
    });
  }

  checkImage(path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ path, status: 'ok' });
      img.onerror = () => reject({ path, status: 'error' });
      img.src = path;
    });
  }

  async checkIfValid() {
    let instruction_flag = false;
    let label_flag = false;
    let url_flag = false;

    if (
      this.state.instruction === '' ||
      this.state.instruction === null ||
      this.state.instruction === undefined
    ) {
      instruction_flag = true;
    }

    if (this.state.label.length === 0) {
      label_flag = true;
    } else {
      for (let i = 0; i < this.state.label.length; i++) {
        if (this.state.label[i] === '') {
          label_flag = true;
          break;
        }
      }
    }

    if (this.state.url.length === 0) {
      url_flag = true;
    } else {
      for (let i = 0; i < this.state.url.length; i++) {
        if (this.state.url[i] === '') {
          url_flag = true;
          break;
        } else {
          // eslint-disable-next-line no-loop-func
          await this.checkImage(this.state.url[i])
            .then((status) => {})
            // eslint-disable-next-line no-loop-func
            .catch((err) => {
              url_flag = true;
            });
        }
      }
    }
    return {
      instruction_flag: instruction_flag,
      label_flag: label_flag,
      url_flag: url_flag,
    };
  }

  async submitOnClick() {
    await this.checkIfValid().then((res) => {
      if (res.instruction_flag === true) {
        this.setState({
          openInstructionAlert: true,
        });
      } else if (res.label_flag === true) {
        this.setState({
          openLabelAlert: true,
        });
      } else if (res.url_flag === true) {
        this.setState({
          openUrlAlert: true,
        });
      } else {
        const newTask = {
          instruction: this.state.instruction,
          author_id: this.props.auth.user.id,
          author_name: this.props.auth.user.name,
          annotator_id: '',
          annotator_name: '',
          labels: this.state.label,
          images: this.state.url.map((url) => ({
            url: url,
            status: 'pending',
            annotation: [],
          })),
          status: 'pending',
        };

        axios.interceptors.request.use(
          function (config) {
            config.metadata = { startTime: new Date() };
            return config;
          },
          function (error) {
            return Promise.reject(error);
          },
        );

        axios.interceptors.response.use(
          function (response) {
            response.config.metadata.endTime = new Date();
            response.duration =
              response.config.metadata.endTime -
              response.config.metadata.startTime;
            return response;
          },
          function (error) {
            error.config.metadata.endTime = new Date();
            error.duration =
              error.config.metadata.endTime - error.config.metadata.startTime;
            return Promise.reject(error);
          },
        );

        axios
          .post('/api/tasks/create', newTask)
          .then((res) => {
            this.setResponse(res);
            this.setState({
              postSuccessAlert: true,
            });
          })
          .catch((err) => console.log(err));
      }
    });
  }

  setResponse(res) {
    this.setState({
      doc: JSON.stringify(res.data, null, 2),
      responseStatus: res.status,
      responseTime: res.duration + ' ms',
      responseSize: prettyBytes(
        JSON.stringify(res.data).length + JSON.stringify(res.headers).length,
      ),
    });
  }

  setDoc(doc) {
    this.setState({
      doc: doc,
    });
  }

  instructionSetCallback(instruction_obj) {
    this.setState({
      instruction: instruction_obj.value,
    });
  }

  labelSetCallback(label_obj) {
    const labels = label_obj.map((obj) => obj.value);
    this.setState({
      label: labels,
    });
  }

  urlSetCallback(url_obj) {
    const urls = url_obj.map((obj) => obj.value);
    this.setState({
      url: urls,
    });
  }

  render() {
    return (
      <div>
        <Container maxWidth="md">
          <Box
            sx={{
              mt: 3,
              backgroundColor: 'white',
            }}
          >
            <h3 className="addTaskPage-h">Add your instruction</h3>
            <div className="panel">
              <InstructionPanel
                instructionSetCallback={this.instructionSetCallback}
                title={'instruction'}
              />
            </div>
            <h3 className="addTaskPage-h">Add your labels</h3>
            <div className="panel">
              <LabelPanel
                labelSetCallback={this.labelSetCallback}
                title={'label'}
              />
            </div>
            <h3 className="addTaskPage-h">Add your image urls</h3>
            <div className="panel">
              <UrlPanel urlSetCallback={this.urlSetCallback} title={'url'} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <ThemeProvider theme={theme}>
                <Button
                  sx={{ mt: 2 }}
                  size="large"
                  variant="contained"
                  endIcon={<SendIcon />}
                  color="primary"
                  onClick={this.submitOnClick}
                >
                  POST
                </Button>
                <Snackbar
                  open={this.state.openInstructionAlert}
                  autoHideDuration={2000}
                  onClose={this.instructionAlertOnClose}
                >
                  <Alert
                    onClose={this.instructionAlertOnClose}
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    The instruction field should not be empty!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={this.state.openLabelAlert}
                  autoHideDuration={2000}
                  onClose={this.labelAlertOnClose}
                >
                  <Alert
                    onClose={this.labelAlertOnClose}
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    The label field should not be empty!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={this.state.openUrlAlert}
                  autoHideDuration={2000}
                  onClose={this.urlAlertOnClose}
                >
                  <Alert
                    onClose={this.urlAlertOnClose}
                    severity="error"
                    sx={{ width: '100%' }}
                  >
                    The url fields include invalid url!
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={this.state.postSuccessAlert}
                  autoHideDuration={2000}
                  onClose={this.postSuccessAlertOnClose}
                >
                  <Alert
                    onClose={this.postSuccessAlertOnClose}
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    Successfully submitted!
                  </Alert>
                </Snackbar>
              </ThemeProvider>
            </div>
            <div>
              <h2 className="addTaskPage-h">Response</h2>
              <div style={{ width: '150px', display: 'inline-block' }}>
                <span className="addTaskPage-h">
                  Status: {this.state.responseStatus}
                </span>
              </div>
              <div style={{ width: '150px', display: 'inline-block' }}>
                <span className="addTaskPage-h">
                  Time: {this.state.responseTime}
                </span>
              </div>
              <div style={{ width: '150px', display: 'inline-block' }}>
                <span className="addTaskPage-h">
                  Size: {this.state.responseSize}
                </span>
              </div>
            </div>
            <div className="editor-panel">
              <CodeMirrorEditorPanel
                doc={this.state.doc}
                setDoc={this.setDoc}
                isEditable={false}
              />
            </div>
          </Box>
        </Container>
      </div>
    );
  }
}

AddTaskPage.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AddTaskPage);
