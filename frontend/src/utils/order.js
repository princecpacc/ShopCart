export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function shortOrderId(id) {
  return id.slice(-8);
}
