export function idsMatch(left, right) {
  if (left === undefined || left === null || right === undefined || right === null) {
    return false;
  }

  return String(left) === String(right);
}

export function findProductById(products, productId) {
  return products.find((product) => idsMatch(product.id, productId));
}
