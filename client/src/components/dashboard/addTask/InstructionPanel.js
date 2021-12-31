import React from "react";
import TextField from '@mui/material/TextField';


class Panels extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputList: { title: this.props.title, value: "" }

        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            inputList: {
                ...this.state.inputList,
                [name]: value
            }
        }, () => { this.props.instructionSetCallback(this.state.inputList) });
    }


    render() {
        return (
            <div style={{ margin: "10px" }}>
                <div>
                    <TextField
                        style={{ width: "15%" }}
                        disabled
                        id="outlined-disabled"
                        name="title"
                        value={this.state.inputList.title}
                        onChange={e => this.handleChange(e)}
                        sx={{ mr: 2, mb: 1 }}
                        size="small"
                    />
                    <TextField
                        sx={{ width: "80%" }}
                        id="outlined-basic"
                        variant="outlined"
                        name="value"
                        value={this.state.inputList.value}
                        onChange={e => this.handleChange(e)}
                        size="small"
                    />
                </div>
            </div>
        )
    }
}

export default Panels;