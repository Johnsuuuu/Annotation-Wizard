import React, { Component } from "react";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
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

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };


  render() {
    const { errors } = this.state;
    return (
      <div>
        <CssBaseline />
        <Container maxWidth="sm">
          <Box sx={{
            mt: 15,
            height: 400,
            backgroundColor: 'white'
          }}>
            <Typography variant="h4"><strong>Login</strong> below</Typography>
            <Box sx={{ mt: 3 }}>
              <Typography color="gray" variant="body">Don't have an account?<Link component={RouterLink} to="/register" underline="none" style={{ marginLeft: "7px" }} >Register</Link></Typography>
            </Box>
            <form noValidate onSubmit={this.onSubmit}>
              <ThemeProvider theme={theme}>
                <TextField
                  onChange={this.onChange}
                  value={this.state.email}
                  error={errors.email || errors.emailnotfound}
                  helperText={errors.email ? errors.email : errors.emailnotfound}
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
                  error={errors.password || errors.passwordincorrect}
                  helperText={errors.password ? errors.password : errors.passwordincorrect}
                  color="primary"
                  sx={{ width: "100%", mt: 5 }}
                  id="password"
                  type="password"
                  label="Password"
                  variant="standard"
                />
                <div>
                  <Button type="submit" size='large' sx={{ mt: 7, px: 6, py: 2 }} variant="contained">Login</Button>
                </div>
              </ThemeProvider>
            </form>


          </Box>
        </Container>
      </div>
    );

  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
