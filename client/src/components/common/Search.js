/* eslint-disable */

import React, { useState, useEffect } from "react"
import TextField from "@material-ui/core/TextField"
import SearchIcon from "@material-ui/icons/Search"
import './style.css'

const Search = props => {
  const [anchorEl, setAnchorEl] = useState(true);

  const clickHandler = event => {
    setAnchorEl(event.currentTarget);
  }

  const changeHandler = data => {
    if (data.length === 0) {
      return props.setSearchedData(null);
    }
    let filteredData = [...props.data];
    filteredData = filteredData.filter(item => {

      let fullName = item.firstname + '  ' + item.lastname
      if (/'andreea'/.test(fullName)) {
        console.log('worked....', typeof fullName, data)
      }

      if (JSON.stringify(item).toLowerCase().includes(data.toLowerCase())) {
        return true
      }
      return false
    })
    props.setSearchedData(filteredData);
  }

  const isOpened = Boolean(anchorEl)

  return (
    <>
      <div className="search-field-wr">
        <SearchIcon onClick={e => clickHandler(e)} className='search-icon' />
        <TextField
          className='search-field'
          placeholder={window.location.pathname === '/workers' ? "Search in Firstname, Lastname, Company name, Phone, Trade, Tikets, Comment, eMail, ZipCode, City, UTR, NINO" : "Search in Company name, Contact person, Phone number and Email"}
          onChange={e => changeHandler(e.target.value)}
        />
      </div>
    </>
  );
};

export default Search;
