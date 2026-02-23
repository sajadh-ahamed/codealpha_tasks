// Generate watch data from image filenames
// AED to USD: 1 AED = 0.27 USD
import watchData from './watchData.json';

export const generateWatchData = () => {
  return watchData.map((watch, index) => {
    return {
      id: index + 1,
      name: watch.name,
      category: watch.category,
      brand: watch.brand,
      model: watch.model,
      price: watch.price,
      priceAED: watch.priceAED,
      image: watch.image,
      images: watch.images,
      description: watch.description,
      stock: watch.stock,
      rating: watch.rating,
      reviews: watch.reviews,
      featured: watch.featured,
      dateAdded: watch.dateAdded
    };
  });
};