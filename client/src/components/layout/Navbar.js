import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuidditch } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import MenuOutlinedIcon from '@material-ui/icons/MenuOutlined';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLinks: false
    };
    this.openDecreasedNavbar = this.openDecreasedNavbar.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  openDecreasedNavbar() {
    this.setState(function (prevState) {
      return {
        showLinks: !prevState.showLinks
      };
    })
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.setState(function (prevState) {
      return {
        showLinks: !prevState.showLinks
      };
    });
    this.props.logoutUser();
  }

  render() {
    const { user } = this.props.auth;
    return (
      <div className="navbar">
        <div className="leftSide">
          <div className='navbar-brand'>
            <div className="links">
              <Link to='/dashboard'>
                <FontAwesomeIcon className="navbar-icon" icon={faQuidditch} />
                Annotation Wizard
              </Link>
            </div>
          </div>
        </div>
        <div className="rightSide">
          <div className="links" id={this.state.showLinks ? "hidden" : ""}>
            <Link to="/dashboard/create-task">create tasks</Link>
            <Link to="/dashboard/my-published-tasks">published tasks</Link>
            <Link to="/dashboard/my-taken-tasks">tasks taken</Link>
            <Link to="" onClick={this.onLogoutClick}>log out</Link>
          </div>
          <p className='greeting' id={user.name ? "" : "hide-greeting"}>Hey there, {user.name}</p>
          <MenuOutlinedIcon className="menuButton" id={user.name ? "" : "hide-menuButton"} onClick={this.openDecreasedNavbar} />
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);