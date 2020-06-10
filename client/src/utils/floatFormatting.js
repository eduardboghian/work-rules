
export const floatFormat = (number, type) => {
  if (type === 'hours') {
    let nr = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 1
    }).format(number)
    return nr
  }

  let nr = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2
  }).format(number)
  return nr
}

