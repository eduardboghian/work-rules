import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";

const Search = props => {
  const [anchorEl, setAnchorEl] = useState(null);

  const clickHandler = event => {
    setAnchorEl(event.currentTarget);
  };
  const closeHandler = reason => {
    if (reason === "backdropClick") {
      setAnchorEl(null);
    }
  };
  const changeHandler = data => {
    if (data.length === 0) {
      return props.setSearchedData(null);
    }
    let filteredData = [...props.data];
    filteredData = filteredData.filter(item => {
      let isExist = props.keys.find(key => item[key].toLowerCase().includes(data.toLowerCase()));
      if (typeof isExist !== "undefined") {
        return true;
      }
      return false;
    });
    props.setSearchedData(filteredData);
  };

  const isOpened = Boolean(anchorEl);

  return (
    <>
      <SearchIcon onClick={e => clickHandler(e)} style={{ cursor: "pointer" }} />
      <Popover
        open={isOpened}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        onClose={(event, reason) => closeHandler(reason)}
      >
        <TextField style={{ padding: "10px" }} placeholder="Enter text..." onChange={e => changeHandler(e.target.value)} />
      </Popover>
    </>
  );
};

export default Search;
