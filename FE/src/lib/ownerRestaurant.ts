export const OWNER_RESTAURANT_ID_KEY = "ownerRestaurantId";

export const getSelectedRestaurantId = (): number | null => {
  const value = localStorage.getItem(OWNER_RESTAURANT_ID_KEY);
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

export const setSelectedRestaurantId = (restaurantId: number) => {
  localStorage.setItem(OWNER_RESTAURANT_ID_KEY, String(restaurantId));
};

export const clearSelectedRestaurantId = () => {
  localStorage.removeItem(OWNER_RESTAURANT_ID_KEY);
};
