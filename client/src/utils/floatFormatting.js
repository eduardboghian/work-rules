
export const floatFormat = (number, type) => {
  let nr = number.toString()
  let count = 0
  let string1 = ''
  for (let i = 0; i < nr.length; i++) {
    if (nr[i] === '.') {
      string1 = string1 + ','
      i++
      count++
    }
    string1 = string1 + nr[i]
  }
  let j = 0
  let string2 = ''
  if (count === 0 && type === 'hours') {
    string2 += '0,'
  }
  else if (count === 0) {
    string2 += '00,'
  }
  else if (string1[string1.length - 3] === ',') {
    string2 += string1[string1.length - 1] + string1[string1.length - 2] + string1[string1.length - 3]
  }
  else if (string1[string1.length - 2] === ',' && type === 'hours') {
    string2 += string1[string1.length - 1] + string1[string1.length - 2]
  }
  else {
    string2 += '0' + string1[string1.length - 1] + string1[string1.length - 2]
  }

  if (string1[string1.length - 3] === ',') {
    for (let i = string1.length - 4; i >= 0; i--) {
      if (j === 3) {
        string2 += '.'
        j = 0
      }
      j++
      string2 += string1[i]
    }
  }
  else if (count === 0) {
    for (let i = string1.length - 1; i >= 0; i--) {
      if (j === 3) {
        string2 += '.'
        j = 0
      }
      j++
      string2 += string1[i]
    }
  }
  else {
    for (let i = string1.length - 3; i >= 0; i--) {
      if (j === 3) {
        string2 += '.'
        j = 0
      }
      j++
      string2 += string1[i]
    }
  }

  let string3 = ''
  for (let i = string2.length - 1; i >= 0; i--) {
    string3 += string2[i]
  }
  return string3
}

