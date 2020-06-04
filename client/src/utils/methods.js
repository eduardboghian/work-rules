export const multiSort = (array, sortObject = {}) => {
  let objectCopy = { ...sortObject };
  const sortKey = Object.keys(sortObject);

  // Return array if no sort object is supplied.
  let lista2 = []
  for (let i in array) {
    lista2.push(array[i][sortKey])
  }
  if(sortObject[sortKey] === 'desc') {
    for (let i=0; i<lista2.length-1; i++) {
      for (let j=i+1; j<lista2.length; j++) {
        if (lista2[i].toLowerCase() < lista2[j].toLowerCase()) {
          let aux = lista2[i]
          lista2[i] = lista2[j]
          lista2[j] = aux
        }
      }
    }
  } else {
      for (let i=0; i<lista2.length-1; i++) {
        for (let j=i+1; j<lista2.length; j++) {
          if (lista2[i].toLowerCase() > lista2[j].toLowerCase()) {
            let aux = lista2[i]
            lista2[i] = lista2[j]
            lista2[j] = aux
          }
        }
      }
  }
  let lista3 = []
  for (let i in lista2) {
    for (let j in array) {
      if (array[j][sortKey] === lista2[i]) {
        lista3.push(array[j])
      }
    }
  }
  return lista3

}
