import React from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
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

class UrlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputList: [{ title: this.props.title, value: "" }]

        }
        this.handleAddOnClick = this.handleAddOnClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRemoveOnClick = this.handleRemoveOnClick.bind(this);
    }

    handleAddOnClick() {
        this.setState({
            inputList: [...this.state.inputList, { title: this.props.title, value: "" }]
        }, () => { this.props.urlSetCallback(this.state.inputList) });
    }

    handleChange(e, index) {
        const { name, value } = e.target;
        const list = [...this.state.inputList];
        list[index][name] = value
        this.setState({
            inputList: list
        }, () => { this.props.urlSetCallback(this.state.inputList) });
    }

    handleRemoveOnClick(index) {
        const list = [...this.state.inputList];
        list.splice(index, 1);
        this.setState({
            inputList: list
        }, () => { this.props.urlSetCallback(this.state.inputList) });
    }

    render() {
        return (
            <div style={{ margin: "10px" }}>
                {this.state.inputList.map((item, i) => {
                    return (
                        <div key={i}>
                            <TextField
                                style={{ width: "15%" }}
                                disabled
                                id="outlined-disabled"
                                name="title"
                                value={item.title}
                                onChange={e => this.handleChange(e, i)}
                                sx={{ mr: 2, mb: 1 }}
                                size="small"
                            />
                            <TextField
                                sx={{ width: "76%" }}
                                id="outlined-basic"
                                variant="outlined"
                                name="value"
                                value={item.value}
                                onChange={e => this.handleChange(e, i)}
                                size="small"
                            />
                            <IconButton aria-label="delete" sx={{ ml: 1 }} onClick={() => this.handleRemoveOnClick(i)}>
                                <DeleteIcon />
                            </IconButton>

                        </div>
                    )
                }
                )}
                <ThemeProvider theme={theme}>
                    <IconButton onClick={this.handleAddOnClick} color='primary'>
                        <AddCircleIcon />
                    </IconButton>
                </ThemeProvider>
            </div>
        )
    }
}

export default UrlPanel;