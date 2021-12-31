import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FileDownload from "js-file-download";

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

class PublishedTaskPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            success: false
        }
        this.handleDownloadTaskOnClick = this.handleDownloadTaskOnClick.bind(this);
    }

    componentDidMount() {
        axios.get('/api/tasks/published-tasks/' + this.props.auth.user.id)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        data: res.data,
                        success: true
                    })
                }
            });
    }

    handleDownloadTaskOnClick(index) {
        FileDownload(JSON.stringify(this.state.data[index], null, 2), "Task_Annotation_" + this.state.data[index]._id + ".json");
    }


    render() {
        const { user } = this.props.auth;
        if (this.state.data.length !== 0) {
            return (
                !this.state.success ? "Loading..." : (
                    <Container maxWidth="lg">
                        <Box sx={{ mt: 5, mb: 8 }}>
                            <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
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
                                                <p className="card"><b>{task.instruction}</b></p>
                                                <p className="card" style={{ color: "grey" }}><b>author:</b> {task.author_name}</p>
                                                <p className="card" style={{ color: "grey" }}><b>annotator:</b> {task.annotator_name ? task.annotator_name : "task unassigned"}</p>
                                                <p className="card" style={{ color: "grey" }}><b>task size:</b> {task.images.length}</p>
                                                <p className="card" style={{ color: "grey" }}><b>status:</b> {task.status}</p>
                                            </CardContent>
                                            <CardActions sx={{ pt: 0, pb: 0 }} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <ThemeProvider theme={theme}>
                                                    <IconButton disabled={task.status === "finished" ? false : true} color="primary" onClick={() => this.handleDownloadTaskOnClick(i)}>
                                                        <CloudDownloadIcon fontSize="small" />
                                                    </IconButton>
                                                </ThemeProvider>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Container>
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


PublishedTaskPage.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PublishedTaskPage);