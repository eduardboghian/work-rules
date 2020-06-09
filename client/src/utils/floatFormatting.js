
export const floatFormat = (number, type) => {
  let nr = number
  if (type === 'hours') {
    let string1 = ''
    let k = 0
    for (let i=0; i<nr.length; i++) {
      if (nr[i] === '.') {
        string1 = string1 + ','
        i++
        k++
      }
      string1 = string1 + nr[i]
    }
    if (k !== 0) {
      return string1
    } else {
      string1 += ',0'
    }
  }
  else if (type === 'rate') {
    let string1 = ''
    let k = 0
    for (let i=0; i<nr.length; i++) {
      if (nr[i] === '.') {
        string1 = string1 + ','
        i++
        k++
      }
      string1 = string1 + nr[i]
    }
    if (k !== 0) {
      return string1
    } else {
      string1 += ',0'
    }
  }


  let string1 = ''
  for (let i=0; i<nr.length; i++) {
    if (nr[i] === '.') {
      string1 = string1 + ','
      i++
    }
    string1 = string1 + nr[i]
  }
  let j = 0
  let string2 = string1[string1.length-1] + string1[string1.length-2] + string1[string1.length-3]
  for (let i=string1.length-4; i>=0; i--) {
    if (j===3) {
      string2 += '.'
      j = 0
    }
    j ++
    string2 += string1[i]
  }

  let string3 = ''
  for (let i=string2.length-1; i>=0; i--) {
    string3 += string2[i]
  }
  return string3
}
