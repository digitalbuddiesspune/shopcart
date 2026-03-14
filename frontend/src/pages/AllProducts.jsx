                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryAPI, productAPI, cartAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch categories for sidebar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await categoryAPI.getAllCategories();
        if (response.success) {
          // Filter only active categories and sort by order
          const activeCategories = (response.data || [])
            .filter(cat => cat.isActive !== false)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setCategories(activeCategories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = { limit: 100 };
        const response = await productAPI.getAllProducts(params);
        if (response.success) {
          setProducts(response.data.products);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-brown-50">
      {/* Breadcrumb */}
      <div className="bg-brown-50 border-b border-brown-200 sticky top-0 z-40">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4">
          <nav className="flex items-center flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm">
            <Link to="/" className="text-brown-500 hover:text-brown-700 truncate">
              Home
            </Link>
            <span className="text-brown-400">/</span>
            <span className="text-brown-900 font-semibold truncate">All Products</span>
          </nav>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar - All Categories */}
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-gradient-to-br from-brown-50 to-white lg:from-white rounded-lg sm:rounded-xl shadow-lg lg:shadow-sm border-2 lg:border border-brown-200 lg:border-brown-200 overflow-hidden lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-120px)] lg:flex lg:flex-col">
              {/* Sticky Header */}
              <div className="sticky top-0 z-30 bg-gradient-to-r from-brown-800 to-brown-500 lg:from-white lg:to-white border-b-2 lg:border-b border-brown-300 lg:border-brown-200 px-3 sm:px-4 py-3 sm:py-4 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-bold text-white lg:text-brown-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 lg:hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <span>All Categories</span>
                </h3>
              </div>
              
              {/* Scrollable Categories List */}
              <div className="p-3 sm:p-4 overflow-y-auto flex-1 max-h-[400px] lg:max-h-none">
                <nav className="space-y-1.5 sm:space-y-2">
                  {/* All Products Link */}
                  <Link
                    to="/all-products"
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors mb-2 bg-brown-50 text-brown-600 font-semibold border border-brown-200"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-brown-500 to-brown-600 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium flex-1">
                      All Products
                    </span>
                  </Link>
                  
                  {categoriesLoading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brown-800"></div>
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <Link
                        key={cat._id}
                        to={`/category/${cat.slug}`}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-colors text-brown-700 hover:bg-brown-50 hover:text-brown-900"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-md overflow-hidden bg-brown-100">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brown-200">
                              <svg className="w-5 h-5 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-medium flex-1 line-clamp-2">
                          {cat.name}
                        </span>
                      </Link>
                    ))
                  )}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brown-900 mb-2">
                All Products
              </h1>
              <p className="text-sm sm:text-base text-brown-600">
                Browse all products from all categories
              </p>
            </div>

            {/* Products from All Categories */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brown-800"></div>
                  <p className="mt-4 text-brown-600">Loading products...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-brown-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-brown-800 text-white rounded-lg hover:bg-brown-900"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-brown-600">No products found</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-2 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                {products.map((product) => {
                  const discount = product.originalPrice && product.originalPrice > product.price 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;
                  return (
                  <Link
                    key={product._id}
                    to={`/product/${product.slug}`}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-brown-200 overflow-hidden transform hover:-translate-y-1 flex flex-col h-full"
                  >
                    <div className="aspect-square bg-gradient-to-br from-brown-50 to-brown-100 overflow-hidden relative flex-shrink-0">
                      {discount > 0 && (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-brown-50 text-brown-600 border border-brown-200 text-[8px] sm:text-[10px] md:text-xs font-bold px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2 md:py-1 rounded-full shadow-lg whitespace-nowrap">
                          {discount}% OFF
                        </div>
                      )}
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="h-full w-full flex items-center justify-center text-brown-400" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
                        <svg
                          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-end bg-gradient-to-b from-brown-100 to-brown-50">
                      <h3 className="text-sm sm:text-base font-bold text-brown-900 mb-1.5 line-clamp-2 group-hover:text-brown-600 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg sm:text-xl font-bold text-brown-900">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <>
                              <span className="text-sm text-brown-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!isAuthenticated()) {
                              navigate('/sign-in');
                              return;
                            }
                            
                            setAddingToCart({ ...addingToCart, [product._id]: true });
                            try {
                              const response = await cartAPI.addToCart(product._id, 1);
                              if (response.success) {
                                alert('Product added to cart!');
                              } else {
                                alert('Failed to add product to cart. Please try again.');
                              }
                            } catch (err) {
                              if (err.response?.status === 401) {
                                navigate('/sign-in');
                              } else {
                                alert(err.response?.data?.message || 'Failed to add product to cart. Please try again.');
                              }
                            } finally {
                              setAddingToCart({ ...addingToCart, [product._id]: false });
                            }
                          }}
                          disabled={addingToCart[product._id]}
                          className="w-full px-3 py-2 bg-gradient-to-r from-brown-800 to-brown-900 text-white rounded-lg hover:from-brown-900 hover:to-brown-900 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingToCart[product._id] ? 'Adding...' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </Link>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;

