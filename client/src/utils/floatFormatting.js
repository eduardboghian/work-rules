
export const floatFormat = (number, type) => {
  let nr = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2
  }).format(number)
  console.log(nr)
  return nr
}

