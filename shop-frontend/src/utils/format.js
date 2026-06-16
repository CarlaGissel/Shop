// Formatea un monto en guaraníes: 800000 -> "Gs. 800.000"
// El guaraní no usa centavos, por eso redondeamos a entero.
export const formatGs = value =>
  `Gs. ${Math.round(Number(value) || 0).toLocaleString('es-PY')}`
