import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getGuestCart, setGuestCart } from '../utils/cart'; // make sure this path is correct
import AddToWishlistButton from './AddToWishlistButton'; // adjust path if needed


function FullSearchResults({ allItems = [] }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();

  const lower = query.toLowerCase();
  const results = allItems.filter(
    (item) =>
      item.description?.toLowerCase().includes(lower) ||
      item.artist?.toLowerCase().includes(lower) ||
      item.genre?.toLowerCase().includes(lower)
  );

  const handleClick = (id) => {
    navigate(`/home/${id}`);
  };

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      let guestCart = getGuestCart();
      const existing = guestCart.find((it) => it.id === item.id);
      guestCart = existing
        ? guestCart.map((it) => (it.id === item.id ? { ...it, quantity: it.quantity + 1 } : it))
        : [...guestCart, { ...item, quantity: 1 }];
      setGuestCart(guestCart);
      toast.success('Item added to cart!');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/carts/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item.id, quantity: 1 }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Could not add to cart.');
        return;
      }

      toast.success('Item added to cart!');
    } catch (err) {
      toast.error('Error adding item to cart.');
    }
  };

  return (
    <div className='full-search-page'>
      <h2>{results.length > 0 ? `Results for "${query}"` : `No results for "${query}"`}</h2>

      {results.length > 0 && (
        <div className='full-search-content'>
          <div className='full-search-grid'>
          {results.map((item) => (
  <div key={item.id} className='full-search-card'>
    <img
      src={
        item.image_url?.startsWith('http')
          ? item.image_url
          : `${import.meta.env.VITE_BACKEND_URL}/public${item.image_url}`
      }
      alt={item.description}
      onError={(e) => (e.target.src = '/placeholder.png')}
      onClick={() => handleClick(item.id)}
    />
    <div className='title' onClick={() => handleClick(item.id)}>
      {item.description || 'Untitled'}
    </div>
    <div className='artist'>{item.artist || 'Unknown Artist'}</div>
    <div className='genre'>{item.genre || 'Unknown Genre'}</div>
    <div className='price'>{item.price ? `$${item.price}` : 'Not available'}</div>

    <div className='wishlist-cart-buttons'>
      <AddToWishlistButton productId={item.id} />
      <button
        className='add-to-bag-button'
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(item);
        }}
      >
        Add to Bag
      </button>
    </div>
  </div>
))}

          </div>
        </div>
      )}
    </div>
  );
}

export default FullSearchResults;
