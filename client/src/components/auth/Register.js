import React, { Component } from "react";
import { Link as RouterLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@material-ui/core/Link';
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
  onSubmit = e => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    this.props.registerUser(newUser, this.props.history);
  };



  render() {
    const { errors } = this.state;
    return (
      <div>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box sx={{
            mt: 8,
            height: 400,
            backgroundColor: 'white'
          }}>
            <Typography variant="h4"><strong>Register</strong> below</Typography>
            <Box sx={{ mt: 3 }}>
              <Typography color="gray" variant="body">Already have an account?<Link component={RouterLink} to="/login" underline="none" style={{ marginLeft: "7px" }} >Login</Link></Typography>
            </Box>
            <form noValidate onSubmit={this.onSubmit}>
              <ThemeProvider theme={theme}>
                <TextField
                  onChange={this.onChange}
                  value={this.state.name}
                  error={errors.name}
                  helperText={errors.name ? errors.name : ""}
                  type="text"
                  color="primary"
                  sx={{ width: "100%", mt: 3 }}
                  id="name"
                  label="Name"
                  variant="standard"
                />
                <TextField
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email}
                  helperText={errors.email ? errors.email : ""}
                  type="email"
                  color="primary"
                  sx={{ width: "100%", mt: 3 }}
                  id="email"
                  label="Email"
                  variant="standard"
                />
                <TextField
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  helperText={errors.password ? errors.password : ""}
                  color="primary"
                  sx={{ width: "100%", mt: 5 }}
                  id="password"
                  type="password"
                  label="Password"
                  variant="standard"
                />
                <TextField
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  helperText={errors.password2 ? errors.password2 : ""}
                  color="primary"
                  sx={{ width: "100%", mt: 5 }}
                  id="password2"
                  type="password"
                  label="Confirm password"
                  variant="standard"
                />
                <div>
                  <Button type="submit" size='large' sx={{ mt: 7, px: 6, py: 2 }} variant="contained">Sign up</Button>
                </div>
              </ThemeProvider>
            </form>


          </Box>
        </Container>
      </div>

    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));