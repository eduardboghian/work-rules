
export const floatFormat = (number, type) => {
  if (type === 'hours') {
    let nr = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(number)
    return nr
  }

  let nr = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number)
  return nr
}

