import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DefaultPage from '../annotate/DefaultPage';

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

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      success: false,
      addTaskSuccessAlert: false,
    };
    this.handleAddTaskOnClick = this.handleAddTaskOnClick.bind(this);
    this.deleteTaskAfterTakenTask = this.deleteTaskAfterTakenTask.bind(this);
    this.addTaskSuccessAlertOnClose =
      this.addTaskSuccessAlertOnClose.bind(this);
  }

  componentDidMount() {
    axios.get('/api/tasks/unassigned-tasks').then((res) => {
      if (res.status === 200) {
        this.setState({
          data: res.data,
          success: true,
        });
      }
    });
  }

  addTaskSuccessAlertOnClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      addTaskSuccessAlert: false,
    });
  }

  handleAddTaskOnClick(index) {
    console.log(this.state.data[index]);
    axios
      .patch('/api/tasks/taken-tasks/' + this.state.data[index]._id, {
        annotator_id: this.props.auth.user.id,
        annotator_name: this.props.auth.user.name,
      })
      .then(() => {
        this.deleteTaskAfterTakenTask(index);
      })
      .catch((err) => console.log(err));
    this.setState({
      addTaskSuccessAlert: true,
    });
  }

  deleteTaskAfterTakenTask(index) {
    const list = [...this.state.data];
    list.splice(index, 1);
    this.setState({
      data: list,
    });
  }

  render() {
    const { user } = this.props.auth;
    if (this.state.data.length !== 0) {
      return !this.state.success ? (
        'Loading...'
      ) : (
        <Container maxWidth="lg">
          <Box sx={{ mt: 5, mb: 8 }}>
            <Grid
              container
              rowSpacing={3}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {this.state.data.map((task, i) => (
                <Grid item key={i} xs={6} md={4} lg={4}>
                  <Card sx={{ maxWidth: 600 }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={task.images[0].url}
                      alt="image"
                    />
                    <CardContent sx={{ pt: 1, pb: 0, pl: 3 }}>
                      <p className="card">
                        <b>{task.instruction}</b>
                      </p>
                      <p className="card" style={{ color: 'grey' }}>
                        <b>author:</b> {task.author_name}
                      </p>
                      <p className="card" style={{ color: 'grey' }}>
                        <b>task size:</b> {task.images.length}
                      </p>
                    </CardContent>
                    <CardActions
                      sx={{ pt: 0, pb: 0 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ThemeProvider theme={theme}>
                        <IconButton
                          color="primary"
                          onClick={() => this.handleAddTaskOnClick(i)}
                        >
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      </ThemeProvider>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Snackbar
            open={this.state.addTaskSuccessAlert}
            autoHideDuration={6000}
            onClose={this.addTaskSuccessAlertOnClose}
          >
            <Alert
              onClose={this.addTaskSuccessAlertOnClose}
              severity="success"
              sx={{ width: '100%' }}
            >
              Task successfully taken! Taken tasks in "tasks taken" section.
            </Alert>
          </Snackbar>
        </Container>
      );
    } else {
      return (
        <div>
          <DefaultPage text="No unassigned tasks available for now 😰" />
          <Snackbar
            open={this.state.addTaskSuccessAlert}
            autoHideDuration={6000}
            onClose={this.addTaskSuccessAlertOnClose}
          >
            <Alert
              onClose={this.addTaskSuccessAlertOnClose}
              severity="success"
              sx={{ width: '100%' }}
            >
              Task successfully taken! Taken tasks in "tasks taken" section.
            </Alert>
          </Snackbar>
        </div>
      );
    }
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps)(Dashboard);
