import React, { useState } from "react";
import Popover from "@material-ui/core/Popover";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import './style.css'

const Search = props => {
  const [anchorEl, setAnchorEl] = useState(true);

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
        return false

    });
    props.setSearchedData(filteredData);
  };

  const isOpened = Boolean(anchorEl);

  return (
    <>
      
      
      <div className="search-field-wr">
        <SearchIcon onClick={e => clickHandler(e)}className='search-icon' />
        <TextField className='search-field'  placeholder="Search in Firstname, Lastname, Company name, Phone, Trade, Tikets, Comment, eMail, ZipCode, City, UTR, NINO" onChange={e => changeHandler(e.target.value)} />
      </div>
      
    </>
  );
};

export default Search;
