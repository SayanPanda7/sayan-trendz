export function scoreRecommendations({ catalog, product, user }) {
  const userCategories = new Set(user?.preferences?.categories || []);
  const userSizes = new Set(user?.preferences?.sizes || []);

  return catalog
    .filter((item) => String(item._id) !== String(product?._id))
    .map((item) => {
      let score = 0;

      if (product && item.category === product.category) {
        score += 36;
      }

      const overlappingTags = item.tags.filter((tag) => product?.tags?.includes(tag)).length;
      score += overlappingTags * 14;

      if (userCategories.has(item.category)) {
        score += 18;
      }

      if (item.inventory?.sizes?.some((size) => userSizes.has(size.label))) {
        score += 8;
      }

      score += Math.min(item.rating * 10, 50);
      score += Math.min(item.metrics?.totalSold || 0, 25);

      return { item, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
    .map((entry) => entry.item);
}
