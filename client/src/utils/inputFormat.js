const inputFormt = (value) => {
  value = value.toString().replace(/[^0-9\,]/g, "")
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")



  // add ',' and one zecimal
  if (!value.includes(',')) {
    value.conncat(',0')
  }

  //remove other zecimal nubers
  if (value) {

  }
}