// Real watch data from ETERNAL collection
import { generateWatchData } from './generateWatchData';

// Generate watches from actual images
export const watches = generateWatchData();

// Categories - Updated for ETERNAL collection
export const categories = ["All", "Men", "Women"]

// Sort options
export const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" }
]
