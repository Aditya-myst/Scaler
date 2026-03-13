export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

export const truncate = (str, n) => str?.length > n ? str.substring(0, n) + '...' : str;

export const getStarRating = (rating = 4.2) => {
    const stars = Math.round(rating * 2) / 2;
    return { stars, display: '★'.repeat(Math.floor(stars)) + (stars % 1 ? '½' : '') };
};
